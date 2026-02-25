const API_BASE = "/api";

function toQuery(params){
    const sp = new URLSearchParams(); //helps build query strings safely

    Object.entries(params).forEach(([key, value]) => {
        if(value === null || value === undefined || value === "") return;
        if(typeof value === "string" && value.trim() === "") return;
        sp.set(key, String(value));
    });
    return sp.toString();
}

export async function fetchOrders(params){
    const qs = toQuery(params);
    const res = await fetch(`${API_BASE}/orders?${qs}`);

    if(!res.ok){
        throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
}

export async function fetchOrder(id){
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if(!res.ok){
        throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
}

export async function deleteOrder(id){
    const res = await fetch(`${API_BASE}/orders/${id}`, {method: "DELETE" });
    if(res.status === 204){
        return true;
    }
    if(!res.ok){
        throw new Error(`HTTP ${res.status}`);
    }
}

export async function createOrder(payload) {

  const url = `${API_BASE}/orders`;
  console.log("POST url =", url);
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(payload),
  });

  // ✅ Check response type before trying to parse JSON
  const ct = res.headers.get("content-type") || "";

  // If server didn't return JSON, read as text and throw a helpful error
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON but got (${res.status}): ${text.slice(0, 160)}`);
  }

  // ✅ Now it's safe to parse JSON
  const json = await res.json();

  // Validation errors
  if (res.status === 422) {
    const e = new Error("Validation failed");
    e.validation = json.errors;
    throw e;
  }

  // Other non-OK errors
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  // Success
  return json;
}

export async function updateOrderStatus(id, status){
    const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({status}),
    });


    if(res.status === 422){
        const err = await res.json();
        const e = new Error("Validation failed");
        e.validation = err.errors;
        throw e;
    }

    if(!res.ok){
        throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
}