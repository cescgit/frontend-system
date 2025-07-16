import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    accountingSourceDataSchema,
    AccountingSourceFormData,
    AccountingSourceFormDataAdd,
    AccountingSourceFormDataEdit
} from "../types/accountingSourceData";

// * Get all type account
export async function getAllAccountingSources() {
    try {
        const { data } = await api("/accountingSources")
        const response = accountingSourceDataSchema.safeParse(data)        
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
export async function getAccountingSourcesById({ id }: Pick<AccountingSourceFormData, "id">) {
    try {
        const { data } = await api(`/accountingSources/${id}`);
        const response = accountingSourceDataSchema.safeParse(data);
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
export async function createAccountingSource(formData: AccountingSourceFormDataAdd) {
    try {
        const { data } = await api.post("/accountingSources/createAccountingSources", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type AccountingSourceAPIType = {
    formData: AccountingSourceFormDataEdit,
    accountingSourceId: AccountingSourceFormDataEdit["id"],
}

// * Updta type accounting by id
export async function updateAccountingSource({ accountingSourceId, formData }: Pick<AccountingSourceAPIType, "accountingSourceId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/accountingSources/updateAccountingSources/${accountingSourceId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}