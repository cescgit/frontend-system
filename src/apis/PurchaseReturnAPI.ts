import { isAxiosError } from "axios";
import api from "../lib/axios";
import {    
    PurchaseReturnData,    
    purchaseReturnDetailsShema,    
    PurchaseReturnFormDataAdd,
    purchaseReturnFormDataSchema    
} from "../types/purchaseReturnData";

// * Get all purchase return
export async function getPurchaseReturn() {
    try {
        const { data } = await api("/purchaseReturn");
        const response = purchaseReturnFormDataSchema.safeParse(data)        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Get purchase return by id
export async function getDetailsPurchaseReturnById({ id }: Pick<PurchaseReturnData, "id">) {
    try {
        const { data } = await api(`/purchaseReturn/${id}`);        
        const response = purchaseReturnDetailsShema.safeParse(data);          
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Create a new purchase return
export async function createPurchaseReturn(formData: PurchaseReturnFormDataAdd) {
    try {
        const { data } = await api.post("/purchaseReturn/createpurchaseReturn", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}