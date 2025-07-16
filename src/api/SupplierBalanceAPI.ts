import { isAxiosError } from "axios";
import api from "../lib/axios";
import {                
    supplierBalanceDataSchema,    
    supplierBalanceFormDataSchemaSupplier,
    SupplierBalanceFormDataSupplier,
    SupplierBalanceFormDataSupplierAdd,
    SupplierBalanceFormDataSupplierCancel,
    SupplierBalanceFormDetails,
} from "../types/supplierBalanceData";

// * Get all supplier balance
export async function getSupplierBalance() {
    try {
        const { data } = await api("/supplierBalance")
        const response = supplierBalanceDataSchema.safeParse(data)          
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get supplier balance by id details supplier balance not canceled
export async function getSupplierBalanceByIdSupplier({ id }: Pick<SupplierBalanceFormDataSupplier, "id">) {
    try {
        const { data } = await api(`/supplierBalance/${id}`);               
        const response = supplierBalanceFormDataSchemaSupplier.safeParse(data);                   
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get supplier balance by id supplier
export async function getSupplierBalanceByIdSupplierDetails({ id }: Pick<SupplierBalanceFormDataSupplier, "id">) {
    try {
        const { data } = await api(`/supplierBalance/supplierBalanceDetails/${id}`);               
        const response = supplierBalanceFormDataSchemaSupplier.safeParse(data);                      
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get supplier balance by id details supplier balance
export async function getDetailsByBalanceSupplier({ id }: Pick<SupplierBalanceFormDetails, "id">) {
    try {        
        const { data } = await api(`supplierBalance/${id}/detailsBalanceSupplier/supplierBalanceDetails`);       
        const response = supplierBalanceFormDataSchemaSupplier.safeParse(data);                      
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type SupplirBalanceAPIType = {
    formData: SupplierBalanceFormDataSupplierAdd,
    id_proveedor: SupplierBalanceFormDataSupplier["id"],
}

// * Create new advance or payment
export async function createAdvanceOrPayment({id_proveedor, formData}: Pick<SupplirBalanceAPIType, "id_proveedor" | "formData">) {
    try {
        const { data } = await api.post(`/supplierBalance/${id_proveedor}/createAdvanceOrPaymentSupplierBalance`, formData);                
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type SupplirBalanceCancelAPIType = {
    formData: SupplierBalanceFormDataSupplierCancel,
    supplierBalanceId: SupplierBalanceFormDataSupplier["id"],
}

// * Cancel advance or payment
export async function cancelAdvanceOrPayment({supplierBalanceId, formData}: Pick<SupplirBalanceCancelAPIType, "supplierBalanceId" | "formData">) {
    try {
        const { data } = await api.patch(`/supplierBalance/${supplierBalanceId}/cancelAdvanceOrPaymentSupplierBalance`, formData);                
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}