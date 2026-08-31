import { useEffect, useState } from "react";

const Toast = ({
    type = "success",
    title = "Notification",
    message = "",
    duration = 3000,
    onClose
}) => {

    const [visible, setVisible] = useState(false);

    const styles = {
        success: {
            icon: "✓",
            bg: "bg-green-100",
            color: "text-green-600"
        },
        error: {
            icon: "✕",
            bg: "bg-red-100",
            color: "text-red-600"
        },
        warning: {
            icon: "!",
            bg: "bg-yellow-100",
            color: "text-yellow-600"
        },
        info: {
            icon: "i",
            bg: "bg-blue-100",
            color: "text-blue-600"
        }
    };

    const current = styles[type] || styles.info;


    // Show animation

    useEffect(() => {

        requestAnimationFrame(() => {
            setVisible(true);
        });

    }, []);


    // Auto close

    useEffect(() => {

        const timer = setTimeout(() => {

            handleClose();

        }, duration);


        return () => {
            clearTimeout(timer);
        };

    }, [duration]);


    // Close animation

    const handleClose = () => {

        setVisible(false);

        setTimeout(() => {

            onClose();

        }, 200);
    };


    return (
        <div
            className={`
                fixed
                top-6
                right-6
                z-[99999]
                w-96

                flex
                items-center
                gap-4

                rounded-xl
                bg-white
                p-4
                shadow-lg

                transition-all
                duration-300
                ease-out

                ${
                    visible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-10 opacity-0"
                }
            `}
        >

            {/* Icon */}

            <div
                className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${current.bg}
                `}
            >

                <span
                    className={`
                        text-lg
                        font-bold
                        ${current.color}
                    `}
                >
                    {current.icon}
                </span>

            </div>


            {/* Content */}

            <div className="flex-1">

                <h4 className="font-semibold text-gray-800">
                    {title}
                </h4>

                {message && (
                    <p className="mt-1 text-sm text-gray-500">
                        {message}
                    </p>
                )}

            </div>


            {/* Close */}

            <button
                type="button"
                className="
                    text-xl
                    text-gray-400
                    transition
                    hover:text-gray-700
                "
                onClick={handleClose}
            >
                ×
            </button>

        </div>
    );
};

export default Toast;