import {
    createContext,
    useContext,
    useState
} from "react";

import Toast from "./Toast";


const ToastContext = createContext();


export const ToastProvider = ({ children }) => {

    const [toast, setToast] = useState(null);


    const open = (options) => {

        console.log("TOAST OPEN:", options);

        setToast({
            type: options?.type || "success",
            title: options?.title || "Notification",
            message: options?.message || ""
        });
    };


    const close = () => {
        setToast(null);
    };


    return (
        <ToastContext.Provider
            value={{
                open,
                close
            }}
        >

            {children}

            {toast && (
                <Toast
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onClose={close}
                />
            )}

        </ToastContext.Provider>
    );
};


export const useToast = () => {

    const context = useContext(
        ToastContext
    );

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
};