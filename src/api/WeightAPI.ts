import { isAxiosError } from "axios";
import api from "../lib/axios";
import { WeightFormData, WeightFormDataAdd, WeightFormDataEdit, WeightFormDataInfo, weightDataSchema } from "../types/weightData";

// * Get all weight
export async function getWeight() {
    try {
        const { data } = await api("/weight")
        const response = weightDataSchema.safeParse(data)        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get weight by id
export async function getWeightById({ id }: Pick<WeightFormData, "id">) {
    try {
        const { data } = await api(`/weight/${id}`);
        const response = weightDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new weight
export async function createWeight(formData: WeightFormDataAdd) {
    try {
        const { data } = await api.post("/weight/createWeight", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type WeightAPIType = {
    formData: WeightFormDataInfo,
    weightId: WeightFormDataEdit["id"],
}

// * Updta weight by id
export async function updateWeight({weightId, formData}: Pick<WeightAPIType, "formData" | "weightId">) {
    try {        
        const { data } = await api.patch<string>(`/weight/updateWeight/${weightId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete weight by id
export async function deleteWeight(weightId: WeightFormData["id"]) {
    try {
        const { data } = await api.delete<string>(`/weight/${weightId}`);
        return data;        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}