<template>
    <div class="px-40 pb-5 flex justify-center">
        <div class="w-100">
            <div class="two-card blog-detail">
                <div v-if="blogDetail" class="article">
                    <h1>{{ blogDetail.title }}</h1>
                    <div class="blog-meta">
                        <span class="blog-category">
                            {{ blogDetail.type }}
                        </span>

                        <span class="blog-date">
                            <i class="bi bi-calendar3"></i>
                            {{ formatDate(blogDetail.created_at) }}
                        </span>
                    </div>
                    <img
                        v-if="blogDetail.cover_image"
                        :src="`${SERVER_URL}${blogDetail.cover_image}`"
                        :alt="blogDetail.title"
                        class="cover-image w-100"
                    >
                    <!-- render markdown html -->
                    <div
                        class="article-content"
                        v-html="blogDetail.content_html"
                    ></div>
                </div>
            </div>
            <div class="two-card comment mt-3">
                <h3 class="comment-title">
                    <i class="bi bi-chat"></i>
                    Comments
                </h3>
                <div class="comment-list">
                    <div v-for="item in allComments" :key="item.id" class="comment-item">
                        <div class="comment-avatar">
                            {{ item.username[0] }}
                        </div>
                        <div class="comment-content">
                            <div class="comment-header flex justify-between items-center mb-8">
                                <span class="comment-name">
                                    {{ item.username }}
                                </span>

                                <span class="comment-date">
                                    {{ formatDate(item.created_at) }}
                                </span>
                            </div>

                            <p class="comment-text">
                                {{ item.content }}
                            </p>
                        </div>
                    </div>
                </div>
                <h3 class="pt-3"><i class="bi bi-brush"></i> Leave a comment</h3>
                <textarea
                    v-model="commentContent"
                    class="form-control"
                    aria-label="With textarea"
                    placeholder="Add comment..."
                ></textarea>
                <div class="flex justify-end">
                    <button class="btn btn-pink w-40 mt-2" @click="handleAddComment">Post Comment</button>
                </div>
            </div>
        </div>
        <div>
            <button class="btn btn-outline-pink back-btn" @click="handleBack">Back-></button>
            <button v-if="userStore.isLoggedIn" class="btn btn-outline-pink back-btn mt-2" @click="handleLogout">Logout</button>
            <button v-else="userStore.isLoggedIn" class="btn btn-outline-pink back-btn mt-2" @click="handleGoLogin">Login</button>
        </div>
    </div>
    <!-- go login confirm modal -->
    <div ref="loginModal"
         class="modal fade"
         id="myModal"
         tabindex="-1"
         aria-labelledby="exampleModalLabel"
         aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Need Login</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                You need to log in to post comments.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" @click="handleGoLogin">Go Login</button>
            </div>
            </div>
        </div>
    </div>
    <Toast ref="toastRef" />
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { getBlogDetail, addComment, getCommentsByBlogId } from "../api/blog";
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/user";
import { Modal } from "bootstrap";

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const blogId = route.params.id;
const blogDetail = ref(null);

const toastRef = ref(null);
const commentContent = ref("");
const allComments = ref([])
const loginModal = ref(null);
let loginModalInstance = null;

const getBlogDetailById = async () => {
    try {
        const result = await getBlogDetail(blogId);
        blogDetail.value = result.data;

    } catch (error) {
        console.error("Get blog detail error:", error);
    }
};

// add comment
const handleAddComment = async () => {
     if (!userStore.isLoggedIn) {
            loginModalInstance = Modal.getOrCreateInstance(
            loginModal.value
        );
        loginModalInstance.show();
        return;
    }

    // check comment
    if (!commentContent.value.trim()) {
        toastRef.value.open({
            type: "error",
            title: "Comment cannot be empty",
        });
        return;
    }

    try {
         await addComment(
            {
                blog_id: blogId,
                content: commentContent.value.trim()
            }
        );
        getComments();
        // clear textarea
        commentContent.value = "";
        toastRef.value.open({
            type: "success",
            title: "Added!",
            message: "Comment added successfully!"
        });

    } catch (error) {

        toastRef.value.open({
            type: "error",
            title: "Fail to add comment",
        });
    }

};

// handleGoLogin
const handleGoLogin = () => {
    if(loginModalInstance) {
        loginModalInstance.hide();
    }
    router.push("/login");
};

// get comments
const getComments = async () => {
    try {
        const result = await getCommentsByBlogId(blogId);
        allComments.value = result.data;

    } catch (error) {
        console.error("Get blog comment error:", error);
    }
};

// clisk btn: back
const handleBack = () => {
    router.push("/");
};

// logout
const handleLogout = () => {
    userStore.logout();

    toastRef.value.open({
        type: "success",
        title: "logout",
        message: "Logout successfully!"
    });
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
    getBlogDetailById();
    getComments();
});

</script>

<style scoped lang="scss">
textarea:focus {
  outline: none;
  box-shadow: none;
  border-color: #dee2e6;
}

.two-card {
    padding: 10px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(232, 160, 181, 0.12),
        0 10px 30px rgba(0, 0, 0, 0.06);
}

.blog-detail {
    h1 {
        margin: 0;
        font-family: "Dancing Script", cursive;
        font-size: 48px;
        color: #E8A0B5;
    }

    .blog-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        margin: 15px 0 25px;

        .blog-category {
            display: inline-flex;
            align-items: center;
            padding: 6px 14px;
            color: #d87f9d;
            background-color: rgba(232, 160, 181, 0.15);
            border: 1px solid rgba(232, 160, 181, 0.35);
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        .blog-date {
            position: relative;
            color: #8b8b8b;
            font-size: 14px;
            letter-spacing: 0.5px;
            padding-left: 14px;
            i {
                color: #E8A0B5;
            };
        }
    }

    .cover-image {
        max-height: 300px;
        object-fit: cover;
        border-radius: 16px;
        margin-bottom: 20px;
    }
    
}
.comment {
    font-family: "Cormorant Garamond", serif;
    color: #E8A0B5;
    .comment-title {
        // width: 100%;
        padding-bottom: 12px;
        margin-bottom: 25px;
        border-bottom: 2px solid #E8A0B5;
    }

    .comment-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .comment-item {
        display: flex;
        gap: 15px;
        padding: 18px;
        background-color: #fffafa;
        border-radius: 12px;
        border: 1px solid rgba(232, 160, 181, 0.18);
        transition: 0.25s ease;

        &:hover {
            transform: translateY(-2px);

            box-shadow:
                0 5px 18px rgba(232, 160, 181, 0.12);
        }
    }

    .comment-avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        width: 42px;
        height: 42px;
        color: white;
        background-color: #e8a0b5;
        border-radius: 50%;
        font-size: 16px;
        font-weight: 500;
    }

    .comment-content {
        flex: 1;
    }

    .comment-header {
        .comment-name {
            color: #29292f;
            font-size: 16px;
            font-weight: 600;
        }

        .comment-date {
            color: #aaa;
            font-size: 13px;
        }

        .comment-text {
            margin: 0;
            color: #555;
            line-height: 1.7;
            font-size: 15px;
        }
    }

    
}
.back-btn {
    height: 50px;
    width: 100px;
    margin-left: 10px;
}
</style>