import { useOrders } from "../context/OrdersContext";

function LoadingErrors(){
    const {error} = useOrders();
    return(
        <>
            {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-white p-4 text-sm text-red-700">
              Error: {error}
            </div>
          )}
        </>
    );
}

export default LoadingErrors