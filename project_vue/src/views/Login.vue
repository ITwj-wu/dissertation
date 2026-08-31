<template>
    <div class="auth-page">
        <div class="auth-card">
            <h1 class="auth-title">
                Iris Notes
            </h1>
            <!-- subtitle -->
            <p class="auth-subtitle">
                {{ isLogin ? "Welcome back 💗" : "Create your account 🌷" }}
            </p>
            <form @submit.prevent="handleSubmit">
                <!-- username -->
                <div
                    v-if="!isLogin"
                    class="mb-3"
                >
                    <label class="form-label">
                        Username
                    </label>
                    <input
                        v-model="username"
                        type="text"
                        class="form-control"
                        placeholder="Enter your username"
                    >
                </div>
                <!-- email -->
                <div class="mb-3">
                    <label class="form-label">
                        Email
                    </label>

                    <input
                        v-model="email"
                        type="email"
                        class="form-control"
                        placeholder="Enter your email"
                    >
                </div>
                <!-- password -->
                <div class="mb-4">

                    <label class="form-label">
                        Password
                    </label>

                    <input
                        v-model="password"
                        type="password"
                        class="form-control"
                        placeholder="Enter your password"
                    >
                </div>
                <!-- button -->
                <button
                    type="submit"
                    class="btn btn-pink w-100"
                >
                    {{ isLogin ? "Login" : "Register" }}
                </button>
            </form>
            <!-- switch -->
            <div class="auth-switch">
                <template v-if="isLogin">
                    Don't have an account?
                    <span @click="toggleAuth">
                        Register
                    </span>
                </template>
                <template v-else>
                    Already have an account?
                    <span @click="toggleAuth">
                        Login
                    </span>
                </template>
            </div>
        </div>
    </div>
    <Toast ref="toastRef" />
</template>

<script setup>
import { ref } from "vue";
import { login, register } from "@/api/auth";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

const router = useRouter();

const toastRef = ref(null);
const isLogin = ref(true);
const username = ref("");
const email = ref("");
const password = ref("");

const toggleAuth = () => {
    isLogin.value = !isLogin.value;
    // clear input
    username.value = "";
    email.value = "";
    password.value = "";

};


const handleSubmit = () => {

    if (isLogin.value) {
        handleLogin();
    } else {
        handleRegister();
    }

};

// login
const handleLogin = async () => {
    try {

        // valid
        if (!email.value || !password.value) {

            toastRef.value.open({
                type: "error",
                title: "Login failed",
                message: "Email and password are required"
            });
            return;
        }

        const result = await login({
            email: email.value,
            password: password.value
        });
        
        userStore.setUser(
            result.user,
            result.token
        );

        // save token
        localStorage.setItem(
            "token",
            result.token
        );

        // save user
        localStorage.setItem(
            "user",
            JSON.stringify(result.user)
        );

        // go home page
        router.push("/");

    } catch (error) {

        toastRef.value.open({
            type: "error",
            title: "Login failed",
            message: error.message
        });
    }
};

// register
const handleRegister = async () => {

    try {

        // vali
        if (!username.value.trim() || !email.value.trim() || !password.value.trim()) {
            toastRef.value.open({
                type: "error",
                title: "full input",
                message: error.message
            });
            return;
        }

        // request register API
        await register({
            username: username.value.trim(),
            email: email.value.trim(),
            password: password.value
        });

        toastRef.value.open({
            type: "success",
            title: "Published!",
            message: "Register successfully!"
        });

        // clear input
        username.value = "";
        email.value = "";
        password.value = "";

        // switch to login
        isLogin.value = true;

    } catch (error) {
        toastRef.value.open({
            type: "error",
            title: "Register failed",
            message: error.message
        });

    }

};
</script>

<style scoped lang="scss">

.auth-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.auth-card {
    width: 100%;
    max-width: 420px;
    padding: 40px;
    background: white;
    border-radius: 20px;
    box-shadow:
        0 8px 25px rgba(232, 160, 181, 0.15),
        0 15px 40px rgba(0, 0, 0, 0.06);
}

.auth-title {
    margin-bottom: 5px;
    text-align: center;
    font-family: "Dancing Script", cursive;
    font-size: 48px;
    color: #E8A0B5;
}

.auth-subtitle {
    margin-bottom: 30px;
    text-align: center;
    color: #8b8b8b;
}

.form-label {
    color: #555;
}

.form-control {
    padding: 10px 14px;
    border: 1px solid rgba(232, 160, 181, 0.5);
    &:focus {
        border-color: #E8A0B5;
        box-shadow:
            0 0 0 0.2rem rgba(232, 160, 181, 0.15);
    }
}

.auth-switch {
    margin-top: 25px;

    text-align: center;

    color: #888;

    span {
        margin-left: 5px;

        color: #E8A0B5;
        font-weight: 500;

        cursor: pointer;

        &:hover {
            color: #d87f9d;
            text-decoration: underline;
        }
    }
}

</style>