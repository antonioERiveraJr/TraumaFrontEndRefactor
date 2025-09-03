<script setup>
import { onMounted, ref, provide, watch } from 'vue';
import { usePatientStore } from '../../../store/injury/PatientStore';
import createValidationRules from '../../../validation/doctorsInjuryValidation';
import useVuelidate from '@vuelidate/core';
import ABTCForm from '../../../components/app/injury/opd/abtcForm.vue';
import { useUserStore } from '../../../store/general/UserStore';
import InjuryService from '../../../service/InjuryService';
import ProgressionDay from '../../../components/app/injury/opd/progressionDay.vue';
import FollowUpForm from '../../../components/app/injury/opd/followUpForm.vue';

const patientStore = usePatientStore();
const validations = createValidationRules();
const v$ = useVuelidate(validations, patientStore.details);
const loading = ref(false);
const detailsData = patientStore.details;
const enccode = ref();
const patientsTSSRecordLoaded = ref();
const user = useUserStore();
const patientData = ref(null);
const injuryService = new InjuryService();
provide('v$', v$);
onMounted(async () => {
    loading.value = true;
    const fullUrl = window.location.href;
    const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
    const match3 = fullUrl.match(/[?&]access_token=([^&#]*)/);
    const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
    enccode.value = match ? match[1] : null;
    const empID = match2 ? match2[1] : null;
    const getToken = match3 ? match3[1] : null;
    if (localStorage.getItem('enccode') === null) {
        localStorage.setItem('authToken', getToken);
        localStorage.setItem('empID', empID);
        localStorage.setItem('enccode', enccode.value);
    } else if (localStorage.getItem('authToken') === null) {
        localStorage.setItem('authToken', getToken);
    }
    const userInfo = await user.getUserInfo();
    console.log('user info: ', userInfo);
    if (!patientStore.enccode) {
        if (!enccode.value) {
            enccode.value = localStorage.getItem('enccode');
            patientData.value = await injuryService.getOPDPatientData(enccode.value);
            console.log('Patient data: ', patientData.value);
            patientStore.loadOPDPatientData(patientData.value);
            console.log(patientStore);
        } else {
            patientData.value = await injuryService.getOPDPatientData(enccode.value);
            console.log('Patient data: ', patientData.value);
            patientStore.loadOPDPatientData(patientData.value);
            console.log(patientStore);
        }
    }
    detailsData.preAdmissionData.inj_intent_code = patientStore.header.iicode;
    detailsData.preAdmissionData.place_occ_code = patientStore.header.poi;
    detailsData.hospitalFacilityData.diagnosis = patientStore.header.dx;

    loading.value = false;
});
watch(
    () => patientStore.patientTSSRecord,
    (newValue) => {
        patientsTSSRecordLoaded.value = newValue;
        console.log('patientsTSSRecordLoaded: ', patientsTSSRecordLoaded);
    }
);
</script>
<template>
    <Transition name="slide-fade">
        <ABTCForm v-if="!patientsTSSRecordLoaded?.data[0] && patientStore.progressionDay !== ''" :enccode="enccode" />
        <ProgressionDay v-if="patientStore.progressionDay === ''" />
        <FollowUpForm v-if="patientsTSSRecordLoaded?.data[0]" />
    </Transition>
</template>

<style scoped>
.loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

.slide-fade-enter-active {
    transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>
