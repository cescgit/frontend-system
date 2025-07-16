import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
    SeparatedProduct,
    SeparatedProductData,
    SeparatedProductFormDataEdit,
    productFormDataSchema,
    seperatedProductDetailsShema,
    SeparatedProductFormDataAdd,
    TempPurchasingFormData,
} from "../types/separatedProductsData";

// * Get all separated product
export async function getSeparatedProducts() {
    try {
        const { data } = await api("/separatedProducts")
        const response = productFormDataSchema.safeParse(data)                           
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get separated propduct by id
export async function getDetailsSeparatedproductById({ id }: Pick<SeparatedProductData, "id">) {
    try {
        const { data } = await api(`/separatedProducts/${id}`);        
        const response = seperatedProductDetailsShema.safeParse(data);             
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new sepparated product
export async function createSeparatedProduct(formData: SeparatedProductFormDataAdd) {
    try {
        const { data } = await api.post("/separatedProducts/createSeparatedProducts", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {            
            throw new Error(error.response.data.error);
        }
    }
}

type SeparateProductsAPIType = {
    formData: SeparatedProductFormDataEdit,
    separatedProductId: SeparatedProductFormDataEdit["id"],
}

// * Updta separated product by id
export async function updateSeparatedProduct({ separatedProductId, formData }: Pick<SeparateProductsAPIType, "separatedProductId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/separatedProducts/updateSeparatedProduct/${separatedProductId}`, formData);        
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Cancel separated product by id
export async function cancelSeparatedProduct(separatedProductId: SeparatedProduct["id"]) {
    try {
        const { data } = await api.patch<string>(`/separatedProducts/cancelSeparatedProduct/${separatedProductId}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * restored separated product by id
export async function restoredSeparatedProduct(separatedProductId: SeparatedProduct["id"]) {
    try {
        const { data } = await api.patch<string>(`/separatedProducts/restoredSeparatedProduct/${separatedProductId}`);    
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type ProductSeparatedFormDataEdit = {
    formData: TempPurchasingFormData,
    separatedProductId: SeparatedProductFormDataEdit["id"],
}


// * Delete product by id in inventory
export async function deleteProductInInventorySeparatedproduct({separatedProductId, formData}: Pick<ProductSeparatedFormDataEdit, "separatedProductId" | "formData">) {
    try {
        const { data } = await api.patch<string>(`/separatedProducts/${separatedProductId}`, formData);
        return data;        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}