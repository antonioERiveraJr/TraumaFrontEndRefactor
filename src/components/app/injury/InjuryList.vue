<script setup>
import { watch, onMounted, ref, provide, computed } from 'vue';
import InjuryService from '@/service/InjuryService';
import { usePatientStore } from '../../../store/injury/PatientStore';
import { useRouter } from 'vue-router';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { FilterMatchMode } from 'primevue/api';
import Swal from 'sweetalert2';
import useToastWaitingForFetch from '@/composables/useToastWaitingForFetch';
import { useToast } from 'primevue/usetoast';
import useVuelidate from '@vuelidate/core';
import createValidationRules from '../../../validation/injuryValidations';
import moment from 'moment';
import 'primeicons/primeicons.css';
import { useNow } from '@vueuse/core';
import InjuryCasesTabView from './tabView/injuryCasesTabView.vue';
import ExportCasesTabView from './tabView/exportCasesTabView.vue';
import ArchivedTabView from './tabView/archivedTabView.vue';
import StashCasesTabView from './tabView/stashCasesTabView.vue';
import { useUserStore } from '../../../store/general/UserStore';

const user = useUserStore();
const props = defineProps({
    savedStartDate: {
        type: String,
        required: true
    },
    savedEndDate: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    searchValue: {
        type: String,
        required: false
    }
});

const dateDescription = ref(null);
const selectedPatients = ref([]);
const selectedEnccodes = ref([]);
const showT = ref(true);
const forArchived = ref(null);
const archivedDialogVisible = ref(false);
const patientStore = usePatientStore();
const showGeneralData = ref(false);
const showGeneralDataNOI = ref(false);
const preAdmissionDataNew = ref(false);
const externalCauses = ref(false);
const validations = createValidationRules();
const v$ = useVuelidate(validations, patientStore.details);
const injuryService = new InjuryService();
const injuryList = ref(null);
const patientMap = new Map();
const showPatientDialogExport = ref(false);
const filterValue = ref(null);
const showPatientModal = ref(false);
const selectedPatient = ref([]);
const router = useRouter();
const toast = useToast();
const formattedStartDate = ref(moment(new Date(props.savedStartDate)).format('MM/DD/YYYY'));
const formattedEndDate = ref(moment(new Date(props.savedEndDate)).format('MM/DD/YYYY'));
const exportDone = ref(false);
const exporting = ref(false);
const originalForArchived = ref(null);
const activePanel = ref(0);
const selectedDate = ref(null);
const uniqueArchivedItems = ref([]);
const groupedArchivedItems = ref({});
const totalCounts = ref(null);
const forExportList = ref([]);
const hardRefresh = ref(null);
const isLoading = ref(true);
provide('v$', v$);

// ***************************************HANDLE PATIENT's DATA***************************************

// addToLocalStorageStatus updates the status of a patient in the injuryList and stores the indices of updated patients in local storage.

const addToLocalStorageStatus = async (index) => {
    const patient = injuryList.value[index];
    patient.status = patientStore.status;

    const indices = JSON.parse(localStorage.getItem('indices')) || [];

    indices.push(index);
    if (indices.length >= 5) {
        await loadList(true);
        return;
    }
    indices.forEach((i) => {
        injuryList.value[i].status = '1';
    });
    localStorage.setItem('indices', JSON.stringify(indices));
};

// updateList updates the injuryList with the current patient details from patientStore and calls addToLocalStorageStatus to persist changes.
const updateList = async () => {
    if (!patientStore.status || !patientStore.enccode) return;
    const index = injuryList.value.findIndex((i) => i.enccode === patientStore.enccode);
    injuryList.value[index].status = patientStore.status;

    injuryList.value[index] = patientStore;
    localStorage.removeItem('patientStore');

    addToLocalStorageStatus(index);
};

// patientStoreFromLocalStorage initializes the patientStore with data retrieved from local storage.
const patientStoreFromLocalStorage = () => {
    if (localStorage.getItem('patientStore')) {
        const enccode = JSON.parse(localStorage.getItem('enccode'));
        const status = JSON.parse(localStorage.getItem('status'));
        const header = JSON.parse(localStorage.getItem('header'));
        const details = JSON.parse(localStorage.getItem('data'));

        patientStore.enccode = enccode;
        patientStore.status = status;
        patientStore.header = { ...header };
        patientStore.details = { ...details };
        patientStore.loadPatientDataDev();
    }
};

onMounted(async () => {
    patientStoreFromLocalStorage();
    await loadList();
    await user.getUserInfo();
    injuryList.value.forEach((patient) => {
        patientMap.set(patient.enccode, patient);
    });

    await updateList();
    transitions();
});

async function getInjuryList(hardRefresh, hardRefreshStatus) {
    isLoading.value = false;
    const response = await injuryService.injuryList3(hardRefresh, hardRefreshStatus, formattedStartDate.value, formattedEndDate.value, props.value);
    return response;
}

async function getInjuryListArchived(hardRefresh, hardRefreshStatus) {
    const response = await injuryService.injuryList(hardRefresh, hardRefreshStatus, formattedStartDate.value, formattedEndDate.value, props.value);
    isLoading.value = false;
    return response;
}


const checkCondition = async (hardRefresh, hardRefreshStatus) => {
    isLoading.value = true;
    const injuryList = await getInjuryList(hardRefresh, hardRefreshStatus, formattedStartDate.value, formattedEndDate.value, props.value);
    return injuryList;
};

const checkConditionArchived = async (hardRefresh, hardRefreshStatus) => {
    isLoading.value = true;
    const injuryList = await getInjuryListArchived(hardRefresh, hardRefreshStatus, formattedStartDate.value, formattedEndDate.value, props.value);
    return injuryList;
};

// Update List Everytime the panel is changed
const updateActivePanel = (e) => {
    if (activePanel.value !== e.index) {
        activePanel.value = e.index;
        selectedEnccodes.value = null;
        selectedPatient.value = null;
        filters.value.global.value = null;
        loadList(true);
    }
};
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.IN },
    date: { value: null, matchMode: FilterMatchMode.EQUALS }
});
const loadList = async (hardRefresh) => {
    selectedPatients.value = [];
    if (hardRefresh) localStorage.removeItem('indices');
    toast.removeAllGroups();
    var response = null;
    if (activePanel.value == 0) {
        patientStore.resets();
        injuryList.value = [];
        response = await toastWaitingForFetch.fetchData();
        if (response && response.status === 401) {
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
        injuryList.value = response?.data;
    }
    if (activePanel.value == 1) {
        injuryList.value = [];
        response = await toastWaitingForFetchAdmitted.fetchData();
        if (response && response.status === 401) {
            console.warn('401 Unauthorized');
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
        injuryList.value = response.data;
    }
    if (activePanel.value == 2) {
        selectedPatient.value = '';
        patientStore.resets();

        forExportList.value = null;
        response = await toastWaitingForExport.fetchData();
        if (response && response.status === 401) {
            console.warn('401 Unauthorized');
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
        forExportList.value = response.data;
    }
    if (activePanel.value == 3) {
        selectedPatient.value = '';
        patientStore.resets();

        forExportList.value = null;
        response = await toastWaitingForExport.fetchData();
        if (response && response.status === 401) {
            console.warn('401 Unauthorized');
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
        forExportList.value = response.data;
    }
    if (activePanel.value == 4) {
        selectedPatient.value = '';
        patientStore.resets();
        forArchived.value = null;
        const response = await toastWaitingForFetchArchived.fetchData();
        forArchived.value = response.data;
        const employeeIds = forArchived.value.map((item) => item.exportby).filter(Boolean);
        await injuryService.fetchEmployeeNames(employeeIds);
        if (forArchived.value) {
            totalCounts.value = Object.groupBy(forArchived.value, getExportBy, getPatName);
            if (employeeIds.length > 0) {
                try {
                    const employeeDataArray = await injuryService.fetchEmployeeNames(employeeIds);
                    for (let i = 0; i < forArchived.value.length; i++) {
                        const employeeData = employeeDataArray[i];
                        if (employeeData) {
                            forArchived.value[i].header.exportby = `${employeeData.firstname} ${employeeData.lastname}`;
                        } else {
                            forArchived.value[i].header.exportby = 'Unknown';
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch employee names:', error);
                    for (const item of forArchived.value) {
                        item.header.exportby = 'Unknown';
                    }
                }
            }
        } else {
            console.log('No archived data available.');
        }
        
    }
    if (activePanel.value == 5) {
        patientStore.resets();
        injuryList.value = [];

        response = await toastWaitingForFetchStashed.fetchData();
        if (response && response.status === 401) {
            console.warn('401 Unauthorized');
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
        injuryList.value = response.data;
    } else if (response && response.status === 401) {
        console.warn('401 Unauthorized');
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
};

// ***************************************TOAST***************************************

// Toast Injury List
const toastWaitingForFetch = useToastWaitingForFetch(
    {
        waitingSeverity: 'info',
        waitingSummary: 'Please wait...',
        waitingMessage: 'Retrieving Injury Cases list...'
    },
    {
        successSeverity: 'success',
        successSummary: 'Sucess!',
        successMessage: 'Injury Cases List loaded successfully',
        successLife: 3000
    },
    { errorSeverity: 'error', errorSummary: 'Error', errorMessage: 'Server Error!' },
    { asyncFunction: checkCondition, asyncFunctionParams: [hardRefresh, null] }
);
// Toast Archived List
const toastWaitingForFetchArchived = useToastWaitingForFetch(
    {
        waitingSeverity: 'info',
        waitingSummary: 'Please wait...',
        waitingMessage: 'Retrieving Archived Injury Cases list...'
    },
    {
        successSeverity: 'success',
        successSummary: 'Sucess!',
        successMessage: 'Archived Injury Cases List loaded successfully',
        successLife: 3000
    },
    { errorSeverity: 'error', errorSummary: 'Error', errorMessage: 'Server Error!' },
    { asyncFunction: checkConditionArchived, asyncFunctionParams: [hardRefresh, '2'] }
);
// Toast Export List
const toastWaitingForExport = useToastWaitingForFetch(
    {
        waitingSeverity: 'info',
        waitingSummary: 'Please wait...',
        waitingMessage: 'Retrieving For Export list...'
    },
    {
        successSeverity: 'success',
        successSummary: 'Sucess!',
        successMessage: 'For Export List loaded successfully',
        successLife: 3000
    },
    { errorSeverity: 'error', errorSummary: 'Error', errorMessage: 'Server Error!' },
    { asyncFunction: checkCondition, asyncFunctionParams: [hardRefresh, '1'] }
);
// Toast Admitted List
const toastWaitingForFetchAdmitted = useToastWaitingForFetch(
    {
        waitingSeverity: 'info',
        waitingSummary: 'Please wait...',
        waitingMessage: 'Retrieving Injury Cases list...'
    },
    {
        successSeverity: 'success',
        successSummary: 'Sucess!',
        successMessage: 'Injury Cases List loaded successfully',
        successLife: 3000
    },
    { errorSeverity: 'error', errorSummary: 'Error', errorMessage: 'Server Error!' },
    { asyncFunction: checkCondition, asyncFunctionParams: [hardRefresh, null] }
);
// Toast Stashed List
const toastWaitingForFetchStashed = useToastWaitingForFetch(
    {
        waitingSeverity: 'info',
        waitingSummary: 'Please wait...',
        waitingMessage: 'Retrieving Stashed list...'
    },
    {
        successSeverity: 'success',
        successSummary: 'Sucess!',
        successMessage: 'Stashed List loaded successfully',
        successLife: 3000
    },
    { errorSeverity: 'error', errorSummary: 'Error', errorMessage: 'Server Error!' },
    { asyncFunction: checkCondition, asyncFunctionParams: [hardRefresh, '5'] }
);
// ***************************************INJURY LIST***************************************
const filteredInjuryListAdmitRemoved = computed(() => {
    if (injuryList.value) {
        return injuryList.value.filter((item) => item.header.dispcode !== 'ADMIT');
    }
    return [];
});
// Displays other data from another vue
function transitions() {
    // console.log('injurycases: ', filteredInjuryListAdmitRemoved.value);

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

// ***************************************ADMITTED LIST***************************************

// Admitted List
const filteredInjuryList = computed(() => {
    if (injuryList.value) {
        return injuryList.value.filter((item) => item.header.dispcode === 'ADMIT');
    }

    return [];
});

// // ***************************************ADMITTED CASES EXPORT***************************************

const filteredExportList = computed(() => {
    // console.log('field: ', forExportList.value);
    if (forExportList.value) {
        return forExportList.value.filter((item) => item.header.dispcode === 'ADMIT');
    }

    return [];
});

// ***************************************EXPORT LIST***************************************

// Extracts 'exportby' field from the header object.
function getExportBy({ header }) {
    return header.exportby;
}

// Retrieves patient's name from the header object.
function getPatName({ header }) {
    return header.patname;
}

//Stash Patients (status = 5)
const stashPatients = async () => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Are you sure you want to stash these patients?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, stash them!',
        cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
        return; // Exit if the user cancels
    }

    exporting.value = true;
    exportDone.value = false;
    patientStore.loadSignal = true;

    const dateNow = useNow().value;

    try {
        const archivedData = [];
        const enccodess = [];

        for (const patient of selectedPatients.value) {
            patient.status = '5';
            patient.header.status = '5';

            enccodess.push(patient.enccode);

            archivedData.push({
                enccode: patient.enccode,
                patname: patient.header.patlast + ', ' + patient.header.patfirst + ' ' + patient.header.patmiddle,
                patsex: patient.header.patsex,
                patage: patient.header.patage,
                injrem: patient.header.injrem,
                injtme: patient.header.injtime,
                injloc: patient.header.injloc
            });
        }

        await patientStore.saveStashedPatients(enccodess, dateNow);
    } catch (error) {
        console.error('Error Stashing Patients:', error);
        toast.add({
            severity: 'error',
            summary: 'Stash Error',
            detail: 'Failed to stash patients',
            life: 3000
        });
    } finally {
        exporting.value = false;
        exportDone.value = true;
        loadList(true);
    }
};

// Export
const exportToExcel = async () => {
    exporting.value = true;
    exportDone.value = false;
    patientStore.loadSignal = true;
    const dateNow = useNow().value;
    try {
        const archivedData = [];
        const enccodess = [];

        for (const patient of selectedPatients.value) {
            patient.status = '2';
            patient.header.status = '2';

            enccodess.push(patient.enccode);

            archivedData.push({
                enccode: patient.enccode,
                patname: patient.header.patlast + ', ' + patient.header.patfirst + ' ' + patient.header.patmiddle,
                patsex: patient.header.patsex,
                patage: patient.header.patage,
                injrem: patient.header.injrem,
                injtme: patient.header.injtime,
                injloc: patient.header.injloc
            });
        }
        const response = await injuryService.archDate(enccodess, dateNow);
        if (response && response.status === 401) {
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
        await patientStore.saveFormattedDataArchived(enccodess, dateNow);
        await injuryService.sendArrayToServer(archivedData, dateNow);
    } catch (error) {
        console.error('Error exporting data to Excel:', error);
        toast.add({
            severity: 'error',
            summary: 'Export Error',
            detail: 'Failed to export data to Excel',
            life: 3000
        });
    } finally {
        exporting.value = false;
        exportDone.value = true;
        loadList(true);
    }
};

// Export Disabler
const isExportDisabled = computed(() => {
    return selectedPatients?.value?.length === 0; // Disable if no patients are selected
});

const filteredExportListAdmitRemoved = computed(() => {
    if (forExportList.value) {
        // console.log('forExtportList: ', forExportList.value);

        return forExportList.value.filter((item) => item.header.dispcode !== 'ADMIT');
    }
    return [];
});

const updateSelectedPatients = (newSelectedPatients) => {
    selectedPatients.value = newSelectedPatients; // Update the selected patients
};

// ***************************************ARCHIVED LIST***************************************
// Archive List
const groupedArchivedData = computed(() => {
    return Object.entries(groupedArchivedItems.value).map(([archdate, items]) => {
        const cleanedDate = archdate.replace('Injury', '').trim();
        const dateObject = new Date(cleanedDate);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formattedDate = dateObject.toLocaleString('en-US', options).replace(',', '');
        const names = items.map((item) => item.header.patname).filter((name) => name);
        const exportByIDs = items.map((item) => item.header.hpercode).filter((id) => id);

        return {
            archdate: formattedDate,
            items,
            count: items.length,
            names,
            exportByIDs
        };
    });
});
// *************************************** WATCHERS ***************************************

watch(
    () => selectedPatients.value,
    (newSelectedPatients) => {
        if (selectedPatients?.value?.length > 0) {
            selectedEnccodes.value = newSelectedPatients.map((patient) => patient.enccode);
        }
    }
);
watch(
    () => props.value,
    (newValue) => {
        dateDescription.value = newValue;
    }
);
watch(
    () => archivedDialogVisible.value,
    (newValue) => {
        if (!newValue) {
            forArchived.value = originalForArchived.value;
        }
    }
);
watch(
    () => patientStore.loadSignal,
    (newValue) => {
        if (newValue) {
            loadList();
            showPatientDialogExport.value = false;
            showPatientModal.value = false;
            patientStore.loadSignal = false;
        }
    }
);
watch(selectedDate, (newDate) => {
    if (newDate) {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(newDate);
        filters.value.global.value = formattedDate;
    }
});
watch(
    forArchived,
    (newValue) => {
        if (newValue) {
            const uniqueItems = newValue.reduce((acc, current) => {
                acc.push(current);
                return acc;
            }, []);
            uniqueArchivedItems.value = uniqueItems;
            const groupedItems = uniqueItems.reduce((acc, item) => {
                // const archdate = item.header.archdate;
                const archdate = item.archdate;
                if (!acc[archdate]) {
                    acc[archdate] = [];
                }
                acc[archdate].push(item);
                return acc;
            }, {});
            groupedArchivedItems.value = groupedItems;
        } else {
            uniqueArchivedItems.value = [];
            groupedArchivedItems.value = {};
        }
    },
    { immediate: true }
);
watch(
    () => props.savedStartDate,
    (newStartDate) => {
        formattedStartDate.value = moment(new Date(newStartDate)).format('MM/DD/YYYY');
    }
);
watch(
    () => props.searchValue,
    (newValue) => {
        filterValue.value = newValue;
    }
);
watch(
    () => props.savedEndDate,
    (newEndDate) => {
        formattedEndDate.value = moment(new Date(newEndDate)).format('MM/DD/YYYY');
    }
);

if (patientStore.details.loader != null) {
    loadList(true);
    patientStore.value.details.loader = '';
}
</script>
<template>
    <div class="bg">
        <div v-if="exporting" class="loading-overlay">
            <div class="spinner"></div>
            <p class="loading-message">PLEASE WAIT...</p>
        </div>
        <div class="col-12 xl:col-12" v-if="showT">
            <div class="shadow-4 mx-5 opacity-90" style="height: 100%">
                <div class="flex align-items-center mb-2 justify-content-between">
                    <div class="flex align-items-center">
                        <!-- <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filterValue" placeholder="( Name / Hospital# / DOI / NOI)" class="w-18rem shadow-2" style="width: 40%" />
                        </span>
                        <Calendar v-model="selectedDate" :showIcon="true" class="calendar-icon-only" /> -->
                    </div>
                </div>
                <TabView :lazy="false" @tab-change="updateActivePanel">
                    <TabPanel header="Injury Cases">
                        <template #header>
                            <i class="pi pi-spin pi-spinner ml-2" v-if="!injuryList && activePanel === '0'"></i>
                        </template>
                        <InjuryCasesTabView :filterValue="filterValue" :list="filteredInjuryListAdmitRemoved" :loading="isLoading" />
                    </TabPanel>
                    <TabPanel header="Admitted  Cases">
                        <template #header>
                            <i class="pi pi-spin pi-spinner ml-2" v-if="!injuryList && activePanel === '1'"></i>
                        </template>
                        <InjuryCasesTabView :filterValue="filterValue" :list="filteredInjuryList" :loading="isLoading" />
                    </TabPanel>
                    <TabPanel header="Export Admitted Cases">
                        <Button label="Export" icon="pi pi-file-excel" :disabled="isExportDisabled" class="col-12 shadow-4 mb-3" v-tooltip.top="'Export to Excel'" @click="exportToExcel()" :loading="exporting" />
                        <ExportCasesTabView :filterValue="filterValue" :list="filteredExportList" :loading="isLoading" @update:selectedPatients="updateSelectedPatients" :exportDone="exportDone" />
                    </TabPanel>
                    <TabPanel header="For Export">
                        <div v-if="user.userInfo.employeeid === '000001' || user.userInfo.employeeid === 'TP2015075'" class="flex justify-content-between" style="width: 100%">
                            <Button label="Export" icon="pi pi-file-excel" :disabled="isExportDisabled" class="col-12 shadow-4 mb-3" v-tooltip.top="'Export to Excel'" @click="exportToExcel()" :loading="exporting" style="width: 78%" />
                            <Button
                                label="Stash"
                                icon="pi pi-trash"
                                :disabled="isExportDisabled"
                                class="col-12 shadow-4 mb-3"
                                v-tooltip.top="'Stash Patient(s)'"
                                @click="stashPatients()"
                                :loading="exporting"
                                style="width: 20%; background-color: orange; border-color: orange"
                            />
                        </div>
                        <Button v-else label="Export" icon="pi pi-file-excel" :disabled="isExportDisabled" class="col-12 shadow-4 mb-3" v-tooltip.top="'Export to Excel'" @click="exportToExcel()" :loading="exporting" />
                        <ExportCasesTabView :filterValue="filterValue" :list="filteredExportListAdmitRemoved" @update:selectedPatients="updateSelectedPatients" :loading="isLoading" />
                    </TabPanel>
                    <TabPanel header="Archived">
                        <template #header>
                            <i class="pi pi-spin pi-spinner ml-2" v-if="!groupedArchivedData && activePanel == '4'"></i>
                        </template>
                        <ArchivedTabView :filterValue="filterValue" :list="groupedArchivedData" :loading="isLoading" />
                        <!-- <ArchivedTabView :filterValue="filterValue" :list="groupedArchivedData" :loading="isLoading" @update:exporting="updateExporting" /> -->
                    </TabPanel>
                    <TabPanel v-if="user.userInfo.employeeid === '000001' || user.userInfo.employeeid === 'TP2015075'" header="Stashed">
                        <StashCasesTabView :filterValue="filterValue" :list="injuryList" :loading="isLoading" />
                    </TabPanel>
                </TabView>
            </div>
            <Toast />
        </div>
    </div>
</template>

<style>
.fancy-icon {
    font-size: 2rem !important;
    margin: 10px 10px 0px 10px;
    transition: transform 0.3s ease, color 0.3s ease;
    color: #007bff;
}

.fancy-icon:hover {
    transform: scale(1.35) rotate(5deg);
    color: #52ec9f;
}

.spinner {
    border: 8px solid rgba(255, 255, 255, 0.3);
    border-left-color: #007bff;

    border-radius: 50%;
    width: 50px;

    height: 50px;

    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading-message {
    margin-top: 10px;
    font-size: 16px;

    color: #007bff;
}

.bg {
    background: url('@/assets/images/BGHMC.png') no-repeat center center fixed;
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

.loading-message {
    color: white;
    font-size: 18px;
    margin-top: 10px;
}

.p-dialog {
    z-index: 9999;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background-color: #333;
    color: white;
    padding: 16px;
    border-radius: 5px;
    transition: all 0.5s ease;
}

.calendar-icon-only .p-inputtext {
    display: none;
}

.calendar-icon-only .p-datepicker-trigger {
    width: 40px;
    height: 40px;
    cursor: pointer;
}

.calendar-icon-only .p-datepicker-trigger .pi-calendar {
    font-size: 1.5rem;
}

@keyframes zoom {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(1.2);
    }
}

.warning-notice {
    padding: 10px;
    border: 1px solid red;
    border-radius: 5px;
    background-color: #ffe6e6;
}
</style>
a
