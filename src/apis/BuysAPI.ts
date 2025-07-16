import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    BuysData,              
    BuysFormDataAdd,    
    buysFormDataSchema,
    tempPurchasingDetailsDataSchema,
} from "../types/buysData";

// * Get all buys
export async function getBuys() {
    try {
        const { data } = await api("/buys")
        const response = buysFormDataSchema.safeParse(data)   
        console.log(response)     
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Get buys by id
export async function getDetailsBuysById({ id }: Pick<BuysData, "id">) {
    try {
        const { data } = await api(`/buys/${id}`);
        const response = tempPurchasingDetailsDataSchema.safeParse(data);                     
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Create a new buys
export async function createBuys(formData: BuysFormDataAdd) {
    try {
        const { data } = await api.post("/buys/createBuys", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}