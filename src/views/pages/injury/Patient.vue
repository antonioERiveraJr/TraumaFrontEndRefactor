<script setup>
import { onMounted, ref, provide, defineAsyncComponent, onUnmounted } from 'vue';
import { usePatientStore } from '../../../store/injury/PatientStore';
import createValidationRules from '../../../validation/injuryValidations';
import useVuelidate from '@vuelidate/core';
import InjuryService from '../../../service/InjuryService';
import NewForm from '../../../components/app/injury/newDoctorForm/newForm.vue';

const GeneralData = defineAsyncComponent(() => import('@/components/app/injury/doctorsForm/GeneralDataDoctor.vue'));
const GeneralDataNOI = defineAsyncComponent(() => import('@/components/app/injury/doctorsForm/GeneralDataNOIDoctor.vue'));
const PreAdmissionDataNew = defineAsyncComponent(() => import('@/components/app/injury/doctorsForm/PreAdmissionDataNewDoctor.vue'));
const ExternalCauses = defineAsyncComponent(() => import('@/components/app/injury/doctorsForm/ExternalCausesDoctor.vue'));
const EntryOfDoctors = defineAsyncComponent(() => import('@/components/app/injury/doctorsForm/entryOfDoctors.vue'));
const injuryService = new InjuryService();
const patientStore = usePatientStore();
const showGeneralData = ref(false);
const showGeneralDataNOI = ref(false);
const preAdmissionDataNew = ref(false);
const externalCauses = ref(false);
const validations = createValidationRules();
const v$ = useVuelidate(validations, patientStore.details);
const child = ref(null);
const detailsData = patientStore.details;
const goToNewForm = ref(false);
const toggleNewForm = () => {
    goToNewForm.value = goToNewForm.value ? false : true;
};
provide('v$', v$);

onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const enccodeFromHash = hash.split('/').pop();
    if (enccodeFromHash) {
        urlParams.set('enccode', enccodeFromHash);
    }
    const enccode = urlParams.get('enccode');

    patientStore.enccode = enccode;
    if (!patientStore.enccode) {
        if (!enccode) {
            const storedEnccode = localStorage.getItem('enccode');
            if (storedEnccode) {
                patientStore.enccode = storedEnccode;
                await patientStore.loadPatientDataDev(storedEnccode);
            } else {
                console.error('No enccode found in localStorage');
            }
        } else {
            await patientStore.loadPatientDataDev(enccode);
        }
    } else {
        await patientStore.loadPatientDataDev(enccode);
    }

    detailsData.preAdmissionData.inj_intent_code = patientStore.header.iicode;
    detailsData.preAdmissionData.place_occ_code = patientStore.header.poi;
    detailsData.hospitalFacilityData.diagnosis = patientStore.header.dx;

    transitions();
});

onUnmounted(async () => {
    try {
        const latestEntry = await injuryService.getLatestEntryOfDoctors(patientStore.enccode);
        const latestTStamp = latestEntry.tStamp;
        const latestDiag = latestEntry.diagtext;
        const diagId = latestEntry.id;
        const enccode = latestEntry.enccode;
        await injuryService.updatePrimediag(enccode, latestDiag, latestTStamp, diagId);
    } catch (error) {
        console.error('Error updating primary diagnosis:', error);
    }
});

function transitions() {
    const mqSmall = window.matchMedia('(max-width: 767px)');
    const mqMedium = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const mqLarge = window.matchMedia('(min-width: 1024px)');

    let generaldata, generaldatanoi, preadmissiondata, externalcauses;

    if (mqSmall.matches) {
        generaldata = 50;
        generaldatanoi = generaldata + 50;
        preadmissiondata = generaldatanoi + 50;
        externalcauses = preadmissiondata + 50;
    } else if (mqMedium.matches) {
        generaldata = 150;
        generaldatanoi = generaldata + 50;
        preadmissiondata = generaldata + 50;
        externalcauses = preadmissiondata + 50;
    } else if (mqLarge.matches) {
        generaldatanoi = 200;
        preadmissiondata = generaldatanoi + 50;
        generaldata = generaldatanoi + 50;
        externalcauses = generaldatanoi + 50;
    } else {
        generaldatanoi = 300;
        preadmissiondata = generaldatanoi + 50;
        generaldata = preadmissiondata + 50;
        externalcauses = generaldata + 50;
    }

    setTimeout(() => {
        showGeneralData.value = true;
    }, generaldata);
    setTimeout(() => {
        showGeneralDataNOI.value = true;
    }, generaldatanoi);
    setTimeout(() => {
        preAdmissionDataNew.value = true;
    }, preadmissiondata);
    setTimeout(() => {
        externalCauses.value = true;
    }, externalcauses);
}
</script>

<template>
    <i @click="toggleNewForm()" icon="pi pi-check" aria-label="Filter" class="pi pi-external-link fixed bottom-5 m-2 right-5 z-50 rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:scale-110" style="color: green"> </i>
    <div class="bg">
        <Transition name="slide-fade">
            <NewForm v-if="goToNewForm" />
        </Transition>
        <Transition>
            <div v-if="!goToNewForm">
                <h1 class="flex my-auto font-bold justify-content-center">TRAUMA SURVEILLANCE SYSTEM FORM</h1>
                <div class="grid grid-cols-4 gap-4 justify-content-center mt-1">
                    <div class="generaldata">
                        <Transition name="slide-fade" mode="out-in">
                            <GeneralData class="w-min" v-if="showGeneralData" />
                        </Transition>
                    </div>
                    <div class="generaldatanoi">
                        <Transition name="slide-fade" mode="out-in">
                            <GeneralDataNOI v-if="showGeneralDataNOI" ref="child" />
                        </Transition>
                    </div>
                    <div class="preadmissiondata">
                        <Transition name="slide-fade" mode="out-in">
                            <PreAdmissionDataNew v-if="preAdmissionDataNew" />
                        </Transition>
                    </div>
                    <div class="externalcauses">
                        <Transition name="slide-fade" mode="out-in">
                            <ExternalCauses v-if="externalCauses" />
                        </Transition>
                    </div>
                </div>
                <div class="ml-5">
                    <EntryOfDoctors :enccode="patientStore.enccode" />
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.slide-fade-enter-active {
    transition: all 0.4s ease-out;
}

.bg {
    background: url('@/assets/images/BGHMC.png') no-repeat center center fixed;
}
.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

.bg::before {
    content: '';
    background: url('@/assets/images/BGHMC.png') no-repeat center center fixed;
    opacity: 0.1;
}
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>

