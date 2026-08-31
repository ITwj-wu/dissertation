import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "./router";

import { AuthProvider } from "./context/AuthContext";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { ToastProvider } from "./components/Toast/ToastContext";

import "./index.scss";
import "./index.css"

ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <AuthProvider>

            <ToastProvider>

                <RouterProvider
                    router={router}
                />

            </ToastProvider>

        </AuthProvider>

    </React.StrictMode>
);