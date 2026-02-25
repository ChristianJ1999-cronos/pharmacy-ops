import { useOrders } from "../context/OrdersContext";

function LoadingOrder(){
  const {loading} = useOrders();

    return(

        <>
            {/* Loading */}
          {loading && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              Lord Cronos is loading orders…
            </div>
          )}
        </>
    );

}

export default LoadingOrder