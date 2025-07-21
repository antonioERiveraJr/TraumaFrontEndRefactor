<script>
import Swal from 'sweetalert2';
import { watch, ref, computed, defineAsyncComponent, onMounted, provide } from 'vue';
import useToastWaitingForFetch from '@/composables/useToastWaitingForFetch';
import { useNow } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import InjuryService from '@/service/InjuryService';
import createValidationRules from '../../../validation/injuryValidations';
import { useRouter } from 'vue-router';
import { usePatientStore } from '../../../store/injury/PatientStore';
import { FilterMatchMode } from 'primevue/api';
import useVuelidate from '@vuelidate/core'; 

const GeneralData = defineAsyncComponent(() => import('@/components/app/injury/details/GeneralData.vue'));
const GeneralDataNOI = defineAsyncComponent(() => import('@/components/app/injury/details/GeneralDataNOI.vue'));
const PreAdmissionDataNew = defineAsyncComponent(() => import('@/components/app/injury/details/PreAdmissionDataNew.vue'));
const ExternalCauses = defineAsyncComponent(() => import('@/components/app/injury/details/ExternalCauses.vue'));
const preAdmissionDataNew = defineAsyncComponent(() => import('@/components/app/injury/details/PreAdmissionDataNew.vue'));
const externalCauses = defineAsyncComponent(() => import('@/components/app/injury/details/ExternalCauses.vue'));

export default {
    components: { 
        GeneralData,
        GeneralDataNOI,
        PreAdmissionDataNew,
        ExternalCauses,
        preAdmissionDataNew,
        externalCauses
    },
    setup() {
        const editOneiss = ref(false);
        const selectedPatients = ref([]);
        const forArchived = ref([]);
        const router = useRouter();
        const fromDate = ref(new Date(new Date().setDate(new Date().getDate() - 7)));
        const toDate = ref(new Date());
        const patientStore = usePatientStore();
        const validations = createValidationRules();
        const toast = useToast();
        const v$ = useVuelidate(validations, patientStore.details); 
        const hardRefresh = ref(null);
        const selectedPatient = ref([]);
        const patientDetails = ref({});
        const showGeneralDataNOIArchived = ref(false);
        const showPreAdmissionDataArchived = ref(false);
        const showExternalCausesArchived = ref(false);
        const showPatientDialogExport = ref(false);
        const injuryList = ref(null);
        const showGeneralData = ref(false);
        const showGeneralDataNOI = ref(false);
        const preAdmissionDataNew = ref(false);
        const externalCauses = ref(false);
        const showPreAdmissionData = ref(false);
        const showExternalCauses = ref(false);
        const selectedEnccodes = ref([]);
        const formattedFromDate = ref();
        const formattedToDate = ref();
        const isExportDisabled = computed(() => selectedPatients.value.length === 0);
        const exporting = ref(false);
        const injuryService = new InjuryService();

        provide('v$', v$);

        const isRefreshDisabled = computed(() => fromDate.value != null && toDate.value != null);
        const formatDate = (date) => {
            if (!date) return '';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        };
        formattedFromDate.value = formatDate(fromDate.value);
        formattedToDate.value = formatDate(toDate.value);
        const filterEdit = ref({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            status: { value: null, matchMode: FilterMatchMode.IN },
            date: { value: null, matchMode: FilterMatchMode.EQUALS }
        });

        const exporteditOneiss = async () => {
            exporting.value = true;
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
                        patname: `${patient.header.patlast}, ${patient.header.patfirst} ${patient.header.patmiddle}`,
                        patsex: patient.header.patsex,
                        patage: patient.header.patage,
                        injrem: patient.header.injrem,
                        injtme: patient.header.injtime,
                        injloc: patient.header.injloc
                    });
                }

                await injuryService.sendArrayToServer(archivedData, dateNow);
                await delay(1000);
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
            }
        };

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
                patientStore.loadPatientData();
            }
        };

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

        const updateList = async () => {
            if (!patientStore.status || !patientStore.enccode) return;
            const index = injuryList.value.findIndex((i) => i.enccode === patientStore.enccode);
            injuryList.value[index].status = patientStore.status;
            injuryList.value[index] = patientStore;
            localStorage.removeItem('patientStore');
            addToLocalStorageStatus(index);
        };

        onMounted(async () => {
            patientStoreFromLocalStorage();
            await loadList(); 
            await updateList();
            transitionsss();
        });

        function transitionsss() {
            const mqSmall = window.matchMedia('(max-width: 767px)');
            const mqMedium = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
            const mqLarge = window.matchMedia('(min-width: 1024px)');

            let generaldata, generaldatanoiarchived, preadmissiondataarchived, externalcausesarchived;

            if (mqSmall.matches) {
                generaldata = 50;
                generaldatanoiarchived = generaldata + 50;
                preadmissiondataarchived = generaldatanoiarchived + 50;
                externalcausesarchived = preadmissiondataarchived + 50;
            } else if (mqMedium.matches) {
                generaldata = 150;
                generaldatanoiarchived = generaldata + 50;
                preadmissiondataarchived = generaldata + 50;
                externalcausesarchived = preadmissiondataarchived + 50;
            } else if (mqLarge.matches) {
                generaldata = 200;
                generaldatanoiarchived = generaldata + 50;
                preadmissiondataarchived = generaldatanoiarchived + 50;
                externalcausesarchived = preadmissiondataarchived + 50;
            }

            setTimeout(() => {
                showGeneralData.value = true;
            }, generaldata);
            setTimeout(() => {
                showGeneralDataNOIArchived.value = true;
            }, generaldatanoiarchived);
            setTimeout(() => {
                showPreAdmissionDataArchived.value = true;
            }, preadmissiondataarchived);
            setTimeout(() => {
                showExternalCausesArchived.value = true;
            }, externalcausesarchived);
        }

        const checkCondition = async (hardRefresh, hardRefreshStatus) => { 
            const injuryList = await getInjuryList(hardRefresh, hardRefreshStatus, formatDate(fromDate.value), formatDate(toDate.value), 'admdate');
            return injuryList;
        };

        const toastWaitingForFetchArchived = useToastWaitingForFetch(
            {
                waitingSeverity: 'info',
                waitingSummary: 'Please wait...',
                waitingMessage: 'Retrieving Archived Injury Cases list...'
            },
            {
                successSeverity: 'success',
                successSummary: 'Success!',
                successMessage: 'Archived Injury Cases List loaded successfully',
                successLife: 3000
            },
            { errorSeverity: 'error', errorSummary: 'Error', errorMessage: 'Server Error!' },
            { asyncFunction: checkCondition, asyncFunctionParams: [hardRefresh, '2'] }
        );

        async function getInjuryList(hardRefresh, hardRefreshStatus) { 
            const response = await injuryService.injuryListDev(hardRefresh, hardRefreshStatus, formatDate(fromDate.value), formatDate(toDate.value), 'admdate');
            return response;
        }

        const loadList = async (hardRefresh) => {
            exporting.value = true;
            selectedPatients.value = [];
            if (hardRefresh) localStorage.removeItem('indices');
            toast.removeAllGroups();
            let response = null;

            selectedPatient.value = '';
            patientStore.resets();
            forArchived.value = [];

            try {
                response = await toastWaitingForFetchArchived.fetchData();

                if (response) {
                    if (response.status === 401) {
                        exporting.value = false;
                        localStorage.removeItem('authToken');

                        await Swal.fire({
                            icon: 'warning',
                            title: 'Session Expired',
                            text: 'Please Login Again',
                            confirmButtonText: 'OK'
                        });

                        toast.add({
                            severity: 'danger',
                            summary: 'Session Expired',
                            detail: 'Session expired please login again',
                            life: 10,
                            closable: false
                        });

                        router.push('/auth/login').then(() => {
                            window.location.reload();
                        });
                        return;
                    }

                    forArchived.value = response.data || [];
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No response received from the server.',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Error fetching archived data:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load archived data.',
                    life: 3000
                });
            } finally {
                exporting.value = false;
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

        const openPatientDetails = async (slotProps) => {
            exporting.value = true;
 
            if (!patientStore.enccode) {
                await patientStore.loadPatientData(slotProps.data.enccode);
            }

            patientDetails.value = patientStore.details;
            showExternalCauses.value = true;
            showPreAdmissionData.value = true;
            showPatientDialogExport.value = true;
            exporting.value = false;
            transitions();
        };

        const confirmPatientExport = () => {
            editOneiss.value = false;
            if (selectedPatients.value.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Patients Selected',
                    text: 'Please select at least one patient to export.'
                });
                return;
            }

            const patientDetails = selectedPatients.value.map((patient) => ({
                name: `${patient.header.patlast}, ${patient.header.patfirst} ${patient.header.patmiddle}`,
                hospitalNo: patient.header.hpercode
            }));

            let message = 'Selected Patients:<br>';
            patientDetails.forEach((patient) => {
                message += `name: ${patient.name.toLowerCase()}, hospital no: ${patient.hospitalNo}<br>`;
            });

            Swal.fire({
                title: 'Confirm Export',
                html: `<div style="font-size: 12px;">${message}</div>`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Export',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    exporteditOneiss();
                    loadList();
                }
            });
        };

        const conditionStatus = (data) => {
            const incidentTime = new Date(data.header.injtme);
            const admissionTime = new Date(data.header.admdate);
            const timeDifference = admissionTime - incidentTime;
            const hoursDifference = timeDifference / (1000 * 60 * 60);
            return hoursDifference > 24 ? 'Warning' : 'Normal';
        };

        const rowClass = (data) => {
            return [{ 'bg-green-100': data.status === '1' }, { 'bg-pink-100': data.status === 'I' }];
        };

        const rowStyle = (data) => {
            if (data.quantity === 0) {
                return { fontWeight: 'bold', fontStyle: 'italic' };
            }
        };

        const onSelectionChange = (e) => {
            selectedPatients.value = e.value;
            selectedEnccodes.value = e.value.map((patient) => patient.enccode);
        };

        const isConditionWarning = (data) => {
            const incidentTime = new Date(data.header.injtme);
            const admissionTime = new Date(data.header.admdate);
            const timeDifference = admissionTime - incidentTime;
            const hoursDifference = timeDifference / (1000 * 60 * 60);
            return hoursDifference > 24;
        };
        function rowSelectForExport(e) {
            try {
                if (e.type == 'checkbox') {
                    selectedEnccodes.value.push(e.data.enccode);
                    return;
                }
            } catch (error) {
                console.log('bleh :P');
            } 
        }

        watch(fromDate, (newValue) => { 
            fromDate.value = newValue;
        });

        watch(toDate, (newValue) => { 
            toDate.value = newValue;
        });

        function Refresh() {
            loadList();
        }
        return {
            confirmPatientExport,
            isExportDisabled,
            filterEdit,
            conditionStatus,
            rowStyle,
            rowClass,
            forArchived,
            openPatientDetails,
            transitionsss,
            onSelectionChange,
            selectedPatients,
            loadList,
            isConditionWarning,
            showPatientDialogExport,
            rowSelectForExport,
            patientStore,
            showGeneralData,
            showGeneralDataNOIArchived,
            showExternalCausesArchived,
            showGeneralDataNOI,
            transitions,
            preAdmissionDataNew,
            externalCauses,
            exporteditOneiss,
            showPreAdmissionData,
            showExternalCauses,
            exporting,
            fromDate,
            Refresh,
            toDate,
            isRefreshDisabled
        };
    }
};
</script>

<template>
    <div v-if="exporting" class="loading-overlay">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <div>
        <span class="p-input-icon-left mb-2">
            <i class="pi pi-search" />
            <InputText v-model="filterEdit['global'].value" placeholder="( Name / Hospital# / DOI / NOI)" class="w-18rem shadow-2" style="width: 40%" />
        </span>

        <Calendar v-model="fromDate" placeholder="From Date" :showIcon="true" class="w-auto my-auto shadow-4 mx-2" :showButtonBar="true" :todayButton="true" />

        <Calendar v-model="toDate" placeholder="To Date" :showIcon="true" class="w-auto my-auto shadow-4" :showButtonBar="true" :todayButton="true" />
        <Button :disabled="!isRefreshDisabled" icon="pi pi-refresh" size="large" class="w-auto mt-2 mr-8 ml-2 shadow-4 mb-1" v-tooltip.top="'Refresh List'" @click="Refresh()" />

        <Button label="Export Selected Patient/s" icon="pi pi-file-excel" :disabled="isExportDisabled" class="col-12 shadow-4 mb-1" v-tooltip.top="'Export to Excel'" @click="confirmPatientExport" />
    </div>

    <DataTable
        :value="forArchived"
        scrollHeight="calc(100vh - <height_of_other_elements>)"
        :paginator="true"
        :rows="10"
        :filters="filterEdit"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        v-model:selection="selectedPatients"
        selectionMode="multiple"
        dataKey="enccode"
        :metaKeySelection="false"
        @rowSelect="rowSelectForExport"
        @selectionChange="onSelectionChange"
        responsiveLayout="scroll"
        sortField="header.injtme"
        :sortOrder="-1"
        class="p-datatable-sm shadow-2"
        style="min-height: 100%"
        :globalFilterFields="['header.patname', 'header.hpercode', 'header.status', 'header.injtme', 'header.injrem']"
        stripedRows
        :loading="!forArchived"
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
        <Column field="header.hpercode" header="Hospital No." :sortable="true"></Column>

        <Column header="Patient Name" :sortable="true">
            <template #body="slotProps">
                <span class="font-bold">{{ slotProps.data.header.patlast }}</span>
                <span>, {{ slotProps.data.header.patfirst + ' ' + slotProps.data.header.patmiddle }}</span>
            </template>
        </Column>
        <Column field="header.patsex" header="Sex"></Column>
        <Column field="header.patage" header="Age" :sortable="true"></Column>
        <Column field="header.injrem" header="Nature of Incident" :sortable="true"></Column>
        <Column field="header.injtme" header="Date/Time of Incident" :sortable="true"></Column>
        <Column headerStyle="width: 5rem; text-align: center" header="View" bodyStyle="text-align: center; overflow: visible">
            <template #body="slotProps">
                <Button type="button" icon="pi pi-eye" @click="openPatientDetails(slotProps)" />
            </template>
        </Column>
    </DataTable>

    <Dialog header="Patient Injury Form" v-model:visible="showPatientDialogExport" maximizable modal @hide="patientStore.$reset()" :style="{ width: '120rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="grid col gap-4 flex justify-content-center flex-wrap card-container">
            <div class="generaldata">
                <Transition name="slide-fade" mode="out-in">
                    <GeneralData v-if="showGeneralData" />
                </Transition>
            </div>
            <div class="generaldatanoi">
                <Transition name="slide-fade" mode="out-in">
                    <GeneralDataNOI v-if="showGeneralDataNOI" />
                </Transition>
            </div>
            <div class="preadmissiondata">
                <Transition name="slide-fade" mode="out-in">
                    <PreAdmissionDataNew v-if="showPreAdmissionData" />
                </Transition>
            </div>
            <div class="externalcauses">
                <Transition name="slide-fade" mode="out-in">
                    <ExternalCauses v-if="showExternalCauses" />
                </Transition>
            </div>
        </div>
    </Dialog>
</template>
