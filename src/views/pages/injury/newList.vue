<script setup>
import { ref, watch, onMounted } from 'vue';
import Calendar from 'primevue/calendar';
import Toast from 'primevue/toast';
import NewInjuryList from '../../../components/app/injury/newInjuryList.vue';
import moment from 'moment';
import { usePatientStore } from '../../../store/injury/PatientStore';
const startDate = ref(moment().subtract(7, 'days').toDate());
const endDate = ref(moment().toDate());
const patientStore = usePatientStore();
const toast = ref(null);
const dateFrom = ref(null);
const dateTo = ref(null);
const loading = ref(false);
const value = ref('Date of Injury');
const options = ref(['Date of Injury', 'Date of Consultation']);
const savedStartDate = ref(null);
const savedEndDate = ref(null);

watch(value, (newValue) => {
    value.value = newValue;
});

watch(dateFrom, (newDateFrom) => {
    dateFrom.value = moment(newDateFrom).format('MM/DD/YYYY');
});

watch(dateTo, (newDateTo) => {
    dateTo.value = moment(newDateTo).format('MM/DD/YYYY');
});

watch(endDate, (newEndDate) => {
    if (!startDate.value) {
        toast.value.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select a start date first.',
            life: 3000
        });
        endDate.value = null;
        return;
    }
    const formattedEndDate = moment(newEndDate).format('MM/DD/YYYY');
    const formattedStartDate = moment(startDate.value).format('MM/DD/YYYY');
    savedEndDate.value = formattedEndDate;
    savedStartDate.value = formattedStartDate;
});
onMounted(async () => {
    patientStore.registry = 'new';
});
watch(
    () => patientStore.registry,
    (newRegistry) => {
        if (newRegistry !== 'new') {
            patientStore.registry = 'new';
        }
    }
);
</script>

<template>
    <div>
        <div v-if="loading">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </div>
        <div class="flex justify-content-center">
            <SelectButton v-model="value" :options="options" />
            <div class="flex" style="max-width: 100%; position: relative; margin-left: 1%">
                <div class="calendar-container mb-2 ml-4">
                    <strong class="label-from ml-4 mb-1">FROM</strong>
                    <Calendar v-model="startDate" dateFormat="mm/dd/yy" style="max-width: 100%; height: 30px" :showIcon="true" class="w-auto my-auto shadow-4" :showButtonBar="true" :todayButton="true" :style="{ height: '30px' }" />
                </div>
                <div class="calendar-container ml-4">
                    <strong class="label-to ml-4">TO</strong>
                    <Calendar v-model="endDate" dateFormat="mm/dd/yy" style="max-width: 100%; height: 30px" :showIcon="true" class="w-auto my-auto shadow-4" :showButtonBar="true" :todayButton="true" :style="{ height: '30px' }" />
                </div>
            </div>
            <span class="tooltip" style="cursor: pointer; margin-left: 0.5%; margin-right: 1%">
                <i class="pi pi-question-circle" style="font-size: 1.5em"></i>
                <span class="tooltiptext"
                    >Please note that you can only select dates within 30 days prior to today. <br /><br />
                    If you need to access dates beyond this range, kindly reach out to the MIS department for assistance.</span
                >
            </span>
            <div>
                <Button icon="pi pi-refresh" size="small" class="w-auto mr-8 ml-2 shadow-4" v-tooltip.top="'Refresh List'" @click="patientStore.loadSignal = true" />
            </div>
        </div>
    </div>
    <div class="flex justify-content-center">
        <NewInjuryList class="w-12 opacity-90" style="max-height: 400px" :savedStartDate="startDate.toString()" :savedEndDate="endDate.toString()" :value="value" />
    </div>
    <Toast ref="toast" />
</template>

<style scoped>
.tooltip {
    position: relative;
    display: inline-block;
    transform: translateY(-10px);
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 500px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 10px;
    position: absolute;
    top: 40%;
    left: 50%;
    margin-left: -520px;
    margin-top: -35px;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
    transition: visibility 0.5s;
}
</style>
