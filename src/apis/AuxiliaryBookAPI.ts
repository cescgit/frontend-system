import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    auxiliaryBookDataSchema,
    AuxiliaryBookFormData,
    AuxiliaryBookFormDataAdd,
    AuxiliaryBookFormDataEdit
} from "../types/auxiliaryBookData";

// * Get all auxiliary book
export async function getAllAuxiliaryBook() {
    try {
        const { data } = await api("/auxiliaryBooksdgerRegister/")
        const response = auxiliaryBookDataSchema.safeParse(data)        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get type acccount by id
export async function getAuxiliaryBookById({ id }: Pick<AuxiliaryBookFormData, "id">) {
    try {
        const { data } = await api(`/auxiliaryBooksdgerRegister/${id}`);
        const response = auxiliaryBookDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new auxiliary book
export async function createAuxiliaryBook(formData: AuxiliaryBookFormDataAdd) {
    try {
        const { data } = await api.post("/auxiliaryBooksdgerRegister/createAuxiliaryBook", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type AuxiliaryBookAPIType = {
    formData: AuxiliaryBookFormDataEdit,
    auxiliaryBookId: AuxiliaryBookFormDataEdit["id"],
}

// * Updta auxiliary book by id
export async function updateAuxiliaryBook({ auxiliaryBookId, formData }: Pick<AuxiliaryBookAPIType, "auxiliaryBookId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/auxiliaryBooksdgerRegister/updateAuxiliaryBook/${auxiliaryBookId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}