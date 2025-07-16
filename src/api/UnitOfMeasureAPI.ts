import { isAxiosError } from "axios";
import api from "../lib/axios";
import { UnitOfMeasureData, unitOfMeasureDataSchema, UnitOfMeasureFormData, UnitOfMeasureFormDataAdd, UnitOfMeasureFormDataEdit, UnitOfMeasureFormDataInfo } from "../types/unitOfMeasureData";

// * Get all unit of measure
export async function getUnitOfMeasurements() {
    try {
        const { data } = await api("/unitOfMeasurements")
        const response = unitOfMeasureDataSchema.safeParse(data)        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get unit of measure by id
export async function getUnitOfMeasureById({ id }: Pick<UnitOfMeasureFormData, "id">) {
    try {
        const { data } = await api(`/unitOfMeasurements/${id}`);
        const response = unitOfMeasureDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new unit of measure
export async function createUnitOfMeasure(formData: UnitOfMeasureFormDataAdd) {
    try {
        const { data } = await api.post("/unitOfMeasurements/createUnitOfMeasure", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type UnitOfMeasureAPIType = {
    formData: UnitOfMeasureFormDataInfo,
    unitOfMeasureId: UnitOfMeasureFormDataEdit["id"],
}

// * Updta brand by id
export async function updateUnitOfMeasure({unitOfMeasureId, formData}: Pick<UnitOfMeasureAPIType, "formData" | "unitOfMeasureId">) {
    try {        
        const { data } = await api.patch<string>(`/unitOfMeasurements/updateUnitOfMeasure/${unitOfMeasureId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete brand by id
export async function deleteUniofMeasure(unitOfMeasureId: UnitOfMeasureData["id"]) {
    try {
        const { data } = await api.delete<string>(`/unitOfMeasurements/${unitOfMeasureId}`);
        return data;        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}