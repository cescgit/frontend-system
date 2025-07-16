import { isAxiosError } from "axios";
import api from "../lib/axios";
import { companyDataSchemaImage } from "../types/companyData";

// * Get all information initial system
export async function getDataInitial() {
    try {
        const { data } = await api("/")
        const response = companyDataSchemaImage.safeParse(data)        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error.message);
        }
    }
}
