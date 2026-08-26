<template>
    <form
        ref="formRef"
        class="add-new-blog"
        :class="{ 'was-validated': validated }"
        @submit.prevent="handlePost"
        novalidate
    >
        <h3 class="title">
            Iris Notes >> Add new blog
        </h3>

        <div class="mb-4">
            <label class="form-label">
                Cover image
            </label>

            <input
                ref="fileInput"
                class="form-control"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                required
                @change="handleImageUpload"
            />

            <div class="invalid-feedback">
                Please upload a cover image.
            </div>

            <div v-if="imagePreview" class="mt-3">
                <img
                    :src="imagePreview"
                    alt="Blog cover preview"
                    class="img-fluid rounded blog-cover-preview"
                />
            </div>
        </div>

        <div class="mb-3 mt-3">
            <p>Type</p>

            <button
                v-for="category in categories"
                :key="category"
                :id="category"
                type="button"
                class="btn me-3"
                :class="selectType === category ? 'btn-pink' : 'btn-outline-pink'"
                @click="selectType = category"
            >
                {{ category }}
            </button>

            <div
                v-if="validated && !selectType"
                class="text-danger small mt-2"
            >
                Please select a type.
            </div>

            <!-- <button type="button" class="btn btn-outline-primary"> + </button> -->
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

        <!-- <button type="button" class="btn btn-primary">Save</button> -->

        <button
            type="submit"
            class="btn btn-pink"
            :disabled="loading"
        >
            {{ loading ? "Posting..." : "Post" }}
        </button>
    </form>

    <Toast ref="toastRef" />
</template>

<script setup>

import Toast from "../components/Toast.vue";
import { addBlog } from "../api/blog";
import { ref } from "vue";

import { Editor } from "@bytemd/vue-next";

import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";

import "bytemd/dist/index.css";
import "highlight.js/styles/default.css";


const toastRef = ref(null);

const categories = [
    "Handcraft",
    "Nail Art",
    "Tea Ceremony",
    "Guzheng",
];

const title = ref("");
const selectType = ref("");
const content = ref("");
const fileInput = ref(null);

const formRef = ref(null);
const validated = ref(false);

const plugins = [
    gfm(),
    highlight(),
];

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

    if (!selectType.value) {
        return;
    }

    if (!content.value.trim()) {
        return;
    }

    try {
        loading.value = true;

        // FormData
        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("type", selectType.value);
        formData.append("content", content.value);

        if (imageFile.value) {
            formData.append("coverImage", imageFile.value);
        }

        // for (const [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }

        // request API
        await addBlog(formData);

        toastRef.value.open({
            type: "success",
            title: "Published!",
            message: "Your blog has been published successfully."
        });

        resetForm();

    } catch (error) {
        toastRef.value.open({
            type: "error",
            title: "Post failed",
            message: error.message
        });
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.title {
    font-family: "Dancing Script", cursive;
    font-size: 42px;
    color: #E8A0B5;
}

.blog-cover-preview {
    width: 300px;
    height: 180px;
    object-fit: cover;
}

</style>