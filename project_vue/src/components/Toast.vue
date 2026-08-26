<template>
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-10 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-10 opacity-0"
    >
        <div
            v-if="show"
            class="fixed top-6 right-6 z-50 flex w-96 items-center gap-4 rounded-xl bg-white p-4 shadow-lg"
        >
            <!-- Icon -->
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                :class="iconBg"
            >
                <span
                    class="text-lg font-bold"
                    :class="iconColor"
                >
                    {{ icon }}
                </span>
            </div>

            <!-- Content -->
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">
                    {{ title }}
                </h4>

                <p class="mt-1 text-sm text-gray-500">
                    {{ message }}
                </p>
            </div>

            <!-- Close -->
            <button
                class="text-xl text-gray-400 transition hover:text-gray-700"
                @click="close"
            >
                ×
            </button>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";

const show = ref(false);

const title = ref("");
const message = ref("");
const type = ref("success");

let timer = null;


const icon = computed(() => {
    const icons = {
        success: "✓",
        error: "✕",
        warning: "!",
        info: "i"
    };

    return icons[type.value] || "i";
});


const iconBg = computed(() => {
    const styles = {
        success: "bg-green-100",
        error: "bg-red-100",
        warning: "bg-yellow-100",
        info: "bg-blue-100"
    };

    return styles[type.value];
});


const iconColor = computed(() => {
    const styles = {
        success: "text-green-600",
        error: "text-red-600",
        warning: "text-yellow-600",
        info: "text-blue-600"
    };

    return styles[type.value];
});


const open = (options = {}) => {

    title.value = options.title || "Notification";

    message.value = options.message || "";

    type.value = options.type || "success";

    const duration = options.duration || 3000;

    show.value = true;

    clearTimeout(timer);

    timer = setTimeout(() => {
        close();
    }, duration);
};


const close = () => {
    show.value = false;
};


onBeforeUnmount(() => {
    clearTimeout(timer);
});


defineExpose({
    open,
    close
});
</script>