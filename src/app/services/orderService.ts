// services/orderService.ts
import axios from "@/app/config/axiosConfig";
import { BASE_API } from "@/app/(main)/api";

export interface Order {
    id: string;
    order_no: string;
}

export const fetchOrder = async (): Promise<Order[]> => {
    try {
        const res = await axios.post(`${BASE_API}/po/getAllOrder`);
        if (res.data) {
            return res.data.map((item: any) => ({
                id: item.id,
                order_no: item.order_no,
            }));
        }
        return [];
    } catch (err) {
        console.error("Failed to fetch orders:", err);
        return [];
    }
};
