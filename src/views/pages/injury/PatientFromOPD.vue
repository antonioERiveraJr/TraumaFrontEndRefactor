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
const caseLogDialog = ref(false);
const activeAccordionIndex = ref(0);
const patientData = ref(null);
const groupedCases = ref([]);
const injuryService = new InjuryService();
provide('v$', v$);

// Panel widths (CLICK TOGGLE)
const panel1Width = ref('3%');
const panel2Width = ref('95%');
const isExpanded = ref(false);

const togglePanel = () => {
    if (patientStore.progressionDay !== '' && patientStore.type_prophylaxis !== '' && patientStore.type_prophylaxis !== undefined && patientStore.type_prophylaxis !== null) {
        isExpanded.value = !isExpanded.value;

        if (isExpanded.value) {
            panel1Width.value = '10%';
            panel2Width.value = '88%';
        } else {
            panel1Width.value = '3%';
            panel2Width.value = '95%';
        }
    }
};

const requestPhilhealthForm = () => {
    window.location.href = `http://192.168.6.58:8010/api/loginABTCPhilhealth?hpercode=${patientStore.header.hpercode}&employeeid=${user.value.employeeid}`;
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options).replace(/\//g, '-');
};

const openCaseDialogLog = async () => {
    caseLogDialog.value = true;
    const patientsABTCLog = await injuryService.getPatientABTCLog(patientStore.header.hpercode);
    groupPatientData(patientsABTCLog);
};

const groupPatientData = (patientsABTCLog) => {
    const grouped = patientsABTCLog.reduce((acc, curr) => {
        const dogbiteDegree = ref();

        if (curr && curr.data) {
            let parsedData;

            try {
                parsedData = JSON.parse(curr.data);
            } catch {
                return;
            }

            const externalCause = parsedData.ExternalCauseOfInjury;

            if (externalCause) {
                dogbiteDegree.value = externalCause.dogbiteDegree;
            }
        }

        const lockCase = curr.lockCase.trim();
        const caseData = {
            dogbiteDegree,
            vaccineday: curr.vaccineday,
            prophylaxis: curr.prophylaxis,
            tStamp: curr.tStamp,
            status: curr.status
        };

        if (!acc[lockCase]) {
            acc[lockCase] = { lockCase, items: [caseData] };
        } else {
            acc[lockCase].items.push(caseData);
        }
        return acc;
    }, {});

    for (const key in grouped) {
        const caseGroup = grouped[key];
        const hasDay7 = caseGroup.items.some((item) => item.vaccineday === '7');
        const isFirstDegree = caseGroup.items.some((item) => item.dogbiteDegree.value === 'I');

        caseGroup.status = hasDay7 || isFirstDegree ? 'Finished' : 'Unfinished';
    }

    groupedCases.value = Object.values(grouped);
};

onMounted(async () => {
    loading.value = true;

    const fullUrl = window.location.href;
    const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
    const matchToken = fullUrl.match(/[?&]access_token=([^&#]*)/);
    const matchEmpID = fullUrl.match(/[?&]empID=([^&#]*)/);

    enccode.value = match ? match[1] : null;
    const empID = matchEmpID ? matchEmpID[1] : null;
    const getToken = matchToken ? matchToken[1] : null;

    if (localStorage.getItem('enccode') === enccode.value) {
        localStorage.setItem('authToken', getToken);
        localStorage.setItem('empID', empID);
        localStorage.setItem('enccode', enccode.value);
    } else {
        localStorage.setItem('authToken', getToken);
        localStorage.setItem('empID', empID);
        localStorage.setItem('enccode', enccode.value);
    }

    user.value = await user.getUserInfo();

    if (!patientStore.enccode) {
        enccode.value = localStorage.getItem('enccode') || enccode.value;
        patientData.value = await injuryService.getOPDPatientData(enccode.value);
        patientStore.OPDPatientData = patientData.value;
        await patientStore.loadOPDPatientData(patientData.value);

        const checkPatientTSSRecord = await injuryService.checkPatientTSSRecord(patientStore.header.hpercode);
        patientStore.patientTSSRecord = checkPatientTSSRecord;
    }

    const detailsData = patientStore.details;
    detailsData.preAdmissionData.inj_intent_code = patientStore.header.iicode;
    detailsData.preAdmissionData.place_occ_code = patientStore.header.poi;
    detailsData.hospitalFacilityData.diagnosis = patientStore.header.dx;

    Object.assign(detailsData.preAdmissionData, {
        place_occ_code: '10',
        activity_code: '99',
        inj_intent_code: '01'
    });
    Object.assign(detailsData.hospitalFacilityData, {
        status_code: '03',
        mode_transport_code: '03'
    });

    if (patientData.value.data?.enccode.toLowerCase() === enccode?.value?.toLowerCase()) {
        patientStore.type_prophylaxis = patientData.value.data.type_prophylaxis;
        patientStore.progressionDay = patientData.value.data.progressionDay;
    }

    loading.value = false;
});

watch(
    () => patientStore.type_prophylaxis,
    (newValue) => {
        patientStore.progressionDay = '';

        if (newValue) {
            panel1Width.value = '10%';
            panel2Width.value = '88%';
            isExpanded.value = true;
        } else {
            panel1Width.value = '3%';
            panel2Width.value = '95%';
            isExpanded.value = false;
        }
    }
);
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
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    },
                    button: {
                        style: {
                            width: '90%',
                            height: '50%',
                            marginX: '5%',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }
                    },
                    label: {
                        style: {
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            marginBottom: '10px'
                        }
                    }
                }"
            />
            <!-- CLICKABLE PANEL -->
            <div style="height: 100%" :style="{ width: panel1Width, backgroundColor: '#9bb0bf', transition: 'width 0.3s ease' }" class="flex justify-content-center" @click="togglePanel">
                <div v-if="panel1Width === '3%'" class="vertical-text">
                    <strong>PROGRESSION DAY (DAY {{ patientStore.progressionDay }})</strong>
                </div>

                <ProgressionDay v-else v-model:loading="fetchingPatientData" />
            </div>

            <!-- RIGHT PANEL -->
            <div style="height: 100%" :style="{ width: panel2Width, transition: 'width 0.3s ease' }" class="flex justify-content-center">
                <div style="height: 100%; width: 100%">
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

                        <hr v-if="itemIndex < caseGroup.items.length - 1" style="margin: 10px 0; border: 1px solid #ccc" />
                    </div>
                </AccordionTab>
            </Accordion>

            <Button style="width: 100%; margin-top: 5%" label="Request Philhealth Form" @click="requestPhilhealthForm" />
        </Dialog>
    </div>
</template>
<style scoped>
.flex {
    display: flex;
    align-items: center;
    justify-content: center;
}
.vertical-text {
    writing-mode: vertical-rl; /* Vertical text */
    transform: rotate(180deg); /* Rotate text for correct orientation */
    font-size: 20px; /* Adjust font size if needed */
    color: white; /* Change color for better visibility */
}
</style>
