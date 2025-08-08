import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
// import _ from 'lodash';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

//const API_URL = 'http://127.0.0.1:8000/api/user/';
// const LOCATIONS_API_URL = 'http://127.0.0.1:8000/api/locations/';

export const useLocationsStore = defineStore('locationsStore', () => {
    const locations = ref({});
    const router = useRouter();
    const regions = ref([]);
    const provinces = ref([]);
    const citys = ref([]);
    const bgys = ref([]);

    const loadingProvinces = ref(false);
    const loadingCities = ref(false);

    async function getLocations() {
        const response = await axios
            .get('locations', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });
        if (response.status == 200) {
            locations.value = response.data;
        }
        if (response && response.status === 401) {
            // loading.value = false;
            console.log('401 Unauthorized');
            localStorage.removeItem('authToken');

            await Swal.fire({
                icon: 'info',
                title: 'Session Expired',
                text: 'Informing Session Expired. Logging In...',
                showConfirmButton: false,
                timer: 1500
            });

            // router.push('/auth/login').then(() => {
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
                window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
            } else {
                console.error('empID or enccode is missing in localStorage');
            }
            // });
            return;
        }
        return response;
    }

    async function getNewLocations() {
        try {
            const response = await axios.get('newlocations', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });

            if (response.status === 200) {
                locations.value = response.data;
            }

            if (response.status === 401) {
                console.log('401 Unauthorized');
                localStorage.removeItem('authToken');

                await Swal.fire({
                    icon: 'info',
                    title: 'Session Expired',
                    text: 'Informing Session Expired. Logging In...',
                    showConfirmButton: false,
                    timer: 1500
                });

                const enccode = ref();
                const fullUrl = window.location.href;
                const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
                const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
                enccode.value = match ? match[1] : null;
                const empID = match2 ? match2[1] : null;

                if (empID && enccode.value) {
                    window.location.href = `http://192.168.6.58:8010/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                } else {
                    console.error('empID or enccode is missing in localStorage');
                }

                return;
            }

            return response;
        } catch (err) {
            console.error(err);
            return err.response;
        }
    }

    
    async function getNewRegion() {
        try {
            const response = await axios.get('newRegion', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });

            if (response.status === 200) {
                locations.value = response.data;
            }

            if (response.status === 401) {
                console.log('401 Unauthorized');
                localStorage.removeItem('authToken');

                await Swal.fire({
                    icon: 'info',
                    title: 'Session Expired',
                    text: 'Informing Session Expired. Logging In...',
                    showConfirmButton: false,
                    timer: 1500
                });

                const enccode = ref();
                const fullUrl = window.location.href;
                const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
                const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
                enccode.value = match ? match[1] : null;
                const empID = match2 ? match2[1] : null;

                if (empID && enccode.value) {
                    window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                } else {
                    console.error('empID or enccode is missing in localStorage');
                }

                return;
            }

            return response;
        } catch (err) {
            console.error(err);
            return err.response;
        }
    }

    async function getNewProvince() {
        try {
            const response = await axios.get('newProvince', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });

            if (response.status === 200) {
                locations.value = response.data;
            }

            if (response.status === 401) {
                console.log('401 Unauthorized');
                localStorage.removeItem('authToken');

                await Swal.fire({
                    icon: 'info',
                    title: 'Session Expired',
                    text: 'Informing Session Expired. Logging In...',
                    showConfirmButton: false,
                    timer: 1500
                });

                const enccode = ref();
                const fullUrl = window.location.href;
                const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
                const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
                enccode.value = match ? match[1] : null;
                const empID = match2 ? match2[1] : null;

                if (empID && enccode.value) {
                    window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                } else {
                    console.error('empID or enccode is missing in localStorage');
                }

                return;
            }

            return response;
        } catch (err) {
            console.error(err);
            return err.response;
        }
    }

    async function getNewCity() {
        try {
            const response = await axios.get('newCity', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });

            if (response.status === 200) {
                locations.value = response.data;
            }

            if (response.status === 401) {
                console.log('401 Unauthorized');
                localStorage.removeItem('authToken');

                await Swal.fire({
                    icon: 'info',
                    title: 'Session Expired',
                    text: 'Informing Session Expired. Logging In...',
                    showConfirmButton: false,
                    timer: 1500
                });

                const enccode = ref();
                const fullUrl = window.location.href;
                const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
                const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
                enccode.value = match ? match[1] : null;
                const empID = match2 ? match2[1] : null;

                if (empID && enccode.value) {
                    window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                } else {
                    console.error('empID or enccode is missing in localStorage');
                }

                return;
            }

            return response;
        } catch (err) {
            console.error(err);
            return err.response;
        }
    }

    async function getNewBarangay() {
        try {
            const response = await axios.get('newBarangay', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });

            if (response.status === 200) {
                locations.value = response.data;
            }

            if (response.status === 401) {
                console.log('401 Unauthorized');
                localStorage.removeItem('authToken');

                await Swal.fire({
                    icon: 'info',
                    title: 'Session Expired',
                    text: 'Informing Session Expired. Logging In...',
                    showConfirmButton: false,
                    timer: 1500
                });

                const enccode = ref();
                const fullUrl = window.location.href;
                const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
                const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
                enccode.value = match ? match[1] : null;
                const empID = match2 ? match2[1] : null;

                if (empID && enccode.value) {
                    window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                } else {
                    console.error('empID or enccode is missing in localStorage');
                }

                return;
            }

            return response;
        } catch (err) {
            console.error(err);
            return err.response;
        }
    }


    // console.log('token', localStorage.getItem('authToken'));

    // async function getRegions() {
    //     const response = await axios
    //         // .get(LOCATIONS_API_URL + 'regions', {
    //         .get('locations/regions', {
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //             }
    //         })
    //         .then((res) => {
    //             return res;
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             return err.response;
    //         });
    //     if (response.status == 200) {
    //         regions.value = response.data;
    //         // console.log('regions', regions);
    //     }
    //     if (response.status == 401) {
    //         console.log('401');
    //         localStorage.removeItem('authToken');
    //         router.push('/login');
    //     }
    //     // console.log('regions', regions);
    //     return response;
    // }

    function updateRegions(newRegions) {
        regions.value = newRegions;
        loadingProvinces.value = false;
        loadingCities.value = true;
        getProvinces(newRegions.old_regcode).then(() => {
            loadingProvinces.value = false;
        });
        getCities(newRegions.old_regcode).then(() => {
            loadingCities.value = false;
        });
    }

    function getRegions() {
        axios
            .get('locations/regions', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .then((response) => {
                if (response.status == 200) {
                    regions.value = response.data;
                }
                if (response.status == 401) {
                    // console.log('401');
                    localStorage.removeItem('authToken');
                    router.push('/login');
                }

                return response;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });
    }

    async function getAllCities() {
        axios
            .get('locations/cities', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .then((response) => {
                if (response.status == 200) {
                    citys.value = response.data;
                }
                if (response.status == 401) {
                    // console.log('401');
                    localStorage.removeItem('authToken');
                    router.push('/login');
                }
                // console.log('resp: ', response);

                return response;
            })

            .catch((err) => {
                console.error(err);
                return err.response;
            });
    }

    // async function getProvincesDesc() {
    //     const response = await axios
    //         .get('locations/provinceByRegionDesc', {
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //             },

    //         })
    //         .then((res) => {
    //             return res;
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             return err.response;
    //         });
    //     if (response.status === 200) {
    //         provinces.value = response.data;
    //         console.log('Fetched provinces:', provinces.value);
    //     }
    //     return response;
    // }

    // async function getCitiesDesc() {
    //     const response = await axios
    //         .get('locations/citiesByProvinceDesc', {
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //             },
    //         })
    //         .then((res) => {
    //             return res;
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             return err.response;
    //         });
    //     if (response.status === 200) {
    //         provinces.value = response.data;
    //         console.log('Fetched cities:', provinces.value);
    //     }
    //     return response;
    // }

    // async function getCitiesDesc() {
    //     const response = await axios
    //         .get('locations/citiesByProvinceDesc', {
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //             },
    //         })
    //         .then((res) => {
    //             return res;
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             return err.response;
    //         });
    //         if (response.status === 200) {
    //             // Ensure the response data is an array
    //             if (Array.isArray(response.data)) {
    //                 regions.value = response.data; // Set the regions data
    //             } else {
    //                 console.error('Expected an array but got:', response.data);
    //                 regions.value = []; // Reset to an empty array if the data is not as expected
    //             }
    //         }
    //     return response;
    // }
    // async function getProvincesDesc() {
    //     const response = await axios
    //         .get('locations/provinceByRegionDesc', {
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //             },

    //         })
    //         .then((res) => {
    //             return res;
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             return err.response;
    //         });
    //     if (response.status === 200) {
    //         // Ensure the response data is an array
    //         if (Array.isArray(response.data)) {
    //             regions.value = response.data; // Set the regions data
    //         } else {
    //             console.error('Expected an array but got:', response.data);
    //             regions.value = []; // Reset to an empty array if the data is not as expected
    //         }
    //     }
    //     return response;
    // }

    async function getProvinces(regcode) {
        if (regcode) {
            const response = await axios
                .get('locations/provinceByRegion', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    params: {
                        regcode: regcode
                    }
                })
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    console.error(err);
                    return err.response;
                });
            if (response.status == 200) {
                provinces.value = response.data;
                // console.log('regions', regions.value);
                // console.log('Fetched Provinces:', provinces.value);
            }
            if (response && response.status === 401) {
                // loading.value = false;
                console.log('401 Unauthorized');
                localStorage.removeItem('authToken');
                await Swal.fire({
                    icon: 'warning',
                    title: 'Session Expired',
                    text: 'Please Login Again',
                    confirmButtonText: 'OK'
                });
                // router.push('/auth/login').then(() => {
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
                if (empID && enccode) {
                    // window.location.href = `http://192.168.6.58:8000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                    window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                } else {
                    console.error('empID or enccode is missing in localStorage');
                }
                // });
                return;
            }

            // console.log('regions.value', regions.value);
            return response;
        }
    }

    async function getCities(provcode) {
        if (provcode) {
            const response = await axios
                // .get(LOCATIONS_API_URL + 'cityByProvince', {
                .get('locations/cityByProvince', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    params: {
                        provcode: provcode
                    }
                })
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    console.error(err);
                    return err.response;
                });
            if (response.status == 200) {
                citys.value = response.data;
                // console.log('regions', regions.value);
            }
            if (response && response.status === 401) {
                // loading.value = false;
                console.log('401 Unauthorized');
                localStorage.removeItem('authToken');

                await Swal.fire({
                    icon: 'warning',
                    title: 'Session Expired',
                    text: 'Please Login Again',
                    confirmButtonText: 'OK'
                });

                // router.push('/auth/login').then(() => {
                // window.location.reload();
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
                    window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                } else {
                    console.error('empID or enccode is missing in localStorage');
                }
                // });
                return;
            }

            // console.log('regions.value', regions.value);
            return response;
        }
    }

    async function getBgys(ctycode) {
        if (ctycode) {
            // console.log('ctycode', ctycode);

            const response = await axios
                // .get(LOCATIONS_API_URL + 'bgyByCity', {
                .get('locations/bgyByCity', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    },
                    params: {
                        ctycode: ctycode
                    }
                })
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    console.error(err);
                    return err.response;
                });
            if (response.status == 200) {
                bgys.value = response.data;
                // console.log('regions', regions.value);
            }
            if (response && response.status === 401) {
                // loading.value = false;
                console.log('401 Unauthorized');
                localStorage.removeItem('authToken');

                await Swal.fire({
                    icon: 'warning',
                    title: 'Session Expired',
                    text: 'Please Login Again',
                    confirmButtonText: 'OK'
                });

                // router.push('/auth/login').then(() => {
                // window.location.reload();
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
                if (empID && enccode) {
                    // window.location.href = `http://192.168.6.58:8000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                    window.location.href = `http://192.168.7.66:9000/api/fromEMR?empID=${empID}&enccode=${enccode.value}`;
                } else {
                    console.error('empID or enccode is missing in localStorage');
                }
                // });
                return;
            }

            // console.log('regions.value', regions.value);
            return response;
        }
    }
    /*
    async function getLocations() {
        const response = await axios
            .get('http://127.0.0.1:8000/api/locations', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });
        if (response.status == 200) {
            locations.value = response.data;

            // console.log('success: locations2', locations2);
            // console.log('success: locations', locations);
            // console.log('success: locations.value', locations.value);
        }
        return response;
    }

    function setRegions() {
        const keys = _.uniq(_.map(_.values(locations.value), 'regcode'));
        const values = _.uniq(_.map(_.values(locations.value), 'regname'));
        const arr = [];
        for (const key in keys) {
            arr.push(new Object({ regcode: keys[key], regname: values[key] }));
        }

        regions.value = arr;
        // return arr;
        // console.log('arr', arr);
        // console.log('...region.value', { ...region.value });
        // console.log('store regions.value', regions.value);
        return regions.value;
    }

    //create function to set provinces by region code

    function setProvinces(code) {
        //if code is undefined, return
        if (code === undefined) {
            return;
        }
        // console.log('code', code);
        const arr = [];
        const provs = _.values(locations.value);
        const keys = _.uniq(
            _.map(
                provs.filter((p) => p.regcode === code),
                'provcode'
            )
        );

        const values = _.uniq(
            _.map(
                provs.filter((p) => p.regcode === code),
                'provname'
            )
        );
        // console.log({ keys, values });
        for (const key in keys) {
            arr.push(new Object({ provcode: keys[key], provname: values[key] }));
        }

        provinces.value = arr.sort((a, b) => (a.provname > b.provname ? 1 : -1));
        // console.log('provinces', provinces);
        return arr;
    }
    function setCities(code) {
        if (code === undefined) {
            return;
        }
        const arr = [];
        const ctys = _.values(locations.value);
        const keys = _.uniq(
            _.map(
                ctys.filter((p) => p.provcode === code),
                'ctycode'
            )
        );

        const values = _.uniq(
            _.map(
                ctys.filter((p) => p.provcode === code),
                'ctyname'
            )
        );
        // console.log({ keys, values });
        for (const key in keys) {
            arr.push(new Object({ ctycode: keys[key], ctyname: values[key] }));
        }

        citys.value = arr;
        // console.log('citys', citys);
        return arr;
    }
    function setBgys(code) {
        if (code === undefined) {
            return;
        }
        const arr = [];
        const brgs = _.values(locations.value);
        const keys = _.uniq(
            _.map(
                brgs.filter((p) => p.ctycode === code),
                'bgycode'
            )
        );

        const values = _.uniq(
            _.map(
                brgs.filter((p) => p.ctycode === code),
                'bgyname'
            )
        );
        // console.log({ keys, values });
        for (const key in keys) {
            arr.push(new Object({ bgycode: keys[key], bgyname: values[key] }));
        }

        // bgys.value = arr;
        bgys.value = arr;
        // console.log('bgys', bgys);
    }
    */
    return {
        locations,

        regions,
        provinces,
        citys,
        bgys,
        getLocations,
        // setRegions,
        // setRegions2,
        // setProvinces,
        // setCities,
        // setBgys,

        getRegions,
        getProvinces,
        // getCitiesDesc,
        // getProvincesDesc,
        getCities,
        getBgys,
        getAllCities,
        getNewLocations,
        getNewRegion,
        getNewProvince,
        getNewCity,
        getNewBarangay,

        updateRegions,
        loadingCities,
        loadingProvinces
    };
});
// import { defineStore } from 'pinia';
// import axios from 'axios';
// import { ref } from 'vue';
// import { useRouter } from 'vue-router';

// // Debounce function to limit the frequency of API calls
// function debounce(func, delay) {
//     let timeout;
//     return function(...args) {
//         clearTimeout(timeout);
//         timeout = setTimeout(() => {
//             func.apply(this, args);
//         }, delay);
//     };
// }

// export const useLocationsStore = defineStore('locationsStore', () => {
//     const locations = ref({});
//     const router = useRouter();
//     const regions = ref({});
//     const provinces = ref({});
//     const citys = ref({});
//     const bgys = ref({});

//     const loadingProvinces = ref(false);
//     const loadingCities = ref(false);

//     // Cache for provinces and cities
//     const provinceCache = ref({});
//     const cityCache = ref({});

//     // Function to update regions and fetch related provinces and cities
//     function updateRegions(newRegions) {
//         regions.value = newRegions;
//         loadingProvinces.value = true;
//         loadingCities.value = true;
//         debouncedGetProvinces(newRegions.regcode).then(() => {
//             loadingProvinces.value = false;
//         });
//         debouncedGetCities(newRegions.regcode).then(() => {
//             loadingCities.value = false;
//         });
//     }

//     // Debounced versions of getProvinces and getCities
//     const debouncedGetProvinces = debounce(getProvinces, 300);
//     const debouncedGetCities = debounce(getCities, 300);

//     // Function to get regions from the API
//     function getRegions() {
//         axios
//             .get('locations/regions', {
//                 headers: {
//                     Authorization: 'Bearer ' + localStorage.getItem('authToken')
//                 }
//             })
//             .then((response) => {
//                 if (response.status == 200) {
//                     regions.value = response.data;
//                 }
//                 if (response.status == 401) {
//                     console.log('401');
//                     localStorage.removeItem('authToken');
//                     router.push('/login');
//                 }
//                 return response;
//             })
//             .catch((err) => {
//                 console.error(err);
//                 return err.response;
//             });
//     }

//     // Function to get provinces by region code with caching
//     async function getProvinces(regcode) {
//         // Check if the provinces for this regcode are already cached
//         if (provinceCache.value[regcode]) {
//             provinces.value = provinceCache.value[regcode];
//             return;
//         }

//         const response = await axios.get('locations/provinceByRegion', {
//             headers: {
//                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
//             },
//             params: {
//                 regcode: regcode
//             }
//         });

//         if (response.status == 200) {
//             provinces.value = response.data;
//             provinceCache.value[regcode] = response.data; // Cache the result
//         }
//         return response;
//     }

//     // Function to get cities by province code with caching
//     async function getCities(provcode) {
//         // Check if the cities for this provcode are already cached
//         if (cityCache.value[provcode]) {
//             citys.value = cityCache.value[provcode];
//             return;
//         }

//         const response = await axios.get('locations/cityByProvince', {
//             headers: {
//                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
//             },
//             params: {
//                 provcode: provcode
//             }
//         });

//         if (response.status == 200) {
//             citys.value = response.data;
//             cityCache.value[provcode] = response.data; // Cache the result
//         }
//         return response;
//     }

//     // Function to get barangays by city code
//     async function getBgys(ctycode) {
//         const response = await axios.get('locations/bgyByCity', {
//             headers: {
//                 Authorization: 'Bearer ' + localStorage.getItem('authToken')
//             },
//             params: {
//                 ctycode: ctycode
//             }
//         });

//         if (response.status == 200) {
//             bgys.value = response.data;
//         }
//         return response;
//     }

//     return {
//         locations,
//         regions,
//         provinces,
//         citys,
//         bgys,
//         getRegions,
//         getProvinces,
//         getCities,
//         getBgys,
//         updateRegions,
//         loadingCities,
//         loadingProvinces
//     };
// });
