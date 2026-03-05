import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchOrder, updateOrderStatus } from "../api/ordersApi";
import { useOrders } from "../context/OrdersContext";

function money(cents){
    const safe = Number(cents ?? 0);
    return `$${(safe / 100).toFixed(2)}`;
}

function OrderDetailsPage(){
    const { id } = useParams();
    const navigate = useNavigate();
    const { deleteOrder } = useOrders();

    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");
    const [saving, setSaving] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function load() {
        setLoading(true);
        setError(null);

        try {
        const json = await fetchOrder(id);
        const o = json.data ?? null;
        setOrder(o);
        setStatus(o?.status ?? "");
        } catch (e) {
        setError(e?.message ?? "Failed to load order");
        } finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        if (id) load();
    }, [id]);

    async function onSaveStatus() {
        setSaving(true);
        setError(null);

        try {
        await updateOrderStatus(id, status);
        await load(); // reload so UI reflects backend truth
        } catch (e) {
        setError(e?.message ?? "Failed to update status");
        } finally {
        setSaving(false);
        }
    }

    async function onDelete() {
        await deleteOrder(Number(id));
        navigate("/orders");
    }

    if(loading){
        return <div>Loading Order details</div>
    }

    if(error){
        return <div className="text-red-950">Error: {error} </div>
    }

    if(!order){
        return <div>Order not found.</div>
    }
    const items = order?.items ?? [];
    console.log(items);

    return (
        <div className="min-h-screen w-full bg-zinc-50 text-black">
        <div className="mx-auto max-w-5xl p-6">
            <div className="mb-4 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-zinc-900">
                {order.patient_name}
                </h1>
                <p className="text-sm text-zinc-600">
                RX: {order.external_rx_id ?? "—"} • Total: {money(order.total_cents)} • Placed:{" "}
                {order.placed_at ? new Date(order.placed_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }) : "—"}
                </p>
            </div>

            <div className="flex gap-2">
                <button
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-white"
                onClick={() => navigate("/orders")}
                type="button"
                >
                Back
                </button>
                <button
                className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                onClick={onDelete}
                type="button"
                >
                Delete Order
                </button>
            </div>
            </div>

            <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div className="md:w-64">
                <label className="block text-sm font-medium text-zinc-700">Status</label>
                <select
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="cancelled">cancelled</option>
                </select>
                </div>

                <button
                disabled={saving}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
                onClick={onSaveStatus}
                type="button"
                >
                {saving ? "Saving…" : "Save Status"}
                </button>
            </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-zinc-100 text-left text-zinc-700">
                <tr>
                    <th className="px-4 py-3">Item ID</th>
                    <th className="px-4 py-3">Drug</th>
                    <th className="px-4 py-3">NDC</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Price (cents)</th>
                    <th className="px-4 py-3 text-right">Line Total</th>
                </tr>
                </thead>
                <tbody>
                {items.length === 0 ? (
                    <tr>
                    <td className="px-4 py-6 text-zinc-600" colSpan={6}>
                        No items found.
                    </td>
                    </tr>
                ) : (
                    items.map((it) => (
                    <tr key={it.id} className="border-t border-zinc-200">
                        <td className="px-4 py-3">{it.id}</td>
                        <td className="px-4 py-3">{it.drug_name}</td>
                        <td className="px-4 py-3">{it.ndc ?? "—"}</td>
                        <td className="px-4 py-3 text-right">{it.quantity}</td>
                        <td className="px-4 py-3 text-right">{it.price_cents}</td>
                        <td className="px-4 py-3 text-right">
                        {money(it.price_cents * it.quantity)}
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
}

export default OrderDetailsPage