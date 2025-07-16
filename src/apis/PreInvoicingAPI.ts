import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    PreInvoicingData,              
    PreInvoicingFormDataAdd,    
    preInvoicingFormDataSchema,    
    tempPreInvoicingDetailsDataSchema
} from "../types/preInvoicingData";
import { SalesQuoteFormDataEdit } from "../types/salesQuoteData";
import { SeparatedProductFormDataEdit } from "../types/separatedProductsData";

// * Get all pre-invoincing
export async function getPreInvoicing() {
    try {
        const { data } = await api("/preInvoicing")
        const response = preInvoicingFormDataSchema.safeParse(data);        
        if (response.success) {
            return response.data;
        }
    } catch (error) {        
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Get pre-invoincing by id
export async function getDetailsPreInvoicingById({ id }: Pick<PreInvoicingData, "id">) {
    try {
        const { data } = await api(`/preInvoicing/${id}`);        
        const response = tempPreInvoicingDetailsDataSchema.safeParse(data);         
        if (response.success) {
            return response.data;
        }
    } catch (error) {        
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}

// * Create a new pre-invoincing
export async function createPreInvoicing(formData: PreInvoicingFormDataAdd) {
    try {
        const { data } = await api.post("/preInvoicing/createPreInvoicing", formData);        
        return data
    } catch (error) {        
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}

type SalesQuoteAPIType = {
    formData: PreInvoicingFormDataAdd,
    idSalesQuote: SalesQuoteFormDataEdit["id"],
}
// * Create a new pre-invoincing from a sales quote
export async function createPreInvoicingFromSalesQuote({idSalesQuote, formData}: Pick<SalesQuoteAPIType, "idSalesQuote" | "formData">) {
    try {
        const { data } = await api.post(`/preInvoicing/createpreInvoicing/${idSalesQuote}/salesQuote`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}

type SeparatedProdctAPISalesType = {
    formData: PreInvoicingFormDataAdd,
    idSeparatedProduct: SeparatedProductFormDataEdit["id"],
}
// * Create a new sales from a separeted product
export async function createPreInvoicingFromSeparatedProduct({idSeparatedProduct, formData}: Pick<SeparatedProdctAPISalesType, "idSeparatedProduct" | "formData">) {
    try {
        const { data } = await api.post(`/preInvoicing/createpreInvoicing/${idSeparatedProduct}/separatedProduct`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}