import PharmacyForm from '../components/PharmacyForm';
import LoadingOrder from '../components/LoadingOrder';
import LoadingErrors from '../components/LoadingErrors';
import OrderTable from '../components/OrderTable';

function OrdersPage(){
    return(
        <>
            <div className='min-h-screen w-full bg-zinc-50 text-black'>
                <div className='mx-auto max-w-none p-6'>
                    <div className='mb-6'>
                        <h1 className='text-2xl font-semibold text-zinc-900'>Pharmacy Ops - Orders</h1>
                    </div>

                    <PharmacyForm />
                    <LoadingOrder />
                    <LoadingErrors />
                    <OrderTable />
                </div>
            </div>
        </>
    );
}
export default OrdersPage