<script setup>
import { onMounted, ref, provide, defineAsyncComponent } from 'vue';
import { usePatientStore } from '../../../store/injury/PatientStore';
import createValidationRules from '../../../validation/injuryValidations';
import useVuelidate from '@vuelidate/core';
import NewForm from '../../../components/app/injury/doctorsForm/doctorForm.vue';
import { useUserStore } from '../../../store/general/UserStore';
const patientStore = usePatientStore();
const validations = createValidationRules();
const v$ = useVuelidate(validations, patientStore.details);
const loading = ref(false);
const detailsData = patientStore.details;
const enccode = ref();
const user = useUserStore();
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
    await user.getUserInfo();
    if (!patientStore.enccode) {
        if (!enccode.value) {
            enccode.value = localStorage.getItem('enccode');
            await patientStore.loadPatientData(enccode.value);
        } else {
            await patientStore.loadPatientData(enccode.value);
        }
    }
    detailsData.preAdmissionData.inj_intent_code = patientStore.header.iicode;
    detailsData.preAdmissionData.place_occ_code = patientStore.header.poi;
    detailsData.hospitalFacilityData.diagnosis = patientStore.header.dx;

    loading.value = false;
});
</script>
<template>
    <Transition name="slide-fade">
        <NewForm :enccode="enccode" />
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

