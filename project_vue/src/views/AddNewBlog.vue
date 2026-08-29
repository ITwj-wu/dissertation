<template>
    <div class="flex justify-between header">
        <h3 class="title">
            Iris Notes >> {{ isEdit ? "Edit Blog" : "Add New Blog" }}
        </h3>
        <button class="btn btn-outline-pink" @click="handleBack">Back -></button>
    </div>
    <form
        ref="formRef"
        class="add-new-blog"
        :class="{ 'was-validated': validated }"
        @submit.prevent="handlePost"
        novalidate
    >
        <div class="mb-4">
            <label class="form-label">
                Cover image
            </label>

            <input
                ref="fileInput"
                class="form-control"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                @change="handleImageUpload"
            />

            <div class="invalid-feedback">
                Please upload a cover image.
            </div>

            <div v-if="imagePreview" class="mt-3 image-preview">
                <img
                    :src="imagePreview"
                    alt="Blog cover preview"
                    class="img-fluid rounded blog-cover-preview-img"
                />
                <button
                    type="button"
                    class="btn btn-danger mt-2 clear-btn"
                    @click="clearImage"
                >
                    X
                </button>
            </div>
        </div>

        <div class="mb-3 mt-3">
            <p>Type</p>

            <button
                v-for="category in allCategories"
                :key="category.id"
                :id="category.id"
                type="button"
                class="btn me-3"
                :class="selectType === category.name ? 'btn-pink' : 'btn-outline-pink'"
                @click="selectType = category.name"
            >
                {{ category.name }}
            </button>

            <div
                v-if="validated && !selectType"
                class="text-danger small mt-2"
            >
                Please select a type.
            </div>
        </div>

        <div class="mb-3">
            <label
                for="basic-url"
                class="form-label"
            >
                Title
            </label>

            <input
                v-model="title"
                type="text"
                class="form-control"
                id="basic-url"
                aria-describedby="basic-addon3 basic-addon4"
                required
            >

            <div class="invalid-feedback">
                Please enter a title.
            </div>
        </div>

        <div class="mb-3">
            <label
                for="basic-url"
                class="form-label"
            >
                Content
            </label>

            <Editor
                :value="content"
                :plugins="plugins"
                mode="split"
                @change="handleContentChange"
            />

            <div
                v-if="validated && !content.trim()"
                class="text-danger small mt-2"
            >
                Please enter content.
            </div>
        </div>

        <button
            type="submit"
            class="btn btn-pink w-40"
            :disabled="loading"
        >
            {{ isEdit ? "Save" : "Post" }}
        </button>
    </form>

    <Toast ref="toastRef" />
</template>

<script setup>
import { getCategories } from "../api/blog";
import { useRouter, useRoute } from "vue-router";
import { addBlog, getBlogDetail, updateBlog } from "../api/blog";
import { onMounted, ref } from "vue";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

import { Editor } from "@bytemd/vue-next";

import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";

import "bytemd/dist/index.css";
import "highlight.js/styles/default.css";

const router = useRouter();
const route = useRoute();
const blogId = route.params.id;
const isEdit = !!blogId;

const toastRef = ref(null);
const allCategories = ref(null);
const title = ref("");
const selectType = ref("");
const content = ref("");
const fileInput = ref(null);

const formRef = ref(null);
const validated = ref(false);


onMounted(() => {
    getAllCategories();

    if (isEdit) {
        getEditBlog();
    }
});

// edit: get blog details
const getEditBlog = async () => {

    try {

        const result = await getBlogDetail(blogId);
        const blog = result.data;
        console.log(blog);
        
        title.value = blog.title;
        selectType.value = blog.type;
        content.value = blog.content;
        if(blog.cover_image) {
            fileInput.value = blog.cover_image
        }

        console.log(fileInput.value )

        if (blog.cover_image) {
            imagePreview.value =
                `${SERVER_URL}${blog.cover_image}`;
        }

    } catch (error) {

        console.error("Get blog detail error:", error);

    }

};

const plugins = [
    gfm(),
    highlight(),
];

const getAllCategories = async() => {
     try {
        const result = await getCategories();
        allCategories.value = result.data;

    } catch (error) {
        console.error("Init Categories error:", error);
    }
};


// content change
const handleContentChange = (val) => {
    content.value = val;
};

// upload image
const imageFile = ref(null);
const imagePreview = ref("");
const loading = ref(false);

const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
};

// reset form
const resetForm = () => {
    title.value = "";
    selectType.value = "";
    content.value = "";

    imageFile.value = null;
    imagePreview.value = "";

    if (fileInput.value) {
        fileInput.value.value = "";
    }

    validated.value = false;
};

// click post button
const handlePost = async () => {
    validated.value = true;

    if (!formRef.value.checkValidity()) {
        return;
    }

    // FormData
    const formData = new FormData();

    formData.append("title", title.value);
    formData.append("type", selectType.value);
    formData.append("content", content.value);

    if (imageFile.value) {
        formData.append("coverImage", imageFile.value);
    }

    try {
        loading.value = true;
        console.log(formData)
        
        if (isEdit) {
            // edit
             await updateBlog(
                 blogId,
                 formData,
            );

            toastRef.value.open({
                type: "success",
                title: "Update!",
                message: "Your blog has been updated successfully."
            });

            router.push("/");
        } else {
            // add
            await addBlog(formData);

            toastRef.value.open({
                type: "success",
                title: "Published!",
                message: "Your blog has been published successfully."
            });
            resetForm();
        }

    } catch (error) {
        toastRef.value.open({
            type: "error",
            title: "Failed",
            message: error.message
        });
    } finally {
        loading.value = false;
    }
};

const handleBack = () => {
    router.push("/");
};

// clear image
const clearImage = () => {
    imageFile.value = null;
    imagePreview.value = "";

    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

</script>

<style scoped lang="scss">
.title {
    font-family: "Dancing Script", cursive;
    font-size: 42px;
    color: #E8A0B5;
}

.image-preview {
    position: relative;
    .blog-cover-preview-img {
        width: 300px;
        height: 180px;
        object-fit: cover;
    }
    .clear-btn {
        position: absolute;
        top: 0;
        left: 0;
        width: 15px;
        height: 15px;
        border-radius: 15px;
        font-size: 10px;
        line-height: 3px;
    }
}


</style>