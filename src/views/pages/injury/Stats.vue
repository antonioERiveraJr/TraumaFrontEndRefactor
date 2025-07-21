<script>
import { ref, watch, computed, onMounted } from 'vue';
import Calendar from 'primevue/calendar';
// import { useLocationsStore } from '../../../../store/general/LocationsStore';
import { useLocationsStore } from '../../../store/general/LocationsStore';
// import Toast from 'primevue/toast';
// import InjuryList from '../../../components/app/injury/InjuryList.vue';
import moment from 'moment';
// import axios from 'axios';
// import Button from 'primevue/button';
import Swal from 'sweetalert2';
import axios from 'axios';
import InjuryService from '../../../service/InjuryService';
import Column from 'primevue/column';
import { usePatientStore } from '../../../store/injury/PatientStore';
// import Divider from 'primevue/divider';
import LibraryService from '@/service/LibraryService';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
// import { filter } from 'lodash';
// import InjuryByExternal from '../../../components/graphs/injuryByExternal.vue';
// import TabPanel from 'primevue/tabpanel';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

export default {
    components: {
        Calendar,
        // InjuryList,
        // InjuryByExternal,
        Column
    },

    setup() {
        const libraryService = new LibraryService();

        const router = useRouter();
        const startDate = ref(moment().subtract(7, 'days').toDate());
        const endDate = ref(moment().toDate());
        const patientStore = usePatientStore();
        const toast = useToast();
        const position = ref('center');
        const locationsStore = useLocationsStore();
        const visible = ref(false);
        // const selectedSex = ref();
        // const ageFrom = ref(null);
        // const ageTo = ref(null);
        const dateFrom = ref(new Date(new Date().setDate(new Date().getDate() - 7)));
        const dateTo = ref(new Date());
        const loading = ref(false);
        const listDialogVisible = ref(false);
        const dataTableVisible = ref();
        const filterModel = ref([]);
        const ageFrom = ref(0);
        const ageTo = ref(100);
        const selectedSex = ref([]);
        const selectedExternal = ref([]);
        const selectedPreAdmission = ref([]);
        const selectedInjuryIntent = ref([]);
        const selectedStatusList = ref([]);
        const selectedPlaceOfOccurence = ref([]);
        const selectedActivityList = ref([]);
        const loadingProvinces = ref(false);
        const selectedFirstAid = ref([]);
        const selectedSafety = ref([]);
        const selectedRisk = ref([]);
        const selectedRegion = ref();
        const selectedProvince = ref();
        const selectedCity = ref();
        const selectedBarangay = ref();

        dateFrom.value = moment(dateFrom.value).format('YYYY-MM-DD');
        dateTo.value = moment(dateTo.value).format('YYYY-MM-DD');
        // var response = null;
        const filteredReportData = computed(() => {
            const hasSelectedExternal = selectedExternal.value.length > 0;
            const hasSelectedSex = selectedSex.value.length > 0;
            const hasSelectedPreAdmission = selectedPreAdmission.value.length > 0;
            const hasSelectedInjuryIntent = selectedInjuryIntent.value.length > 0;
            const hasSelectedStatus = selectedStatusList.value.length > 0;
            const hasSelectedPlaceOfOccurrence = selectedPlaceOfOccurence.value.length > 0;
            const hasSelectedActivity = selectedActivityList.value.length > 0;
            const hasSelectedFirstAid = selectedFirstAid.value.length > 0;
            const hasSelectedRegion = selectedRegion.value !== undefined && selectedRegion.value !== null && selectedRegion.value !== '';
            const hasSelectedProvince = selectedProvince.value !== undefined && selectedProvince.value !== null && selectedProvince.value !== '';
            const hasSelectedCity = selectedCity.value !== undefined && selectedCity.value !== null && selectedCity.value !== '';
            const hasSelectedBarangay = selectedBarangay.value !== undefined && selectedBarangay.value !== null && selectedBarangay.value !== '';
            const hasSelectedSafety = selectedSafety.value.length > 0;
            const hasSelectedRisk = selectedRisk.value.length > 0;

            // console.log('selectedRegion:', selectedRegion);
            // console.log('selectedProvince:', selectedProvince);
            // console.log('selectedCity:', selectedCity);a
            // console.log('selectedBarangay:', selectedBarangay);

            return reportData.value.filter((item) => {
                // check for safety
                const safetyMatch = hasSelectedSafety
                    ? selectedSafety.value.some((selected) => {
                          const safetyCode = selected.codep;
                          return item.details && item.details.forTransportVehicularAccident && item.details.forTransportVehicularAccident[safetyCode] === 'Y';
                      })
                    : true;

                // check for risk
                const riskMatch = hasSelectedRisk
                    ? selectedRisk.value.some((selected) => {
                          const riskyCode = selected.code;
                          return item.details && item.details.forTransportVehicularAccident && item.details.forTransportVehicularAccident[riskyCode] === 'Y';
                      })
                    : true;

                // Check for external causes
                const externalMatch = hasSelectedExternal
                    ? selectedExternal.value.some((selected) => {
                          const externalCauseCode = selected.code;
                          return item.details && item.details.ExternalCauseOfInjury && item.details.ExternalCauseOfInjury[externalCauseCode] === 'Y';
                      })
                    : true;

                // Check for age
                const ageMatch = (ageFrom.value === null || item.header.patage >= ageFrom.value) && (ageTo.value === null || item.header.patage <= ageTo.value);

                // Check for gender
                const genderMatch = hasSelectedSex
                    ? selectedSex.value.some((selected) => {
                          const genderCode = selected.code;
                          return item.header && item.header.patsex === genderCode;
                      })
                    : true;

                // Check for preadmission data
                const preAdmissionMatch = hasSelectedPreAdmission
                    ? selectedPreAdmission.value.some((selected) => {
                          const preAdmissionCode = selected.code;
                          return item.details && item.details.natureOfInjury && item.details.natureOfInjury[preAdmissionCode] === 'Y';
                      })
                    : true;

                // Check for injury intent
                const injuryIntentMatch = hasSelectedInjuryIntent
                    ? selectedInjuryIntent.value.some((selected) => {
                          const injuryIntentCode = selected.code;
                          return item.details && item.details.preAdmissionData && item.details.preAdmissionData.inj_intent_code === injuryIntentCode;
                      })
                    : true;

                // Check for status
                const statusMatch = hasSelectedStatus
                    ? selectedStatusList.value.some((selected) => {
                          const statusCode = selected.code;
                          return item.details && item.details.hospitalFacilityData && item.details.hospitalFacilityData.status_code === statusCode;
                      })
                    : true;

                // Check for place of occurrence
                const placeOfOccurrenceMatch = hasSelectedPlaceOfOccurrence
                    ? selectedPlaceOfOccurence.value.some((selected) => {
                          const placeCode = selected.code;
                          return item.details && item.details.preAdmissionData && item.details.preAdmissionData.place_occ_code === placeCode;
                      })
                    : true;

                //check regions
                const regionMatch = hasSelectedRegion ? item.details && item.details.generalData && item.details.generalData.plc_regcode === selectedRegion.value : true;
                // console.log('hasSelectedRegion:', hasSelectedRegion, 'regionMatch:', regionMatch);

                // Check for province
                const provinceMatch = hasSelectedProvince ? item.details && item.details.generalData && item.details.generalData.plc_provcode === selectedProvince.value : true;

                // Check for city
                const cityMatch = hasSelectedCity ? item.details && item.details.generalData && item.details.generalData.plc_ctycode === selectedCity.value : true;
                // Check for barangay
                const barangayMatch = hasSelectedBarangay ? item.details && item.details.generalData && item.details.generalData.plc_bgycode === selectedBarangay.value : true;
                // Check for activity
                const activityMatch = hasSelectedActivity
                    ? selectedActivityList.value.some((selected) => {
                          const activityCode = selected.code;
                          return item.details && item.details.preAdmissionData && item.details.preAdmissionData.activity_code === activityCode;
                      })
                    : true;

                // Check for first aid given
                const firstAidMatch = hasSelectedFirstAid
                    ? selectedFirstAid.value.some((selected) => {
                          const firstAidCode = selected.code;
                          return item.details && item.details.preAdmissionData && item.details.preAdmissionData.first_aid_code === firstAidCode;
                      })
                    : true;

                // Combine all the matches
                return (
                    externalMatch &&
                    ageMatch &&
                    genderMatch &&
                    preAdmissionMatch &&
                    injuryIntentMatch &&
                    statusMatch &&
                    regionMatch &&
                    placeOfOccurrenceMatch &&
                    provinceMatch &&
                    cityMatch &&
                    barangayMatch &&
                    activityMatch &&
                    firstAidMatch &&
                    safetyMatch &&
                    riskMatch
                );
            });
        });

        const reportData = ref([]);
        // const filteredData = computed(() => {
        //     return reportData.value.filter(item => {

        //         const patage = item.header.patage;
        //         const patsex = item.header.patsex;
        //         const injrem = item.header.injrem;

        //         const isSexMatch = selectedSex.value && selectedSex.value.code !== 'All'
        //             ? patsex === selectedSex.value.code
        //             : true; const isAgeMatch = (ageFrom.value === null || patage >= ageFrom.value) &&
        //                 (ageTo.value === null || patage <= ageTo.value);

        //         const isNOIMatch = selectedNOI.value
        //             ? injrem && new RegExp(`\\b${selectedNOI.value.toLowerCase()}\\b`).test(injrem.toLowerCase())
        //             : true;

        //         // console.log('vals: ', patage, patsex, injrem, isSexMatch, isAgeMatch, isNOIMatch);
        //         return isSexMatch && isAgeMatch && isNOIMatch;
        //     });
        // });;

        const filteredDataTest = computed(() => {
            return reportData.value.filter((item) => {
                return item.details && item.details.ExternalCauseOfInjury && item.details.ExternalCauseOfInjury.ext_burn_r === 'Y';
            });
        });

        const totalReports = computed(() => reportData.value.length);

        // const filteredReports = computed(() => filteredData.value.length);

        const maleCount = computed(() => reportData.value.filter((item) => item.header.patsex === 'M').length);
        const femaleCount = computed(() => reportData.value.filter((item) => item.header.patsex === 'F').length);
        // const filteredMaleCount = computed(() => filteredData.value.filter(item => item.header.patsex === 'M').length);
        // const filteredFemaleCount = computed(() => filteredData.value.filter(item => item.header.patsex === 'F').length);

        // const selectedNOI = ref();

        const gender = ref([
            { sex: 'Male', code: 'M' },
            { sex: 'Female', code: 'F' },
            { sex: 'All', code: 'All' }
        ]);

        const isRefreshDisabled = computed(
            () =>
                //     selectedSex.value === null ||
                //     ageFrom.value === null ||
                //     ageTo.value === null ||
                //     selectedNOI.value === null ||
                dateTo.value === null || dateFrom.value === null
        );

        const openPosition = (pos) => {
            position.value = pos;
            visible.value = true;
        };

        const generateReport = async () => {
            loading.value = true;
            try {
                // console.log('lastFrom : ', dateFrom);

                const formattedStartDate = moment(new Date(dateFrom.value)).format('YYYY-MM-DD');
                const formattedEndDate = moment(new Date(dateTo.value)).format('YYYY-MM-DD');

                const injuryService = new InjuryService();
                const response = await injuryService.reportList(true, formattedStartDate, formattedEndDate, null);

                if (response && response.status === 401) {
                    loading.value = false;
                    console.log('401 Unauthorized');
                    localStorage.removeItem('authToken');

                    await Swal.fire({
                        icon: 'warning',
                        title: 'Session Expired',
                        text: 'Please Login Again',
                        confirmButtonText: 'OK'
                    });

                    router.push('/auth/login').then(() => {
                        window.location.reload();
                    });
                    return;
                }
                reportData.value = response.data;
                dataTableVisible.value = true;
                loading.value = false;
            } catch (error) {
                console.error('Error fetching report data:', error);
                toast.value.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Could not fetch report data.',
                    life: 3000
                });
                loading.value = false;
            }
        };
        const monthlyInjuryStats = computed(() => {
            const monthlyCounts = {};
            reportData.value.forEach((item) => {
                const injuryDate = moment(new Date(item.header.admdate));
                const monthYear = injuryDate.format('YYYY-MM');

                if (!monthlyCounts[monthYear]) {
                    monthlyCounts[monthYear] = 0;
                }
                monthlyCounts[monthYear]++;
            });

            const totalInjuries = totalReports.value;
            const monthlyStats = Object.entries(monthlyCounts).map(([month, count]) => ({
                month,
                count,
                percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0
            }));

            return monthlyStats;
        });
        // const monthlyInjuryStatsFiltered = computed(() => {
        //     const monthlyCounts = {};
        //     filteredData.value.forEach(item => {
        //         const injuryDate = moment(item.header.admdate);
        //         const monthYear = injuryDate.format('YYYY-MM');

        //         if (!monthlyCounts[monthYear]) {
        //             monthlyCounts[monthYear] = 0;
        //         }
        //         monthlyCounts[monthYear]++;
        //     });

        //     const totalInjuries = filteredReports.value;
        //     const monthlyStats = Object.entries(monthlyCounts).map(([month, count]) => ({
        //         month,
        //         count,
        //         percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0,
        //     }));

        //     return monthlyStats;
        // });

        const dispositionInjuryStats = computed(() => {
            const dispositionCounts = {};
            reportData.value.forEach((item) => {
                const dispCode = libraryService.getDispositionCode(item.header.dispcode); // Get the dispcode
                if (item.details && item.details.ExternalCauseOfInjury) {
                    // console.log('hoy: ', item.details.ExternalCauseOfInjury.ext_bite);
                }
                // else {
                //     console.warn('Item details or ExternalCauseOfInjury is null:', item);
                // }
                if (!dispositionCounts[dispCode]) {
                    dispositionCounts[dispCode] = 0;
                }
                dispositionCounts[dispCode]++;
            });

            const totalInjuries = totalReports.value;
            const monthlyStats = Object.entries(dispositionCounts).map(([dispCode, count]) => ({
                dispCode,
                count,
                percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0
            }));

            return monthlyStats;
        });

        // const dispositionInjuryStatsFiltered = computed(() => {
        //     const dispositionCounts = {};
        //     filteredData.value.forEach(item => {
        //         const dispCode = libraryService.getDispositionCode(item.header.dispcode);
        //         if (!dispositionCounts[dispCode]) {
        //             dispositionCounts[dispCode] = 0;
        //         }
        //         dispositionCounts[dispCode]++;
        //     });

        //     const totalInjuries = filteredReports.value;
        //     const monthlyStats = Object.entries(dispositionCounts).map(([dispCode, count]) => ({
        //         dispCode,
        //         count,
        //         percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0,
        //     }));

        //     return monthlyStats;
        // });

        const outcomeInjuryStats = computed(() => {
            const outcomeCounts = {};
            reportData.value.forEach((item) => {
                const condCode = libraryService.getOutcomeCode(item.header.condcode);
                if (!outcomeCounts[condCode]) {
                    outcomeCounts[condCode] = 0;
                }
                outcomeCounts[condCode]++;
            });

            const totalInjuries = totalReports.value;
            const monthlyStats = Object.entries(outcomeCounts).map(([condCode, count]) => ({
                condCode,
                count,
                percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0
            }));

            return monthlyStats;
        });

        // const outcomeInjuryStatsFiltered = computed(() => {
        //     const outcomeCounts = {};
        //     filteredData.value.forEach(item => {
        //         const condCode = libraryService.getOutcomeCode(item.header.condcode);
        //         if (!outcomeCounts[condCode]) {
        //             outcomeCounts[condCode] = 0;
        //         }
        //         outcomeCounts[condCode]++;
        //     });

        //     const totalInjuries = filteredReports.value;
        //     const monthlyStats = Object.entries(outcomeCounts).map(([condCode, count]) => ({
        //         condCode,
        //         count,
        //         percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0,
        //     }));

        //     return monthlyStats;
        // });

        const value = ref('Date of Injury');
        const options = ref(['Date of Injury', 'Date of Consultation']);

        const savedStartDate = ref(null);
        const savedEndDate = ref(null);

        watch(value, (newValue) => {
            value.value = newValue;
        });
        watch(startDate, (newStartDate) => {
            startDate.value = newStartDate;
        });

        let warningShown = false;

        watch(dateFrom, (newDateFrom) => {
            dateFrom.value = moment(new Date(newDateFrom)).format('MM/DD/YYYY');
        });

        watch(dateTo, (newDateTo) => {
            dateTo.value = moment(new Date(newDateTo)).format('MM/DD/YYYY');
        });
        watch(endDate, (newEndDate) => {
            if (!startDate.value) {
                if (!warningShown) {
                    toast.value.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'Please select a start date first.',
                        life: 3000
                    });
                    warningShown = true;
                }
                endDate.value = null;
                return;
            } else {
                warningShown = false;
            }

            const formattedEndDate = moment(newEndDate).format('MM/DD/YYYY');
            const formattedStartDate = moment(startDate.value).format('MM/DD/YYYY');
            console.log('newend :', formattedEndDate);

            savedEndDate.value = formattedEndDate;

            savedStartDate.value = formattedStartDate;
        });

        const totalInjury = computed(() => {
            return [
                {
                    label: 'Males ',
                    count: maleCount.value,
                    percentage: `${((maleCount.value / totalReports.value) * 100).toFixed(1)}%`
                },
                {
                    label: 'Females ',
                    count: femaleCount.value,
                    percentage: `${((femaleCount.value / totalReports.value) * 100).toFixed(1)}%`
                },
                {
                    label: 'Total ',
                    count: totalReports.value,
                    percentage: ''
                }
            ];
        });

        // const filteredStatistics = computed(() => {
        //     return [

        //         {
        //             label: 'Males ',
        //             count: filteredMaleCount.value,
        //             percentage: filteredReports.value ? ((filteredMaleCount.value / filteredReports.value) * 100).toFixed(1) + '%' : '0%'
        //         },
        //         {
        //             label: 'Females ',
        //             count: filteredFemaleCount.value,
        //             percentage: filteredReports.value ? ((filteredFemaleCount.value / filteredReports.value) * 100).toFixed(1) + '%' : '0%'
        //         },
        //         {
        //             label: 'Total ',
        //             count: filteredReports.value,
        //             percentage: totalReports.value ? ((filteredReports.value / totalReports.value) * 100).toFixed(1) + '%' : '0%'
        //         },
        //     ];
        // });

        const externalCauseCounts = computed(() => {
            const counts = {
                bites: 0,
                burns: 0,
                chemicals: 0,
                sharpObjects: 0,
                drownings: 0,
                exposures: 0,
                fall: 0,
                firecrackers: 0,
                vape: 0,
                gunshot: 0,
                hanging: 0,
                mauling: 0,
                transportAccidents: 0,
                sexualAssaults: 0,
                others: 0
            };

            reportData.value.forEach((item) => {
                const injuryDetails = item.details && item.details.ExternalCauseOfInjury;
                // console.log('hey: ', injuryDetails);
                // console.log(item.enccode);

                if (injuryDetails) {
                    if (injuryDetails.ext_bite === 'Y') counts.bites++;
                    if (injuryDetails.ext_burn_r === 'Y') counts.burns++;
                    if (injuryDetails.ext_chem === 'Y') counts.chemicals++;
                    if (injuryDetails.ext_sharp === 'Y') counts.sharpObjects++;
                    if (injuryDetails.ext_drown_r === 'Y') counts.drownings++;
                    if (injuryDetails.ext_expo_nature_r === 'Y') counts.exposures++;
                    if (injuryDetails.ext_fall === 'Y') counts.fall++;
                    if (injuryDetails.ext_firecracker_r === 'Y') counts.firecrackers++;
                    if (injuryDetails.ext_vape === 'Y') counts.vape++;
                    if (injuryDetails.ext_gun === 'Y') counts.gunshot++;
                    if (injuryDetails.ext_hang === 'Y') counts.hanging++;
                    if (injuryDetails.ext_maul === 'Y') counts.mauling++;
                    if (injuryDetails.ext_transport === 'Y') counts.transportAccidents++;
                    if (injuryDetails.ext_sexual === 'Y') counts.sexualAssaults++;
                    if (injuryDetails.ext_other === 'Y') counts.others++;
                }
            });

            return counts;
        });

        // const filteredExternalCauseCounts = computed(() => {
        //     const counts = {
        //         bites: 0,
        //         burns: 0,
        //         chemicals: 0,
        //         sharpObjects: 0,
        //         drownings: 0,
        //         exposures: 0,
        //         fall: 0,
        //         firecrackers: 0,
        //         vape: 0,
        //         gunshot: 0,
        //         hanging: 0,
        //         mauling: 0,
        //         transportAccidents: 0,
        //         sexualAssaults: 0,
        //         others: 0
        //     };

        //     filteredData.value.forEach(item => {
        //         const injuryDetails = item.details && item.details.ExternalCauseOfInjury;
        //         // console.log('hey: ', injuryDetails);

        //         if (injuryDetails) {
        //             if (injuryDetails.ext_bite === 'Y') counts.bites++;
        //             if (injuryDetails.ext_burn_r === 'Y') counts.burns++;
        //             if (injuryDetails.ext_chem === 'Y') counts.chemicals++;
        //             if (injuryDetails.ext_sharp === 'Y') counts.sharpObjects++;
        //             if (injuryDetails.ext_drown_r === 'Y') counts.drownings++;
        //             if (injuryDetails.ext_expo_nature_r === 'Y') counts.exposures++;
        //             if (injuryDetails.ext_fall === 'Y') counts.fall++;
        //             if (injuryDetails.ext_firecracker_r === 'Y') counts.firecrackers++;
        //             if (injuryDetails.ext_vape === 'Y') counts.vape++;
        //             if (injuryDetails.ext_gun === 'Y') counts.gunshot++;
        //             if (injuryDetails.ext_hang === 'Y') counts.hanging++;
        //             if (injuryDetails.ext_maul === 'Y') counts.mauling++;
        //             if (injuryDetails.ext_transport === 'Y') counts.transportAccidents++;
        //             if (injuryDetails.ext_sexual === 'Y') counts.sexualAssaults++;
        //             if (injuryDetails.ext_other === 'Y') counts.others++;
        //         }
        //     });

        //     return counts;
        // });
        const injuryByPlaceOfOccurrence = computed(() => {
            const placeCounts = {};
            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const placeCode = libraryService.getPlaceCode(item.details.preAdmissionData.place_occ_code); // Adjust based on actual data structure
                    if (placeCode) {
                        if (!placeCounts[placeCode]) {
                            placeCounts[placeCode] = 0;
                        }
                        placeCounts[placeCode]++;
                    }
                }
            });

            return Object.entries(placeCounts).map(([placeCode, count]) => ({
                placeCode,
                count
            }));
        });

        // const injuryByPlaceOfOccurrenceFiltered = computed(() => {
        //     const placeCounts = {};
        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const placeCode = libraryService.getPlaceCode(item.details.preAdmissionData.place_occ_code); // Adjust based on actual data structure
        //             if (placeCode) {
        //                 if (!placeCounts[placeCode]) {
        //                     placeCounts[placeCode] = 0;
        //                 }
        //                 placeCounts[placeCode]++;
        //             }
        //         }
        //     });

        //     return Object.entries(placeCounts).map(([placeCode, count]) => ({
        //         placeCode,
        //         count,
        //     }));
        // });

        const injuryByPreAdmission = computed(() => {
            const counts = {
                abrasion: 0,
                burns: 0,
                avulsion: 0,
                concussion: 0,
                contusion: 0,
                fractureOpen: 0,
                fractureClosed: 0,
                openWound: 0,
                amputation: 0,
                others: 0
            };

            reportData.value.forEach((item) => {
                const injuryDetails = item.details && item.details.natureOfInjury;

                if (injuryDetails) {
                    if (injuryDetails.noi_abrasion === 'Y') counts.abrasion++;
                    if (injuryDetails.noi_burn_r === 'Y') counts.burns++;
                    if (injuryDetails.noi_avulsion === 'Y') counts.avulsion++;
                    if (injuryDetails.noi_concussion === 'Y') counts.concussion++;
                    if (injuryDetails.noi_contusion === 'Y') counts.contusion++;
                    if (injuryDetails.noi_frac_ope === 'Y') counts.fractureOpen++;
                    if (injuryDetails.noi_frac_clo === 'Y') counts.fractureClosed++;
                    if (injuryDetails.noi_owound === 'Y') counts.openWound++;
                    if (injuryDetails.noi_amp === 'Y') counts.amputation++;
                    if (injuryDetails.noi_others === 'Y') counts.others++;
                }
            });

            return counts;
        });

        // const injuryByPreAdmissionFiltered = computed(() => {
        //     const counts = {
        //         abrasion: 0,
        //         burns: 0,
        //         avulsion: 0,
        //         concussion: 0,
        //         contusion: 0,
        //         fractureOpen: 0,
        //         fractureClosed: 0,
        //         openWound: 0,
        //         amputation: 0,
        //         others: 0
        //     };

        //     filteredData.value.forEach(item => {
        //         const injuryDetails = item.details && item.details.natureOfInjury;

        //         if (injuryDetails) {
        //             if (injuryDetails.noi_abrasion === 'Y') counts.abrasion++;
        //             if (injuryDetails.noi_burn_r === 'Y') counts.burns++;
        //             if (injuryDetails.noi_avulsion === 'Y') counts.avulsion++;
        //             if (injuryDetails.noi_concussion === 'Y') counts.concussion++;
        //             if (injuryDetails.noi_contusion === 'Y') counts.contusion++;
        //             if (injuryDetails.noi_frac_ope === 'Y') counts.fractureOpen++;
        //             if (injuryDetails.noi_frac_clo === 'Y') counts.fractureClosed++;
        //             if (injuryDetails.noi_owound === 'Y') counts.openWound++;
        //             if (injuryDetails.noi_amp === 'Y') counts.amputation++;
        //             if (injuryDetails.noi_others === 'Y') counts.others++;
        //         }
        //     });

        //     return counts;
        // });

        const injuryBySafety = computed(() => {
            const counts = {
                none: 0,
                unknown: 0,
                airbag: 0,
                helmet: 0,
                childseat: 0,
                seatbelt: 0,
                vest: 0,
                other: 0
            };

            reportData.value.forEach((item) => {
                const safetyDetails = item.details && item.details.forTransportVehicularAccident;

                if (safetyDetails) {
                    if (safetyDetails.safe_none === 'Y') counts.none++;
                    if (safetyDetails.safe_unkn === 'Y') counts.unknown++;
                    if (safetyDetails.safe_airbag === 'Y') counts.airbag++;
                    if (safetyDetails.safe_helmet === 'Y') counts.helmet++;
                    if (safetyDetails.safe_cseat === 'Y') counts.childseat++;
                    if (safetyDetails.safe_sbelt === 'Y') counts.seatbelt++;
                    if (safetyDetails.safe_vest === 'Y') counts.vest++;
                    if (safetyDetails.safe_other === 'Y') counts.other++;
                }
            });

            return counts;
        });

        // const injuryBySafetyFiltered = computed(() => {
        //     const counts = {
        //         none: 0,
        //         unknown: 0,
        //         airbag: 0,
        //         helmet: 0,
        //         childseat: 0,
        //         seatbelt: 0,
        //         vest: 0,
        //         other: 0,
        //     };

        //     filteredData.value.forEach(item => {
        //         const safetyDetails = item.details && item.details.forTransportVehicularAccident;

        //         if (safetyDetails) {
        //             if (safetyDetails.safe_none === 'Y') counts.none++;
        //             if (safetyDetails.safe_unkn === 'Y') counts.unknown++;
        //             if (safetyDetails.safe_airbag === 'Y') counts.airbag++;
        //             if (safetyDetails.safe_helmet === 'Y') counts.helmet++;
        //             if (safetyDetails.safe_cseat === 'Y') counts.childseat++;
        //             if (safetyDetails.safe_sbelt === 'Y') counts.seatbelt++;
        //             if (safetyDetails.safe_vest === 'Y') counts.vest++;
        //             if (safetyDetails.safe_other === 'Y') counts.other++;
        //         }
        //     });

        //     return counts;
        // });

        const injuryByRiskFactor = computed(() => {
            const counts = {
                alcohol: 0,
                sleepy: 0,
                smoking: 0,
                using_mobile: 0,
                other: 0
            };

            reportData.value.forEach((item) => {
                const riskDetails = item.details && item.details.forTransportVehicularAccident;

                if (riskDetails) {
                    if (riskDetails.risk_alcliq === 'Y') counts.alcohol++;
                    if (riskDetails.risk_sleep === 'Y') counts.sleepy++;
                    if (riskDetails.risk_smoke === 'Y') counts.smoking++;
                    if (riskDetails.risk_mobpho === 'Y') counts.using_mobile++;
                    if (riskDetails.risk_other === 'Y') counts.other++;
                }
            });

            return counts;
        });

        // const injuryByRiskFactorFiltered = computed(() => {
        //     const counts = {
        //         alcohol: 0,
        //         sleepy: 0,
        //         smoking: 0,
        //         using_mobile: 0,
        //         other: 0,
        //     };

        //     filteredData.value.forEach(item => {
        //         const riskDetails = item.details && item.details.forTransportVehicularAccident;

        //         if (riskDetails) {
        //             if (riskDetails.risk_alcliq === 'Y') counts.alcohol++;
        //             if (riskDetails.risk_sleep === 'Y') counts.sleepy++;
        //             if (riskDetails.risk_smoke === 'Y') counts.smoking++;
        //             if (riskDetails.risk_mobpho === 'Y') counts.using_mobile++;
        //             if (riskDetails.risk_other === 'Y') counts.other++;
        //         }
        //     });

        //     return counts;
        // });

        const injuryByActivity = computed(() => {
            const activityCounts = {};
            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const activityCode = item.details.preAdmissionData.activity_code;
                    const activityDescription = libraryService.getActivityCode(activityCode);
                    if (activityDescription) {
                        if (!activityCounts[activityDescription]) {
                            activityCounts[activityDescription] = 0;
                        }
                        activityCounts[activityDescription]++;
                    }
                }
            });

            return Object.entries(activityCounts).map(([activityCode, count]) => ({
                activityCode,
                count
            }));
        });

        // const injuryByActivityFiltered = computed(() => {
        //     const activityCounts = {};
        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const activityCode = item.details.preAdmissionData.activity_code;
        //             const activityDescription = libraryService.getActivityCode(activityCode);
        //             if (activityDescription) {
        //                 if (!activityCounts[activityDescription]) {
        //                     activityCounts[activityDescription] = 0;
        //                 }
        //                 activityCounts[activityDescription]++;
        //             }
        //         }
        //     });

        //     return Object.entries(activityCounts).map(([activityCode, count]) => ({
        //         activityCode,
        //         count,
        //     }));
        // });

        const injuryByIntent = computed(() => {
            const intentCounts = {};
            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const intentCode = item.details.preAdmissionData.inj_intent_code;
                    const intentDescription = libraryService.getInjuryIntentsCode(intentCode);
                    if (intentDescription) {
                        if (!intentCounts[intentDescription]) {
                            intentCounts[intentDescription] = 0;
                        }
                        intentCounts[intentDescription]++;
                    }
                }
            });

            return Object.entries(intentCounts).map(([intentCode, count]) => ({
                intentCode,
                count
            }));
        });

        // const injuryByIntentFiltered = computed(() => {
        //     const intentCounts = {};
        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const intentCode = item.details.preAdmissionData.inj_intent_code;
        //             const intentDescription = libraryService.getInjuryIntentsCode(intentCode);
        //             if (intentDescription) {
        //                 if (!intentCounts[intentDescription]) {
        //                     intentCounts[intentDescription] = 0;
        //                 }
        //                 intentCounts[intentDescription]++;
        //             }
        //         }
        //     });

        //     return Object.entries(intentCounts).map(([intentCode, count]) => ({
        //         intentCode,
        //         count,
        //     }));
        // });

        const regions = ref([]);

        async function getRegions() {
            try {
                const response = await axios.get('locations/regions', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                });

                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        regions.value = response.data;
                    } else {
                        console.error('Expected an array but got:', response.data);
                        regions.value = [];
                    }
                } else if (response.status === 401) {
                    console.log('401 Unauthorized');
                    localStorage.removeItem('authToken');
                    router.push('/login');
                }
            } catch (err) {
                console.error('Error fetching regions:', err);
            }
        }
        async function loadLocations() {
            // console.log('hit', selectedRegion);

            await locationsStore.getRegions();
            await locationsStore.getProvinces(selectedRegion.value);
            await locationsStore.getCities(selectedProvince.value);
            await locationsStore.getBgys(selectedCity.value);
        }
        onMounted(async () => {
            await loadLocations();
            await getRegions();
            await getProvincesDesc();
            await getCitiesDesc();
        });
        watch(
            () => patientStore.details.generalData.plc_regcode,
            async (newRegionCode) => {
                if (newRegionCode) {
                    loadingProvinces.value = true;
                    patientStore.details.generalData.plc_provcode = null;
                    patientStore.details.generalData.plc_ctycode = null;
                    await locationsStore.getProvinces(newRegionCode);
                    loadingProvinces.value = false;
                }
            }
        );

        watch(
            () => patientStore.details.generalData.plc_provcode,
            async (newProvinceCode) => {
                patientStore.details.generalData.plc_ctycode = null;
                await locationsStore.getCities(newProvinceCode);
            }
        );

        watch(
            () => patientStore.details.generalData.plc_ctycode,
            async (newCityCode) => {
                locationsStore.getBgys(newCityCode);
            }
        );
        const injuryByPOI = computed(() => {
            const regionCount = {};
            const regionCodes = new Set();

            const regionsMap = {};
            regions.value.forEach((region) => {
                if (region.regcode) {
                    regionsMap[region.regcode] = region.regname;
                }
            });

            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const placeCode = item.details.generalData.plc_regcode;
                    if (placeCode) {
                        regionCodes.add(placeCode);
                    }
                }
            });

            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const placeCode = item.details.generalData.plc_regcode;
                    if (placeCode) {
                        if (regionsMap[placeCode]) {
                            const regionDescription = regionsMap[placeCode];
                            // console.log('lowl: 0', regionDescription);

                            if (regionDescription) {
                                if (!regionCount[regionDescription]) {
                                    regionCount[regionDescription] = 0;
                                }
                                regionCount[regionDescription]++;
                            }
                        }
                    }
                }
            });

            // console.log('Region Counts:', regionCount);

            return Object.entries(regionCount).map(([regionDescription, count]) => ({
                regionDescription,
                count
            }));
        });

        // const injuryByPOIFiltered = computed(() => {
        //     const regionCount = {};
        //     const regionCodes = new Set();

        //     const regionsMap = {};
        //     regions.value.forEach(region => {

        //         if (region.regcode) {
        //             regionsMap[region.regcode] = region.regname;
        //         }
        //     });

        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const placeCode = item.details.generalData.plc_regcode;
        //             if (placeCode) {
        //                 regionCodes.add(placeCode);
        //             }
        //         }
        //     });

        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const placeCode = item.details.generalData.plc_regcode;
        //             if (placeCode) {
        //                 if (regionsMap[placeCode]) {
        //                     const regionDescription = regionsMap[placeCode];

        //                     if (regionDescription) {
        //                         if (!regionCount[regionDescription]) {
        //                             regionCount[regionDescription] = 0;
        //                         }
        //                         regionCount[regionDescription]++;
        //                     }
        //                 }
        //             }
        //         }
        //     });

        //     console.log('Region Counts:', regionCount);

        //     return Object.entries(regionCount).map(([regionDescription, count]) => ({

        //         regionDescription,
        //         count,
        //     }));
        // });

        const provinces = ref([]);

        async function getProvincesDesc() {
            const response = await axios
                .get('locations/provinceByRegionDesc', {
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
            if (response.status === 200) {
                if (Array.isArray(response.data)) {
                    provinces.value = response.data;
                } else {
                    console.error('Expected an array but got:', response.data);
                    provinces.value = [];
                }
            }
            return response;
        }

        const injuryByPOIProvince = computed(() => {
            const provinceCount = {};
            const provinceCodes = new Set();

            const provincesMap = {};
            provinces.value.forEach((province) => {
                if (province.provcode) {
                    provincesMap[province.provcode] = province.provname;
                }
            });

            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const placeCode = item.details.generalData.plc_provcode;
                    if (placeCode) {
                        provinceCodes.add(placeCode);
                    }
                }
            });

            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const placeCode = item.details.generalData.plc_provcode;
                    if (placeCode) {
                        if (provincesMap[placeCode]) {
                            const provinceDescription = provincesMap[placeCode];
                            // console.log('lowl: 0', regionDescription);

                            if (provinceDescription) {
                                if (!provinceCount[provinceDescription]) {
                                    provinceCount[provinceDescription] = 0;
                                }
                                provinceCount[provinceDescription]++;
                            }
                        }
                    }
                }
            });

            // console.log('Prov Counts:', provinceCount);

            return Object.entries(provinceCount).map(([provinceDescription, count]) => ({
                provinceDescription,
                count
            }));
        });

        // const injuryByPOIProvinceFiltered = computed(() => {
        //     const provinceCount = {};
        //     const provinceCodes = new Set();

        //     const provincesMap = {};
        //     provinces.value.forEach(province => {

        //         if (province.provcode) {
        //             provincesMap[province.provcode] = province.provname;
        //         }
        //     });

        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const placeCode = item.details.generalData.plc_provcode;
        //             if (placeCode) {
        //                 provinceCodes.add(placeCode);
        //             }
        //         }
        //     });

        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const placeCode = item.details.generalData.plc_provcode;
        //             if (placeCode) {
        //                 if (provincesMap[placeCode]) {
        //                     const provinceDescription = provincesMap[placeCode];
        //                     // console.log('lowl: 0', regionDescription);

        //                     if (provinceDescription) {
        //                         if (!provinceCount[provinceDescription]) {
        //                             provinceCount[provinceDescription] = 0;
        //                         }
        //                         provinceCount[provinceDescription]++;
        //                     }
        //                 }
        //             }
        //         }
        //     });

        //     console.log('Prov Counts:', provinceCount);

        //     return Object.entries(provinceCount).map(([provinceDescription, count]) => ({
        //         provinceDescription,
        //         count,
        //     }));
        // });

        const city = ref([]);
        async function getCitiesDesc() {
            const response = await axios
                .get('locations/citiesByProvinceDesc', {
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
            if (response.status === 200) {
                if (Array.isArray(response.data)) {
                    city.value = response.data;
                } else {
                    console.error('Expected an array but got:', response.data);
                    city.value = [];
                }
            }
            return response;
        }
        const injuryByPOICities = computed(() => {
            const citiesCount = {};
            const citiesCodes = new Set();

            const citiessMap = {};
            city.value.forEach((cities) => {
                if (cities.ctycode) {
                    citiessMap[cities.ctycode] = cities.ctyname;
                }
            });

            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const placeCode = item.details.generalData.plc_ctycode;
                    if (placeCode) {
                        citiesCodes.add(placeCode);
                    }
                }
            });

            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const placeCode = item.details.generalData.plc_ctycode;
                    if (placeCode) {
                        if (citiessMap[placeCode]) {
                            const citiesDescription = citiessMap[placeCode];
                            // console.log('lowl: 0', regionDescription);

                            if (citiesDescription) {
                                if (!citiesCount[citiesDescription]) {
                                    citiesCount[citiesDescription] = 0;
                                }
                                citiesCount[citiesDescription]++;
                            }
                        }
                    }
                }
            });

            // console.log('City Counts:', citiesCount);

            return Object.entries(citiesCount).map(([citiesDescription, count]) => ({
                citiesDescription,
                count
            }));
        });

        // const injuryByPOICitiesFiltered = computed(() => {
        //     const citiesCount = {};
        //     const citiesCodes = new Set();

        //     const citiessMap = {};
        //     city.value.forEach(cities => {

        //         if (cities.ctycode) {
        //             citiessMap[cities.ctycode] = cities.ctyname;
        //         }
        //     });

        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const placeCode = item.details.generalData.plc_ctycode;
        //             if (placeCode) {
        //                 citiesCodes.add(placeCode);
        //             }
        //         }
        //     });

        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const placeCode = item.details.generalData.plc_ctycode;
        //             if (placeCode) {
        //                 if (citiessMap[placeCode]) {
        //                     const citiesDescription = citiessMap[placeCode];
        //                     // console.log('lowl: 0', regionDescription);

        //                     if (citiesDescription) {
        //                         if (!citiesCount[citiesDescription]) {
        //                             citiesCount[citiesDescription] = 0;
        //                         }
        //                         citiesCount[citiesDescription]++;
        //                     }
        //                 }
        //             }
        //         }
        //     });

        //     console.log('City Counts:', citiesCount);

        //     return Object.entries(citiesCount).map(([citiesDescription, count]) => ({
        //         citiesDescription,
        //         count,
        //     }));
        // });

        const injuryByStatus = computed(() => {
            const statusCounts = {};
            reportData.value.forEach((item) => {
                if (item.details && item.details.preAdmissionData) {
                    const statusCode = item.details.hospitalFacilityData.status_code;
                    const statusDescription = libraryService.getStatusReachings(statusCode);
                    if (statusDescription) {
                        if (!statusCounts[statusDescription]) {
                            statusCounts[statusDescription] = 0;
                        }
                        statusCounts[statusDescription]++;
                    }
                }
            });

            return Object.entries(statusCounts).map(([statusCode, count]) => ({
                statusCode,
                count
            }));
        });

        // const injuryByStatusFiltered = computed(() => {
        //     const statusCounts = {};
        //     filteredData.value.forEach(item => {
        //         if (item.details && item.details.preAdmissionData) {
        //             const statusCode = item.details.hospitalFacilityData.status_code;
        //             const statusDescription = libraryService.getStatusReaching(statusCode);
        //             if (statusDescription) {
        //                 if (!statusCounts[statusDescription]) {
        //                     statusCounts[statusDescription] = 0;
        //                 }
        //                 statusCounts[statusDescription]++;
        //             }
        //         }
        //     });

        //     return Object.entries(statusCounts).map(([statusCode, count]) => ({
        //         statusCode,
        //         count,
        //     }));
        // });

        // item.details.natureOfInjury
        // get all selected and put it on the last of item.details.natureOfInjury.(selected)
        const preadmissionList = ref([
            { name: 'abrasion', code: 'noi_abrasion' },
            { name: 'burns', code: 'noi_burn_r' },
            { name: 'avulsion', code: 'noi_avulsion' },
            { name: 'consussion', code: 'noi_concussion' },
            { name: 'contusion', code: 'noi_contusion' },
            { name: 'fracture Open', code: 'noi_frac_open' },
            { name: 'fracture Closed', code: 'noi_frac_clo' },
            { name: 'open Wound', code: 'noi_owound' },
            { name: 'amputation', code: 'noi_amp' },
            { name: 'others', code: 'noi_others' }
        ]);

        // item.details.externalCauseOfInjury
        // get all selected and put it on the last of item.details.externalCauseOfInjury.(selected)

        const externalList = ref([
            { name: 'Bites/Stings', code: 'ext_bite' },
            { name: 'Burn', code: 'ext_burn_r' },
            { name: 'Chemical Substances', code: 'ext_chem' },
            { name: 'Sharp Objects', code: 'ext_sharp' },
            { name: 'Drownings', code: 'ext_drown_r' },
            { name: 'Exposure to Forces of Nature', code: 'ext_expo_nature_r' },
            { name: 'Fall', code: 'ext_fall' },
            { name: 'Firecrackers', code: 'ext_firecracker_r' },
            { name: 'Vapor/Tobacco', code: 'ext_vape' },
            { name: 'Gunshot', code: 'ext_gun' },
            { name: 'Hanging', code: 'ext_hang' },
            { name: 'Mauling', code: 'ext_maul' },
            { name: 'Transport Accidents', code: 'ext_transport' },
            { name: 'Sexual Assault', code: 'ext_sexual' },
            { name: 'Others', code: 'ext_other' }
        ]);

        const riskFactorList = ref([
            { name: 'Alcohol', code: 'risk_alcliq' },
            { name: 'Sleepy', code: 'risk_sleep' },
            { name: 'Smoking', code: 'risk_smoke' },
            { name: 'Using Mobile', code: 'risk_mobpho' },
            { name: 'Others', code: 'risk_other' }
        ]);

        const safetyList = ref([
            { name: 'Unknown', code: 'safe_unkn' },
            { name: 'Air', code: 'safe_airbag' },
            { name: 'Helmet', code: 'safe_helmet' },
            { name: 'Child Seat', code: 'safe_cseat' },
            { name: 'Seat Bely', code: 'safe_sbelt' },
            { name: 'Life Vest', code: 'safe_vest' },
            { name: 'Others', code: 'safe_other' }
        ]);

        // item.details.preAdmissionData.inj_intent_code
        // get all selected and set the value of item.details.preAdmissionData.inj_intent_code as  (code)
        const injuryIntentList = ref([
            { name: 'Unintentional/Accident', code: '01' },
            { name: 'Intentional (Violence)', code: '02' },
            { name: 'Intentional (Self-inflicted)', code: '03' },
            { name: 'Undetermined', code: '99' }
        ]);

        // item.details.hospitalFacilityData.status_code
        // get all selected and set the value of item.details.hospitalFacilityData.status_code as  (code)

        const statusList = ref([
            { name: 'Dead on Arrival', code: '01l' },
            { name: 'Alive - Unconscious', code: '02' },
            { name: 'Alive - Conscious', code: '03' }
        ]);

        //item.details.preAdmissionData.place_occ_code
        // get all selected and set the value of item.details.preAdmissionData.place_occ_code as  (code)

        const placeOfOccurrenceList = ref([
            { name: 'Home', code: '10' },
            { name: 'Road/Highway', code: '50' },
            { name: 'School', code: '30' },
            { name: 'Videoke Bars', code: '60' },
            { name: 'Workplace', code: '70' },
            { name: 'Unknown', code: '99' },
            { name: 'Others', code: '88' }
        ]);

        //item.details.preAdmissionData.activity_code
        // get all selected and set the value of item.details.preAdmissionData.activity_code as  (code)

        const activityList = ref([
            { name: 'Work', code: '30' },
            { name: 'Leisure', code: '20' },
            { name: 'Sports', code: '10' },
            { name: 'Unknown', code: '99' },
            { name: 'Others', code: '88' }
        ]);

        //item.details.preAdmissionData.first_aid_code
        //get all selected and set the value of item.details.preAdmissionData.first_aid_code as (code)

        const firstAidGivenList = ref([
            { name: 'No', code: 'N' },
            { name: 'Yes', code: 'Y' },
            { name: 'Unknown', code: 'U' }
        ]);

        // item.header.patsex
        //get all selected and set the value of item.header.patsex as (code)

        const genderList = ref([
            { name: 'Male', code: 'M' },
            { name: 'Female', code: 'F' }
        ]);

        const filters = ref({
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            injurytypes: { value: null, matchMode: FilterMatchMode.IN }
        });
        watch([], (newValues) => {
            console.log(`Age range updated: From ${newValues[0]} to ${newValues[1]}`);
        });

        watch(
            () => [selectedBarangay, selectedCity, selectedProvince, selectedRegion],
            (newValues) => {
                console.log('Selected location changed:', newValues);
                loadLocations();
            }
        );
        watch(
            () => [
                ageFrom,
                ageTo,
                selectedSex.value,
                selectedExternal.value,
                selectedPreAdmission.value,
                selectedInjuryIntent.value,
                selectedStatusList.value,
                selectedPlaceOfOccurence.value,
                selectedActivityList.value,
                selectedFirstAid.value,

                selectedSafety,
                selectedRisk
            ],
            (newValues) => {
                // do something when any of the selected values change
                // console.log("Selected values changed:", newValues);
            },
            { deep: true }
        );

        const customers = ref();
        return {
            firstAidGivenList,
            activityList,
            selectedCity,
            selectedBarangay,
            selectedProvince,
            placeOfOccurrenceList,
            statusList,
            injuryIntentList,
            selectedInjuryIntent,
            selectedSex,
            selectedStatusList,
            selectedActivityList,
            selectedFirstAid,
            genderList,
            startDate,
            endDate,
            getCitiesDesc,
            selectedPreAdmission,
            preadmissionList,
            getRegions,
            value,
            injuryByStatus,
            customers,
            selectedRegion,
            externalList,
            monthlyInjuryStats,
            // filteredStatistics,
            options,
            regions,
            locationsStore,
            injuryByPOI,
            selectedSafety,
            selectedRisk,
            savedStartDate,
            totalInjury,
            savedEndDate,
            patientStore,
            selectedPlaceOfOccurence,
            visible,
            safetyList,
            position,
            toast,
            filterModel,
            openPosition,
            ageFrom,
            riskFactorList,
            ageTo,
            gender,
            // selectedSex,
            // selectedNOI,
            // ageFrom,
            // ageTo,
            dateFrom,
            dateTo,
            generateReport,
            selectedExternal,
            reportData,
            filteredDataTest,
            // filteredData,
            // filteredReports,
            filteredReportData,
            dataTableVisible,
            totalReports,
            maleCount,
            femaleCount,
            // filteredMaleCount,
            // filteredFemaleCount,
            loading,
            // monthlyInjuryStatsFiltered,
            dispositionInjuryStats,
            // injuryByStatusFiltered,
            // dispositionInjuryStatsFiltered,
            outcomeInjuryStats,
            // outcomeInjuryStatsFiltered,
            externalCauseCounts,
            filters,
            // filteredExternalCauseCounts,
            injuryByPlaceOfOccurrence,
            // injuryByPlaceOfOccurrenceFiltered,
            listDialogVisible,
            injuryByPreAdmission,
            // injuryByPreAdmissionFiltered,
            injuryBySafety,
            // injuryBySafetyFiltered,
            injuryByRiskFactor,
            // injuryByRiskFactorFiltered,
            // InjuryByExternal,
            injuryByActivity,
            // injuryByActivityFiltered,
            injuryByIntent,
            // injuryByPOIFiltered,
            isRefreshDisabled,
            // injuryByIntentFiltered,
            injuryByPOIProvince,
            // injuryByPOIProvinceFiltered,
            injuryByPOICities
            // injuryByPOICitiesFiltered,
        };
    }
};
</script>
<template>
    <div v-if="loading" class="loading-overlay">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div class="flex justify-content-center">
        <!-- <div class="flex flex-column mx-2">
            <strong style="font-size: 8px;">SEX:</strong>
            <Dropdown v-model="selectedSex" :options="gender" optionLabel="sex" class="w-full md:w-8rem" />
        </div>
        <div class="flex flex-column mx-2">
            <strong style="font-size: 8px;">NOI:</strong>
            <InputText v-model="selectedNOI" class="w-full md:w-14rem" />
        </div>
        <div class="flex flex-column mx-2">
            <strong style="font-size: 8px;">FROM AGE:</strong>
            <InputNumber v-model="ageFrom" mode="decimal" :min="0" class="w-full" />
        </div>
        <div class="flex flex-column mx-2">
            <strong style="font-size: 8px;">TO AGE:</strong>
            <InputNumber v-model="ageTo" mode="decimal" :min="0" class="w-full" />
        </div> -->
        <div class="flex flex-column mx-2">
            <strong style="font-size: 8px">FROM DATE:</strong>
            <Calendar v-model="dateFrom" dateFormat="dd/mm/yy" showIcon class="w-full" :todayButton="true" :showButtonBar="true" />
        </div>
        <div class="flex flex-column mx-2">
            <strong style="font-size: 8px">TO DATE:</strong>
            <Calendar v-model="dateTo" dateFormat="dd/mm/yy" showIcon class="w-full" :todayButton="true" :showButtonBar="true" />
        </div>
        <div class="flex justify-end mx-2">
            <Button type="button" label="GENERATE" @click="generateReport" :disabled="isRefreshDisabled" style="font-size: 10px; padding: 0px 8px" />
        </div>
    </div>

    <div class="flex justify-content-between mt-2 align-items-center">
        <i class="pi pi-list clickable-icon" style="cursor: pointer; font-size: 1.5em" v-tooltip="'List of Patients'" @click="listDialogVisible = true"> <strong class="ml-2">LIST</strong></i>
    </div>

    <div>
        <div class="grid grid-cols-2 justify-content-center">
            <!-- <h3>Statistics</h3> -->

            <div class="flex-1 mt-4 mb-3 mr-1">
                <strong class="flex justify-content-center">Total Injury</strong>
                <DataTable :value="totalInjury" class="p-datatable-striped small-table bordered-table" :paginator="false">
                    <Column field="label" header="TOTAL INJURY" style="width: 40%" />
                    <Column field="count" header="Count" style="width: 30%" />
                    <Column field="percentage" header="Percentage" style="width: 30%" />
                </DataTable>
            </div>

            <!-- <div class="flex-1 mt-4 mb-3 ml-1 mr-4">
                <strong class="flex justify-content-center">Filtered Injury</strong>
                <DataTable :value="filteredStatistics" class="p-datatable-striped small-table bordered-table"
                    :paginator="false">
                    <Column field="label" header="FILTERED INJURY" style="width: 40%;" />
                    <Column field="count" header="Count" style="width: 30%;" />
                    <Column field="percentage" header="Percentage" style="width: 30%;" />
                </DataTable>
            </div> -->
        </div>

        <div class="grid grid-cols-2 justify-content-center">
            <div class="flex-1 mr-1">
                <strong class="flex justify-content-center">Monthly Injury</strong>
                <DataTable :value="monthlyInjuryStats" class="p-datatable-striped small-table bordered-table" :paginator="false">
                    <Column field="month" header="Month" style="width: 40%" />
                    <Column field="count" header="Count" style="width: 30%" />
                    <Column field="percentage" header="Percentage" style="width: 30%" />
                </DataTable>
            </div>
            <!-- <div class="flex-1 ml-1 mr-4">
                <strong class="flex justify-content-center">Filtered Monthly Injury</strong>
                <DataTable :value="monthlyInjuryStatsFiltered" class="p-datatable-striped small-table bordered-table"
                    :paginator="false">
                    <Column field="month" header="Month" style="width: 40%;" />
                    <Column field="count" header="Count" style="width: 30%;" />
                    <Column field="percentage" header="Percentage" style="width: 30%;" />
                </DataTable>
            </div> -->
        </div>
        <TabView :scrollable="true" class="mt-4">
            <TabPanel header="Injury by Disposition">
                <div class="grid grid-cols-2">
                    <div class="flex-1 mr-1">
                        <strong class="flex justify-content-center">Injury by Disposition</strong>
                        <DataTable :value="dispositionInjuryStats" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="dispCode" header="Disposition Code" style="width: 40%" />
                            <Column field="count" header="Count" style="width: 30%" />
                            <Column field="percentage" header="Percentage" style="width: 30%" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 ml-1">
                        <strong class="flex justify-content-center">Filtered Injury by Disposition</strong>
                        <DataTable :value="dispositionInjuryStatsFiltered"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="dispCode" header="Disposition Code" style="width: 40%;" />
                            <Column field="count" header="Count" style="width: 30%;" />
                            <Column field="percentage" header="Percentage" style="width: 30%;" />
                        </DataTable>
                    </div> -->
                </div>
            </TabPanel>
            <TabPanel header="Injury by Outcome">
                <div class="grid grid-cols-2 justify-content-center">
                    <div class="flex-1 mr-1">
                        <strong class="flex justify-content-center">Injury by Outcome</strong>
                        <DataTable :value="outcomeInjuryStats" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="condCode" header="Outcome Code" style="width: 40%" />
                            <Column field="count" header="Count" style="width: 30%" />
                            <Column field="percentage" header="Percentage" style="width: 30%" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 ml-1  ">
                        <strong class="flex justify-content-center">Filtered Injury by Outcome</strong>
                        <DataTable :value="outcomeInjuryStatsFiltered"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="condCode" header="Outcome Code" style="width: 40%;" />
                            <Column field="count" header="Count" style="width: 30%;" />
                            <Column field="percentage" header="Percentage" style="width: 30%;" />
                        </DataTable>
                    </div> -->
                </div>
            </TabPanel>

            <TabPanel header="Injury by External Injury">
                <div class="grid flex-1 justify-content-center">
                    <div class="flex-1 mb-3">
                        <strong class="flex justify-content-center">External Cause of Injury Counts</strong>
                        <DataTable :value="[externalCauseCounts]" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="bites" header="Bites/Stings" />
                            <Column field="burns" header="Burns" />
                            <Column field="chemicals" header="Chemical Substances" />
                            <Column field="sharpObjects" header="Sharp Objects" />
                            <Column field="drownings" header="Drownings" />
                            <Column field="exposures" header="Exposure to Forces of Nature" />
                            <Column field="fall" header="Fall" />
                            <Column field="firecrackers" header="Firecrackers" />
                            <Column field="vape" header="Vapor/Tobacco" />
                            <Column field="gunshot" header="Gunshot" />
                            <Column field="hanging" header="Hanging" />
                            <Column field="mauling" header="Mauling" />
                            <Column field="transportAccidents" header="Transport Accidents" />
                            <Column field="sexualAssaults" header="Sexual Assault" />
                            <Column field="others" header="Others" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 mt-4  mb-3">
                        <strong class="flex justify-content-center">Filtered External Cause of Injury
                            Counts</strong>
                        <DataTable :value="[filteredExternalCauseCounts]"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="bites" header="Bites/Stings" />
                            <Column field="burns" header="Burns" />
                            <Column field="chemicals" header="Chemical Substances" />
                            <Column field="sharpObjects" header="Sharp Objects" />
                            <Column field="drownings" header="Drownings" />
                            <Column field="exposures" header="Exposure to Forces of Nature" />
                            <Column field="fall" header="Fall" />
                            <Column field="firecrackers" header="Firecrackers" />
                            <Column field="vape" header="Vapor/Tobacco" />
                            <Column field="gunshot" header="Gunshot" />
                            <Column field="hanging" header="Hanging" />
                            <Column field="mauling" header="Mauling" />
                            <Column field="transportAccidents" header="Transport Accidents" />
                            <Column field="sexualAssaults" header="Sexual Assault" />
                            <Column field="others" header="Others" />
                        </DataTable>
                    </div> -->
                </div>
            </TabPanel>
            <TabPanel header="Injury by Place of Occurence">
                <div class="grid grid-cols-1 justify-content-center">
                    <div class="flex-1 mr-1">
                        <strong class="flex justify-content-center">Injury by Place of Occurrence</strong>
                        <DataTable :value="injuryByPlaceOfOccurrence" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="placeCode" header="Place of Occurrence" style="width: 60%" />
                            <Column field="count" header="Count" style="width: 40%" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1   ml-1">
                        <strong class="flex justify-content-center">Filtered Injury by Place of
                            Occurrence</strong>
                        <DataTable :value="injuryByPlaceOfOccurrenceFiltered"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="placeCode" header="Place of Occurrence" style="width: 60%;" />
                            <Column field="count" header="Count" style="width: 40%;" />
                        </DataTable>

                    </div> -->
                </div>
            </TabPanel>
            <TabPanel header=" Injury by Pre Admission">
                <div class="grid grid-cols-1 justify-content-center">
                    <div class="flex-1 mr-1">
                        <strong class="flex justify-content-center">Injury by Pre-Admission</strong>
                        <DataTable :value="Object.entries(injuryByPreAdmission).map(([key, value]) => ({ injuryType: key, count: value }))" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="injuryType" header="Injury Type" style="width: 60%" />
                            <Column field="count" header="Count" style="width: 40%" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1   ml-1">
                        <strong class="flex justify-content-center">Filtered Injury by Pre-Admission</strong>
                        <DataTable
                            :value="Object.entries(injuryByPreAdmissionFiltered).map(([key, value]) => ({ injuryType: key, count: value }))"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="injuryType" header="Injury Type" style="width: 60%;" />
                            <Column field="count" header="Count" style="width: 40%;" />
                        </DataTable>

                    </div> -->
                </div>
            </TabPanel>
            <TabPanel header=" Injury by Safety">
                <div class="grid grid-cols-1 justify-content-center">
                    <div class="flex-1 mr-1">
                        <strong class="flex justify-content-center">Safety Measures</strong>
                        <DataTable :value="Object.entries(injuryBySafety).map(([key, value]) => ({ safetyType: key, count: value }))" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="safetyType" header="Safety Type" style="width: 60%" />
                            <Column field="count" header="Count" style="width: 40%" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 ml-1">
                        <strong class="flex justify-content-center">Filtered Safety Measures</strong>
                        <DataTable
                            :value="Object.entries(injuryBySafetyFiltered).map(([key, value]) => ({ safetyType: key, count: value }))"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="safetyType" header="Safety Type" style="width: 60%;" />
                            <Column field="count" header="Count" style="width: 40%;" />
                        </DataTable>
                    </div> -->
                </div>
            </TabPanel>
            <TabPanel header="Injury by Risk Factor">
                <div class="grid grid-cols-1 justify-content-center">
                    <div class="flex-1 mr-1">
                        <strong class="flex justify-content-center">Risk Factors</strong>
                        <DataTable :value="Object.entries(injuryByRiskFactor).map(([key, value]) => ({ riskType: key, count: value }))" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="riskType" header="Risk Factor" style="width: 60%" />
                            <Column field="count" header="Count" style="width: 40%" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 ml-1">
                        <strong class="flex justify-content-center">Filtered Risk Factors</strong>
                        <DataTable
                            :value="Object.entries(injuryByRiskFactorFiltered).map(([key, value]) => ({ riskType: key, count: value }))"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="riskType" header="Risk Factor" style="width: 60%;" />
                            <Column field="count" header="Count" style="width: 40%;" />
                        </DataTable>
                    </div> -->
                </div>
            </TabPanel>
            <TabPanel header="Injury by Activity">
                <div class="grid grid-cols-1 justify-content-center">
                    <div class="flex-1 mr-1">
                        <strong class="flex justify-content-center">Injury by Activity</strong>
                        <DataTable :value="injuryByActivity" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="activityCode" header="Activity" style="width: 60%" />
                            <Column field="count" header="Count" style="width: 40%" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 ml-1">
                        <strong class="flex justify-content-center">Filtered Injury by Activity</strong>
                        <DataTable :value="injuryByActivityFiltered"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="activityCode" header="Activity" style="width: 60%;" />
                            <Column field="count" header="Count" style="width: 40%;" />
                        </DataTable>
                    </div> -->
                </div>
            </TabPanel>
            <TabPanel header=" Injury by Intent">
                <div class="grid grid-cols-1 justify-content-center">
                    <div class="flex-1 mr-1">
                        <strong class="flex justify-content-center">Injury by Intent</strong>
                        <DataTable :value="injuryByIntent" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="intentCode" header="Injury Intent" style="width: 60%" />
                            <Column field="count" header="Count" style="width: 40%" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 ml-1">
                        <strong class="flex justify-content-center">Filtered Injury by Intent</strong>
                        <DataTable :value="injuryByIntentFiltered"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="intentCode" header="Injury Intent" style="width: 60%;" />
                            <Column field="count" header="Count" style="width: 40%;" />
                        </DataTable>
                    </div> -->
                </div>
            </TabPanel>
            <TabPanel header=" Injury by POI">
                <div class="grid grid-cols-3 justify-content-center">
                    <div class="flex-1 mr-1">
                        <DataTable :value="injuryByPOI" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="regionDescription" header="Region of Injury" style="width: 60%" />
                            <Column field="count" header="Count" style="width: 40%" />
                        </DataTable>

                        <!-- <div class="flex-1 ml-1">
                        <strong class="flex justify-content-center">Filtered Injury by POI</strong>
                        <DataTable :value="injuryByPOIFiltered" class="p-datatable-striped small-table bordered-table"
                            :paginator="false">
                            <Column field="regionDescription" header="Filtered Region of Injury" style="width: 60%;" />
                            <Column field="count" header="Count" style="width: 40%;" />
                        </DataTable>
                    </div> -->
                    </div>
                    <div class="flex-1 mr-1">
                        <DataTable :value="injuryByPOIProvince" class="p-datatable-striped small-table bordered-table">
                            <Column field="provinceDescription" header="Province of Injury" style="width: 60%" />
                            <Column field="count" header="Count" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 ml-1">
                        <DataTable :value="injuryByPOIProvinceFiltered"
                            class="p-datatable-striped small-table bordered-table">
                            <Column field="provinceDescription" header="Filtered Province of Injury"
                                style="width: 60%;" />
                            <Column field="count" header="Count" />
                        </DataTable>
                    </div> -->

                    <div class="flex-1 mr-1">
                        <DataTable :value="injuryByPOICities" class="p-datatable-striped small-table bordered-table">
                            <Column field="citiesDescription" header="City of Injury" style="width: 60%" />
                            <Column field="count" header="Count" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 ml-1">
                        <DataTable :value="injuryByPOICitiesFiltered"
                            class="p-datatable-striped small-table bordered-table">
                            <Column field="citiesDescription" header="Filtered City of Injury" style="width: 60%;" />
                            <Column field="count" header="Count" />
                        </DataTable>
                    </div> -->
                </div>
            </TabPanel>

            <TabPanel header=" Injury by Status">
                <div class="grid grid-cols-1 justify-content-center">
                    <div class="flex-1 mr-1">
                        <strong class="flex justify-content-center">Injury by Status</strong>
                        <DataTable :value="injuryByStatus" class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="statusCode" header="Injury Status" style="width: 60%" />
                            <Column field="count" header="Count" style="width: 40%" />
                        </DataTable>
                    </div>
                    <!-- <div class="flex-1 ml-1">
                        <strong class="flex justify-content-center">Filtered Injury by Status</strong>
                        <DataTable :value="injuryByStatusFiltered"
                            class="p-datatable-striped small-table bordered-table" :paginator="false">
                            <Column field="statusCode" header="Filtered Injury by Status" style="width: 60%;" />
                            <Column field="count" header="Count" style="width: 40%;" />
                        </DataTable>
                    </div> -->
                </div>
            </TabPanel>
        </TabView>
    </div>
    <Dialog v-model:visible="listDialogVisible" :style="{ width: '90%', height: '100%' }" :modal="true" v-model:filters="filters">
        <template #header>
            <div class="flex">
                <h4 class="flex justify-content-center">DATE: {{ dateFrom }} to {{ dateTo }} &nbsp;&nbsp;</h4>
            </div>
        </template>

        <div class="card flex justify-content-center">
            <div class="grid grid-rows-4 grid-flow-col gap-4">
                <div class="flex flex-column">
                    <strong style="font-size: 8px">SEX:</strong>
                    <MultiSelect v-model="selectedSex" :options="genderList" filter optionLabel="name" placeholder="Select Gender" :maxSelectedLabels="2" class="w-1/2 md:w-1/2 mr-2" />
                </div>

                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">EXTERNAL CAUSE:</strong>
                    <MultiSelect v-model="selectedExternal" :options="externalList" filter optionLabel="name" placeholder="External Cause" :maxSelectedLabels="15" class="w-1/2 md:w-1/2 mr-2" />
                </div>

                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">PRE-ADMISSION:</strong>
                    <MultiSelect v-model="selectedPreAdmission" :options="preadmissionList" filter optionLabel="name" placeholder="Pre-Admission" :maxSelectedLabels="15" class="w-1/2 md:w-1/2 mr-2" />
                </div>

                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">INJURY INTENT:</strong>
                    <MultiSelect v-model="selectedInjuryIntent" :options="injuryIntentList" filter optionLabel="name" placeholder="Injury Intent" :maxSelectedLabels="15" class="w-1/2 md:w-1/2 mr-2" />
                </div>

                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">STATUS:</strong>
                    <MultiSelect v-model="selectedStatusList" :options="statusList" filter optionLabel="name" placeholder="Status" :maxSelectedLabels="15" class="w-1/2 md:w-1/2 mr-2" />
                </div>

                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">PLACE OF OCCURRENCE:</strong>
                    <MultiSelect v-model="selectedPlaceOfOccurence" :options="placeOfOccurrenceList" filter optionLabel="name" placeholder="Place of Occurrence" :maxSelectedLabels="15" class="w-1/2 md:w-1/2 mr-2" />
                </div>

                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">ACTIVITY:</strong>
                    <MultiSelect v-model="selectedActivityList" :options="activityList" filter optionLabel="name" placeholder="Activity" :maxSelectedLabels="15" class="w-1/2 md:w-1/2 mr-2" />
                </div>

                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">FIRST AID GIVEN:</strong>
                    <MultiSelect v-model="selectedFirstAid" :options="firstAidGivenList" filter optionLabel="name" placeholder="First Aid Given" :maxSelectedLabels="15" class="w-1/2 md:w-1/2" />
                </div>
                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">SAFETY:</strong>
                    <MultiSelect v-model="selectedSafety" :options="safetyList" filter optionLabel="name" placeholder="Safety" :maxSelectedLabels="15" class="w-1/2 md:w-1/2 mr-2" />
                </div>
                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">RISK FACTOR:</strong>
                    <MultiSelect v-model="selectedRisk" :options="riskFactorList" filter optionLabel="name" placeholder="Risk Factor" :maxSelectedLabels="15" class="w-1/2 md:w-1/2 mr-2" />
                </div>
                <div class="flex flex-column mx-2">
                    <strong style="font-size: 8px">AGE RANGE:</strong>
                    <div class="flex items-center">
                        <input type="range" v-model="ageFrom" min="0" max="100" class="w-1/2 mr-2" />
                        <span>{{ ageFrom }}</span>
                    </div>
                    <div class="flex items-center">
                        <input type="range" v-model="ageTo" min="0" max="100" class="w-1/2 mr-2" />
                        <span>{{ ageTo }}</span>
                    </div>
                    <div>
                        <strong>Selected Age Range: {{ ageFrom }} - {{ ageTo }}</strong>
                    </div>
                </div>

                <div class="flex flex-column">
                    <div class="flex justify-content-between w-1/2 md:w-1/2">
                        <strong style="font-size: 8px" for="generalData.plc_regcode">POI REGION</strong>
                    </div>

                    <Dropdown
                        showClear
                        id="selectedRegion"
                        v-model="selectedRegion"
                        :options="locationsStore.regions"
                        optionLabel="regname"
                        optionValue="regcode"
                        :class="{
                            'p-inputtext-filled  mb-2 w-1/2 md:w-1/2 ': true
                        }"
                    />
                </div>
                <div class="flex flex-column">
                    <div class="flex justify-content-between w-1/2 md:w-1/2">
                        <strong style="font-size: 8px" for="generalData.plc_provcode">POI PROVINCE</strong>
                    </div>
                    <Dropdown
                        showClear
                        id="selectedProvince"
                        v-model="selectedProvince"
                        :options="locationsStore.provinces"
                        optionLabel="provname"
                        optionValue="provcode"
                        :class="{
                            'p-inputtext-filled  mb-2 w-1/2 md:w-1/2': true
                        }"
                    />
                </div>
                <div class="flex flex-column">
                    <div class="flex justify-content-between w-1/2 md:w-1/2">
                        <strong style="font-size: 8px" for="generalData.plc_ctycode">POI CITY</strong>
                    </div>
                    <Dropdown
                        showClear
                        id="selectedCity"
                        v-model="selectedCity"
                        :options="locationsStore.citys"
                        optionLabel="ctyname"
                        optionValue="ctycode"
                        :class="{
                            'p-inputtext-filled  mb-2 w-1/2 md:w-1/2 ': true
                        }"
                    />
                </div>
                <div class="flex flex-column">
                    <div class="flex justify-content-between w-1/2 md:w-1/2">
                        <strong style="font-size: 8px" for="generalData.plc_ctycode">POI BARANGGAY</strong>
                    </div>
                    <Dropdown
                        showClear
                        id="selectedBarangay"
                        v-model="selectedBarangay"
                        :options="locationsStore.bgys"
                        optionLabel="bgyname"
                        optionValue="bgycode"
                        :class="{
                            'p-inputtext-filled  mb-2 w-full md:w-1/2': true
                        }"
                    />
                </div>
            </div>
        </div>

        <div class="card">
            <DataTable
                :value="filteredReportData"
                class="p-datatable-striped small-table bordered-table"
                :paginator="true"
                :rows="10"
                v-model:filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                filterDisplay="menu"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            >
                <Column field="header.patname" header="Name" />
                <Column field="header.patage" header="Age" />
                <Column field="header.patsex" header="Sex" />
                <Column field="header.injrem" header="Nature of Injury" />
                <Column field="header.injtme" header="Date" />
            </DataTable>
        </div>
    </Dialog>

    <Toast ref="toast" />
</template>
<style scoped>
.clickable-icon {
    color: #007bff;
    /* Change to a bright color */
    transition: transform 0.2s, color 0.2s;
    /* Smooth transition for hover effects */
}

.clickable-icon:hover {
    color: #0056b3;
    /* Darker shade on hover */
    transform: scale(1.1);
    /* Slightly increase size on hover */
}

.small-table {
    font-size: 0.8em;
    /* Smaller font size */
}

.small-table .p-datatable-header,
.small-table .p-datatable-footer {
    padding: 0.5rem;
    /* Reduce padding in header and footer */
}

.small-table .p-datatable-tbody > tr > td {
    padding: 0.5rem;
    /* Reduce padding in table cells */
    border: 1px solid #ccc;
    /* Add border to table cells */
}

.bordered-table {
    border: 1px solid #ccc;
    /* Add border to the table */
    border-collapse: collapse;
    /* Collapse borders */
}

.bordered-table .p-datatable-header {
    border-bottom: 2px solid #ccc;
    /* Thicker border for header */
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner {
    border: 8px solid rgba(255, 255, 255, 0.3);
    border-left-color: #007bff;

    border-radius: 50%;
    width: 50px;

    height: 50px;

    animation: spin 1s linear infinite;
}

.tooltip {
    position: relative;
    display: inline-block;
    transform: translateY(-10px);
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 500px;

    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 10px;
    position: absolute;

    top: 40%;

    left: 50%;

    margin-left: -520px;
    margin-top: -35px;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
    transition: visibility 0.5s;
}

.calendar-container {
    position: relative;
}

.label-from,
.label-to {
    position: absolute;

    left: -15px;

    top: -11px;

    font-size: 10px;

    color: #333;
}

.flex {
    display: flex;
}

.flex-1 {
    flex: 1;
}

.p-4 {
    padding: 1rem;
}
</style>
