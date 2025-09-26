<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import AuthenticationService from '@/service/AuthenticationService';
import { useRouter, useRoute } from 'vue-router';
import useToastWaitingForFetch from '@/composables/useToastWaitingForFetch';

const emit = defineEmits(); // Define emits
const username = ref('');
const password = ref('');
const router = useRouter();
const route = useRoute();

const authenticationService = new AuthenticationService();

const attemptLogin = async () => {
    const response = await authenticationService.login(username.value, password.value);
    if (response.status !== 200) {
        throw new Error('Incorrect Credentials');
    }
    return response;
};

const toastWaitingForFetch = useToastWaitingForFetch(
    {
        waitingSeverity: 'info',
        waitingSummary: 'Logging in...',
        waitingMessage: 'Please wait...'
    },
    {
        successSeverity: 'success',
        successSummary: 'Login successful',
        successMessage: 'Redirecting...'
    },
    { errorSeverity: 'error', errorSummary: 'Error', errorMessage: 'Login failed' },
    { asyncFunction: attemptLogin, asyncFunctionParams: [] }
);

let isLoggingIn = false;

async function login() {
    if (isLoggingIn) return;
    isLoggingIn = true;
    try {
        const response = await toastWaitingForFetch.fetchData();
        if (response.status == 200) {
            // const redirectPath = route.query.redirect || '/erstats';
            // router.push(redirectPath);
            emit('login-success');
        }
    } catch (error) {
        console.error('error logging In: ', error);
    } finally {
        isLoggingIn = false;
    }
}

const isCapslockOn = ref(false);

const checkCapsLock = (event) => {
    const capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    isCapslockOn.value = capsLockOn;
};

onMounted(async () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        const isValid = await authenticationService.validateToken(authToken);
        if (isValid) {
            router.push({ name: 'registry' });
        } else {
            localStorage.clear();
        }
    } else {
        localStorage.clear();
    }
});
</script>

<template>
    <div class="flex align-items-center justify-content-center overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-6 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="@/assets/images/BGHMC.png" alt="Image" height="120" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="username" class="block text-900 text-xl font-medium mb-2">User Name</label>
                        <InputText id="username" required type="text" placeholder="User Name" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />

                        <div class="flex justify-content-between">
                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <span v-if="isCapslockOn">
                                <small class="text-red-800 text-xs font-bold">Warning: Caps Lock is on</small>
                            </span>
                        </div>
                        <Password id="password1" :feedback="false" @keydown="checkCapsLock" @keyup="checkCapsLock" required v-model="password" placeholder="Password" class="w-full mb-3" inputClass="w-full" @keyup.enter="login()"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <label for="rememberme1"></label>
                            </div>
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="login()"></Button>
                    </div>
                </div>
            </div>
        </div>
        <Toast />
    </div>
</template>

<style scoped></style>
