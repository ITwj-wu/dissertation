import { request } from "./request";


export const addBlog = async (formData) => {

    return request("/blogs", {
        method: "POST",
        body: formData
    });

};