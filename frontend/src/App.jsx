// import { useState, useEffect, useMemo } from 'react';
// import PharmacyForm from './components/PharmacyForm';
// import LoadingOrder from './components/LoadingOrder';
// import LoadingErrors from './components/LoadingErrors';
// import OrderTable from './components/OrderTable';


// function money(cents){
//   const safe = Number(cents ?? 0);
//   return `$${(safe / 100).toFixed(2)}`;
// }

// function App() {

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   //for fileting and pagination
//   const [status, setStatus] = useState("");
//   const [q, setQ] = useState(""); //what the user is searching
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   const [meta, setMeta] = useState(null); //pagination info returned by laravel currpage, lastpage, total, perpage

//   const queryString = useMemo( () => {
//     const params = new URLSearchParams();

//     params.set("per_page", String(perPage));
//     params.set("page", String(page));

//     if(status){ 
//       params.set("status", status);
//     }
//     if(q.trim()){
//       params.set("q", q.trim());
//     }

//     return params.toString();

//   }, [perPage, page, status, q]);

//   useEffect( () => {
//     let cancelled = false;

//     async function load(){
//       setLoading(true);
//       setError(null);

//       try{
      
//         const res = await fetch(`/api/orders?${queryString}`);
//         if(!res.ok){
//           throw new Error(`HTTP ${res.status}`);
//         }

//         const json = await res.json();
//         if(cancelled){
//           return;
//         }

//         setOrders(json.data ?? []);
//         setMeta(json.meta ?? null);
//       } catch(e){

//         if (!cancelled) setError(e?.message ?? "Failed to load orders");

//       }finally{

//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();
//     return() => {
//       cancelled = true;
//     };

//   }, [queryString]);

//   const canGoPrev = meta ? meta.current_page > 1 : page > 1;
//   const canGoNext = meta ? meta.current_page < meta.last_page : orders.length === perPage;

//   function onSubmitFilters(e){
//     e.preventDefault();
//     setPage(1);
//   }

//   return (
//     <>
//       <div className="min-h-screen w-full bg-zinc-50 text-black">
//         <div className="mx-auto max-w-none p-6">
//           {/* Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-semibold text-zinc-900">Pharmacy Ops — Orders</h1>  
//           </div>

//           <PharmacyForm onSubmitFilters={onSubmitFilters} q={q} setQ={setQ} status={status} setStatus={setStatus} setPage={setPage} perPage={perPage} setPerPage={setPerPage}  /> 
//           <LoadingOrder loading={loading} />
//           <LoadingErrors error={error} />
//           <OrderTable loading={loading} error={error} orders={orders} money={money} meta={meta} page={page} canGoPrev={canGoPrev} setPage={setPage} canGoNext={canGoNext} />

//         </div>
//       </div>
//     </>
//   )
// }

// export default App

import { OrdersProvider } from './context/OrdersContext';
import CreateOrderPage from './pages/CreateOrderPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrdersPage from './pages/OrdersPage';
import {Routes, Route, Navigate} from 'react-router-dom';
//navigate is what does the rerouting to /orders
function App(){
  return(
    <>
      <OrdersProvider>
        <Routes>
          <Route path="/" element={<Navigate  to="/orders" replace /> } />  
          <Route path="/orders" element={<OrdersPage/>} />
          <Route path="/orders/details/:id" element={<OrderDetailsPage />} />
          <Route path="/orders/new" element={<CreateOrderPage />} />
        </Routes>
        {/* <OrdersPage /> */}
      </OrdersProvider>
    </>
  );
}

export default App