import axios from 'axios';
import { useTokenStore } from '../store/tokenStore';
import { useRouter } from 'vue-router';
// import { useUserStore } from '@/store/userStore';
// import { useUserStore } from '../store/userStore';

// const contextPath = import.meta.env.BASE_URL;
// const API_URL = 'http://127.0.0.1:8000/api/';
// const API_URL = 'http://127.0.0.1:8000/api/';
// const API_URL = 'http://192.168.7.74:8001/api/';

// set API_URL in .env file
// const API_URL = process.env.VUE_APP_API_URL;
// const API_URL = import.meta.env.VITE_API_URL;
// const userStore = useUserStore();
export default class AuthenticationService {
    async loginByID(empID) {
        const tokenStore = useTokenStore();
        // localStorage.removeItem('authToken');
        // console.log('AuthenticationService.loginByID()', empID);
        // await axios
        //     .get('http://
        const response = await axios
            .post('loginbyid', { empID: empID })
            .then((res) => {
                // console.log('status', res);
                return res;
            })
            .catch((err) => {
                // console.log('status', err.response.status);
                if (err.response.status == 401) {
                    localStorage.setItem(
                        'originalUrl',
                        JSON.stringify({
                            path: window.location.pathname
                            // data: {
                            //     username: username,
                            //     password: password
                            // }
                        })
                    );
                    const router = useRouter();
                    router.push('/login');
                }
                // console.error('err', err.response);
                localStorage.removeItem('authToken');
                tokenStore.token = '';
                return err.response;
            });
        if (response.status == 200) {
            localStorage.setItem('authToken', response.data.data.token.plainTextToken);
            tokenStore.token = response.data.data.token.plainTextToken;
            // return

            return response;
        } else {
            return response;
        }
    }
    async login(username, password) {
        const tokenStore = useTokenStore();
        // localStorage.removeItem('authToken');
        // console.log('AuthenticationService.login()');
        // await axios
        //     .get('http://127.0.0.1:8000/sanctum/csrf-cookie')
        //     .then((res) => {
        //         console.log({ res });
        //         return res;
        //     })
        //     .catch((err) => {
        //         console.error({ err });
        //     });
        // const csrfToken = await this.getCSRFToken();
        const response = await axios
            // .post(API_URL + 'login', {
            .post(
                // API_URL + 'login',
                'login',
                // process.env.VITE_API_URL + 'login',
                {
                    username: username,
                    password: password
                },
                {
                    headers: { withCredentials: true }
                }

                // ,{
                //     headers: {
                //         'X-CSRF-TOKEN': csrfToken
                //     }
                // }
            )
            .then((res) => {
                // console.log('status', res);
                return res;
            })
            .catch((err) => {
                // console.log('status', err.response.status);
                if (err.response.status == 401) {
                    localStorage.setItem(
                        'originalUrl',
                        JSON.stringify({
                            path: window.location.pathname
                            // data: {
                            //     username: username,
                            //     password: password
                            // }
                        })
                    );
                    const router = useRouter();
                    router.push('/login');
                }
                // console.error('err', err.response);
                localStorage.removeItem('authToken');
                tokenStore.token = '';
                return err.response;
            });

        if (response.status == 200) {
            localStorage.setItem('authToken', response.data.data.token.plainTextToken);
            tokenStore.token = response.data.data.token.plainTextToken;
            // return

            return response;
        } else {
            return response;
        }
    }

    async logout() {
        console.log('AuthenticationService.logout()');
        // const csrfToken = await this.getCSRFToken();
        const response = await axios
            .post(
                'logout',
                // API_URL + 'logout',
                {},
                //,
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                localStorage.removeItem('authToken');
                return res;
            })
            .catch((err) => {
                console.error('err', err);
                return err.response;
            });
        console.log('response', response);
        return response;
    }

    async getCSRFToken() {
        console.log('AuthenticationService.getCSRFToken()');
        try {
            const response = await axios.get('csrf').then((res) => {
                // const response = await axios.get('sanctum/csrf-cookie').then((res) => {
                console.log('csrf response', res);
                return res;
            });
            console.log('csrf response', response);
            return response.data.csrfToken;
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    }
}
