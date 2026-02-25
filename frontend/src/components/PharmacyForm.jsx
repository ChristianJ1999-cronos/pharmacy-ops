import { useOrders } from "../context/OrdersContext";

function PharmacyForm(){

  const { q, setQ, status, setStatus, perPage, setPerPage, setPage } = useOrders();

  function onSubmitFilters(e){
    e.preventDefault();
    setPage(1);
  }

    return(

        <>
         {/* Filters */}
          <form
            onSubmit={onSubmitFilters}
            className="mb-4 flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 md:flex-row md:items-end"
          >
            {/* Search */}
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-zinc-700">Search (patient / rx id)</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                placeholder="e.g. Johan or RX-69427"
              />
            </div>

            {/* Status */}
            <div className="w-full md:w-56">
              <label className="mb-1 block text-sm font-medium text-zinc-700">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="processing">processing</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>

            {/* Per page */}
            <div className="w-full md:w-40">
              <label className="mb-1 block text-sm font-medium text-zinc-700">Per page</label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* Apply */}
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Apply
            </button>
          </form>
          </>

    );

} 

export default PharmacyForm