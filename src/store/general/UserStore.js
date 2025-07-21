import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
// import _ from 'lodash';
// import { useRouter } from 'vue-router';

//const API_URL = 'http://127.0.0.1:8000/api/user/';
// const USER_API_URL = 'http://127.0.0.1:8000/api/getUserInfo';
// const router = useRouter();
export const useUserStore = defineStore('userStore', () => {
    const userInfo = ref({});

    async function getUserInfo() {
        const uInfo = await axios
            // .get(USER_API_URL, {
            .get('getUserInfo', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    // withCredentials: true
                }
            })
            .then((response) => {
                // console.log('response', response);
                return response.data;
            })
            .catch((err) => {
                const enccode = ref();
                const fullUrl = window.location.href;
                const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
                const match3 = fullUrl.match(/[?&]access_token=([^&#]*)/);
                const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
                enccode.value = match ? match[1] : null;
                const empID = match2 ? match2[1] : null;
                const getToken = match3 ? match3[1] : null;
                // console.log('getToken:', getToken, 'empID:', empID, 'enccode:', enccode.value);
                // console.log('empID', empID);
                // console.log('enccode', enccode);
                if (localStorage.getItem('authToken') === null) {
                    window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                }
            });

        userInfo.value = uInfo;
        return uInfo;
    }

    return {
        userInfo,
        getUserInfo
    };
});

// import { defineStore } from 'pinia';
// import axios from 'axios';
// import { ref } from 'vue';

// export const useUserStore = defineStore('userStore', () => {
//     const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')) || {});

//     async function getUserInfo() {
//         const uInfo = await axios
//             .get('getUserInfo', {
//                 headers: {
//                     Authorization: 'Bearer ' + localStorage.getItem('authToken')
//                 }
//             })
//             .then((response) => {
//                 return response.data;
//             })
//             .catch((err) => {
//                 console.error(err);
//                 return err.response;
//             });

//         userInfo.value = uInfo;
//         localStorage.setItem('userInfo', JSON.stringify(uInfo));
//         return uInfo;
//     }

//     return {
//         userInfo,
//         getUserInfo
//     };
// });
