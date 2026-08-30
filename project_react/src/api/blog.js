import { request } from "./request";
const token = localStorage.getItem("token");

// add new blog
export const addBlog = async (formData) => {

    return request("/addBlog", {
        method: "POST",
         headers: {
            "Authorization": `Bearer ${token}`
        },

        body: formData
    });

};

// update blog
export const updateBlog= async (id, formData) => {

    return request(`/updateBlog/${id}`, {
        method: "PUT",

        headers: {
            "Authorization": `Bearer ${token}`
        },

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
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};


// get blog detail by id
export const getBlogDetail= async (id) => {
    return request(`/blogDetail/${id}`, {
        method: "GET"
    });

};



// add comment
export const addComment= async (data) => {

    return request("/comments", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(data)
    });

};

// get comments
export const getCommentsByBlogId= async (id) => {
    return request(`/getComments/${id}`, {
        method: "GET"
    });

};

