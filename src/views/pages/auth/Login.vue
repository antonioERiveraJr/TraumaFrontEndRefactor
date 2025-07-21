<!-- <script setup>
// import { useLayout } from '@/layout/composables/layout';
import { ref, computed, onMounted } from 'vue';
// import AppConfig from '@/layout/AppConfig.vue';
import AuthenticationService from '@/service/AuthenticationService';
// import InputTextCheckBox from '../../../components/custom/InputTextCheckBox.vue';
// import InputTextCheckBox from '../../../components/custom/InputTextCheckBox.vue';
// import router from '@/router';
import { useRouter, useRoute } from 'vue-router';
import logo from '@/assets/images/BGHMC.png';
import { useToast } from 'primevue/usetoast';
import useToastWaitingForFetch from '@/composables/useToastWaitingForFetch';

// const { layoutConfig, contextPath } = useLayout();
// const email = ref('');
// const username = ref('registry');
// const password = ref('a123456');
const username = ref('');
const password = ref('');
// const checked = ref(false);
const router = useRouter();
const route = useRoute();

// const loginFailed = ref(true);
const toast = useToast();

const authenticationService = new AuthenticationService();

const logoUrl = computed(() => {
    // return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    // return '@/assets/images/BGHMC.png';
    return logo;
});

const attemptLogin = async () => {
    const response = await authenticationService.login(username.value, password.value);
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
    { severity: 'error', summary: 'Error', detail: 'Login failed' },
    { asyncFunction: attemptLogin, asyncFunctionParams: [] }
);

// async function login(username, password) {
async function login() {
    // console.log('login');
    // await authenticationService.getCSRFToken();
    // return;

    const response = await toastWaitingForFetch.fetchData();
    // console.log('toastWaitingForFetch.fetchData()', response);
    // if (response.status == 200) {
    //     // router.push({ name: 'injurylist' });
    //     router.push({ name: 'injurylist' });
    // }

    if (response.status == 200) {
        // Retrieve the redirect URL from the query parameter, or fallback to a default route

        const redirectPath = route.query.redirect || '/home'; // Adjust the default route as needed
        // console.log('redirectPath', redirectPath);
        // Redirect to the retrieved path
        router.push(redirectPath);
    }

    // toast.add({
    //     severity: 'info',
    //     summary: 'Logging in...',
    //     detail: '',
    //     life: 1500,
    //     closable: false
    // });
    // const response = await authenticationService.login(username, password);
    // // console.log(localStorage.getItem('authToken'));
    // console.log('response', response);

    // if (localStorage.getItem('authToken')) {
    //     // console.log('login success');
    //     //show toast on successful login

    //     toast.add({
    //         severity: 'success',
    //         summary: 'Login Successful',
    //         detail: '',
    //         life: 1300
    //     });
    //     new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
    //         router.push({ name: 'injurylist' });
    //     });
    //     // router.push({ name: 'injurylist' });
    // } else {
    //     toast.add({ severity: 'error', summary: 'Login Failed', detail: '', life: 1500 });
    // }
}

const isCapslockOn = ref(false);

const checkCapsLock = (event) => {
    const capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    isCapslockOn.value = capsLockOn;
};

// onMounted(() => {
//     // console.log('mounted');
//     if (localStorage.getItem('authToken')) {
//         // console.log(localStorage.getItem('authToken'));
//         router.push({ name: 'home' });
//     }
//     //delete all localstorage
//     localStorage.clear();
// });
onMounted(async () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        const isValid = await authenticationService.validateToken(authToken);
        if (isValid) {
            router.push({ name: 'home' });
        } else {
            localStorage.clear(); // Clear invalid token
        }
    } else {
        localStorage.clear(); // Ensure localStorage is clean
    }
});
const testroute = () => {
    window.location.href = 'https://192.168.7.66:9050/api/fromEMR?empID=000001&enccode=ER100507Nov262024065658';
};
</script> -->

<script setup>
// import { useLayout } from '@/layout/composables/layout';
import { ref, onMounted } from 'vue';
// import AppConfig from '@/layout/AppConfig.vue';
import AuthenticationService from '@/service/AuthenticationService';
// import InputTextCheckBox from '../../../components/custom/InputTextCheckBox.vue';
// import InputTextCheckBox from '../../../components/custom/InputTextCheckBox.vue';
// import router from '@/router';
import { useRouter, useRoute } from 'vue-router';
// import logo from '@/assets/images/BGHMC.png';
// import { useToast } from 'primevue/usetoast';
import useToastWaitingForFetch from '@/composables/useToastWaitingForFetch';
// import { ErrorMessage } from 'vee-validate';

// const { layoutConfig, contextPath } = useLayout();
// const email = ref('');
// const username = ref('registry');
// const password = ref('a123456');
const username = ref('');
const password = ref('');
// const checked = ref(false);
const router = useRouter();
const route = useRoute();

// const loginFailed = ref(true);
// const toast = useToast();

const authenticationService = new AuthenticationService();

// const logoUrl = computed(() => {
//     // return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
//     // return '@/assets/images/BGHMC.png';
//     return logo;
// });

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
    { errorSeverity: 'error', errorSummmary: 'Error', ErrorMessage: 'Login failed' },
    { asyncFunction: attemptLogin, asyncFunctionParams: [] }
);
let isLoggingIn = false;

async function login() {
    if (isLoggingIn) return;
    isLoggingIn = true;
    try {
        const response = await toastWaitingForFetch.fetchData();
        if (response.status == 200) {
            const redirectPath = route.query.redirect || '/registry';
            router.push(redirectPath);
        }
    } catch (error) {
        // console.error('Login failed:', error);
    } finally {
        isLoggingIn = false;
    }
}
// async function login(username, password) {
// async function login() {
//     // console.log('login');
//     // await authenticationService.getCSRFToken();
//     // return;

//     const response = await toastWaitingForFetch.fetchData();
//     // console.log('toastWaitingForFetch.fetchData()', response);
//     // if (response.status == 200) {
//     //     // router.push({ name: 'injurylist' });
//     //     router.push({ name: 'injurylist' });
//     // }

//     if (response.status == 200) {
//         // Retrieve the redirect URL from the query parameter, or fallback to a default route

//         const redirectPath = route.query.redirect || '/registry'; // Adjust the default route as needed
//         // console.log('redirectPath', redirectPath);
//         // Redirect to the retrieved path
//         router.push(redirectPath);
//     }

//     // toast.add({
//     //     severity: 'info',
//     //     summary: 'Logging in...',
//     //     detail: '',
//     //     life: 1500,
//     //     closable: false
//     // });
//     // const response = await authenticationService.login(username, password);
//     // // console.log(localStorage.getItem('authToken'));
//     // console.log('response', response);

//     // if (localStorage.getItem('authToken')) {
//     //     // console.log('login success');
//     //     //show toast on successful login

//     //     toast.add({
//     //         severity: 'success',
//     //         summary: 'Login Successful',
//     //         detail: '',
//     //         life: 1300
//     //     });
//     //     new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
//     //         router.push({ name: 'injurylist' });
//     //     });
//     //     // router.push({ name: 'injurylist' });
//     // } else {
//     //     toast.add({ severity: 'error', summary: 'Login Failed', detail: '', life: 1500 });
//     // }
// }

const isCapslockOn = ref(false);

const checkCapsLock = (event) => {
    const capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    isCapslockOn.value = capsLockOn;
};

// onMounted(() => {
//     // console.log('mounted');
//     if (localStorage.getItem('authToken')) {
//         // console.log(localStorage.getItem('authToken'));
//         router.push({ name: 'home' });
//     }
//     //delete all localstorage
//     localStorage.clear();
// });
onMounted(async () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        const isValid = await authenticationService.validateToken(authToken);
        if (isValid) {
            router.push({ name: 'registry' });
        } else {
            localStorage.clear(); // Clear invalid token
        }
    } else {
        localStorage.clear(); // Ensure localStorage is clean
    }
});

// const testroute = () => {
//     window.location.href = 'https://192.168.7.66:9050/api/fromEMR?empID=000001&enccode=ER100507Nov262024065658';
// };
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-6 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="@/assets/images/BGHMC.png" alt="Image" height="120" class="mb-3" />
                        <!-- <img :src="logoUrl" alt="Image" height="120" class="mb-3" /> -->
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
                        <Password
                            id="password1"
                            :feedback="false"
                            @keydown="checkCapsLock"
                            @keyup="checkCapsLock"
                            required
                            v-model="password"
                            placeholder="Password"
                            class="w-full mb-3"
                            inputClass="w-full"
                            @keyup.enter="login(username, password)"
                        ></Password>

                        <!-- <div v-if="loginFailed">Login Failed!</div> -->

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <!-- <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox> -->
                                <label for="rememberme1"></label>
                            </div>
                            <!-- <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a> -->
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="login(username, password)"></Button>
                        <!-- <Button label="Sign In" class="w-full p-3 text-xl" @click="testroute"></Button> -->
                        <!-- <div>
                            <InputTextCheckBox title="TESTCOPMPENTET" cbval="Y" />
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <Toast />
    </div>
    <!-- <AppConfig simple /> -->
</template>

<style scoped></style>

