import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login, register } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast/ToastContext";

import "./Login.scss";

const Login = () => {

    const navigate = useNavigate();
    const toast = useToast();

    const { login: saveUser } = useAuth(); // login rename saveUser

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // switch login & register
     const toggleAuth = () => {

        setIsLogin((prev) => !prev);

        // clear input
        setUsername("");
        setEmail("");
        setPassword("");
    };

    // submit
    const handleSubmit = (event) => {
        event.preventDefault();

        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    // login
    const handleLogin = async() => {
        try {

            // validation
            if (!email.trim() || !password.trim()) {

                toast.open({
                    type: "error",
                    title: "Login failed",
                    message: "Email and password are required"
                });

                return;
            }

            // API
            const result = await login({
                email: email.trim(),
                password
            });

            // save user + token
            saveUser(
                result.user,
                result.token
            );

            // success
            toast.open({
                type: "success",
                title: "Welcome!",
                message: "Login successfully!"
            });

            // go home
            navigate("/");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            toast.open({
                type: "error",
                title: "Login failed",
                message: error.message
            });
        }
    };


    //Register
    const handleRegister = async() => {
        try {

            // validation
            if (
                !username.trim() ||
                !email.trim() ||
                !password.trim()
            ) {
                toast.open({
                    type: "error",
                    title: "Invalid input",
                    message: "Username, email and password are required"
                });

                return;
            }

            // API
            await register({
                username: username.trim(),
                email: email.trim(),
                password
            });

            // success
            toast.open({
                type: "success",
                title: "Registered!",
                message: "Register successfully!"
            });

            // clear input
            setUsername("");
            setEmail("");
            setPassword("");

            // switch to login
            setIsLogin(true);

        } catch (error) {

            console.error(
                "Register error:",
                error
            );

            toast.open({
                type: "error",
                title: "Register failed",
                message: error.message
            });
        }
    };


    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* title */}
                <h1 className="auth-title">Iris Notes</h1>

                {/* subtitle */}
                <p className="auth-subtitle">
                    {isLogin
                        ? "Welcome back 💗"
                        : "Create your account 🌷"
                    }
                </p>

                {/* form */}
                <form onSubmit={handleSubmit}>

                    {/* username */}
                    {!isLogin && (
                        <div className="mb-3">
                            <label className="form-label">
                                Username
                            </label>

                            <input
                                value={username}
                                onChange={(event) =>
                                    setUsername(
                                        event.target.value
                                    )
                                }
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                            />
                        </div>
                    )}

                    {/* email */}
                    <div className="mb-3">
                        <label className="form-label">
                            Email
                        </label>

                        <input
                            value={email} 
                            onChange={(event) => setEmail(
                                event.target.value
                            )}
                            type="email"
                            className="form-control email"
                            placeholder="Enter your email"
                         />
                    </div>

                    {/* password */}
                    <div className="mb-3">
                        <label className="form-label">
                            password
                        </label>

                        <input
                            value={password} 
                            onChange={(event) => setPassword(
                                event.target.value
                            )}
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                         />
                    </div>

                    {/* submit */}
                    <button
                        type="submit"
                        className="btn btn-pink w-100"
                    >
                        {isLogin
                            ? "Login"
                            : "Register"
                        }
                    </button>
                </form>
                
                {/* switch */}
                <div className="auth-switch">

                    {isLogin ? (
                        <>
                            Don't have an account?
                            <span
                                onClick={toggleAuth}
                            >
                                Register
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?

                            <span
                                onClick={toggleAuth}
                            >
                                Login
                            </span>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Login;