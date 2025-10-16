<script setup>
import { onMounted, ref, provide, watch } from 'vue';
import { usePatientStore } from '../../../store/injury/PatientStore';
import createValidationRules from '../../../validation/doctorsInjuryValidation';
import useVuelidate from '@vuelidate/core';
import { useUserStore } from '../../../store/general/UserStore';
import InjuryService from '../../../service/InjuryService';
import ABTCForm from '../../../components/app/injury/opd/ABTCForm.vue';
import ProgressionDay from '../../../components/app/injury/opd/progressionDay.vue';

const patientStore = usePatientStore();
const validations = createValidationRules();
const v$ = useVuelidate(validations, patientStore.details);
const loading = ref(false);
const fetchingPatientData = ref(true);
const typesOfProphylaxis = ['PRE-EXPOSURE', 'POST-EXPOSURE'];
const enccode = ref();
const user = useUserStore();
const checkPatientTSSRecord = ref();
const patientData = ref(null);
const injuryService = new InjuryService();
provide('v$', v$);

// Panel widths
const panel1Width = ref('3%');
const panel2Width = ref('95%');

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

const handleMouseLeave = () => {
    if (patientStore.progressionDay !== '' && patientStore.type_prophylaxis !== '' && patientStore.type_prophylaxis !== undefined && patientStore.type_prophylaxis !== null) {
        panel1Width.value = '3%';
        panel2Width.value = '95%';
    }
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

    // const userInfo = await user.getUserInfo();
    await user.getUserInfo();
    // console.log('user info: ', userInfo);

    if (!patientStore.enccode) {
        // console.log('hehe');

        enccode.value = localStorage.getItem('enccode') || enccode.value;
        patientData.value = await injuryService.getOPDPatientData(enccode.value);
        // console.log('patientData: ', patientData.value);
        await patientStore.loadOPDPatientData(patientData.value);
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
        checkPatientTSSRecord.value = await injuryService.checkPatientTSSRecord(patientStore.header.hpercode, patientStore.type_prophylaxis);
        // console.log('checkPatientTSSRecord: ', checkPatientTSSRecord.value);
        patientStore.patientTSSRecord = checkPatientTSSRecord;
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
                            <SplitterPanel style="background-color: #e5e5e5" :size="5" class="flex justify-content-center sticky">
                                <h1 class="font-bold">{{ patientStore.header.patname }}</h1>
                                <h5 class="text-blue-800">
                                    <strong>{{ patientStore.header.hpercode }}</strong>
                                </h5>
                            </SplitterPanel>
                            <SplitterPanel class="flex" :size="95">
                                <img class="flex justify-content-center" src="@/assets/images/ABTCloader.gif" alt="Loading..." />
                            </SplitterPanel>
                        </Splitter>
                    </SplitterPanel>
                    <ABTCForm :enccode="enccode" v-else />
                </div>
            </div>
        </div>
    </div>
</template>

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
