<script setup>
import { ref, computed, onMounted } from 'vue';
import InjuryService from '../../../../service/InjuryService';

const tssForms = ref([]);
const loading = ref(true);
const injuryService = new InjuryService();

const selectedDepartment = ref(null);

// compute unique departments for the dropdown
const departments = computed(() => {
    const deptSet = new Set(tssForms.value.map((item) => item.department));
    return Array.from(deptSet).filter(Boolean); // remove null/empty
});

// filtered data depending on department selected
const filteredTssForms = computed(() => {
    if (!selectedDepartment.value) return tssForms.value;
    return tssForms.value.filter((item) => item.department === selectedDepartment.value);
});

onMounted(async () => {
    try {
        const data = await injuryService.getUnfinishedTSSForms();
        tssForms.value = data;
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="p-4">
        <!-- Department filter dropdown -->
        <div class="mb-4 flex justify-content-between">
            <h2 class="text-xl font-semibold mb-4">Unfinished TSS Forms</h2>

            <div>
                <label for="deptFilter" class="font-medium" style="font-weight: bold;">Filter by Department:</label>
                <Dropdown id="deptFilter" v-model="selectedDepartment" :options="departments" placeholder="Select Department" showClear class="w-64" />
            </div>
        </div>

        <DataTable
            :value="filteredTssForms"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            responsiveLayout="scroll"
            :loading="loading"
            style="font-weight: bold"
            class="shadow-md rounded-lg"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Patients"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        >
            <Column field="hpercode" header="Patient ID" sortable></Column>
            <Column field="patfullname" header="Name" sortable></Column>
            <Column field="encounter_date" header="Encounter Date" sortable></Column>
            <Column field="department" header="Department" sortable></Column>
        </DataTable>
    </div>
</template>
