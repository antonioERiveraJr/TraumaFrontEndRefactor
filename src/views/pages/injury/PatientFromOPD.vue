<script setup>
import { onMounted, ref, provide } from 'vue';
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
const enccode = ref();
const user = useUserStore();
const patientData = ref(null);
const injuryService = new InjuryService();
provide('v$', v$);

// Panel widths
const panel1Width = ref('20%');
const panel2Width = ref('80%');

// Hover function
const handleHover = (panel) => {
    if (patientStore.progressionDay !== '') {
        if (panel === 'panel1') {
            panel1Width.value = '20%';
            panel2Width.value = '80%';
        } else {
            panel1Width.value = '3%';
            panel2Width.value = '97%';
        }
    }
};

const handleMouseLeave = () => {
    if (patientStore.progressionDay !== '') {
        panel1Width.value = '3%';
        panel2Width.value = '97%';
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
        }
    } else {
        localStorage.setItem('authToken', getToken);
        localStorage.setItem('empID', empID);
        localStorage.setItem('enccode', enccode.value);
    }

    const userInfo = await user.getUserInfo();
    console.log('user info: ', userInfo);

    if (!patientStore.enccode) {
        enccode.value = localStorage.getItem('enccode') || enccode.value;
        patientData.value = await injuryService.getOPDPatientData(enccode.value);
        patientStore.loadOPDPatientData(patientData.value);
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
</script>

<template>
    <div style="width: 100%; height: 100%">
        <div class="flex" style="height: 100%">
            <div style="height: 100vh" :style="{ width: panel1Width, backgroundColor: '#9bb0bf', transition: 'width 0.3s ease' }" class="flex justify-content-center" @mouseover="handleHover('panel1')" @mouseleave="handleMouseLeave">
                <div v-if="panel1Width === '3%'" class="vertical-text">
                    <strong>PROGRESSION DAY (DAY {{ patientStore.progressionDay }})</strong>
                </div>
                <ProgressionDay v-else />
            </div>
            <div style="height: 100vh" :style="{ width: panel2Width, transition: 'width 0.3s ease' }" class="flex justify-content-center" @mouseover="handleHover('panel2')" @mouseleave="handleMouseLeave">
                <div style="height: 100%; width: 100%">
                    <ABTCForm :enccode="enccode" v-if="patientStore.progressionDay !== ''" />
                    <SplitterPanel v-else style="height: 100%" :size="100">
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
