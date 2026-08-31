import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import { useUserStore } from "../stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/addNewBlog',
      name: 'addNewBlog',
      meta: {
        requiresAdmin: true
      },
      component: () => import('../views/AddNewBlog.vue'),
    },
    {
      path: "/editBlog/:id?",
      meta: {
          requiresAdmin: true
      },
      component: () => import('../views/AddNewBlog.vue'),
    },
    {
      path: '/blogDetail/:id',
      name: 'blogDetail',
      component: () => import('../views/BlogDetail.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
  ],
})

router.beforeEach((to) => {
    const userStore = useUserStore();

    // need admin premission
    if (to.meta.requiresAdmin) {

        // no login, not admin
        if (!userStore.isLoggedIn || !userStore.isAdmin) {
            return "/";
        }
    }

});

export default router
