import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

const API_URL = 'http://127.0.0.1:8000/api/user/';
export const useOldUserStore = defineStore('userStore', () => {
    var username = ref('');
    var employeeid = ref('');
    var lastname = ref('');
    var firstname = ref('');
    var middlename = ref('');
    var empsuffix = ref('');
    var postitle = ref('');
    var token = ref('');

    async function getUserInfo(username) {
        const url = API_URL + username;

        const response = await axios
            .get(
                url,

                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                // console.log('userStore success', res);
                return res;
            })
            .catch((err) => {
                console.error('userStore error', err);
                return err.response;
            });

        if (response.status == 200) {
            employeeid.value = response.data[0].employeeid;
            lastname.value = response.data[0].lastname;
            firstname.value = response.data[0].firstname;
            middlename.value = response.data[0].middlename;
            empsuffix.value = response.data[0].empsuffix;
            postitle.value = response.data[0].postitle;
        }

        // console.log(response);
        // return response;
    }

    function getUserByToken() {
        if (!username.value) {
            //use token retrieve user details
            console.log('no username stored');
        }
    }

    return {
        username,
        employeeid,
        lastname,
        firstname,
        middlename,
        empsuffix,
        postitle,
        token,
        getUserInfo,
        getUserByToken
    };
});
