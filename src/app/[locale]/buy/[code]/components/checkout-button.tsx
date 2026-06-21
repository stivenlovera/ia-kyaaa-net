import { IPayPalCheckOrder } from "@/src/app/types/buy_pack.types";
import { IResponse } from "@/src/app/types/response";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
    code: string;
}
export const CheckoutButton = ({ code }: CheckoutButtonProps) => {
    console.log('CheckoutButton', code)
    const router = useRouter()
    const createOrder = async () => {
        // Best Practice: Create the order on your backend server instead of client-side 
        // to protect your pricing logic and avoid validation vulnerabilities.
        const response = await fetch("/api/buy-pack/order-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code })
        });
        const data = await response.json() as IResponse<IPayPalCheckOrder>;
        return data.data.id; // Must return the order ID string fetched from PayPal API
    };

    // Triggered immediately after the buyer approves the payment inside the popup
    const onApprove = async (data: any) => {
        // Capture the funds on your backend server
        console.log('onApprove', data)
        const response = await fetch(`/api/buy-pack/order-capture`, {
            method: "POST",
            body: JSON.stringify({ "order_id": data.orderID })
        });
        const orderData = await response.json();
        console.log('orderData', orderData)
        if (orderData.status === true) {
            router.push('/dashboard')
            alert("Transaction completed successfully!");
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
