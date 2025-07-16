import { isAxiosError } from "axios";
import api from "../lib/axios";
import {                
    remissionDataSchema,    
    RemissionsFormData,
    RemissionsFormDataEdit,        
    RemissionsFormDataAdd,
    remissionDetailsShema,    
    ProductRemissionFormData,
} from "../types/remissionsData";

// * Get all remissions
export async function getRemissions() {
    try {
        const { data } = await api("/remissions")
        const response = remissionDataSchema.safeParse(data)                
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get remission by id
export async function getRemissionById({ id }: Pick<RemissionsFormData, "id">) {
    try {
        const { data } = await api(`/remissions/${id}`);
        const response = remissionDetailsShema.safeParse(data);        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new remission
export async function createRemission(formData: RemissionsFormDataAdd) {
    try {
        const { data } = await api.post("/remissions/createRemission", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type RemissionAPIType = {
    formData: RemissionsFormDataEdit,
    remissionId: RemissionsFormDataEdit["id"],
}

// * Updta brand by id
export async function updateRemission({remissionId, formData}: Pick<RemissionAPIType, "remissionId" | "formData">) {
    try {        
        const { data } = await api.patch<string>(`/remissions/updateRemission/${remissionId}`, formData);        
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type DeleteProductRemissionAPIType = {
    formData: ProductRemissionFormData,
    remissionId: RemissionsFormDataEdit["id"],
}


// * Delete product by id in inventory
export async function deleteProductInInventory({remissionId, formData}: Pick<DeleteProductRemissionAPIType, "remissionId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/remissions/${remissionId}`, formData);
        return data;        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}