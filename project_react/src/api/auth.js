import { request } from "./request";

// login
export const login = async (data) => {

    return request("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
    });
};

// 
export const register = async (data) => {

    return request("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
};