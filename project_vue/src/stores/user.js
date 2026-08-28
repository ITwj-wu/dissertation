import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {

    state: () => ({
        user: null,
        token: null
    }),

    getters: {

        isLoggedIn: (state) => {
            return !!state.token;
        },

        isAdmin: (state) => {
            return state.user?.role === "admin";
        },

        isVisitor: (state) => {
            return state.user?.role === "visitor";
        }

    },

    actions: {

        // login
        setUser(user, token) {

            this.user = user;
            this.token = token;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "token",
                token
            );
        },


        // get user from localStorage
        loadUser() {

            const user =
                localStorage.getItem("user");

            const token =
                localStorage.getItem("token");

            if (user && token) {

                this.user =
                    JSON.parse(user);

                this.token = token;
            }

        },


        // logout
        logout() {

            this.user = null;
            this.token = null;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }

    }

});