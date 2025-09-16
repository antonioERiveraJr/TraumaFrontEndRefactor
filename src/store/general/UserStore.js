import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
    const userInfo = ref({});

    async function refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken'); // Assuming you have a refresh token stored
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/refresh', { token: refreshToken });
            localStorage.setItem('authToken', response.data.authToken);
            return response.data.authToken;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            // Redirect to login or handle it as needed
            window.location.href = '/login';
            throw error; // Re-throw to handle it in getUserInfo
        }
    }

    async function getUserInfo() {
        try {
            const uInfo = await axios.get('getUserInfo', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            userInfo.value = uInfo.data;
            return uInfo.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    const newToken = await refreshToken(); // Attempt to refresh the token
                    const uInfo = await axios.get('getUserInfo', {
                        headers: {
                            Authorization: 'Bearer ' + newToken
                        }
                    });
                    userInfo.value = uInfo.data;
                    return uInfo.data;
                } catch (refreshError) {
                    console.error('Failed to fetch user info after token refresh:', refreshError);
                }
            } else {
                console.error('Failed to fetch user info:', error);
            }
        }
    }

    return {
        userInfo,
        getUserInfo
    };
});
// import { defineStore } from 'pinia';
// import axios from 'axios';
// import { ref } from 'vue';
// // import _ from 'lodash';
// // import { useRouter } from 'vue-router';

// //const API_URL = 'http://127.0.0.1:8000/api/user/';
// // const USER_API_URL = 'http://127.0.0.1:8000/api/getUserInfo';
// // const router = useRouter();
// export const useUserStore = defineStore('userStore', () => {
//     const userInfo = ref({});

//     async function getUserInfo() {
//         const uInfo = await axios
//             // .get(USER_API_URL, {
//             .get('getUserInfo', {
//                 headers: {
//                     Authorization: 'Bearer ' + localStorage.getItem('authToken')
//                     // withCredentials: true
//                 }
//             })
//             .then((response) => {
//                 // console.log('response', response);
//                 return response.data;
//             })
//             .catch((err) => {
//                 const enccode = ref();
//                 const fullUrl = window.location.href;
//                 const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
//                 const match3 = fullUrl.match(/[?&]access_token=([^&#]*)/);
//                 const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
//                 enccode.value = match ? match[1] : null;
//                 const empID = match2 ? match2[1] : null;
//                 const getToken = match3 ? match3[1] : null;
//                 // console.log('getToken:', getToken, 'empID:', empID, 'enccode:', enccode.value);
//                 // console.log('empID', empID);
//                 // console.log('enccode', enccode);
//                 // console.log('not logged in');
//                 if (localStorage.getItem('authToken') === null) {
//                     window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
//                 }
//                 // if (localStorage.getItem('authToken') === null) {
//                 //     window.location.href = `http://192.168.6.58:8010/api/fromOPD?empID=${empID}&enccode=${enccode.value}`;
//                 // }
//             });

//         userInfo.value = uInfo;
//         return uInfo;
//     }

//     return {
//         userInfo,
//         getUserInfo
//     };
// });

// // import { defineStore } from 'pinia';
// // import axios from 'axios';
// // import { ref } from 'vue';

// // export const useUserStore = defineStore('userStore', () => {
// //     const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')) || {});

// //     async function getUserInfo() {
// //         const uInfo = await axios
// //             .get('getUserInfo', {
// //                 headers: {
// //                     Authorization: 'Bearer ' + localStorage.getItem('authToken')
// //                 }
// //             })
// //             .then((response) => {
// //                 return response.data;
// //             })
// //             .catch((err) => {
// //                 console.error(err);
// //                 return err.response;
// //             });

// //         userInfo.value = uInfo;
// //         localStorage.setItem('userInfo', JSON.stringify(uInfo));
// //         return uInfo;
// //     }

// //     return {
// //         userInfo,
// //         getUserInfo
// //     };
// // });
