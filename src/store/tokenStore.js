import { defineStore } from 'pinia';
// import axios from 'axios';
import { ref } from 'vue';

//const API_URL = 'http://127.0.0.1:8000/api/user/';
export const useTokenStore = defineStore('tokenStore', () => {
    var token = ref('');

    function sendToStorage() {
        localStorage.removeItem('authToken');
        localStorage.setItem('authToken', token);
        
        sessionStorage.setItem('authToken');
        token.value = '';
    }

    function retrieveFromStorage() {
        token.value = localStorage.getItem('authToken');
        localStorage.removeItem('authToken');
    }

    function loadToken() {
        if (token.value == '' && localStorage.getItem('authToken')) {
            return retrieveFromStorage();
        }
    }

    return {
        token,
        sendToStorage,
        // retrieveFromStorage,
        loadToken
    };
});
