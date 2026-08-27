import { request } from "./request";

// add new blog
export const addBlog = async (formData) => {

    return request("/addBlog", {
        method: "POST",
        body: formData
    });

};

// get blogs list
export const getBlogsList = async () => {

    return request("/allBlogs", {
        method: "GET"
    });

};

// get Categories
export const getCategories= async () => {

    return request("/allCategories", {
        method: "GET"
    });

};

// search blogs by title
export const searchBlogs = async (keyword) => {

    return request(
        `/searchBlogs?keyword=${encodeURIComponent(keyword)}`,
        {
            method: "GET"
        }
    );

};

