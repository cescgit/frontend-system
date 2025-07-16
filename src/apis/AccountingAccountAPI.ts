import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    accountingAccountDataSchema,
    AccountingAccountFormData,
    AccountingAccountFormDataAdd,
    AccountingAccountFormDataEdit
} from "../types/acountingAccountData";

// * Get all accounting account
export async function getAllAccountingAccount() {
    try {
        const { data } = await api("/accountingAccount")
        const response = accountingAccountDataSchema.safeParse(data)        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get accounting acccount by id
export async function getAccountingAccountById({ id }: Pick<AccountingAccountFormData, "id">) {
    try {
        const { data } = await api(`/accountingAccount/${id}`);
        const response = accountingAccountDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new accounting account
export async function createAccountingAccount(formData: AccountingAccountFormDataAdd) {
    try {
        const { data } = await api.post("/accountingAccount/createAccountingAccount", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type AccountingAccountAPIType = {
    formData: AccountingAccountFormDataEdit,
    accountingAccountId: AccountingAccountFormDataEdit["id"],
}

// * Updta account accounting by id
export async function updateAccountingAccount({ accountingAccountId, formData }: Pick<AccountingAccountAPIType, "accountingAccountId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/accountingAccount/updateAccountingAccount/${accountingAccountId}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}