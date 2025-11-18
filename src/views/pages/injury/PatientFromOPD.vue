<script setup>
import { onMounted, ref, provide, watch } from 'vue';
import { usePatientStore } from '../../../store/injury/PatientStore';
import createValidationRules from '../../../validation/doctorsInjuryValidation';
import useVuelidate from '@vuelidate/core';
import { useUserStore } from '../../../store/general/UserStore';
import InjuryService from '../../../service/InjuryService';
import ABTCForm from '../../../components/app/injury/opd/ABTCForm.vue';
import ProgressionDay from '../../../components/app/injury/opd/progressionDay.vue';
import { Vue3Lottie } from 'vue3-lottie';
import ABTCloading from '../../../assets/images/ABTCloading.json';

const patientStore = usePatientStore();
const validations = createValidationRules();
const v$ = useVuelidate(validations, patientStore.details);
const loading = ref(false);
const fetchingPatientData = ref(true);
const typesOfProphylaxis = ['PRE-EXPOSURE', 'POST-EXPOSURE'];
const enccode = ref();
const user = useUserStore();
const checkPatientTSSRecord = ref();
const caseLogDialog = ref(false);
const activeAccordionIndex = ref(0);
const patientData = ref(null);
const groupedCases = ref([]);
const injuryService = new InjuryService();
provide('v$', v$);

// Panel widths
const panel1Width = ref('3%');
const panel2Width = ref('95%');

const requestPhilhealthForm = () => {
    window.location.href = `http://192.168.6.58:8010/api/loginABTCPhilhealth?hpercode=${patientStore.header.hpercode}&employeeid=${user.value.employeeid}`;
};

// Hover function
const handleHover = (panel) => {
    if (patientStore.progressionDay !== '' && patientStore.type_prophylaxis !== '' && patientStore.type_prophylaxis !== undefined && patientStore.type_prophylaxis !== null) {
        if (panel === 'panel1') {
            panel1Width.value = '10%';
            panel2Width.value = '88%';
        } else {
            panel1Width.value = '3%';
            panel2Width.value = '95%';
        }
    }
};
// Date formatting function
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options).replace(/\//g, '-'); // Replace '/' with '-' for MM-DD-YYYY format
};

const handleMouseLeave = () => {
    if (patientStore.progressionDay !== '' && patientStore.type_prophylaxis !== '' && patientStore.type_prophylaxis !== undefined && patientStore.type_prophylaxis !== null) {
        panel1Width.value = '3%';
        panel2Width.value = '95%';
    }
};

const openCaseDialogLog = async () => {
    caseLogDialog.value = true;
    // console.log('hpercode; ', patientStore.header.hpercode);
    const patientsABTCLog = await injuryService.getPatientABTCLog(patientStore.header.hpercode);
    // console.log('patientsABTCLog: ', patientsABTCLog);
    groupPatientData(patientsABTCLog);
};

// const groupPatientData = (patientsABTCLog) => {
//     const grouped = patientsABTCLog.reduce((acc, curr) => {
//         const lockCase = curr.lockCase.trim();
//         const caseData = {
//             vaccineday: curr.vaccineday,
//             prophylaxis: curr.prophylaxis,
//             tStamp: curr.tStamp,
//             status: curr.status // Capture the status
//         };

//         if (!acc[lockCase]) {
//             acc[lockCase] = { lockCase, items: [caseData] }; // Store case data
//         } else {
//             acc[lockCase].items.push(caseData); // Add to existing lockCase
//         }
//         return acc;
//     }, {});

//     // Update the status based on the conditions
//     for (const key in grouped) {
//         const caseGroup = grouped[key];
//         const itemCount = caseGroup.items.length;
//         const latestProphylaxis = caseGroup.items[itemCount - 1].prophylaxis;

//         if (latestProphylaxis === 'POST-EXPOSURE' && itemCount >= 3) {
//             caseGroup.status = 'Finished';
//         } else if (latestProphylaxis === 'PRE-EXPOSURE' && itemCount >= 2) {
//             caseGroup.status = 'Finished';
//         } else {
//             caseGroup.status = 'Unfinished';
//         }
//     }

//     groupedCases.value = Object.values(grouped); // Set the grouped cases
// };
const groupPatientData = (patientsABTCLog) => {
    const grouped = patientsABTCLog.reduce((acc, curr) => {
        const lockCase = curr.lockCase.trim();
        const caseData = {
            vaccineday: curr.vaccineday,
            prophylaxis: curr.prophylaxis,
            tStamp: curr.tStamp,
            status: curr.status // Capture the status
        };

        if (!acc[lockCase]) {
            acc[lockCase] = { lockCase, items: [caseData] }; // Store case data
        } else {
            acc[lockCase].items.push(caseData); // Add to existing lockCase
        }
        return acc;
    }, {});

    // Update the status based on the conditions
    for (const key in grouped) {
        const caseGroup = grouped[key];
        const hasDay7 = caseGroup.items.some((item) => item.vaccineday === '7');

        // Set the status based on the presence of day 7
        if (hasDay7) {
            caseGroup.status = 'Finished';
        } else {
            caseGroup.status = 'Unfinished';
        }
    }

    groupedCases.value = Object.values(grouped); // Set the grouped cases
};

onMounted(async () => {
    loading.value = true;

    const fullUrl = window.location.href;
    const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
    const match3 = fullUrl.match(/[?&]access_token=([^&#]*)/);
    const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
    enccode.value = match ? match[1] : null;
    const empID = match2 ? match2[1] : null;
    const getToken = match3 ? match3[1] : null;

    if (localStorage.getItem('enccode') === enccode.value) {
        if (!localStorage.getItem('enccode')) {
            localStorage.setItem('authToken', getToken);
            localStorage.setItem('empID', empID);
            localStorage.setItem('enccode', enccode.value);
        } else if (!localStorage.getItem('authToken')) {
            localStorage.setItem('authToken', getToken);
        } else {
            localStorage.setItem('authToken', getToken);
            localStorage.setItem('empID', empID);
            localStorage.setItem('enccode', enccode.value);
        }
    } else {
        localStorage.setItem('authToken', getToken);
        localStorage.setItem('empID', empID);
        localStorage.setItem('enccode', enccode.value);
    }

    user.value = await user.getUserInfo();
    // await user.getUserInfo();
    // console.log('user info: ', user.value);

    if (!patientStore.enccode) {
        // console.log('hehe');

        enccode.value = localStorage.getItem('enccode') || enccode.value;
        patientData.value = await injuryService.getOPDPatientData(enccode.value);
        patientStore.OPDPatientData = patientData.value;
        console.log('patientData: ', patientData.value);
        await patientStore.loadOPDPatientData(patientData.value);

        const checkPatientTSSRecord = await injuryService.checkPatientTSSRecord(patientStore.header.hpercode);
        // console.log('checkPatientTSSRecord: ', checkPatientTSSRecord);
        patientStore.patientTSSRecord = checkPatientTSSRecord;
    }

    // Set initial values for detailsData
    const detailsData = patientStore.details;
    detailsData.preAdmissionData.inj_intent_code = patientStore.header.iicode;
    detailsData.preAdmissionData.place_occ_code = patientStore.header.poi;
    detailsData.hospitalFacilityData.diagnosis = patientStore.header.dx;

    // Default values
    Object.assign(detailsData.preAdmissionData, {
        place_occ_code: '10',
        activity_code: '99',
        inj_intent_code: '01'
    });
    Object.assign(detailsData.hospitalFacilityData, {
        status_code: '03',
        mode_transport_code: '03'
    });
    // console.log('test');

    // console.log('patdata: ', patientData.value.data.enccode);
    // console.log('pareEnccode: ', enccode.value);
    if (patientData.value.data.enccode.toLowerCase() === enccode.value.toLowerCase()) {
        // console.log('par: ', patientData.value.data.type_prophylaxis);
        // console.log('pat: ', patientData.value.data.progressionDay);

        console.log(patientStore.triggerDatasDay);
        patientStore.type_prophylaxis = patientData.value.data.type_prophylaxis;
        patientStore.progressionDay = patientData.value.data.progressionDay;
        patientStore.triggerDatasDay = true;
        console.log(patientStore.triggerDatasDay);
        //         console.log('par res: ', patientStore.type_prophylaxis);
        // console.log('pat res: ', patientStore.progressionDay);
    }
    loading.value = false;
});

// watch(
//     () => fetchingPatientData.value,
//     (newValue) => {
//         console.log('fetchingPatientData: ', newValue);
//     }
// );

watch(
    () => patientStore.type_prophylaxis,
    async (newValue) => {
        patientStore.progressionDay = '';
        // checkPatientTSSRecord.value = await injuryService.checkPatientTSSRecord(patientStore.header.hpercode, patientStore.type_prophylaxis);
        // checkPatientTSSRecord.value = await injuryService.checkPatientTSSRecord(patientStore.header.hpercode);
        // console.log('checkPatientTSSRecord: ', checkPatientTSSRecord.value);
        // patientStore.patientTSSRecord = checkPatientTSSRecord;
        if (newValue !== '' && newValue !== undefined && newValue !== null) {
            panel1Width.value = '10%';
            panel2Width.value = '88%';
        } else {
            panel1Width.value = '3%';
            panel2Width.value = '95%';
        }
    }
);

// watch(
//     () => patientStore.patientTSSRecord,
//     (newvalue) => {
//         console.log('patientTSSRecord: ', newvalue);
//     },
//     {
//         deep: true
//     }
// );
</script>

<template>
    <div style="width: 100%; height: 100vh">
        <div class="flex" style="height: 100%">
            <SelectButton
                v-model="patientStore.type_prophylaxis"
                :options="typesOfProphylaxis"
                aria-labelledby="basic"
                style="width: 2%"
                :label="'Prophylaxis'"
                :pt="{
                    root: {
                        style: {
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', // Center horizontally
                            justifyContent: 'center' // Center vertically
                        }
                    },
                    button: {
                        style: {
                            width: '90%',
                            height: '50%',
                            marginX: '5%', // Space between buttons, adjust as needed
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center' // Center text
                        }
                    },
                    label: {
                        style: {
                            writingMode: 'vertical-rl', // Vertical display
                            transform: 'rotate(180deg)', // Correct orientation
                            marginBottom: '10px' // Space between label and button
                        }
                    }
                }"
            />
            <div style="height: 100%" :style="{ width: panel1Width, backgroundColor: '#9bb0bf', transition: 'width 0.3s ease' }" class="flex justify-content-center" @mouseover="handleHover('panel1')" @mouseleave="handleMouseLeave">
                <div v-if="panel1Width === '3%'" class="vertical-text">
                    <strong>PROGRESSION DAY (DAY {{ patientStore.progressionDay }})</strong>
                </div>
                <ProgressionDay v-model:loading="fetchingPatientData" v-else />
            </div>
            <div style="height: 100%" :style="{ width: panel2Width, transition: 'width 0.3s ease' }" class="flex justify-content-center" @mouseover="handleHover('panel2')" @mouseleave="handleMouseLeave">
                <div style="height: 100%; width: 100%">
                    <!-- <SplitterPanel v-if="patientStore.progressionDay === '' || fetchingPatientData" style="height: 100%" :size="100"> -->
                    <SplitterPanel v-if="patientStore.progressionDay === '' || patientStore.loadSignal === true" style="height: 100%" :size="100">
                        <Splitter layout="vertical">
                            <SplitterPanel :size="5" class="flex sticky">
                                <div class="flex justify-content-center" style="width: 95%">
                                    <h1 class="font-bold">{{ patientStore.header.patname }}</h1>
                                    <h5 class="text-blue-800">
                                        <strong>{{ patientStore.header.hpercode }}</strong>
                                    </h5>
                                </div>

                                <i class="flex justify-content-center pi pi-bars" @click="openCaseDialogLog()" style="width: 5%; cursor: pointer"></i>
                            </SplitterPanel>
                            <SplitterPanel class="flex" :size="95">
                                <!-- {{ test }} -->
                                <!-- <img class="flex justify-content-center" src="@/assets/images/ABTCloader.gif" alt="Loading..." /> -->
                                <Vue3Lottie :animationData="ABTCloading" :height="200" :width="200" />
                            </SplitterPanel>
                        </Splitter>
                    </SplitterPanel>
                    <ABTCForm :enccode="enccode" v-else />
                </div>
            </div>
        </div>
        <Dialog v-model:visible="caseLogDialog" header="PATIENT's ABTC LOG" class="flex" :style="{ width: '25rem' }" position="topright" :modal="true" :draggable="false">
            <Accordion v-model:activeIndex="activeAccordionIndex">
                <AccordionTab v-for="(caseGroup, index) in groupedCases" :key="index" :header="`${formatDate(caseGroup.lockCase)} - ${caseGroup.status}`">
                    <div v-for="(caseItem, itemIndex) in caseGroup.items" :key="itemIndex">
                        <p class="m-0">
                            <strong>Vaccination Day:</strong> {{ caseItem.vaccineday }}<br />
                            <strong>Prophylaxis:</strong> {{ caseItem.prophylaxis }}<br />
                            <strong>Date:</strong> {{ formatDate(caseItem.tStamp) }}<br />
                        </p>
                        <!-- Add separator -->
                        <hr v-if="itemIndex < caseGroup.items.length - 1" style="margin: 10px 0; border: 1px solid #ccc" />
                    </div>
                </AccordionTab>
            </Accordion>
            <!-- <PhilhealthForm /> -->
            <Button class="flex justify-content-center" style="width: 100%; margin-top: 5%" label="Request Philhealth Form" @click="requestPhilhealthForm()" />
        </Dialog>
    </div>
</template>
1

<style scoped>
.flex {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vertical-text {
    writing-mode: vertical-rl;
    /* Vertical text */
    transform: rotate(180deg);
    /* Rotate text for correct orientation */
    font-size: 20px;
    /* Adjust font size if needed */
    color: white;
    /* Change color for better visibility */
}
</style>
