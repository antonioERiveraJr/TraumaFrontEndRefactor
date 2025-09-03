<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/general/userStore';
import AuthenticationService from '@/service/AuthenticationService';
import { useToast } from 'primevue/usetoast';

// const { layoutConfig, onMenuToggle, contextPath } = useLayout();
const { onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

const userStore = useUserStore();
const toast = useToast();

onMounted(async () => {
    bindOutsideClickListener();

    const user = await userStore.getUserInfo();
    if (!user) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please login again',
            life: 3000
        });
        new Promise((resolve) => setTimeout(resolve, 300)).then(() => {
            router.push('/auth/login');
        });
    }
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};


let isLoggingOut = false;
async function logout() {
    // console.log('logout');
    // return;
    if (isLoggingOut) return;
    isLoggingOut = true;
    const authenticationService = new AuthenticationService();
    toast.add({
        severity: 'info',
        summary: 'Log out',
        detail: 'Logging out...',
        life: 1500
    });

    await authenticationService.logout();
    router.push('/auth/login');

    // router.push('/auth/login');
}
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/home" class="layout-topbar-logo">
            <!-- <img :src="logoUrl" alt="logo" /> -->
            <img src="@/assets/images/BGHMC.png" alt="logo" />
            <b>BGHMC Trauma Surveillance System</b>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <!-- <div class="my-auto ml-5">
            <span class="p-buttonset">
                <Button label="Save" icon="pi pi-save" size="small" class="w-auto" v-tooltip.top="'Save'" @click="submitForm" />
                <Button label="Back to List" icon="pi pi-backward" size="small" class="w-auto" v-tooltip.top="'Back to list'" @click="backToList" />
            </span>
        </div> -->
        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <div class="flex align-items-center" v-if="userStore.userInfo.user_name">
                <div class="mt-3">
                    <b>Logged in as {{ userStore.userInfo.user_name }}</b>
                </div>
                <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                    <i class="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <button @click="logout" class="p-link layout-topbar-button" v-tooltip.left="'Log out?'" type="text" placeholder="Left">
                    <i class="pi pi-sign-out" style="color: red"></i>
                    <span>Profile</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
