import { isAxiosError } from "axios";
import api from "../lib/axios";
import {                
    customerBalanceDataSchema,    
    CustomerBalanceFormDataCustomer,
    CustomerBalanceFormDataCustomerAdd,
    CustomerBalanceFormDataCustomerCancel,
    customerBalanceFormDataSchemaCustomer,
    CustomerBalanceFormDetails,    
} from "../types/customerBalanceData";

// * Get all customer balance
export async function getCustomerBalance() {
    try {
        const { data } = await api("/customerBalance")
        const response = customerBalanceDataSchema.safeParse(data)          
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get customer balance by id details customer balance not canceled
export async function getCustomerBalanceByIdCustomer({ id }: Pick<CustomerBalanceFormDataCustomer, "id">) {
    try {
        const { data } = await api(`/customerBalance/${id}`);               
        const response = customerBalanceFormDataSchemaCustomer.safeParse(data);             
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get customer balance by id customer
export async function getCustomerBalanceByIdCustomerDetails({ id }: Pick<CustomerBalanceFormDataCustomer, "id">) {
    try {
        const { data } = await api(`/customerBalance/customerBalanceDetails/${id}`);               
        const response = customerBalanceFormDataSchemaCustomer.safeParse(data);              
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get customer balance by id details customer balance
export async function getDetailsByBalanceCustomer({ id }: Pick<CustomerBalanceFormDetails, "id">) {
    try {        
        const { data } = await api(`customerBalance/${id}/detailsBalanceCustomer/customerBalanceDetails`);       
        const response = customerBalanceFormDataSchemaCustomer.safeParse(data);             
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type CustomerBalanceAPIType = {
    formData: CustomerBalanceFormDataCustomerAdd,
    id_cliente: CustomerBalanceFormDataCustomer["id"],
}

// * Create new advance or payment
export async function createAdvanceOrPaymentCustomer({id_cliente, formData}: Pick<CustomerBalanceAPIType, "id_cliente" | "formData">) {
    try {
        const { data } = await api.post(`/customerBalance/${id_cliente}/createAdvanceOrPaymentCustomerBalance`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type CustomerBalanceCancelAPIType = {
    formData: CustomerBalanceFormDataCustomerCancel,
    customerBalanceId: CustomerBalanceFormDataCustomer["id"],
}

// * Cancel advance or payment
export async function cancelAdvanceOrPaymentCustomer({customerBalanceId, formData}: Pick<CustomerBalanceCancelAPIType, "customerBalanceId" | "formData">) {
    try {
        const { data } = await api.patch(`/customerBalance/${customerBalanceId}/cancelAdvanceOrPaymentCustomerBalance`, formData);                
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}