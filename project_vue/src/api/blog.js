import { request } from "./request";

// add new blog
export const addBlog = async (formData) => {

    return request("/addBlog", {
        method: "POST",
        body: formData
    });

};

// get blogs list
export const getBlogsList = async (type) => {

    return request(`/allBlogs?type=${encodeURIComponent(type)}`, {
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

// delete blog
export const deleteBlog = (id) => {
    return request(`/deleteBlog/${id}`, {
        method: "DELETE"
    });
};


// get blog detail by id
export const getBlogDetail= async (id) => {
    return request(`/blogDetail/${id}`, {
        method: "GET"
    });

};

