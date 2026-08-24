<template>
  <div class="homepage">
    <div class="header flex items-center justify-between">
        <h3 class="title">Iris Notes</h3>
        <div class="flex items-center">
            <RouterLink class="about-link" to="/about">About me</RouterLink>
            <button type="button" class="btn btn-outline-info" @click="handleClickPost">+ Post</button>
            <div>
                <input v-model="searchText"  class="search" type="text">
                <i class="bi bi-search search-icon"></i>
            </div>
        </div>
    </div>
    <div class="carousel-content">
        <div id="carouselExampleCaptions" class="carousel slide">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active">
                <img src="..." class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                    <h5>First slide label</h5>
                    <p>Some representative placeholder content for the first slide.</p>
                </div>
                </div>
                <div class="carousel-item">
                <img src="..." class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                    <h5>Second slide label</h5>
                    <p>Some representative placeholder content for the second slide.</p>
                </div>
                </div>
                <div class="carousel-item">
                <img src="..." class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                    <h5>Third slide label</h5>
                    <p>Some representative placeholder content for the third slide.</p>
                </div>
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
    <nav class="category">
        <button
            v-for="item in categories"
            :key="item"
            class="category-item"
            :class="{ active: activeCategory === item }"
            @click="activeCategory = item"
        >
        {{ item }}
        </button>
    </nav>
    <div class="blog-list">
        <div v-for="blog in allBlogs" :key="blog.id" class="blog-card">
             <h2>{{ blog.title }}</h2>

          <p class="date">
            {{ blog.date }}
          </p>

          <div class="card-actions">
            <button class="detail-btn">
              view details
            </button>

            <button
              v-if="blog.editable"
              class="edit-btn"
            >
              Edit
            </button>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchText = ref("");

const activeCategory = ref("Handcraft");

const categories = [
  "Handcraft",
  "Nail Art",
  "Tea Ceremony",
  "Guzheng",
];

const allBlogs = ref([
  {
    id: 1,
    title: "Ceramic flowers",
    date: "19th August 2026",
    category: "Handcraft",
    editable: false,
  },
  {
    id: 2,
    title: "Ceramic flowers",
    date: "19th August 2026",
    category: "Handcraft",
    editable: true,
  },
  {
    id: 3,
    title: "",
    date: "",
    category: "Handcraft",
    editable: false,
  },
  {
    id: 4,
    title: "",
    date: "",
    category: "Handcraft",
    editable: false,
  },
  {
    id: 5,
    title: "",
    date: "",
    category: "Handcraft",
    editable: false,
  },
  {
    id: 6,
    title: "",
    date: "",
    category: "Handcraft",
    editable: false,
  },
]);



const handleClickPost = () => {
  router.push("/addNewBlog");
};
</script>

<style scoped>
.homepage {
    min-height: 100vh;
    padding: 25px 40px;
    background: #fad7d7a8;
}
.header {
    /* min-height: 70px; */
    margin-bottom: 30px;
}

.title{
    margin: 0;
    font-size: 26px;
    font-weight: 400;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    letter-spacing: 1px;
    color: #29292f;
/* 
    text-decoration: underline;
    text-decoration-color: #e082b9;
    text-decoration-thickness: 4px;
    text-underline-offset: 2px; */
}

.about-link {
  margin-right: 35px;
  font-size: 22px;
  color: #29292f;
  text-decoration: none;
}

.about-link:hover {
  color: #8b6ca9;
}

/**carousel */
.carousel-content {
  margin-bottom: 70px;
}

.carousel {
  overflow: hidden;
  height: 260px;

  background: #e4d9e8;
}

.carousel-item,
.carousel-item img {
  height: 260px;
}

.carousel-item {
  background: #e4d9e8;
}

.carousel-item img {
  object-fit: cover;
}

.carousel-caption {
  right: auto;
  bottom: auto;
  left: 13%;

  top: 50%;

  width: auto;

  text-align: left;

  transform: translateY(-50%);
}

.carousel-caption h5 {
  margin-bottom: 5px;

  color: #28282e;

  font-size: 30px;
  font-weight: 400;
}

.carousel-caption p {
  margin: 0;

  color: #28282e;

  font-size: 28px;
  font-weight: 400;
}

/**category */
.category {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 65px;
  margin-bottom: 28px;
}

.category-item {
  padding: 5px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #29292f;
  cursor: pointer;
  transition: 0.2s;
}

.category-item:hover {
  color: #d184e2;
}

.category-item.active {
  color: #d184e2;
}

/** blog cards */
.blog-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px 38px;
}

.blog-card {
  display: flex;
  flex-direction: column;
  min-height: 235px;
  padding: 20px;
  background: #e6dce9;
}
</style>