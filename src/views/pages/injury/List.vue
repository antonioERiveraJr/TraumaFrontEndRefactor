<script>
import { ref, watch, computed, onMounted } from 'vue';
import Calendar from 'primevue/calendar';
import Toast from 'primevue/toast';
import InjuryList from '../../../components/app/injury/InjuryList.vue';
import moment from 'moment';
import InjuryService from '../../../service/InjuryService';
import { usePatientStore } from '../../../store/injury/PatientStore';
import LibraryService from '@/service/LibraryService';

export default {
    components: {
        Calendar,
        InjuryList,
        Toast
    },

    setup() {
        const libraryService = new LibraryService();
        const startDate = ref(moment().subtract(7, 'days').toDate());
        const endDate = ref(moment().toDate());
        const patientStore = usePatientStore();
        const toast = ref(null);
        const position = ref('center');
        const visible = ref(false);
        const selectedSex = ref();
        const ageFrom = ref(null);
        const ageTo = ref(null);
        const dateFrom = ref(null);
        const searchValue = ref(null);
        const dateTo = ref(null);
        const loading = ref(false);
        const dataTableVisible = ref();
        const reportData = ref([]);
        const selectedNOI = ref();
        const gender = ref([
            { sex: 'Male', code: 'M' },
            { sex: 'Female', code: 'F' },
            { sex: 'All', code: 'All' }
        ]);
        const value = ref('Date of Injury');
        const options = ref(['Date of Injury', 'Date of Consultation']);
        const savedStartDate = ref(null);
        const savedEndDate = ref(null);

        const filteredData = computed(() => {
            return reportData.value.filter((item) => {
                const patage = item.header.patage;
                const patsex = item.header.patsex;
                const injrem = item.header.injrem;
                const isSexMatch = selectedSex.value && selectedSex.value.code !== 'All' ? patsex === selectedSex.value.code : true;
                const isAgeMatch = (ageFrom.value === null || patage >= ageFrom.value) && (ageTo.value === null || patage <= ageTo.value);
                const isNOIMatch = selectedNOI.value ? injrem && new RegExp(`\\b${selectedNOI.value.toLowerCase()}\\b`).test(injrem.toLowerCase()) : true;
                return isSexMatch && isAgeMatch && isNOIMatch;
            });
        });

        const totalReports = computed(() => reportData.value.length);
        const filteredReports = computed(() => filteredData.value.length);
        const maleCount = computed(() => reportData.value.filter((item) => item.header.patsex === 'M').length);
        const femaleCount = computed(() => reportData.value.filter((item) => item.header.patsex === 'F').length);
        const filteredMaleCount = computed(() => filteredData.value.filter((item) => item.header.patsex === 'M').length);
        const filteredFemaleCount = computed(() => filteredData.value.filter((item) => item.header.patsex === 'F').length);

        const generateReport = async () => {
            loading.value = true;
            try {
                const formattedStartDate = moment(dateFrom.value).format('YYYY-MM-DD');
                const formattedEndDate = moment(dateTo.value).format('YYYY-MM-DD');
                const injuryService = new InjuryService();
                const response = await injuryService.reportList(true, formattedStartDate, formattedEndDate, null);
                reportData.value = response.data;
                dataTableVisible.value = true;
                loading.value = false;
            } catch (error) {
                console.error('Error fetching report data:', error);
                toast.value.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Could not fetch report data.',
                    life: 3000
                });
            }
        };

        const monthlyInjuryStats = computed(() => {
            const monthlyCounts = {};
            reportData.value.forEach((item) => {
                const injuryDate = moment(item.header.admdate);
                const monthYear = injuryDate.format('YYYY-MM');
                if (!monthlyCounts[monthYear]) {
                    monthlyCounts[monthYear] = 0;
                }
                monthlyCounts[monthYear]++;
            });
            const totalInjuries = totalReports.value;
            return Object.entries(monthlyCounts).map(([month, count]) => ({
                month,
                count,
                percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0
            }));
        });

        const monthlyInjuryStatsFiltered = computed(() => {
            const monthlyCounts = {};
            filteredData.value.forEach((item) => {
                const injuryDate = moment(item.header.admdate);
                const monthYear = injuryDate.format('YYYY-MM');
                if (!monthlyCounts[monthYear]) {
                    monthlyCounts[monthYear] = 0;
                }
                monthlyCounts[monthYear]++;
            });
            const totalInjuries = filteredReports.value;
            return Object.entries(monthlyCounts).map(([month, count]) => ({
                month,
                count,
                percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0
            }));
        });

        const dispositionInjuryStats = computed(() => {
            const dispositionCounts = {};
            reportData.value.forEach((item) => {
                const dispCode = libraryService.getDispositionCode(item.header.dispcode);
                if (!dispositionCounts[dispCode]) {
                    dispositionCounts[dispCode] = 0;
                }
                dispositionCounts[dispCode]++;
            });
            const totalInjuries = totalReports.value;
            return Object.entries(dispositionCounts).map(([dispCode, count]) => ({
                dispCode,
                count,
                percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0
            }));
        });

        const dispositionInjuryStatsFiltered = computed(() => {
            const dispositionCounts = {};
            filteredData.value.forEach((item) => {
                const dispCode = libraryService.getDispositionCode(item.header.dispcode);
                if (!dispositionCounts[dispCode]) {
                    dispositionCounts[dispCode] = 0;
                }
                dispositionCounts[dispCode]++;
            });
            const totalInjuries = filteredReports.value;
            return Object.entries(dispositionCounts).map(([dispCode, count]) => ({
                dispCode,
                count,
                percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0
            }));
        });

        const outcomeInjuryStats = computed(() => {
            const outcomeCounts = {};
            reportData.value.forEach((item) => {
                const condCode = libraryService.getOutcomeCode(item.header.condcode);
                if (!outcomeCounts[condCode]) {
                    outcomeCounts[condCode] = 0;
                }
                outcomeCounts[condCode]++;
            });
            const totalInjuries = totalReports.value;
            return Object.entries(outcomeCounts).map(([condCode, count]) => ({
                condCode,
                count,
                percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0
            }));
        });

        const outcomeInjuryStatsFiltered = computed(() => {
            const outcomeCounts = {};
            filteredData.value.forEach((item) => {
                const condCode = libraryService.getOutcomeCode(item.header.condcode);
                if (!outcomeCounts[condCode]) {
                    outcomeCounts[condCode] = 0;
                }
                outcomeCounts[condCode]++;
            });
            const totalInjuries = filteredReports.value;
            return Object.entries(outcomeCounts).map(([condCode, count]) => ({
                condCode,
                count,
                percentage: totalInjuries ? ((count / totalInjuries) * 100).toFixed(1) : 0
            }));
        });

        const totalInjury = computed(() => {
            return [
                {
                    label: 'Males ',
                    count: maleCount.value,
                    percentage: `${((maleCount.value / totalReports.value) * 100).toFixed(1)}%`
                },
                {
                    label: 'Females ',
                    count: femaleCount.value,
                    percentage: `${((femaleCount.value / totalReports.value) * 100).toFixed(1)}%`
                },
                {
                    label: 'Total ',
                    count: totalReports.value,
                    percentage: ''
                }
            ];
        });

        const filteredStatistics = computed(() => {
            return [
                {
                    label: 'Males ',
                    count: filteredMaleCount.value,
                    percentage: filteredReports.value ? ((filteredMaleCount.value / filteredReports.value) * 100).toFixed(1) + '%' : '0%'
                },
                {
                    label: 'Females ',
                    count: filteredFemaleCount.value,
                    percentage: filteredReports.value ? ((filteredFemaleCount.value / filteredReports.value) * 100).toFixed(1) + '%' : '0%'
                },
                {
                    label: 'Total ',
                    count: filteredReports.value,
                    percentage: totalReports.value ? ((filteredReports.value / totalReports.value) * 100).toFixed(1) + '%' : '0%'
                }
            ];
        });

        watch(value, (newValue) => {
            value.value = newValue;
        });

        watch(startDate, (newStartDate) => {
            const formattedStartDate = moment(newStartDate).format('MM/DD/YYYY');
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
            patientStore.registry = 'old';
        });
        watch(
            () => patientStore.registry,
            (newRegistry) => {
                if (newRegistry !== 'old') {
                    patientStore.registry = 'old';
                }
            }
        );
        return {
            startDate,
            endDate,
            value,
            monthlyInjuryStats,
            filteredStatistics,
            options,
            savedStartDate,
            totalInjury,
            savedEndDate,
            patientStore,
            visible,
            position,
            toast,
            gender,
            selectedSex,
            selectedNOI,
            ageFrom,
            ageTo,
            dateFrom,
            dateTo,
            generateReport,
            reportData,
            filteredData,
            filteredReports,
            dataTableVisible,
            totalReports,
            maleCount,
            femaleCount,
            filteredMaleCount,
            filteredFemaleCount,
            loading,
            monthlyInjuryStatsFiltered,
            dispositionInjuryStats,
            dispositionInjuryStatsFiltered,
            outcomeInjuryStats,
            outcomeInjuryStatsFiltered,
            searchValue
        };
    }
};
</script>

<template>
    <div>
        <div v-if="loading">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </div>

        <div class="flex justify-content-between align-itenms-center">
            <div class="flex align-items-center" style="width: 25%">
                <i class="pi pi-search ml-4 mr-4" style="font-size: xx-large" />
                <InputText v-model="searchValue" placeholder="( Name / Hospital# / DOI / NOI)" class="shadow-2" style="width: 100%; height: 100%" />
            </div>
            <SelectButton v-model="value" :options="options" style="width: 25%" class="flex justify-content-center" />
            <div class="flex" style="max-width: 100%; position: relative; margin-left: 1%; width: 25%">
                <div class="calendar-container ml-4">
                    <strong class="label-from ml-4 mb-1">FROM</strong>
                    <Calendar v-model="startDate" dateFormat="mm/dd/yy" style="max-width: 100%; height: 100%" :showIcon="true" class="w-auto my-auto shadow-4" :showButtonBar="true" :todayButton="true" :style="{ height: '100%' }" />
                </div>
                <div class="calendar-container ml-4">
                    <strong class="label-to ml-4">TO</strong>
                    <Calendar v-model="endDate" dateFormat="mm/dd/yy" style="max-width: 100%; height: 100%" :showIcon="true" class="w-auto my-auto shadow-4" :showButtonBar="true" :todayButton="true" :style="{ height: '100%' }" />
                </div>
                <span class="tooltip" style="cursor: pointer; margin-left: 0.5%; margin-right: 1%">
                    <i class="pi pi-question-circle" style="font-size: 1.5em"></i>
                    <span class="tooltiptext"
                        >Please note that you can only select dates within 30 days prior to today. <br /><br />
                        If you need to access dates beyond this range, kindly reach out to the MIS department for assistance.</span
                    >
                </span>
            </div>

            <div style="width: 25%" class="flex justify-content-center">
                <Button icon="pi pi-refresh" size="large" class="w-full mr-8 ml-2 shadow-4" v-tooltip.top="'Refresh List'" @click="patientStore.loadSignal = true" />
            </div>
        </div>
    </div>

    <div>
        <InjuryList style="width: 100%" :savedStartDate="startDate.toString()" :savedEndDate="endDate.toString()" :value="value" :searchValue="searchValue" />
    </div>

    <Toast ref="toast" />
</template>

<style scoped>
.clickable-icon {
    color: #007bff;
    transition: transform 0.2s, color 0.2s;
}

.clickable-icon:hover {
    color: #0056b3;
    transform: scale(1.1);
}

.small-table {
    font-size: 0.8em;
}

.small-table .p-datatable-header,
.small-table .p-datatable-footer {
    padding: 0.5rem;
}

.small-table .p-datatable-tbody > tr > td {
    padding: 0.5rem;
    border: 1px solid #ccc;
}

.bordered-table {
    border: 1px solid #ccc;
    border-collapse: collapse;
}

.bordered-table .p-datatable-header {
    border-bottom: 2px solid #ccc;
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

.spinner {
    border: 8px solid rgba(255, 255, 255, 0.3);
    border-left-color: #007bff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

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

.calendar-container {
    position: relative;
}

.label-from,
.label-to {
    position: absolute;
    left: -15px;
    top: -11px;
    font-size: 10px;
    color: #333;
}

.flex {
    display: flex;
}

.flex-1 {
    flex: 1;
}

.p-4 {
    padding: 1rem;
}
</style>

