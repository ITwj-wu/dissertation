import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext(null);


export const AuthProvider = ({children}) => {
    // save user from localStorage
    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    //get token from localstorage
     const [token, setToken] = useState(() => {

        return localStorage.getItem("token");
    });

    // login
     const login = (user, token) => {

        setUser(user);
        setToken(token);

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "token",
            token
        );
    };

    // logout
    const logout = () => {

        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };


    //user state
    const isLoggedIn = !!token;

    const isAdmin =
        user?.role === "admin";

    const isVisitor =
        user?.role === "visitor";

     return (
        <AuthContext.Provider
            value={{
                user,
                token,

                isLoggedIn,
                isAdmin,
                isVisitor,

                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    return useContext(AuthContext);

};