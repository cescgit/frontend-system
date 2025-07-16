import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    SalesData,              
    SalesFormDataAdd,    
    salesFormDataSchema,
    tempPurchasingDetailsDataSchema,
} from "../types/salesData";
import { SalesQuoteFormDataEdit } from "../types/salesQuoteData";
import { SeparatedProductFormDataEdit } from "../types/separatedProductsData";

// * Get all sales

export async function getSales() {
    try {
        const { data } = await api("/billing")
        const response = salesFormDataSchema.safeParse(data);        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Get sales by id
export async function getDetailsSalesById({ id }: Pick<SalesData, "id">) {
    try {
        const { data } = await api(`/billing/${id}`);
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

// * Create a new sales
export async function createSales(formData: SalesFormDataAdd) {
    try {
        const { data } = await api.post("/billing/createBilling", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}

type SalesAPIType = {
    formData: SalesFormDataAdd,
    idSalesQuote: SalesQuoteFormDataEdit["id"],
}


// * Create a new sales from a sales quote
export async function createSalesFromSalesQuote({idSalesQuote, formData}: Pick<SalesAPIType, "idSalesQuote" | "formData">) {
    try {
        const { data } = await api.post(`/billing/createBilling/${idSalesQuote}/salesQuote`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}

type SeparatedProdctAPISalesType = {
    formData: SalesFormDataAdd,
    idSeparatedProduct: SeparatedProductFormDataEdit["id"],
}

// * Create a new sales from a separeted product
export async function createSalesFromSeparatedProduct({idSeparatedProduct, formData}: Pick<SeparatedProdctAPISalesType, "idSeparatedProduct" | "formData">) {
    try {
        const { data } = await api.post(`/billing/createBilling/${idSeparatedProduct}/separatedProduct`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}