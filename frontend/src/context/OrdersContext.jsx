import { useEffect, useMemo, useState, createContext, useContext } from "react";
import { deleteOrder as apiDeleteOrder, fetchOrders, createOrder as apiCreateOrder, } from "../api/ordersApi";

const OrdersContext = createContext(null);

export function useOrders(){
    const contxt = useContext(OrdersContext);
    if(!contxt){
        throw new Error("useOrders must be used within <OrdersContext />");
    }
    return contxt;
}

export function OrdersProvider({children}){

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //for fileting and pagination
  const [status, setStatus] = useState("");
  const [q, setQ] = useState(""); //what the user is searching
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [meta, setMeta] = useState(null); //pagination info returned by laravel currpage, lastpage, total, perpage
  const [debouncedQ, setDebouncedQ] = useState(""); // used for debounce

    // Debounce search (300ms)
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
        return () => clearTimeout(t);
    }, [q]);

    // API params used for list fetch
    const params = useMemo(() => {
        return {
        status,
        q: debouncedQ || "",
        page,
        per_page: perPage,
        };
    }, [status, debouncedQ, page, perPage]);

    useEffect( () => {
        let cancelled = false;

        async function load(){
            setLoading(true);
            setError(null);

            try{
                const json = await fetchOrders(params);
                if(cancelled){
                    return;
                }
                setOrders(json.data ?? []);
                setMeta(json.meta ?? null);
            }catch(e){
                if (!cancelled){
                    setError(e?.message ?? "Failed to load orders");
                }
            }finally{
                if (!cancelled){
                    setLoading(false);
                }
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [params]);

    const canGoPrev = meta ? meta.current_page > 1 : page > 1;
    const canGoNext = meta ? meta.current_page < meta.last_page : orders.length === perPage;
    
    async function deleteOrder(orderId){
        const ok = window.confirm(`Delete order #${orderId}? This cannot be undone.`);
        if(!ok){
            return;
        }

        const before = orders;
        setOrders((prev) => prev.filter( (o) => o.id !== orderId));

        try{
            await apiDeleteOrder(orderId);
            const json = await fetchOrders(params);
            setOrders(json.data ?? []);
            setMeta(json.meta ?? null);
        }catch(e){
            //if deletion fails
            setOrders(before);
            setError(e?.message ?? "Delete failed");
        }
    }

    async function createOrder(payload){
        setError(null);

        const json = await apiCreateOrder(payload);
        console.log("api create response =", json);

        // Refresh list so /orders reflects the new order
        // (We re-fetch using current params)
        try {
        const refreshed = await fetchOrders(params);
        setOrders(refreshed.data ?? []);
        setMeta(refreshed.meta ?? null);
        } catch {
        // If refresh fails, it’s not fatal; the create succeeded.
        }

        return json; // return created order object
    }

    const value = { orders, meta, loading, error, setError, status, setStatus, q, setQ, page, setPage, perPage, setPerPage, canGoPrev, canGoNext, deleteOrder, createOrder };
    return(
        <>
            <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
        </>
    );
}