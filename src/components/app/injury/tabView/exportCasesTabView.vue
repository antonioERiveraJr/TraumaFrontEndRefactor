<script setup>
import { ref, defineAsyncComponent, watch } from 'vue';
import Dialog from 'primevue/dialog';
import { FilterMatchMode } from 'primevue/api';
import { usePatientStore } from '../../../../store/injury/PatientStore';
import LibraryService from '@/service/LibraryService';

// Props and Emits
const props = defineProps({
    isAdmit: { type: Boolean, required: true, default: false },
    list: { type: Array, required: true },
    filterValue: { type: String, required: false },
    loading: { type: Boolean, required: true },
    exportDone: { type: Boolean, required: false }
});
const emit = defineEmits(['update:selectedPatients']);

// Refs
const libraryService = new LibraryService();
const selectedPatient = ref(null);
const selectedPatients = ref([]);
const filteredExportList = ref([]);
const showPatientModal = ref(false);
const showGeneralData = ref(false);
const showGeneralDataNOI = ref(false);
const preAdmissionDataNew = ref(false);
const externalCauses = ref(false);
const showPatientDialogExport = ref(false);
const patientDetails = ref({});
const showSelected = ref(false);
const loadingPatientData = ref(false);

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.IN },
    date: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// Store
const patientStore = new usePatientStore();

// Dynamic Components
const GeneralData = defineAsyncComponent(() => import('@/components/app/injury/details/GeneralData.vue'));
const GeneralDataNOI = defineAsyncComponent(() => import('@/components/app/injury/details/GeneralDataNOI.vue'));
const PreAdmissionDataNew = defineAsyncComponent(() => import('@/components/app/injury/details/PreAdmissionDataNew.vue'));
const ExternalCauses = defineAsyncComponent(() => import('@/components/app/injury/details/ExternalCauses.vue'));

// Utility Functions
const conditionStatus = (data) => data.header.status;

const isConditionWarning = (data) => {
    const incidentTime = new Date(data.header.injtme);
    const admissionTime = new Date(data.header.admdate);
    const hoursDifference = (admissionTime - incidentTime) / (1000 * 60 * 60);
    return hoursDifference > 24;
};

const rowClass = (data) => (data.header.status === 'Warning' ? 'warning-row' : '');

const rowStyle = (data) => (data.header.status === 'Warning' ? { backgroundColor: '#ffcccc' } : {});

// Event Handlers
const onSelectionChange = (e) => {
    selectedPatients.value = e.value;
};

const onRowUnselect = (event) => {
    selectedPatients.value = selectedPatients.value.filter((patient) => patient.enccode !== event.data.enccode);
    // console.log('Selected Patients:', selectedPatients.value);
    emit('update:selectedPatients', selectedPatients.value);
};

async function onRowSelect(e) {
    try {
        if (!e || !e.data) return console.error('Row data is undefined or null');
        const enccodesInList = new Set(props.list.map((patient) => patient.enccode));
        selectedPatients.value = selectedPatients.value.filter((patient) => enccodesInList.has(patient.enccode));
        const patientMap = new Map();
        const enccodes = new Set();
        props.list.forEach((patient) => {
            if (!enccodes.has(patient.enccode)) {
                enccodes.add(patient.enccode);
                patientMap.set(patient.enccode, patient);
            }
        });

        emit('update:selectedPatients', selectedPatients.value);

        const enccode = e.data.enccode.trim();
        const patient = patientMap.get(enccode);
        if (!patient) return console.error('Patient not found for enccode:', enccode);

        patientStore.enccode = patient.enccode;
        patientStore.status = patient.status;
        patientStore.header = patient.header;
        patientStore.details = patient.details ?? patientStore.defaultDetails;

        selectedPatient.value = patient;
        showPatientModal.value = true;
    } catch (error) {
        console.error('Error selecting row:', error);
    }
}

const openPatientDetails = async (slotProps) => {
    loadingPatientData.value = true;
    selectedPatient.value = slotProps.data;

    transitions();

    // if (!patientStore.enccode) {
    //     if (patientStore.registry === 'old') {
    // const test = await patientStore.loadPatientDataDev(slotProps.data.enccode);
    // console.log('test: ', test);
    //     } else if (patientStore.registry === 'new') {
    //         await patientStore.loadPatientData(slotProps.data.enccode);
    //     }
    // }
    if (props.isAdmit) {
        console.log('slotpropss: ', slotProps.data.enccode);
        const response = await patientStore.loadAdmittedPatientData(slotProps.data.enccode);
        console.log('   response: ', response);
    } else {
        // console.log('slotprops: ', slotProps.data.enccode);
        await patientStore.loadPatientDataDev(slotProps.data.enccode);
    }

    loadingPatientData.value = false;
    showPatientDialogExport.value = true;
    if (patientStore.details.forTransportVehicularAccident.safe_not_applicable === 'Y') {
        patientStore.details.forTransportVehicularAccident.safe_none = 'N';
    }
    if (patientStore.details.forTransportVehicularAccident.risk_not_applicable === 'Y') {
        patientStore.details.forTransportVehicularAccident.risk_none = 'N';
    }
    // if (patientStore.details.ExternalCauseOfInjury.ext_others_external) {
    //     patientStore.details.ExternalCauseOfInjury.ext_other = 'Y';
    //     patientStore.details.ExternalCauseOfInjury.ext_other_sp = patientStore.details.ExternalCauseOfInjury.ext_others_external;
    // }

    // if (patientStore.details.natureOfInjury.noi_othersPhysical) {
    //     patientStore.details.natureOfInjury.noi_others = 'Y';
    //     patientStore.details.natureOfInjury.noi_otherinj = patientStore.details.natureOfInjury.noi_othersPhysical;
    // }
    if (patientStore.details.ExternalCauseOfInjury.ext_others_external !== null) {
        patientStore.details.ExternalCauseOfInjury.ext_others_external_preview = patientStore.details.ExternalCauseOfInjury.ext_others_external;
    }
    patientDetails.value = patientStore.details;
    if (patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor === 'Y') {
        patientStore.details.ExternalCauseOfInjury.ext_burn_r = 'Y';

        // Get burn details from doctor
        // const burnDetailsDoctor = libraryService.getBurnDetailsDoctor();

        // Determine the corresponding burn code based on the doctor's burn code
        const doctorBurnCode = patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor;

        if (doctorBurnCode === '98' || doctorBurnCode === '96' || doctorBurnCode === '93') {
            // Scalp Burn, Flash Burn, Contact Burn fall under Heat (01)
            patientStore.details.ExternalCauseOfInjury.ref_burn_code = '01'; // Heat
        } else if (doctorBurnCode === '99') {
            // Flame Burn
            patientStore.details.ExternalCauseOfInjury.ref_burn_code = '02'; // Fire
        } else if (doctorBurnCode === '97') {
            // Electrical Burn
            patientStore.details.ExternalCauseOfInjury.ref_burn_code = '03'; // Electricity
        } else if (doctorBurnCode === '95') {
            // Chemical Burn
            patientStore.details.ExternalCauseOfInjury.ref_burn_code = '06'; // Others, specify
            const burnDetailsDoctor = libraryService.getBurnDetailsDoctor();
            const burnDetail = burnDetailsDoctor.find((detail) => detail.ref_burn_code === doctorBurnCode);
            patientStore.details.ExternalCauseOfInjury.ext_burn_sp = burnDetail ? burnDetail.ref_burn_desc : 'Unknown Burn Type';
        } else if (doctorBurnCode === '94') {
            // Blast Injury
            patientStore.details.ExternalCauseOfInjury.ref_burn_code = '06'; // Others, specify
            const burnDetailsDoctor = libraryService.getBurnDetailsDoctor();
            const burnDetail = burnDetailsDoctor.find((detail) => detail.ref_burn_code === doctorBurnCode);
            patientStore.details.ExternalCauseOfInjury.ext_burn_sp = burnDetail ? burnDetail.ref_burn_desc : 'Unknown Burn Type';
        } else if (doctorBurnCode === '92') {
            // Others, Specify
            patientStore.details.ExternalCauseOfInjury.ref_burn_code = '06'; // Others, specify
            patientStore.details.ExternalCauseOfInjury.ext_burn_sp = patientStore.details.ExternalCauseOfInjury.ext_burn_sp_doctor;
        } else {
            patientStore.details.ExternalCauseOfInjury.ref_burn_code = 'Unknown Burn Type';
        }
    }
};

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
    }

    setTimeout(() => (showGeneralData.value = true), generaldata);
    setTimeout(() => (showGeneralDataNOI.value = true), generaldatanoi);
    setTimeout(() => (preAdmissionDataNew.value = true), preadmissiondata);
    setTimeout(() => (externalCauses.value = true), externalcauses);
}

// Watchers
watch(
    () => props.filterValue,
    (newValue) => (filters.value.global.value = newValue)
);

watch(
    () => patientStore.loadSignal,
    () => {
        showPatientDialogExport.value = false;
        patientStore.loadSignal = false;
        showSelected.value = false;
    },
    {
        deep: true
    }
);

watch(
    () => selectedPatients.value,
    () => {
        emit('update:selectedPatients', selectedPatients.value);

        if (selectedPatients?.value?.length > 0) {
            showSelected.value = true;
        } else {
            showSelected.value = false;
        }
    }
);
</script>

<template>
    <div>
        <div v-if="loadingPatientData" class="flex justify-content-center align-items-center" style="position: fixed; top: 0; left: 0; width: 100%; height: 98vh; backdrop-filter: blur(5px); z-index: 9999; background-color: rgba(255, 255, 255, 0.5)">
            <img src="@/assets/images/loader.gif" alt="Loading..." style="height: 10rem; width: 10rem" />
        </div>

        <div v-else>
            <!-- Main DataTable -->
            <div v-if="!showSelected">
                <DataTable
                    :value="props.list"
                    scrollHeight="53vh"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    v-model:selection="selectedPatients"
                    selectionMode="multiple"
                    dataKey="enccode"
                    :metaKeySelection="false"
                    @rowSelect="onRowSelect"
                    @rowUnselect="onRowUnselect"
                    @selectionChange="onSelectionChange"
                    responsiveLayout="scroll"
                    sortField="header.dispdate"
                    :sortOrder="-1"
                    class="p-datatable-sm shadow-2"
                    style="min-height: 90%; font-weight: bold"
                    :globalFilterFields="['header.patname', 'header.hpercode', 'header.status', 'header.injtme', 'header.injrem']"
                    stripedRows
                    :loading="!filteredExportList"
                    :rowClass="rowClass"
                    :rowStyle="rowStyle"
                    :virtualScrollerOptions="{ itemSize: 43 }"
                >
                    <ProgressBar mode="indeterminate" style="height: 6px" v-if="props.loading"></ProgressBar>
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column :sortable="true" :sortField="conditionStatus" style="width: 1.5%">
                        <template #body="slotProps">
                            <span>
                                <i v-if="isConditionWarning(slotProps.data)" class="pi pi-exclamation-circle" style="color: red; animation: zoom 0.5s infinite alternate; font-size: 20px"></i>
                            </span>
                        </template>
                    </Column>
                    <!-- <Column field="header.hpercode" header="Hospital No." :sortable="true"></Column> -->
                    <Column field="details.header.hpercode" header="Hospital No." :sortable="true">
                        <template #body="slotProps">
                            <span :style="{ backgroundColor: slotProps.data.header.disp_inpat ? 'yellow' : 'white' }">
                                {{ slotProps.data.header.hpercode }}
                            </span>
                        </template>
                    </Column>
                    <Column header="Patient Name" :sortable="true">
                        <template #body="slotProps">
                            <span class="font-bold" style="color: #3b82f6">{{ slotProps.data.header.patlast }}</span>
                            <span>, {{ slotProps.data.header.patfirst + ' ' + slotProps.data.header.patmiddle }}</span>
                        </template>
                    </Column>
                    <Column field="header.patsex" header="Sex"></Column>
                    <Column field="header.patage" header="Age" :sortable="true"></Column>
                    <Column field="header.injrem" header="Nature of Incident" :sortable="true">
                        <template #body="slotProps">
                            <span style="color: #22c55e">{{ slotProps.data.header.injrem }}</span>
                        </template>
                    </Column>
                    <Column field="header.injtme" header="Date/Time of Incident" :sortable="true"></Column>
                    <Column v-if="isAdmit" field="header.dispdate" header="Date/Time of Disposition" :sortable="true"></Column>
                    <Column headerStyle="width: 3rem; text-align: center" header="Edit" bodyStyle="text-align: center; overflow: visible">
                        <template #body="slotProps">
                            <Button icon="pi pi-user-edit" style="height: 2px" @click="openPatientDetails(slotProps)" />
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Splitter View -->
            <Splitter v-else>
                <SplitterPanel class="flex items-center justify-center" :size="65" :minSize="10">
                    <DataTable
                        :value="props.list"
                        scrollHeight="400px"
                        :paginator="true"
                        :rows="10"
                        :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        v-model:selection="selectedPatients"
                        selectionMode="multiple"
                        dataKey="enccode"
                        :metaKeySelection="false"
                        @rowSelect="onRowSelect"
                        @rowUnselect="onRowUnselect"
                        @selectionChange="onSelectionChange"
                        responsiveLayout="scroll"
                        sortField="header.injtme"
                        :sortOrder="-1"
                        class="p-datatable-sm shadow-2"
                        style="min-height: 90%; font-weight: bold; font-size: 10px; width: 100%"
                        :globalFilterFields="['header.patname', 'header.hpercode', 'header.status', 'header.injtme', 'header.injrem']"
                        stripedRows
                        :loading="!filteredExportList"
                        :rowClass="rowClass"
                        :rowStyle="rowStyle"
                        :virtualScrollerOptions="{ itemSize: 43 }"
                    >
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column :sortable="true" :sortField="conditionStatus" style="width: 1.5%">
                            <template #body="slotProps">
                                <span>
                                    <i v-if="isConditionWarning(slotProps.data)" class="pi pi-exclamation-circle" style="color: red; animation: zoom 0.5s infinite alternate; font-size: 20px"></i>
                                </span>
                            </template>
                        </Column>
                        <Column field="details.header.hpercode" header="Hospital No." :sortable="true">
                            <template #body="slotProps">
                                <span :style="{ backgroundColor: slotProps.data.header.disp_inpat ? 'yellow' : 'white' }">
                                    {{ slotProps?.data?.details?.header?.hpercode }}
                                </span>
                            </template>
                        </Column>
                        <Column header="Patient Name" :sortable="true">
                            <template #body="slotProps">
                                <span class="font-bold" style="color: #3b82f6">{{ slotProps?.data?.details?.header?.patlast }}</span>
                                <span>, {{ slotProps?.data?.details?.header?.patfirst + ' ' + slotProps?.data?.details?.header?.patmiddle }}</span>
                            </template>
                        </Column>
                        <Column field="details.header.patsex" header="Sex"></Column>
                        <Column field="details.header.patage" header="Age" :sortable="true"></Column>
                        <Column field="details.header.injrem" header="Nature of Incident" :sortable="true">
                            <template #body="slotProps">
                                <span style="color: #22c55e"> {{ slotProps?.data?.details?.header?.injrem?.[0] }}</span>
                            </template>
                        </Column>
                        <Column field="details.header.injtme" header="Date/Time of Incident" :sortable="true"></Column>
                        <Column headerStyle="width: 5rem; text-align: center" header="Edit" bodyStyle="text-align: center; overflow: visible">
                            <template #body="slotProps">
                                <Button icon="pi pi-user-edit" style="height: 2px" @click="openPatientDetails(slotProps)" />
                            </template>
                        </Column>
                    </DataTable>
                </SplitterPanel>
                <SplitterPanel class="flex items-center justify-center" :size="35">
                    <DataTable
                        :value="selectedPatients"
                        scrollHeight="400px"
                        :paginator="true"
                        :rows="7"
                        class="p-datatable-sm shadow-2"
                        :loading="!selectedPatients.length"
                        style="font-size: 10px; width: 100%"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="{totalRecords} selected patients."
                    >
                        <Column field="details.header.hpercode" header="Hospital No." :sortable="true"></Column>
                        <Column header="Patient Name" :sortable="true">
                            <template #body="slotProps">
                                <span class="font-bold" style="color: #3b82f6">{{ slotProps.data?.details?.header?.patlast }}</span>
                                <span>, {{ slotProps.data.details.header.patfirst + ' ' + slotProps.data?.details?.header?.patmiddle }}</span>
                            </template>
                        </Column>
                        <Column field="details.header.patage" header="Age" :sortable="true"></Column>
                        <Column field="details.header.patsex" header="Sex"></Column>
                        <Column field="details.header.injrem" header="Nature of Incident" :sortable="true">
                            <template #body="slotProps">
                                <span style="color: #22c55e">{{ slotProps.data?.details?.header?.injrem?.[0] }}</span>
                            </template>
                        </Column>
                        <Column field="details.header.injtme" header="Date/Time of Incident" :sortable="true"></Column>
                        <Column v-if="isAdmit" field="details.header.dispdate" header="Date/Time of Disposition" :sortable="true"></Column>
                    </DataTable>
                </SplitterPanel>
            </Splitter>

            <!-- Dialog -->
            <Dialog v-model:visible="showPatientDialogExport" maximizable modal header="Patient Injury Form" :style="{ width: '99%' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
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
            </Dialog>
        </div>
    </div>
</template>
