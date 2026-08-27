<template>
  <div class="homepage">
    <div class="header flex items-center justify-between">
        <h3 class="title">Iris Notes</h3>
        <div class="flex items-center">
            <RouterLink class="about-link" to="/about">About me</RouterLink>
            <button type="button" class="btn btn-outline-pink" @click="handleClickPost">+ Post</button>
        </div>
    </div>
    <div class="carousel-content">
        <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel" >
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="../assets/imgs/ceramic.png" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first slide.</p>
                    </div>
                </div>
                <div class="carousel-item">
                    <img src="../assets/imgs/tea.png" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>Second slide label</h5>
                        <p>Some representative placeholder content for the second slide.</p>
                    </div>
                </div>
                <div class="carousel-item">
                    <img src="../assets/imgs/guzheng.png" class="d-block w-100" alt="...">
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
    <div class="flex justify-between mb-4">
        <nav class="flex items-end ">
            <button
                v-for="item in allCategories"
                :key="item.id"
                class="category-item"
                :class="{ active: activeCategory === item.name }"
                @click="handleClickCategory(item.name)"
            >
            {{ item.name }}
            </button>
        </nav>
        <div class="search input-group">
            <input 
                v-model="searchText"
                type="text"
                class="form-control"
                placeholder="search..."
                aria-label="search" 
                aria-describedby="basic-addon2"
            >
            <i 
                class="bi bi-search search-icon input-group-text search-icon"
                id="basic-addon2"
                @click="handleSearch"
            ></i>
        </div>
    </div>
    <div class="blog-list">
        <div v-for="blog in allBlogs" :key="blog.id" class="blog-card" :style="{
            backgroundImage: `url(${SERVER_URL}${blog.cover_image})`
        }">
             <h2>{{ blog.title }}</h2>

          <p class="date">
            {{ blog.date }}
          </p>

          <div class="card-actions">
            <button class="detail-btn" @click="handleClickViewPost(blog.id)">
              view post
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
    <div v-if="allBlogs && allBlogs.length == 0" class="flex justify-center">
        <img src="../assets/imgs/no-data.png" width="200px" alt="">
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getBlogsList, getCategories, searchBlogs } from "../api/blog";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const router = useRouter();
const searchText = ref("");

const activeCategory = ref("");


const allBlogs = ref([])
const allCategories = ref(null)

// get blogs list
const getBlogs = async () => {
    try {
        const result = await getBlogsList(activeCategory.value);

        allBlogs.value = result.data;

    } catch (error) {
        console.error("Get blogs error:", error);
    }
};

// get Categories
const requestCategories = async () => {
    try {
        const result = await getCategories();
        allCategories.value = result.data;
        activeCategory.value = allCategories.value[0].name;

    } catch (error) {
        console.error("Get Categories error:", error);
    }
};

// click search button
const handleSearch = async () => {

    try {
        // if search text is empty, get current category blogs
        if (!searchText.value.trim()) {
            getBlogs();
            return;
        }
        const result = await searchBlogs(searchText.value);
        allBlogs.value = result.data;

    } catch (error) {

        console.error(
            "Search blogs error:",
            error
        );
    }
};
const handleClickCategory = (name) => {
    activeCategory.value = name
    getBlogs();
};

// init page
const initPage = async () => {
    try {
        const result = await getCategories();

        allCategories.value = result.data;

        if (allCategories.value.length > 0) {
            activeCategory.value =
                allCategories.value[0].name;

            await getBlogs();
        }

    } catch (error) {
        console.error("Init page error:", error);
    }
};

onMounted(() => {
    initPage();
});


const handleClickViewPost = (id) => {
    router.push(`/blogDetail/${id}`)
}
</script>

<style scoped lang="scss">

input:focus {
  outline: none;
  box-shadow: none;
  border-color: #dee2e6;
}

.homepage {
    min-height: 100vh;
    // padding: 25px 40px;

    .header {
        /* min-height: 70px; */
        margin-bottom: 30px;

        .title{
            margin: 0;
            font-family: "Dancing Script", cursive;
            font-size: 42px;
            color: #E8A0B5;
        }

        .about-link {
            margin-right: 35px;
            font-family: "Dancing Script", cursive;
            font-size: 22px;
            color: #E8A0B5;
            
            &:hover {
                color: #e8a0b4da;
            }
        }
    }

}

.search {
    width: 30%;
    input {
        border: 1px #E8A0B5 solid;
        color: #E8A0B5;
    }

    .search-icon {
        color: white;
        background-color: #E8A0B5 ;
        border: 1px #E8A0B5 solid;

        &:hover {
            cursor: pointer;
            color: white;
            background-color: #e8a0b4da;
        }
    }
}


/**carousel */
.carousel-content {
    margin-bottom: 30px;
}

.carousel {
    overflow: hidden;
    height: 300px;
    background: #e4d9e8;

    .carousel-item {
        height: 300px;
        background: #e4d9e8;
        img {
            height: 300px;
            object-fit: cover;
        }
    }

    .carousel-caption {
        right: auto;
        bottom: auto;
        left: 13%;
        top: 50%;
        width: auto;
        text-align: left;
        transform: translateY(-50%);
        background-color: #e8a0b467;
        
        h5 {
            margin-bottom: 5px;
            color: #28282e;
            font-size: 30px;
            font-weight: 400;
        }

        p {
            margin: 0;
            color: #28282e;
            font-size: 28px;
            font-weight: 400;
        }
    }
}



/**category */

.category-item {
    position: relative;
    font-family: "Dancing Script", cursive;
    margin-right: 30px;
    border: none;
    background: transparent;
    font-size: 20px;
    color: #E8A0B5;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        color: #e8a0b4da;
    }

    &.active {
        color: #E8A0B5;
        &::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 4px;
            border-radius: 4px;
            background-color: #E8A0B5;
        }
    }
}

/** blog cards */
.blog-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px 38px;

    .blog-card {
        display: flex;
        flex-direction: column;
        min-height: 235px;
        padding: 20px;
        border: 5px #E8A0B5 solid;
        border-radius: 5px;
        background-color: #ebbdca86 ;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
}


</style>