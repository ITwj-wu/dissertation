import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getCategories,
    addBlog,
    getBlogDetail,
    updateBlog
} from "../../api/blog";

import { useToast } from "../../components/Toast/ToastContext";


import { Editor } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";

import "bytemd/dist/index.css";
import "highlight.js/styles/default.css";

import "./AddNewBlog.scss";

const AddNewBlog = () => {
    const toast = useToast();

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = !!id;

    // state
    const [allCategories, setAllCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [selectType, setSelectType] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const fileInputRef =useRef(null);

    // ByteMD plugins
    const plugins = [
        gfm(),
        highlight()
    ];


    // get categories
    const getAllCategories = async () => {
        try {
            const result =await getCategories();

            setAllCategories(result.data || []);

        } catch (error) {
            console.error(
                "Init Categories error:",
                error
            );
        }
    };

    // get edit blog detail
    const getEditBlog = async () => {
        try {

            const result = await getBlogDetail(id);

            const blog = result.data;

            console.log("Edit blog:", blog);

            setTitle(blog.title || "");
            setSelectType(blog.type || "");
            setContent(blog.content || "");

            // Existing cover image
            if (blog.cover_image) {

                const SERVER_URL = import.meta.env.VITE_SERVER_URL ?.replace("/api", "");

                setImagePreview(
                    `${SERVER_URL}${blog.cover_image}`
                );
            }

        } catch (error) {

            console.error("Get blog detail error:", error);

            toast.open({
                type: "error",
                title: "Failed",
                message: "Failed to load blog."
            });
        }
    };

    // image upload
    const handleImageUpload = (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        console.log('ImagePreview', ImagePreview)
    };

    // clear image
    const clearImage = () => {

        setImageFile(null);

        setImagePreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // reset form
    const resetForm = () => {
        setTitle("");
        setSelectType("");
        setContent("");
        setImageFile(null);
        setImagePreview("");
        setValidated(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // post
    const handlePost = async (event) => {

        event.preventDefault();

        setValidated(true);

        // validation
        if (!title.trim()) {
            return;
        }

        if (!selectType) {
            return;
        }

        if (!content.trim()) {
            return;
        }

        try {

            setLoading(true);

            // FormData
            const formData =new FormData();

            formData.append("title",title);
            formData.append("type",selectType);
            formData.append("content", content);

            // Only append image if
            // user selected a new image

            if (imageFile) {
                formData.append("coverImage",imageFile
                );
            }

            // Edit

            if (isEdit) {
                await updateBlog(id, formData);

                toast.open({
                    type: "success",
                    title: "Update!",
                    message:
                        "Your blog has been updated successfully."
                });

                navigate("/");

            }

            // Add blog
            else {

                await addBlog(formData);

                toast.open({
                    type: "success",
                    title: "Published!",
                    message:
                        "Your blog has been published successfully."
                });

                resetForm();
            }

        } catch (error) {
            console.error(
                "Save blog error:",
                error
            );

            toast.open({
                type: "error",
                title: "Failed",
                message: error.message
            });

        } finally {
            setLoading(false);
        }
    };

    // click btn: Back
    const handleBack = () => { navigate("/"); };
    // init page
    useEffect(() => {
        getAllCategories();
        if (isEdit) {
            getEditBlog();
        }
    }, [id]);
    
    return (
        <div>
            {/* header */}
            <div className="flex justify-between header">
                <h3 className="title">
                    Iris Notes &gt;&gt;{" "}
                    {isEdit ? "Edit Blog": "Add New Blog"}
                </h3>
                <button
                    className="btn btn-outline-pink"
                    onClick={handleBack}
                >
                    Back -&gt;
                </button>
            </div>

            {/* form */}
            <form
                className="add-new-blog"
                onSubmit={handlePost}
                noValidate
            >
                {/* Cover image*/}
                <div className="mb-4">
                    <label className="form-label">
                        Cover image
                    </label>

                    <input
                        ref={fileInputRef}
                        className="form-control"
                        type="file"
                        accept="
                            image/png,
                            image/jpeg,
                            image/webp
                        "
                        onChange={
                            handleImageUpload
                        }
                    />

                    {validated && !imagePreview && !isEdit && (
                        <div className="text-danger small mt-2">
                            Please upload a cover image.
                        </div>

                    )}

                    {imagePreview && (
                        <div
                            className="mt-3 image-preview"
                        >
                            <img
                                src={imagePreview}
                                alt="Blog cover preview"
                                className=" img-fluid rounded blog-cover-preview-img"
                            />

                            <button
                                type="button"
                                className="btn btn-danger mt-2 clear-btn"
                                onClick={
                                    clearImage
                                }
                            >
                                X
                            </button>
                        </div>
                    )}
                </div>

                {/* Type */}

                <div className="mb-3 mt-3">
                    <div>
                        <label className="form-label">
                            Type
                        </label>
                    </div>

                    {allCategories.map(
                        (category) => (
                            <button
                                key={category.id}
                                type="button"
                                className={`
                                    btn
                                    me-3
                                    ${
                                        selectType ===
                                        category.name
                                            ? "btn-pink"
                                            : "btn-outline-pink"
                                    }
                                `}
                                onClick={() =>
                                    setSelectType(
                                        category.name
                                    )
                                }
                            >
                                {category.name}
                            </button>
                        )
                    )}

                    {validated &&
                        !selectType && (
                        <div className="text-danger small mt-2">
                            Please select a type.
                        </div>
                    )}
                </div>

                {/* Title */}

                <div className="mb-3">
                    <label htmlFor="blog-title" className="form-label">
                        Title
                    </label>

                    <input
                        value={title}
                        onChange={(event) =>
                            setTitle(
                                event.target.value
                            )
                        }
                        type="text"
                        className="form-control"
                        id="blog-title"
                        required
                    />

                    {validated &&
                        !title.trim() && (
                        <div className="text-danger small mt-2">
                            Please enter a title.
                        </div>
                    )}
                </div>

                {/* Content */}

                <div className="mb-3">
                    <label
                        htmlFor="blog-content"
                        className="form-label"
                    >
                        Content
                    </label>

                    <Editor
                        value={content}
                        plugins={plugins}
                        mode="split"
                        onChange={setContent}
                    />

                    {validated && content.trim() && (
                        <div
                            className="text-dangersmallmt-2
                            "
                        >
                            Please enter content.
                        </div>
                    )}
                </div>

                {/* submit */}
                <button
                    type="submit"
                    className="btn btn-pink w-40"
                    disabled={loading}
                >
                    {loading ? "Saving..." : isEdit ? "Save": "Post"}
                </button>
            </form>
        </div>
    );
}

export default AddNewBlog;