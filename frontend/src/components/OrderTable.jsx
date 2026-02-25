import { useOrders } from "../context/OrdersContext";
import Pagination from "./Pagination";
import {Link} from "react-router-dom";

function money(cents){
    const safe = Number(cents ?? 0);
    return `$${(safe / 100).toFixed(2)}`;
}

function OrderTable(){
    const { loading, error, orders, deleteOrder, meta, page, canGoPrev, canGoNext, setPage } = useOrders();

    return(
        <>
            <div className="pb-3.5">
                <Link to='/orders/new' className="bg-green-500 text-white rounded p-3">Create Order+</Link>
            </div>
            {/* Table */}
            {!loading && !error && (
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-zinc-100 text-left text-zinc-700">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">RX</th>
                        <th className="px-4 py-3">Patient</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-right">Items</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                        <th className="px-4 py-3 text-right">Details</th>
                    </tr>
                    </thead>

                    <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td className="px-4 py-6 text-zinc-600" colSpan={7}>
                                No orders match your filters.
                            </td>
                        </tr>
                    ) : (
                        orders.map((o) => (
                        <tr key={o.id} className="border-t border-zinc-200">
                            <td className="px-4 py-3">{o.id}</td>
                            <td className="px-4 py-3">{o.external_rx_id ?? "—"}</td>
                            <td className="px-4 py-3">{o.patient_name}</td>
                            <td className="px-4 py-3">
                            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                                {o.status}
                            </span>
                            </td>
                            <td className="px-4 py-3 text-right">{money(o.total_cents)}</td>
                            <td className="px-4 py-3 text-right">{o.items_count ?? "—"}</td>
                            <td className="px-4 py-3 text-right">
                                <button onClick={() => deleteOrder(o.id)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-500 hover:text-white">
                                    Delete
                                </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Link  to={`/orders/details/${o.id}`} className="rounded-md border border-gray-200 px-3 py-1.5 text-xs bg-white text-black hover:bg-cyan-600 hover:text-white">Details</Link>
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <Pagination meta={meta} page={page} canGoPrev={canGoPrev} setPage={setPage} canGoNext={canGoNext} />
                </div>
            )}
        </>
    );
}

export default OrderTable