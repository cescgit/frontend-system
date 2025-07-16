import { isAxiosError } from "axios";
import api from "../lib/axios";
import {            
    PermissionsUserFormData,
    permissionsUserFormDataSchema,
    userDataSchema,    
    UserFormDataAdd,
    UserFormDataEdit,
    UserFormDataEditStaff,
    UserFormDataInfo,
    userFormDataSchema,
} from "../types/userData";
import { UserAuth } from "../types/authData";

// * Get all users
export async function getUsers() {
    try {
        const { data } = await api("/users")
        const response = userDataSchema.safeParse(data)        
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Get user by id
export async function getUserById({ id }: Pick<UserFormDataInfo, "id">) {
    try {
        const { data } = await api(`/users/${id}`);
        const response = userFormDataSchema.safeParse(data);     
        console.log(response)
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Create a new user
export async function createUser(formData: UserFormDataAdd) {
    try {
        const { data } = await api.post("/users/createUser", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type UserAPIType = {
    formData: UserFormDataEditStaff,
    userId: UserFormDataEdit["id"],
}

// * Updta data user by id
export async function updateUser({userId, formData}: Pick<UserAPIType, "formData" | "userId">) {
    try {        
        const { data } = await api.patch<string>(`/users/updateUser/${userId}`, formData);        
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type UserManagerAPIType = {
    formData: UserFormDataEdit,
    userId: UserFormDataEdit["id"],
}

// * Updta data user by manager
export async function updateByManagerUser({userId, formData}: Pick<UserManagerAPIType, "formData" | "userId">) {
    try {        
        const url = `/users/updateUserManager/${userId}`;
        const { data } = await api.patch<string>(url, formData);        
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// * Delete user by id
export async function deleteUser(id: UserAuth["id"]) {
    try {
        const { data } = await api.delete<string>(`/users/${id}`);
        return data;        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}


// * Permissions by Users
type PermissonsUserAPIType = {
    formData: PermissionsUserFormData,
    id_usuario: PermissionsUserFormData["id_usuario"],
}

// * Get permissions per user
export async function getPermissionsUser({id_usuario}: Pick<PermissionsUserFormData, "id_usuario"> ) {
    try {
        const {data} = await api(`/users/permissionsUser/${id_usuario}`);        
        const response = permissionsUserFormDataSchema.safeParse(data);            
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) { 
            throw new Error(error.response.data.error);
        }        
    }
}

// * Create or Update permissions for user
export async function addOrUpdatePermissionsUser({formData, id_usuario}: Pick<PermissonsUserAPIType, "formData" | "id_usuario">) {
    try {        
        const { data } = await api.post<string>(`/users/createPermissions/${id_usuario}`, formData);        
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) { 
            throw new Error(error.response.data.error);
        }   
    }
}