/* eslint-disable prettier/prettier */
import axios from 'axios';
// import { useDateFormat, useNow } from '@vueuse/core';
// import { useUserStore } from '../general/UserStore';
// import { LogarithmicScale } from 'chart.js';
import { useUserStore } from '../store/general/UserStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

import Swal from 'sweetalert2';
import { is } from '@vee-validate/rules';
// const user = useUserStore();
// const contextPath = import.meta.env.BASE_URL;
// const API_URL = 'http://127.0.0.1:8000/api/';
// const API_URL = 'http://127.0.0.1:8000/api/';
// const API_URL = process.env.VUE_APP_API_URL;

const employeeCache = {};
export default class InjuryService {
    constructor(router) {
        // Initialize abortController as a property of the class
        this.abortController = null;
        this.router = router;
    }
    async getOPDPatientData(enccode) {
        try {
            // console.log('enccode: ', enccode);
            const response = await axios.get('/opdPatientData', {
                params: {
                    enccode: enccode
                },
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            return response.data;
        } catch (err) {
            console.error('error: ', err);
            throw err;
        }
    }

    async getPatientABTCLog(hpercode) {
        try {
            const response = await axios.get('/getPatientABTCLog', {
                params: {
                    hpercode: hpercode
                },
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            return response.data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getUnfinishedTSSForms() {
        try {
            const response = await axios.get('/getUnfinishedTSSForms', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching unfinished TSS forms:', error);
            throw error;
        }
    }

    async updatePrimediag(enccode, diagtext, tstamp, diagid) {
        // console.log('enccode: ', enccode, '\n diagtext; ', diagtext, '\n tstamp: ', tstamp, 'diagID: ', diagid);

        try {
            const response = await axios.put(
                '/updatePrimediag',
                { enccode: enccode, diagtext: diagtext, tstamp: tstamp, diagid: diagid }, // Request payload
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            );
            // console.log('response: ', response);

            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // loading.value = false;
                console.log('401 Unauthorized: ', error);
                localStorage.removeItem('authToken');

                Swal.fire({
                    title: 'Session Expired',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Trauma Surveillance FORM',
                    denyButtonText: `TSS Admitting`
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    } else if (result.isDenied) {
                        this.router.push('/auth/login').then(() => {
                            window.location.reload();
                        });
                    }
                });

                return;
            }
            if (error.response && error.response.status === 404) {
                console.log('Patient referral not found');
                return error.response;
            } else if (error.response) {
                console.log('Error fetching patient details:', error.response.data.message);
                return error.response;
            } else {
                console.log('Error fetching patient details:', error.response ? error.response.data : error.message);
                return error;
            }
        }
    }

    // async getLatestDiagnosis(enccode, entryby) {
    //     try {
    //         const response = await axios.get('/getLatestDiagnosis', {
    //             params: { enccode, entryby },

    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //             }
    //         });

    //         return response.data;
    //     } catch (error) {
    //         console.log('Error fetching latest Diagnosis of  doctors:', error);

    //         // throw error;
    //     }
    // }

    async getLatestEntryOfDoctors(enccode) {
        try {
            const response = await axios.get('/getLatestEntryOfDoctors', {
                params: { enccode },

                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });

            return response.data;
        } catch (error) {
            console.log('Error fetching latest entry of doctors:', error);

            // throw error;
        }
    }

    async checkLockedEnccode(enccode) {
        try {
            const response = await axios.get('/checkLockedEnccode', {
                params: { enccode },
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });

            return response.data;
        } catch (error) {
            // console.log(error);
            // throw error;
        }
    }

    async getFormDetail(enccode) {
        try {
            // console.log('encode: ', enccode);

            const response = await axios.get('/getFormDetail', {
                params: { enccode: enccode },
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('401 Unauthorized: ', error);
                localStorage.removeItem('authToken');

                Swal.fire({
                    title: 'Session Expired',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Trauma Surveillance FORM',
                    denyButtonText: `TSS Admitting`
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    } else if (result.isDenied) {
                        this.router.push('/auth/login').then(() => {
                            window.location.reload();
                        });
                    }
                });
                return;
            }
            if (error.response && error.response.status === 404) {
                console.log('Form detail not found');
                return error.response;
            } else if (error.response) {
                console.log('Error fetching form detail:', error.response.data.message);
                return error.response;
            } else {
                console.log('Error fetching form detail:', error.response ? error.response.data : error.message);
                return error;
            }
        }
    }

    async getPatientReferral(enccode) {
        try {
            // console.log('enccode in injuryservice:', enccode);
            const response = await axios.get(
                '/getPatientReferral', // Endpoint URL
                {
                    params: { enccode: enccode }, // Pass enccode as a query parameter
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            );

            return response.data;
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // loading.value = false;
                console.log('401 Unauthorized');
                localStorage.removeItem('authToken');

                // Swal.fire({
                //     title: 'Session Expired',
                //     showDenyButton: true,
                //     showCancelButton: true,
                //     confirmButtonText: 'Trauma Surveillance FORM',
                //     denyButtonText: `TSS Admitting`
                // }).then((result) => {
                //     if (result.isConfirmed) {
                window.location.reload();
                // } else if (result.isDenied) {
                //     this.router.push('/auth/login').then(() => {
                //         window.location.reload();
                //     });
                // }
                // });

                const router = new useRouter();
                if (!router) {
                    // router = useRouter();
                    console.log('route not found!');
                }
                router.push('/auth/login').then(() => {
                    window.location.reload();
                });
                return;
            }
            if (err.response && err.response.status === 404) {
                console.log('Patient referral not found');
                // return err.response;
            } else if (err.response) {
                console.log('Error fetching patient details:', err.response.data.message);
                // return err.response;
            } else {
                console.log('Error fetching patient details:', err);
                // return err;
            }
        }
    }

    //list of doctor's entries
    async getEntryOfDoctors(enccode) {
        // const user = useUserStore();
        // console.log('user:', user.userInfo.employeeid);

        // if (!user || !user.userInfo || !user.userInfo.employeeid) {
        //     throw new Error('User is not properly initialized');
        // }
        try {
            const response = await axios.get('/getEntryOfDoctors', {
                params: { enccode: enccode },
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            return response.data;
        } catch (err) {
            if (err.response) {
                console.log('Error fetching entry of doctors:', err.response.data);
                return err.response;
            } else {
                console.log('Error fetching entry of doctors:', err.message);
                return { error: err.message };
            }
        }
    }

    async injuryList(hardRefresh, status = null, startdate = null, enddate = null, dateDescription = null) {
        // Abort the previous request if it's still ongoing
        if (this.abortController) {
            this.abortController.abort();
        }

        // Create a new AbortController instance
        this.abortController = new AbortController();

        try {
            const response = await axios.post(
                'injuryList',
                { hardRefresh: hardRefresh, status: status, startdate: startdate, enddate: enddate, dateDescription: dateDescription },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    signal: this.abortController.signal // Pass the signal to axios
                }
            );

            return response;
        } catch (err) {
            // Handle the error if the request was aborted
            if (axios.isCancel(err)) {
                // console.log('Request canceled:', err.message);
            } else {
                return err.response;
            }
        }
    }
    async admittedInjuryList(status) {
        if (this.abortController) {
            this.abortController.abort();
        }

        this.abortController = new AbortController();

        try {
            const response = await axios.post(
                'admittedInjuryList',
                { status: status },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    signal: this.abortController.signal
                }
            );

            return response;
        } catch (err) {
            if (axios.isCancel(err)) {
                // console.log('Request canceled:', err.message);
            } else {
                return err.response;
            }
        }
    }

    async injuryList3(hardRefresh, status = null, startdate = null, enddate = null, dateDescription = null) {
        // Abort the previous request if it's still ongoing
        if (this.abortController) {
            this.abortController.abort();
        }

        // Create a new AbortController instance
        this.abortController = new AbortController();

        try {
            const response = await axios.post(
                'injuryList3',
                { hardRefresh: hardRefresh, status: status, startdate: startdate, enddate: enddate, dateDescription: dateDescription },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    signal: this.abortController.signal // Pass the signal to axios
                }
            );

            return response;
        } catch (err) {
            // Handle the error if the request was aborted
            if (axios.isCancel(err)) {
                // console.log('Request canceled:', err.message);
            } else {
                return err.response;
            }
        }
    }

    async injuryListDev(hardRefresh, status = null, startdate = null, enddate = null, dateDescription = null) {
        // Abort the previous request if it's still ongoing
        if (this.abortController) {
            this.abortController.abort();
        }

        // Create a new AbortController instance
        this.abortController = new AbortController();

        try {
            const response = await axios.post(
                'injuryListDev',
                { hardRefresh: hardRefresh, status: status, startdate: startdate, enddate: enddate, dateDescription: dateDescription },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    signal: this.abortController.signal // Pass the signal to axios
                }
            );

            return response;
        } catch (err) {
            // Handle the error if the request was aborted
            if (axios.isCancel(err)) {
                // console.log('Request canceled:', err.message);
            } else {
                return err.response;
            }
        }
    }

    async reportList(hardRefresh, startdate = null, enddate = null, dateDescription = null) {
        if (this.abortController) {
            this.abortController.abort();
        }

        this.abortController = new AbortController();

        try {
            const response = await axios.post(
                'reportList',
                { hardRefresh: hardRefresh, startdate: startdate, enddate: enddate, dateDescription: dateDescription },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    signal: this.abortController.signal // Pass the signal to axios
                }
            );

            return response;
        } catch (err) {
            // Handle the error if the request was aborted
            if (axios.isCancel(err)) {
                // console.log('Request canceled:', err.message);
            } else {
                return err.response;
            }
        }
    }

    async injuryList2() {
        // console.log('injuryList()');
        const response = await axios
            .get(
                // API_URL + 'injuryList2',

                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });

        return response;
    }

    async injuryPatient(enccode) {
        // console.log('injuryPatient(' + enccode + ')');
        const response = await axios
            // .get(API_URL + 'injuryList/' + enccode, {
            .get('injuryList/' + enccode, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                // console.error('injuryPatient', err);
                return err.response;
            });
        // console.log('service response', response);
        return response;
    }

    async injuryPatientDev(enccode) {
        // console.log('injuryPatient(' + enccode + ')');
        const response = await axios
            // .get(API_URL + 'injuryList/' + enccode, {
            .get('injuryListDev/' + enccode, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                // console.error('injuryPatient', err);
                return err.response;
            });
        // console.log('service response', response);
        return response;
    }

    // async injuryPatientExport(enccode) {
    //     // console.log('injuryPatient(' + enccode + ')');
    //     const response = await axios
    //         // .get(API_URL + 'injuryList/' + enccode, {
    //         .get('injuryList/' + enccode, {
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //             }
    //         })
    //         .then((res) => {
    //             return res.data;
    //         })
    //         .catch((err) => {
    //             // console.error('injuryPatient', err);
    //             return err.response;
    //         });
    //     // console.log('service response', response);
    //     return response;
    // }

    async getSubjectiveObjective(enccode) {
        // console.log('getSubjectiveObjective(' + enccode + ')');
        const response = await axios
            .post(
                'getSubjectiveNoiToiPoiDoi',
                { enccode: enccode },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                // console.log('getSubjectiveObjective', res.data);
                return res.data;
            })
            .catch((err) => {
                console.error('getSubjectiveObjective', err);
                return err.response;
            });
        // console.log('service response', response);
        return response;
    }

    async extractKeywords(text) {
        // console.log('getKeyTerms(' + text + ')');
        const response = await axios
            .post(
                'getKeyTerms',
                { text: text },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                // console.log('getKeyTerms', res.data);
                return res.data;
            })
            .catch((err) => {
                // console.error('getKeyTerms', err);
                return err.response;
            });
        // console.log('service response', response);
        // save response to object for each array element
        // response.forEach((element) => {
        // element['keywords'] = [];
        // });
        return response;
    }

    // injuryService.js
    // async fetchEmployeeNames(employeeIds) {
    //     try {
    //         const response = await axios.get(`/getEmployeeName`, {
    //             params: { employeeids: employeeIds }, // Pass employee IDs as a query parameter
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //             }
    //         });
    //         return response.data; // Return the array of employee name data
    //     } catch (error) {
    //         console.error('Error fetching employee names:', error);
    //         throw error; // Rethrow the error for handling in the component
    //     }
    // }

    async newCase(hpercode) {
        try {
            const response = await axios.put(
                'newCase',
                { hpercode: hpercode },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            );
            return response;
        } catch (err) {
            console.error('New Case Error');
        }
    }
    async checkPatientTSSRecord(hpercode) {
        try {
            const response = await axios.get('checkPatientTSSRecord', {
                // params: { hpercode: hpercode, prophylaxis: prophylaxis },
                params: { hpercode: hpercode},
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            return response;
        } catch (err) {
            if (err.response && err.response.status === 401) {
                const enccode = ref();
                const fullUrl = window.location.href;
                const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
                // const match3 = fullUrl.match(/[?&]access_token=([^&#]*)/);
                const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
                enccode.value = match ? match[1] : null;
                const empID = match2 ? match2[1] : null;
                // const getToken = match3 ? match3[1] : null;
                // console.log('getToken:', getToken, 'empID:', empID, 'enccode:', enccode.value);
                // console.log('empID', empID);
                // console.log('enccode', enccode);
                if (empID && enccode) {
                    // window.location.href = `http://192.168.6.58:8000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                    window.location.href = `http://192.168.6.58:8010/api/fromOPD?empID=${empID}&enccode=${enccode.value}`;
                } else {
                    console.error('empID or enccode is missing in localStorage');
                }
            }
        }
    }
    async fetchEmployeeNames(employeeIds) {
        const uncachedIds = employeeIds?.filter((id) => !employeeCache[id]);
        if (uncachedIds?.length === 0) {
            return employeeIds.map((id) => employeeCache[id]);
        }

        try {
            const response = await axios.get(`/getEmployeeName`, {
                params: { employeeids: uncachedIds },
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });

            response?.data?.forEach((employee) => {
                employeeCache[employee.employeeid] = {
                    firstname: employee.firstname,
                    lastname: employee.lastname
                };
            });

            return response?.data;
        } catch (error) {
            console.error('Error fetching employee names:', error);
            // throw error;
        }
    }

    async extractNOIPOITOIDOI(text) {
        // console.log('extractNOIPOITOIDOI(' + text + ')');
        const response = await axios
            .post(
                '/extractNOIPOIDOITOIMOI',
                { text: text },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                return res.data;
            });

        // console.log('response', response);
        return response;
    }

    // async insertDoctorsEntries(enccode) {
    //     const user = useUserStore();
    //     const response = await axios
    //         .put(
    //             'insertDoctorsEntries',
    //             { enccode: enccode, user: user.userInfo.employeeid },
    //             {
    //                 headers: {
    //                     Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //                 }
    //             }
    //         )
    //         .then((res) => {
    //             return res;
    //         })
    //         .catch((err) => {
    //             console.error('Error inserting diagnosis:', err.response ? err.response.data : err.message);
    //             return err.response;
    //         });
    //     return response;
    // }

    // }

    async insertBillingDiagnosis(enccode, diagnosis, hpercode) {
        // console.log('insertDiagnosis(' + enccode + ')');
        // console.log('diagnosis:', diagnosis);

        const user = useUserStore();

        const response = await axios
            .put(
                'insertBillingDiagnosis',
                { enccode: enccode, diagnosis: diagnosis, user: user.userInfo.employeeid, hpercode: hpercode },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error('Error inserting diagnosis for billing:', err.response ? err.response.data : err.message);
                return err.response;
            });
        return response;
    }
    async insertDiagnosis(enccode, diagnosis, isUpdateForm) {
        // console.log('insertDiagnosis(' + enccode + ')');
        // console.log('diagnosis:', diagnosis);

        const user = useUserStore();
        // console.log('user2:', user);

        const response = await axios
            .put(
                'insertDiagnosis',
                { enccode: enccode, diagnosis: diagnosis, user: user.userInfo.employeeid, isUpdateForm: isUpdateForm },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error('Error inserting diagnosis:', err.response ? err.response.data : err.message);
                return err.response;
            });
        return response;
    }

    // async insertDiagnosis(enccode, diagnosis) {
    //     // console.log('insertDiagnosis(' + enccode + ')');
    //     // console.log('diagnosis:', diagnosis);

    //     const user = useUserStore();
    //     console.log('user2:', user);

    //     const response = await axios
    //         .put(
    //             'insertDiagnosis',
    //             { enccode: enccode, diagnosis: diagnosis, user: user.userInfo.employeeid },
    //             {
    //                 headers: {
    //                     Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //                 }
    //             }
    //         )
    //         .then((res) => {
    //             return res;
    //         })
    //         .catch((err) => {
    //             console.error('Error inserting diagnosis:', err.response ? err.response.data : err.message);
    //             return err.response;
    //         });
    //     return response;
    // }

    async updateMedilogs(enccode, injtme, injrem, injloc, iicode) {
        // console.log('i:', injtme);

        const response = await axios
            .put(
                'updateMedilogs',
                { enccode: enccode, injtme: injtme, injrem: injrem, injloc: injloc, iicode: iicode },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err.response;
            });
        return response;
    }

    async insertObjSubj(enccode, subjective, objective, hpercode, isUpdateForm, ufiveID) {
        console.log('insertObjSubj called with parameters:', {
            isUpdateForm,
            ufiveID
        });
        // alert('hit');
        const user = useUserStore();
        const response = await axios
            .put(
                'insertObjSubj',
                { enccode: enccode, subjective: subjective, objective: objective, hpercode: hpercode, entryby: user.userInfo.employeeid, isUpdateForm: isUpdateForm, ufiveID: ufiveID },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err.response;
            });
        return response;
    }

    async archDate(patientEnccode, dateNow) {
        // console.log('archDate encounter code: ',patientEnccode);
        const user = useUserStore();
        // console.log('user:', user);

        // const dateNow = useNow();
        const filename = 'Injury' + dateNow.toString().substring(0, 24);
        //    console.log('Hey: ',filename);

        const response = await axios
            .put(
                'updateStatusForArchived',

                {
                    enccode: patientEnccode,
                    archDate: filename,
                    exportby: user.userInfo.employeeid
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                // console.log('Response from saveFormattedData:', res);

                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });
        return response;
    }

    async getListOfDiagnosis(enccode) {
        try {
            const response = await axios.get('/getListOfDiagnosis', {
                params: { enccode },

                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            return response.data;
        } catch (error) {
            console.log('error generating report: ', error);
        }
    }

    async getListOfFinalDiagnosis(admEnccode) {
        try {
            const response = await axios.get('/getListOfFinalDiagnosis', {
                params: { admEnccode },

                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            return response.data;
        } catch (error) {
            console.log('error generating report: ', error);
        }
    }

    async generateStats(dateFrom, dateTo, isOneiss) {
        try {
            const response = await axios.get('/generateStats', {
                params: { dateFrom, dateTo, isOneiss },

                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async generateStatsToExcel(array) {
        try {
            // console.log('array: ', array);
            const response = await axios.post(
                '/generateStatsToExcel',
                { array: array },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    responseType: 'blob'
                }
            );
            console.log('response: ', response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // const filename = 'Injury' + dateFrom.toString()+'to'+ dateTo.toString()+  '.zip';
            const filename = 'InjuryReport.zip';
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            return response.data;
        } catch (err) {
            if (err.response && err.response.status === 401) {
                this.router.push('/auth/login');
            }
        }
    }

    async sendArrayToServer(array, dateNow, isAdmit) {
        // const dateNow = useNow();
        // console.log('array:', array);

        try {
            const response = await axios.post(
                '/getArrayFromFrontEnd',
                { array: array, isAdmit: isAdmit },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    responseType: 'blob'
                }
            );

            console.log('responsearray:', response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = 'Injury' + dateNow.toString().substring(0, 24) + '.zip';
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            return response; // Return the response here
        } catch (err) {
            console.error('Error sending array to server:', err.response ? err.response.data : err.message);
            return err.response; // Return the error response
        }
    }
    // async sendArrayToServer(array) {
    //     const dateNow = useNow();

    //     // Process the array to include diagnosis condition
    //     const processedArray = array.map(item => {
    //         // Check if the diagnosis exists in the item
    //         if (!item.details || !item.details.diagnosis) {
    //             console.log('Diagnosis not found for item:', item);
    //             // Set diagnosis to "no diagnosis"
    //             item.details = item.details || {}; // Ensure details object exists
    //             item.details.diagnosis = "no diagnosis"; // Set to "no diagnosis"
    //         }
    //         return item;
    //     });

    //     try {
    //         const response = await axios.post(
    //             '/getArrayFromFrontEnd',
    //             { array: processedArray }, // Send the processed array
    //             {
    //                 headers: {
    //                     Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //                 },
    //                 responseType: 'blob'
    //             }
    //         );

    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         const filename = 'Injury' + dateNow.value.toString().substring(0, 24) + '.zip';
    //         link.setAttribute('download', filename);
    //         document.body.appendChild(link);
    //         link.click();

    //         return response; // Return the response here
    //     } catch (err) {
    //         console.error('Error sending array to server:', err);
    //         return err.response; // Return the error response
    //     }
    // }
}
