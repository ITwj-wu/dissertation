<template>
 <div class="homepage">
    <div class="header flex items-center justify-between mb-3">
        <h3 class="title">Iris Notes</h3>
        <div class="flex items-end">
            <RouterLink class="about-link" to="/about">About me</RouterLink>
            <button type="button" class="btn-post btn btn-pink" @click="handleClickPost">+ Post</button>
        </div>
    </div>
    <div class="carousel-content">
        <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel" >
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                 <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="../assets/imgs/ceramic.png" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="../assets/imgs/nail.png" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="../assets/imgs/tea.png" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="../assets/imgs/guzheng.png" class="d-block w-100" alt="...">
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
        <!-- loading -->
        <Transition name="fade">
            <div
                v-if="loading"
                class="blog-loading"
            >
                <div
                    class="spinner-border"
                    role="status"
                >
                    <span class="visually-hidden">
                        Loading...
                    </span>
                </div>
            </div>
        </Transition>
        <div v-for="blog in allBlogs" :key="blog.id" class="blog-card" :style="{
            backgroundImage: `url(${SERVER_URL}${blog.cover_image})`
        }">
             <div class="blog-overlay">
                <h2>{{ blog.title }}</h2>

                <p class="date">
                    {{ formatDate(blog.created_at) }}
                </p>

                <div class="card-actions">
                    <button
                        class="btn btn-pink"
                        @click="handleClickViewPost(blog.id)"
                    >
                        view post
                    </button>

                    <button
                        v-if="blog.id"
                        class="btn btn-outline-pink"
                    >
                        Edit
                    </button>
                    <button
                        v-if="blog.id"
                        class="btn btn-outline-pink"
                        @click="handleDeleteBtn(blog)"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="allBlogs && allBlogs.length == 0 && !loading" class="flex justify-center">
        <img src="../assets/imgs/no-data.png" width="200px" alt="">
    </div>
  </div>
  <!-- delete confirm modal -->
    <!-- Modal -->
    <div ref="deleteModal"
         class="modal fade"
         id="myModal"
         tabindex="-1"
         aria-labelledby="exampleModalLabel"
         aria-hidden="true"
    >
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">{{ selectedBlog? selectedBlog.title : '' }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            Are you sure you want to delete this item?
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" @click="handleDelete">Sure</button>
        </div>
        </div>
    </div>
    </div>
    <Toast ref="toastRef" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getBlogsList, getCategories, searchBlogs, deleteBlog } from "../api/blog";
import { Modal } from "bootstrap";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const router = useRouter();
const searchText = ref("");
const activeCategory = ref("")
const allBlogs = ref([])
const allCategories = ref(null)
const loading = ref(false);
const toastRef = ref(null);

const selectedBlog = ref(null);
const deleting = ref(false);


const deleteModal = ref(null);

// get blogs list
const getBlogs = async () => {
    try {
        loading.value = true;
        const result = await getBlogsList(activeCategory.value);

        allBlogs.value = result.data;

    } catch (error) {
        console.error("Get blogs error:", error);
    } finally {
         loading.value = false;
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

let deleteModalInstance = null;
// click delete btn -> show confirm model
const handleDeleteBtn = (blog) => {
    selectedBlog.value = blog;
    deleteModalInstance = Modal.getOrCreateInstance(
        deleteModal.value
    );

    deleteModalInstance.show();
};

// confirm delete
const handleDelete = async () => {
    try {
        deleting.value = true;

        await deleteBlog(selectedBlog.value.id);

        // get list again
        await getBlogs();

        // close modal
        deleteModalInstance.hide();

        toastRef.value.open({
            type: "success",
            title: "Deleted!",
            message: "The blog has been deleted successfully."
        });

    } catch (error) {

        toastRef.value.open({
            type: "error",
            title: "Delete failed",
            message: error.message
        });

    } finally {
        deleting.value = false;
    }
};

// format date
const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
};

onMounted(() => {
    initPage();
});

const handleClickPost = () => {
    router.push("/addNewBlog");
};

const handleClickViewPost = (id) => {
    router.push(`/blogDetail/${id}`)
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');

input:focus {
  outline: none;
  box-shadow: none;
  border-color: #dee2e6;
}

.homepage {
    min-height: 100vh;
    padding: 0 0 20px 0;

    .header {

        .title{
            margin: 0;
            font-family: "Dancing Script", cursive;
            font-size: 48px;
            color: #E8A0B5;
        }
        .btn-post {
            width: 100px;
        }

        .about-link {
            margin-right: 35px;
            font-family: "Dancing Script", cursive;
            font-size: 30px;
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
    // height: 300px;
    background: #e4d9e8;

    .carousel-item {
        // height: 300px;
        background: #e4d9e8;
        img {
            height: 206px;
            object-fit: cover;
        }
    }
}



/**category */

.category-item {
    position: relative;
    font-family: "Cormorant Garamond", serif;
    margin-right: 30px;
    border: none;
    background: transparent;
    font-size: 22px;
    font-weight: 500;
    color: #302629;
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
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px 38px;

    .blog-loading {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        background-color: rgba(255, 255, 255, 0.65);
        z-index: 10;
        .spinner-border {
            width: 3rem;
            height: 3rem;
            color: #E8A0B5;
        }
    }

    .blog-card {
        position: relative;
        min-height: 235px;
        overflow: hidden;
        border-radius: 5px;
        background-color: #ebbdca86;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        box-shadow: 0 4px 15px rgba(232, 160, 181, 0.25);

        .blog-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 25px;
            background-color: rgba(40, 40, 46, 0.65);
            opacity: 0;
            transition: opacity 0.3s ease;

            h2,
            .date,
            .card-actions {
                color: white;
                opacity: 0;
                transform: translateY(15px);
                transition: all 0.35s ease;
            }

            h2 {
                margin-bottom: 10px;
                font-family: "Cormorant Garamond", serif;
                font-size: 30px;
                font-weight: 600;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .date {
                margin-bottom: 25px;
                font-size: 20px;
                font-family: "Cormorant Garamond", serif;
            }

            .card-actions {
                display: flex;
                gap: 12px;
            }
        }

        &:hover {
            .blog-overlay {
                opacity: 1;

                h2,
                .date,
                .card-actions {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        }
    }
}

</style>