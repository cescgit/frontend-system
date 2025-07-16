import { isAxiosError } from "axios";
import api from "../lib/axios";
import {                
    Taxes,
    taxesDataSchema,
    TaxesFormData,
    TaxesFormDataAdd,
    TaxesFormDataEdit,
} from "../types/taxesData";

// * Get all Taxes
export async function getTaxes() {
    try {
        const { data } = await api("/taxes")
        const response = taxesDataSchema.safeParse(data)         
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get tax by id
export async function getTaxById({ id }: Pick<TaxesFormData, "id">) {
    try {
        const { data } = await api(`/taxes/${id}`);
        const response = taxesDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new tax
export async function createTax(formData: TaxesFormDataAdd) {
    try {
        const { data } = await api.post("/taxes/createTax", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type TaxAPIType = {
    formData: TaxesFormDataEdit,
    taxId: TaxesFormDataEdit["id"],
}

// * Updta tax by id
export async function updateTax({taxId, formData}: Pick<TaxAPIType, "formData" | "taxId">) {
    try {        
        const { data } = await api.patch<string>(`/taxes/updateTax/${taxId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete tax by id
export async function deleteTax(taxId: Taxes["id"]) {
    try {
        const { data } = await api.delete<string>(`/taxes/${taxId}`);
        return data;        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}