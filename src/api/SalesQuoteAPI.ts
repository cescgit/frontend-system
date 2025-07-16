import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    SalesQuote,
    SalesQuoteData,
    SalesQuoteFormDataEdit,
    productFormDataSchema,
    salesQuoteDetailsShema,
    SalesQuoteFormDataAdd,
} from "../types/salesQuoteData";

// * Get all sales quote
export async function getSalesQuote() {
    try {
        const { data } = await api("/salesQuote")
        const response = productFormDataSchema.safeParse(data);            
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get sales quote by id
export async function getDetailsSalesQuoteById({ id }: Pick<SalesQuoteData, "id">) {
    try {
        const { data } = await api(`/salesQuote/${id}`);                
        const response = salesQuoteDetailsShema.safeParse(data);           
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new sales quote
export async function createSalesQuotes(formData: SalesQuoteFormDataAdd) {
    try {
        const { data } = await api.post("/salesQuote/createSalesQuote", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}

type SalesQuoteAPIType = {
    formData: SalesQuoteFormDataEdit,
    salesQuoteId: SalesQuoteFormDataEdit["id"],
}

// * Updta sales quote by id
export async function updateSalesQuote({ salesQuoteId, formData }: Pick<SalesQuoteAPIType, "salesQuoteId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/salesQuote/updateSalesQuote/${salesQuoteId}`, formData);        
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Cancel sales quote by id
export async function cancelSalesQuote(salesQuoteId: SalesQuote["id"]) {
    try {
        const { data } = await api.patch<string>(`/salesQuote/${salesQuoteId}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Reactivate sales quote by id
export async function reactivateSalesQuote(salesQuoteId: SalesQuote["id"]) {
    try {
        const { data } = await api.patch<string>(`/salesQuote/${salesQuoteId}/reactivate`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}