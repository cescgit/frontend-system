import { isAxiosError } from "axios";
import api from "../lib/axios";
import {                
    kardexDataSchema,
    kardexFormDataSchema
} from "../types/kardexData";
import { Product } from "../types/productData";

// * Get kardex by id product
export async function getKardexById({ id }: Pick<Product, "id">) {
    try {
        const { data } = await api(`/kardex/${id}`);
        const response = kardexDataSchema.safeParse(data);        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {    
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Get kardex by date range and id product
export async function getKardexByDate({ startDate, endDate }: {startDate: string, endDate: string}) {
    try {
        const { data } = await api(`/kardex/${startDate}/${endDate}`);
        const response = kardexFormDataSchema.safeParse(data);          
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Get kardex by date range and id product
export async function getKardexByidAndDate({ id, startDate, endDate }: Pick<Product, "id"> & { startDate: string, endDate: string }) {
    try {
        const {  data: dataProductDateAndId } = await api(`/kardex/${id}/${startDate}/${endDate}`);
        const response = kardexDataSchema.safeParse(dataProductDateAndId);                   
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}