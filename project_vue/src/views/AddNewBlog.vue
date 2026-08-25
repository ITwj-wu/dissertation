<template>
    <div class="add-new-blog">
        <h3 class="title">Iris Notes >> Add new blog </h3>
        <div class="mb-4">
            <label class="form-label">Cover image</label>

            <input
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
                <button v-for="category in categories" :id="category" type="button" class="btn btn-outline-primary me-3">{{ category }}</button>
            <button type="button" class="btn btn-outline-primary"> + </button>
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
            />
        </div>
        <!-- <button type="button" class="btn btn-primary">Save</button> -->
        <button type="button" class="btn btn-primary">Post</button>
    </div>
</template>

<script  setup>
import { ref } from "vue";

import { Editor } from "@bytemd/vue-next";

import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";

import "bytemd/dist/index.css";
import "highlight.js/styles/default.css";

const categories = [
  "Handcraft",
  "Nail Art",
  "Tea Ceremony",
  "Guzheng",
];

const title = ref("哈哈哈");

// const content = ref("");

const content = ref("# Hello\n\n**Hello World!**");

const plugins = [
    gfm(),
    highlight(),
];

function postBlog() {
    console.log(title.value);
    console.log(content.value);
}
const imageFile = ref(null);
const imagePreview = ref("");

const handleImageUpload = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};
</script>

<style>
.blog-cover-preview {
  width: 300px;
  height: 180px;
  object-fit: cover;
}
</style>