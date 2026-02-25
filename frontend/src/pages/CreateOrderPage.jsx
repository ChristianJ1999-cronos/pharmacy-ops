import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";

function fieldError(errors, key) {
  // Laravel errors values are arrays: { patient_name: ["The patient name field is required."] }
  const msg = errors?.[key]?.[0];
  return msg ? <p className="mt-1 text-xs text-red-700">{msg}</p> : null;
}

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const { createOrder } = useOrders();

  // Order fields
  const [patientName, setPatientName] = useState("");
  const [status, setStatus] = useState("");
  const [externalRxId, setExternalRxId] = useState("");
  const [placedAt, setPlacedAt] = useState("");

  // Items array (start with one item)
  const [items, setItems] = useState([
    { drug_name: "", ndc: "", quantity: 1, price_cents: 0 },
  ]);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); // Laravel validation errors

  function updateItem(index, field, value) {
    // Copy array so we don't mutate state directly
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { drug_name: "", ndc: "", quantity: 1, price_cents: 0 },
    ]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    // Build payload in EXACT keys backend expects
    const payload = {
      patient_name: patientName,
      status,
      external_rx_id: externalRxId || null,
      placed_at: placedAt || null,
      items: items.map((it) => ({
        drug_name: it.drug_name,
        ndc: it.ndc || null,
        quantity: Number(it.quantity),
        price_cents: Number(it.price_cents),
      })),
    };

    try {
      const created = await createOrder(payload);
      console.log("created =", created);

      // Navigate to details page for the new order
      navigate(`/orders/details/${created.id}`);
    } catch (e2) {
      // If our API helper attached validation errors, display them
      if (e2?.validation) {
        setErrors(e2.validation);
      } else {
        setErrors({ _form: [e2?.message ?? "Create failed"] });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50 text-black">
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">New Order</h1>
          <button
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-white"
            onClick={() => navigate("/orders")}
            type="button"
          >
            Back to Orders
          </button>
        </div>

        <form onSubmit={onSubmit} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          {fieldError(errors, "_form")}

          <h3 className="mb-2 text-lg font-semibold text-zinc-900">Order Info</h3>

          <div className="mb-3">
            <label className="block text-sm font-medium text-zinc-700">Patient Name</label>
            <input
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Cronos Time"
            />
            {fieldError(errors, "patient_name")}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-zinc-700">Status</label>
            <select
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select status</option>
              <option value="pending">pending</option>
              <option value="processing">processing</option>
              <option value="shipped">shipped</option>
              <option value="cancelled">cancelled</option>
            </select>
            {fieldError(errors, "status")}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-zinc-700">External RX ID (optional)</label>
            <input
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              value={externalRxId}
              onChange={(e) => setExternalRxId(e.target.value)}
              placeholder="RX-NEW-12345"
            />
            {fieldError(errors, "external_rx_id")}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700">Placed At (optional)</label>
            <input
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              value={placedAt}
              onChange={(e) => setPlacedAt(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
            {fieldError(errors, "placed_at")}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
            >
              + Add item
            </button>
          </div>

          {fieldError(errors, "items")}

          <div className="space-y-4">
            {items.map((it, idx) => (
              <div key={idx} className="rounded-lg border border-zinc-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-800">Item #{idx + 1}</div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-xs text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Drug Name</label>
                    <input
                      className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      value={it.drug_name}
                      onChange={(e) => updateItem(idx, "drug_name", e.target.value)}
                      placeholder="Wegovy"
                    />
                    {fieldError(errors, `items.${idx}.drug_name`)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">NDC (optional)</label>
                    <input
                      className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      value={it.ndc}
                      onChange={(e) => updateItem(idx, "ndc", e.target.value)}
                      placeholder="12345-6789-01"
                    />
                    {fieldError(errors, `items.${idx}.ndc`)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Quantity</label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                      min={1}
                    />
                    {fieldError(errors, `items.${idx}.quantity`)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Price (cents)</label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      value={it.price_cents}
                      onChange={(e) => updateItem(idx, "price_cents", e.target.value)}
                      min={0}
                    />
                    {fieldError(errors, `items.${idx}.price_cents`)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            disabled={submitting}
            className="mt-6 w-full rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            type="submit"
          >
            {submitting ? "Creating…" : "Create new order"}
          </button>
        </form>
      </div>
    </div>
  );
}
