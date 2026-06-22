import { IPayPalCheckOrder } from "@/src/app/types/buy_pack.types";
import { IResponse } from "@/src/app/types/response";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
    code: string
    price: number
    setThanks: (value: boolean) => void
}
export const CheckoutButton = ({ code, price, setThanks }: CheckoutButtonProps) => {
    const router = useRouter()
    const createOrder = async () => {
        const response = await fetch("/api/buy-pack/order-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code, price: price })
        });
        const data = await response.json() as IResponse<IPayPalCheckOrder>;
        return data.data.id; // Must return the order ID string fetched from PayPal API
    };

    const onApprove = async (data: any) => {
        const response = await fetch(`/api/buy-pack/order-capture`, {
            method: "POST",
            body: JSON.stringify({ code: code, order_id: data.orderID })
        });
        const orderData = await response.json();
        if (orderData.success === true) {
            setThanks(true)
            //router.push(`/pack/${code}`)
        }
    };

    return (
        <PayPalButtons
            style={{ layout: "vertical", color: "black", shape: "rect", }} // Customizes UI
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => console.error("PayPal Checkout Error: ", err)}
        />
    );
}
