<script setup>
import { ref, defineAsyncComponent, watch } from 'vue';
import Dialog from 'primevue/dialog';
import { usePatientStore } from '../../../../store/injury/PatientStore';
import { FilterMatchMode } from 'primevue/api';

const injuryList = ref([]);
const selectedPatient = ref(null);
const patientStore = new usePatientStore();
const showPatientModal = ref(false);
const GeneralData = defineAsyncComponent(() => import('@/components/app/injury/details/GeneralData.vue'));
const GeneralDataNOI = defineAsyncComponent(() => import('@/components/app/injury/details/GeneralDataNOI.vue'));
const PreAdmissionDataNew = defineAsyncComponent(() => import('@/components/app/injury/details/PreAdmissionDataNew.vue'));
const ExternalCauses = defineAsyncComponent(() => import('@/components/app/injury/details/ExternalCauses.vue'));
const showGeneralData = ref(false);
const showGeneralDataNOI = ref(false);
const preAdmissionDataNew = ref(false);
const externalCauses = ref(false);

const props = defineProps({
    list: {
        type: Array,
        required: true
    },
    filterValue: {
        type: String,
        required: false
    },
    loading: {
        type: Boolean,
        required: true
    },
    newList: {
        type: Boolean,
        required: false,
        default: false
    }
});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.IN },
    date: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const conditionStatus = (data) => {
    return data.header.status;
};

const isConditionWarning = (data) => {
    const incidentTime = new Date(data.header.injtme);
    const admissionTime = new Date(data.header.admdate);
    const timeDifference = admissionTime - incidentTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference > 24;
};

const rowClass = (data) => {
    return data.header.status === 'Warning' ? 'warning-row' : '';
};

const rowStyle = (data) => {
    return data.header.status === 'Warning' ? { backgroundColor: '#ffcccc' } : {};
};

async function onRowSelect(e) {
    try {
        console.log('Looking for enccode: ', e.data.enccode);
        transitions();
        showPatientModal.value = true;
        if (!e || !e.data) {
            console.error('Row data is undefined or null');
            return;
        }
        const patientMap = new Map();
        const enccodes = new Set();
        props.list.forEach((patient) => {
            if (enccodes.has(patient.enccode)) {
                console.warn(`Duplicate enccode found: ${patient.enccode}`);
            } else {
                enccodes.add(patient.enccode);
                patientMap.set(patient.enccode, patient);
            }
        });
        const patientStore = usePatientStore();
        const enccode = e.data.enccode.trim();
        const patient = patientMap.get(enccode);

        if (!patient) {
            console.error('Patient not found for enccode:', enccode);
            return;
        }

        patientStore.enccode = patient.enccode;
        patientStore.status = patient.status;
        patientStore.header = patient.header;
        patientStore.details = patient.details ?? patientStore.defaultDetails;

        selectedPatient.value = patient;
    } catch (error) {
        console.error('Error selecting row:', error);
    }
}

function transitions() {
    const mqSmall = window.matchMedia('(max-width: 767fpx)');
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

watch(
    () => props.filterValue,
    (newValue) => {
        filters.value.global.value = newValue;
    }
);
watch(
    () => patientStore.loadSignal,
    () => {
        showPatientModal.value = false;
    },
    { deep: true }
);
watch(
    () => props.loading,
    (newV) => {
        if (newV) {
            showPatientModal.value = false;
        }
        showPatientModal.value = false;
    }
);
</script>

<template>
    <div>
        <DataTable
            :value="props.list"
            paginator
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            scrollHeight="400px"
            v-model:filters="filters"
            selectionMode="single"
            dataKey="enccode"
            :metaKeySelection="false"
            @rowSelect="onRowSelect"
            responsiveLayout="scroll"
            sortField="header.injtme"
            :sortOrder="-1"
            class="p-datatable-sm shadow-2"
            style="min-height: 100%; font-weight: bold"
            :globalFilterFields="['header.patname', 'header.hpercode', 'header.status', 'header.injtme', 'header.injrem']"
            stripedRows
            :loading="!injuryList"
            :rowClass="rowClass"
            :rowStyle="rowStyle"
            ><ProgressBar mode="indeterminate" style="height: 6px" v-if="props.loading"></ProgressBar>
            <Column :sortable="true" :sortField="conditionStatus" style="width: 1.5%">
                <template #body="slotProps">
                    <span>
                        <i v-if="isConditionWarning(slotProps.data)" class="pi pi-exclamation-circle" style="color: red; animation: zoom 0.5s infinite alternate; font-size: 20px"></i>
                    </span>
                </template>
            </Column>
            <Column field="header.hpercode" header="Hospital No." :sortable="true"></Column>
            <Column header="Patient Name" :sortable="true">
                <template #body="slotProps">
                    <span class="font-bold" style="color: #0a59da">{{ slotProps.data.header.patlast }}</span>
                    <span>, {{ slotProps.data.header.patfirst + ' ' + slotProps.data.header.patmiddle }}</span>
                </template>
            </Column>
            <Column field="header.patsex" header="Sex"></Column>
            <Column field="header.patage" header="Age" :sortable="true"></Column>
            <Column field="header.injrem" header="Nature of Incident" :sortable="true">
                <template #body="slotProps">
                    <span style="color: #147638">{{ slotProps.data.header.injrem }}</span>
                </template>
            </Column>
            <Column field="header.injtme" header="Date/Time of Incident" :sortable="true"></Column>
        </DataTable>
        <Dialog v-model:visible="showPatientModal" maximizable modal header="Patient Injury Form" :style="{ width: '99%' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" @hide="patientStore.resetDialog()">
            <template v-if="selectedPatient">
                <div v-if="isConditionWarning(selectedPatient)" class="warning-notice" style="color: red; font-weight: bold; margin-bottom: 10px">
                    <i class="pi pi-exclamation-circle"></i> The time elapsed between the injury and the patient's arrival at the emergency room is more than 24 hours.
                </div>
                <div class="grid grid-cols-4 gap-4 justify-content-center mt-1">
                    <div class="generaldata w-1/4">
                        <Transition name="slide-fade" mode="out-in">
                            <GeneralData v-if="showGeneralData" />
                        </Transition>
                    </div>
                    <div class="generaldatanoi w-1/4">
                        <Transition name="slide-fade" mode="out-in">
                            <GeneralDataNOI v-if="showGeneralDataNOI" />
                        </Transition>
                    </div>
                    <div class="preadmissiondata w-1/4">
                        <Transition name="slide-fade" mode="out-in">
                            <PreAdmissionDataNew v-if="preAdmissionDataNew" />
                        </Transition>
                    </div>
                    <div class="externalcauses w-1/4">
                        <Transition name="slide-fade" mode="out-in">
                            <ExternalCauses v-if="externalCauses" />
                        </Transition>
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>
<style>
.sticky {
    position: sticky;
    top: 0;
    border-bottom: 2px solid #475d74;
    background-color: white;
    z-index: 10;
}
.card-container > div {
    width: 24%; /* Default width */
}

@media (max-width: 1199px) {
    .card-container > div {
        width: 48%; /* Adjust for medium screens */
    }
}

@media (max-width: 575px) {
    .card-container > div {
        width: 90%; /* Adjust for mobile screens */
    }
}
.warning-notice {
    padding: 10px;
    border: 1px solid red;
    border-radius: 5px;
    background-color: #ffe6e6;
    /* Light red background */
}
</style>
