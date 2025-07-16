import { isAxiosError } from "axios";
import api from "../lib/axios";
import {                
    productDataSchema,    
    ProductFormData,
    ProductFormDataEdit,    
    Product,    
    ProductFormDataAdd
} from "../types/productData";

// * Get all products
export async function getProducts() {
    try {
        const { data } = await api("/products")
        const response = productDataSchema.safeParse(data)             
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get product by id
export async function getProductById({ id }: Pick<ProductFormData, "id">) {
    try {
        const { data } = await api(`/products/${id}`);
        const response = productDataSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new product
export async function createProduct(formData: ProductFormDataAdd) {
    try {        
        const { data } = await api.post("/products/createProduct", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type ProductAPIType = {
    formData: ProductFormDataEdit,
    productId: ProductFormDataEdit["id"],
}

// * Updta product by id
export async function updateProduct({productId, formData}: Pick<ProductAPIType, "productId" | "formData">) {
    try {                
        const { data } = await api.patch<string>(`/products/updateProduct/${productId}`, formData);        
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete product by id
export async function deleteProduct(productId: Product["id"]) {
    try {
        const { data } = await api.delete<string>(`/products/${productId}`);
        return data;        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}