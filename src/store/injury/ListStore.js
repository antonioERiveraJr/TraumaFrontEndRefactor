import { defineStore } from 'pinia';
// import axios from 'axios';
import { ref } from 'vue';

//const API_URL = 'http://127.0.0.1:8000/api/user/';
export const useListStore = defineStore('listStore', () => {
    const list = ref({});
    return {
        list
    };
});
