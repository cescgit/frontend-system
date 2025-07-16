import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    typeAccountDataSchema,
    TypeAccountFormData,
    TypeAccountFormDataAdd,
    TypeAccountFormDataEdit
} from "../types/typeAccontData";

// * Get all type account
export async function getAlltypeAccount() {
    try {
        const { data } = await api("/typeAccount")
        const response = typeAccountDataSchema.safeParse(data)        
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
export async function getTypeAccountById({ id }: Pick<TypeAccountFormData, "id">) {
    try {
        const { data } = await api(`/typeAccount/${id}`);
        const response = typeAccountDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new type account
export async function createTypeAccount(formData: TypeAccountFormDataAdd) {
    try {
        const { data } = await api.post("/typeAccount/createTypeAccount", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type TypeAccountAPIType = {
    formData: TypeAccountFormDataEdit,
    typeAccountId: TypeAccountFormDataEdit["id"],
}

// * Updta type accounting by id
export async function updateTypeAccount({ typeAccountId, formData }: Pick<TypeAccountAPIType, "typeAccountId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/typeAccount/updateTypeAccount/${typeAccountId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}