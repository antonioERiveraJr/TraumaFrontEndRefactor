<script setup>
import { ref, onMounted, defineAsyncComponent, computed, watch, onUpdated } from 'vue';
import Dialog from 'primevue/dialog';
import { usePatientStore } from '../../../../store/injury/PatientStore';
import PreAdmissionDataArchived from '../details/PreAdmissionDataNew.vue';
import ExternalCausesArchived from '../details/ExternalCauses.vue';
import GeneralDataNOIArchived from '../details/GeneralDataNOI.vue';
import InjuryService from '../../../../service/InjuryService';
import { useNow } from '@vueuse/core';
import Swal from 'sweetalert2';
import { FilterMatchMode } from 'primevue/api';
import LibraryService from '@/service/LibraryService';

const injuryService = new InjuryService();
const libraryService = new LibraryService();
const patientStore = new usePatientStore();
const GeneralData = defineAsyncComponent(() => import('@/components/app/injury/details/GeneralData.vue'));
const showGeneralData = ref(false);
const showPatientDialogArchived = ref(false);
const archivedDialogVisible = ref(false);
const patientDetails = ref({});
const showGeneralDataNOIArchived = ref(false);
const showPreAdmissionDataArchived = ref(false);
const showExternalCausesArchived = ref(false);
const originalForArchived = ref(null);
const forArchived = ref(null);
const totalCounts = ref(null);
const employeeList = ref(false);
const emit = defineEmits(['update:exporting']);
const exporting = ref(false);
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
    }
});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.IN },
    date: { value: null, matchMode: FilterMatchMode.EQUALS }
});
onMounted(() => {
    // console.log(props.list);
    transitions();
});

const exportArchivedData = async () => {
    exporting.value = true;

    emit('update:exporting', exporting.value);

    const dateNow = useNow().value;
    try {
        // console.log('forArchived: ', forArchived.value);
        const archivedData = forArchived.value.map((item) => ({
            enccode: item.enccode,
            patname: item.header.patlast + ', ' + item.header.patfirst + ' ' + item.header.patmiddle,
            patsex: item.header.patsex,
            patage: item.header.patage,
            injrem: item.header.injrem,
            injtme: item.header.injtme,
            injloc: item.header.injloc
        }));

        try {
            await injuryService.sendArrayToServer(archivedData, dateNow);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Download Complete',
                text: 'Your data has been successfully exported!',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        } catch (err) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Export Error',
                text: 'Failed to export archived data',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }

        archivedDialogVisible.value = false;
    } catch (error) {
        console.error('Error exporting archived data:', error);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Export Error',
            text: 'Failed to export archived data',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    } finally {
        exporting.value = false;
        emit('update:exporting', exporting.value);
    }
};

function onRowSelectEmployee(e) {
    try {
        archivedDialogVisible.value = true;

        originalForArchived.value = forArchived.value;

        forArchived.value = totalCounts.value[e.data.exportby];
    } catch (error) {
        // console.log('error: ', error);
    }
}
const rowClass = (data) => {
    return [{ 'bg-green-100': data.status === '1' }, { 'bg-pink-100': data.status === 'I' }];
};

const rowStyle = (data) => {
    if (data.quantity === 0) {
        return { fontWeight: 'bold', fontStyle: 'italic' };
    }
};
const uniqueEmployeeList = computed(() => {
    if (!totalCounts.value) {
        return [];
    }

    let exportbys = Object.keys(totalCounts.value);

    let uniqueList = [];
    for (let e of exportbys) {
        const patients = totalCounts.value[e];
        const names = patients.reduce((acc, patient) => {
            const name = patient.header.exportby;
            return name;
        }, {});
        const patientIDs = patients.map((patient) => patient.header.hpercode).filter((patientID) => patientID);

        uniqueList.push({ exportby: e, total: totalCounts.value[e].length, names: names, patientIDs: patientIDs });
    }

    return forArchived.value ? uniqueList : 0;
});

function onRowSelectArchived(e) {
    try {
        if (!e || !e.data) {
            console.error('Row data is undefined');
            return;
        }
        // console.log('here2:', e.data);

        archivedDialogVisible.value = true;
        originalForArchived.value = forArchived.value;
        const selectedArchdate = e.data.archdate;
        const dateObject = new Date(selectedArchdate.replace('Injury', '').trim());
        const formattedDate = dateObject.toString();
        const finalFormattedDate = formattedDate.slice(0, formattedDate.indexOf('GMT')).trim();

        const items = e.data.items;
        const filteredData = items.filter((item) => item.archdate === 'Injury' + finalFormattedDate);
        // console.log('filtered2: ', filteredData);

        if (!filteredData[0]) {
            // For old TSS
            filteredData.value = items.filter((item) => item.header.archdate === 'Injury' + finalFormattedDate);
            // console.log('filtData: ', filteredData.value);
            // console.log(finalFormattedDate);
            forArchived.value = filteredData.value;
        } else {
            forArchived.value = filteredData;
        }
    } catch (error) {
        // console.log('error: ', error);
    }
}

function transitions() {
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

function openPatientDetailsArchived(slotProps) {
    // console.log(slotProps.data.enccode);

    if (patientStore.header.status !== 2) {
        if (!patientStore.enccode) {
            if (patientStore.registry === 'old') {
                // console.log('old');

                patientStore.loadPatientDataDev(slotProps.data.enccode);
            }
            if (patientStore.registry === 'new') {
                // console.log('new');

                patientStore.loadPatientData(slotProps.data.enccode);
            }
        }
        patientDetails.value = patientStore.details;
        exporting.value = true;
        showPatientDialogArchived.value = true;
        transitions();
        exporting.value = false;
    }
    // console.log(patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor);
}

watch(
    () => patientStore.enccode,
    () => {
        if (patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor === 'Y') {
            patientStore.details.ExternalCauseOfInjury.ext_burn_r = 'Y';
            // alert('hit');
            // Get burn details from doctor
            // const burnDetailsDoctor = libraryService.getBurnDetailsDoctor();

            // console.log(patientStore.details.ExternalCauseOfInjury.ext_burn_r);
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
            }
        }
    }
);
watch(
    () => props.filterValue,
    (newValue) => {
        // console.log('filters: ', newValue);
        filters.value.global.value = newValue;
        // filter.value = newValue;
    }
);
</script>
<template>
    <div>
        <DataTable
            :value="props.list"
            scrollHeight="430px"
            selectionMode="single"
            dataKey="archdate"
            :paginator="true"
            :rows="5"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            :metaKeySelection="false"
            @rowSelect="onRowSelectArchived"
            responsiveLayout="scroll"
            sortField="archdate"
            :sortOrder="-1"
            class="p-datatable-sm shadow-2"
            style="min-height: 90%; font-weight: bolder"
            :globalFilterFields="['archdate', 'names', 'exportByIDs']"
            stripedRows
            :rowClass="rowClass"
            :rowStyle="rowStyle"
            :virtualScrollerOptions="{ itemSize: 43 }"
        >
            <ProgressBar mode="indeterminate" style="height: 6px" v-if="props.loading"></ProgressBar>
            <Column field="archdate" header="Archived Date" :sortable="true"></Column>
            <Column header="Export By">
                <template #body="slotProps">
                    <span>{{ slotProps.data.items[0]?.header.exportby || slotProps.data.items[0].exportby || 'N/A' }}</span>
                </template>
            </Column>
            <Column field="count" header="Count" :sortable="true"></Column>
        </DataTable>

        <Dialog v-model:visible="archivedDialogVisible" maximizable modal header="Archived" :style="{ width: '80vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" disabled="props.loading">
            <div v-if="exporting" class="loading-overlay">
                <div class="spinner"></div>
                <p class="loading-message">PLEASE WAIT...</p>
            </div>
            <Button label="Export All" icon="pi pi-file-excel" class="mb-3" @click="exportArchivedData" />
            <DataTable
                :value="forArchived"
                scrollHeight="430px"
                v-model:filters="filters"
                selectionMode="single"
                dataKey="enccode"
                :metaKeySelection="false"
                paginator
                :rows="5"
                responsiveLayout="scroll"
                sortField="header.archdate"
                :sortOrder="-1"
                class="p-datatable-sm shadow-2"
                style="min-height: 90%; font-weight: bold"
                :globalFilterFields="['header.patname', 'header.hpercode', 'header.status', 'header.injtme', 'header.injrem']"
                showGridlines
                stripedRows
                :loading="!forArchived"
                :rowClass="rowClass"
                :rowStyle="rowStyle"
                :virtualScrollerOptions="{ itemSize: 43 }"
            >
                <Column field="header.hpercode" header="Hospital No." :sortable="true"></Column>
                <Column header="Patient Name" :sortable="true">
                    <template #body="slotProps">
                        <span class="font-bold" style="color: #3b82f6">{{ slotProps.data.header.patlast }}</span>
                        <span>, {{ slotProps.data.header.patfirst + ' ' + slotProps.data.header.patmiddle }}</span>
                    </template>
                </Column>
                <Column field="header.patsex" header="Sex"></Column>
                <Column field="header.patage" header="Age" :sortable="true"></Column>
                <Column field="header.injrem" header="Nature of Incident" :sortable="true"></Column>
                <Column field="header.injtme" header="Date/Time of Incident" :sortable="true"></Column>
                <Column headerStyle="width: 5rem; text-align: center" header="View" bodyStyle="text-align: center; overflow: visible">
                    <template #body="slotProps">
                        <Button type="button" icon="pi pi-eye" @click="openPatientDetailsArchived(slotProps)" />
                    </template>
                </Column>
            </DataTable>
        </Dialog>
        <!-- <Dialog header="Patient Injury Form" v-model:visible="showPatientDialogArchived" maximizable modal @hide="patientStore.$reset()" :style="{ width: '120rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="grid col gap-4 flex justify-content-center flex-wrap card-container">
                <div class="generaldata">
                    <Transition name="slide-fade" mode="out-in">
                        <GeneralData v-if="showGeneralData" />
                    </Transition>
                </div>
                <div class="generaldatanoiarchived">
                    <Transition name="slide-fade" mode="out-in">
                        <GeneralDataNOIArchived v-if="showGeneralDataNOIArchived" />
                    </Transition>
                </div>
                <div class="preadmissiondataarchived">
                    <Transition name="slide-fade" mode="out-in">
                        <PreAdmissionDataArchived v-if="showPreAdmissionDataArchived" />
                    </Transition>
                </div>
                <div class="externalcausesarchived">
                    <Transition name="slide-fade" mode="out-in">
                        <ExternalCausesArchived v-if="showExternalCausesArchived" />
                    </Transition>
                </div>
            </div>
        </Dialog> -->
        <Dialog v-model:visible="showPatientDialogArchived" maximizable modal header="Patient Injury Form" :style="{ width: '99%' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" @hide="patientStore.$reset()">
            <div class="grid grid-cols-4 gap-4 justify-content-center mt-1">
                <div class="generaldata w-1/4">
                    <Transition name="slide-fade" mode="out-in">
                        <GeneralData v-if="showGeneralData" />
                    </Transition>
                </div>
                <div class="generaldatanoi w-1/4">
                    <Transition name="slide-fade" mode="out-in">
                        <GeneralDataNOIArchived v-if="showGeneralDataNOIArchived" />
                    </Transition>
                </div>
                <div class="preadmissiondata w-1/4">
                    <Transition name="slide-fade" mode="out-in">
                        <PreAdmissionDataArchived v-if="showPreAdmissionDataArchived" />
                    </Transition>
                </div>
                <div class="externalcauses w-1/4">
                    <Transition name="slide-fade" mode="out-in">
                        <ExternalCausesArchived v-if="showExternalCausesArchived" />
                    </Transition>
                </div>
            </div>
        </Dialog>
        <Dialog v-model:visible="employeeList" maximizable modal header="Employee's Log" :style="{ width: '80vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <DataTable
                :value="uniqueEmployeeList"
                scrollHeight="430px"
                v-model:filters="filters"
                selectionMode="single"
                dataKey="enccode"
                :metaKeySelection="false"
                @rowSelect="onRowSelectEmployee"
                responsiveLayout="scroll"
                sortField="header.exportby"
                :sortOrder="-1"
                class="p-datatable-sm shadow-2"
                style="min-height: 90%; font-weight: bolder"
                :globalFilterFields="['exportby', 'names', 'patientIDs']"
                showGridlines
                stripedRows
                :rowClass="rowClass"
                :rowStyle="rowStyle"
                scrollable
                :virtualScrollerOptions="{ itemSize: 43 }"
            >
                <Column field="names" header="Employee ID" :sortable="true"></Column>
                <Column header="Total" field="total" :sortable="true"></Column>
            </DataTable>
        </Dialog>
    </div>
</template>
<style>
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
</style>
