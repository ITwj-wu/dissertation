import { createBrowserRouter } from "react-router-dom";

import HomePage from "../views/HomePage/HomePage";
import AboutView from "../views/AboutView/AboutView";
import AddNewBlog from "../views/AddNewBlog/AddNewBlog"
import BlogDetail from "../views/BlogDetail/BlogDetail"
import Login from "../views/Login/Login"

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    
    {
      path: '/about',
      element: <AboutView />
    },

    {
        path: "/addNewBlog",
        element: <AddNewBlog />
    },

    {
        path: "/addNewBlog/:id",
        element: <AddNewBlog />
    },

    {
        path: "/blogDetail/:id",
        element: <BlogDetail />
    },

    {
        path: "/login",
        element: <Login />
    }
]);

export default router;