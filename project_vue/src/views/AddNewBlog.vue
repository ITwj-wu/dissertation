<template>
    <div class="add-new-blog">
        <h3 class="title">Iris Notes >> Add new blog </h3>
        <div class="mb-4">
            <label class="form-label">Cover image</label>

            <input
                ref="fileInput"
                class="form-control"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                @change="handleImageUpload"
            />

            <div v-if="imagePreview" class="mt-3">
                <img
                :src="imagePreview"
                alt="Blog cover preview"
                class="img-fluid rounded blog-cover-preview "
                />
            </div>
        </div>
        <div class="mb-3 mt-3">
            <p>Type</p>
                <button 
                    v-for="category in categories"
                    :id="category"
                    type="button"
                    class="btn btn-outline-primary me-3"
                    :class="selectType === category ? 'btn-primary' : 'btn-outline-primary'"
                    @click="selectType = category"
                >
                    {{ category }}
                </button>
            <!-- <button type="button" class="btn btn-outline-primary"> + </button> -->
        </div>
        <div class="mb-3">
            <label for="basic-url" class="form-label">Title</label>
            <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4" v-model="title">
        </div>
        <div class="mb-3">
            <label for="basic-url" class="form-label">Content</label>
            <Editor
                :value="content"
                :plugins="plugins"
                mode="split"
                @change="handleContentChange"
            />
        </div>
        <!-- <button type="button" class="btn btn-primary">Save</button> -->
        <button 
            type="button" class="btn btn-primary" 
            :disabled="loading"
            @click="handlePost"
        >
            {{ loading ? "Posting..." : "Post" }}
        </button>
    </div>
    <Toast ref="toastRef" />
</template>

<script  setup>
import Toast from "../components/Toast.vue";
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

const plugins = [
    gfm(),
    highlight(),
];

// content change
const handleContentChange = (val) => {
    content.value = val
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
};

// click post button
const handlePost = async () => {
    // vaild
    if (!title.value.trim()) {
        alert("Please enter a title");
        return;
    }

    if (!selectType.value) {
        alert("Please select a type");
        return;
    }

    if (!content.value.trim()) {
        alert("Please enter content");
        return;
    }

    try {
        loading.value = true;

        // FormData
        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("type", selectType.value);
        formData.append("content", content.value);
        if(imageFile.value) {
            formData.append("coverImage", imageFile.value);
        }
        // for (const [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }

        // request API
        const response = await fetch(
            "http://localhost:8080/api/blogs",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();
        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to add new blog"
            );

        }

        toastRef.value.open({
            type: "success",
            title: "Published!",
            message: "Your blog has been published successfully."
        });
        resetForm()


    } catch (error) {
        console.error ("Post error", error);
        alert(error.message)
    } finally {
        loading.value = false
    }
};
</script>

<style>
.blog-cover-preview {
  width: 300px;
  height: 180px;
  object-fit: cover;
}
</style>