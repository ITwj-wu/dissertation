import { createBrowserRouter } from "react-router-dom";

import HomePage from "../views/HomePage/HomePage";
import AboutView from "../views/AboutView/AboutView";
import AddNewBlog from "../views/AddNewBlog/AddNewBlog"
import BlogDetail from "../views/BlogDetail/BlogDetail"
import Login from "../views/Login/Login"

import AdminRoute from "./adminRoute";

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
        path: "/blogDetail/:id",
        element: <BlogDetail />
    },

    {
        path: "/login",
        element: <Login />
    },

    // Admin routes
    {
        element: <AdminRoute />,
        children: [
            {
                path: "/addNewBlog",
                element: <AddNewBlog />
            },
            {
                path: "/editBlog/:id",
                element: <AddNewBlog />
            }

        ]
    }
]);

export default router;