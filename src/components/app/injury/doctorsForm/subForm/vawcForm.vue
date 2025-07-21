<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, computed } from 'vue';
import { usePatientStore } from '../../../../../store/injury/patientStore';
import LibraryService from '@/service/LibraryService';

const patientStore = usePatientStore();
const libraryService = new LibraryService();

// Reactive references for data and dialog states
const selectedVAWC = ref();
const wcpuCustom = ref(false);
const siteOfBodyDialog = ref(false);
const isImpressionInputNeeded = ref(false);
const searchFindings = ref('');
const siteOfBody = ref('');
const selectedImpression = ref('');
const searchImpressions = ref('');
const selectedInputValue = ref(patientStore.details.ExternalCauseOfInjury.vawc_impression_input);
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const vawcCases = libraryService.getVAWCCases(); // Fetch VAWC cases

// Function to open the site of body dialog
const openSiteOfBodyDialog = (data) => {
    console.log('data: ', data);
    siteOfBodyDialog.value = true;
};

// Computed property for placeholder text based on selected input value
const placeholderText = computed(() => {
    switch (selectedInputValue.value) {
        case '1':
            return 'site of the body';
        case '2':
            return 'suction marks, fingertip bruises, bite marks etc.';
        case '3':
            return 'cite the infection';
        case '4':
            return 'specific site';
        default:
            return '';
    }
});

// Function to save site of body information
const saveSiteOfBody = () => {
    const changedValue = '(' + placeholderText.value + ')';
    patientStore.details.ExternalCauseOfInjury.vawc_impression = selectedImpression.value.replace(changedValue, siteOfBody.value);
    patientStore.details.ExternalCauseOfInjury.vawc_impression_input = siteOfBody.value;
    siteOfBodyDialog.value = false; // Close dialog after saving
};

// Event handler for row selection in findings
const onRowSelect = (event) => {
    patientStore.details.ExternalCauseOfInjury.vawc_findings = event.data.findings;
    patientStore.details.ExternalCauseOfInjury.vawc_impression = event.data.impression;
    selectedImpression.value = event.data.impression;
    selectedInputValue.value = event.data.inputValue;

    if (event.data.inputValue !== '0') {
        siteOfBodyDialog.value = true; // Open dialog if input value is set
    }
    isImpressionInputNeeded.value = placeholderText.value !== ''; // Determine if input is needed
};

// Function to filter findings based on search input
const filteredFindings = computed(() => {
    if (!searchFindings.value) return vawcCases;
    return vawcCases.filter((caseItem) => caseItem.findings.toLowerCase().includes(searchFindings.value.toLowerCase()));
});

// Function to filter impressions based on search input
const filteredImpressions = computed(() => {
    if (!searchImpressions.value) return vawcCases;
    return vawcCases.filter((caseItem) => caseItem.impression.toLowerCase().includes(searchImpressions.value.toLowerCase()));
});
</script>

<template>
    <div class="p-1" style="height: 100vh; width: 100%">
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedVAWC"
            :value="vawcCases"
            :paginator="true"
            :rows="10"
            dataKey="findings"
            filterDisplay="menu"
            :globalFilterFields="['findings', 'impression']"
            selectionMode="single"
            :metaKeySelection="false"
            @rowSelect="onRowSelect"
            @rowUnselect="onRowUnselect"
        >
            <div class="flex justify-content-between mb-2 p-0">
                <div>
                    <i class="pi pi-search m-3 p-0" />
                    <InputText class="mb-3" v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
                <Button
                    label="Custom"
                    @click="
                        wcpuCustom = true;
                        vawcDialog = false;
                    "
                />
            </div>
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="findings" header="Findings" :style="{ width: '400px' }" />
            <Column field="impression" header="Impression" :style="{ width: '400px' }" />
            <Column header="Action" :style="{ width: '50px' }">
                <template #body="{ data }">
                    <i
                        v-if="data.inputValue != '0'"
                        class="pi pi-pencil"
                        @click="
                            (event) => {
                                openSiteOfBodyDialog(data); // Open dialog for editing
                                event.stopPropagation();
                            }
                        "
                        style="cursor: pointer"
                    ></i>
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- Custom Findings & Impression Dialog -->
    <Dialog v-model:visible="wcpuCustom" modal header="Custom Findings & Impression" position="left" :style="{ width: '63%' }">
        <Splitter style="height: 700px; width: 100%">
            <SplitterPanel class="flex align-items-start justify-content-center mr=3">
                <div class="p-fluid mr-3" style="width: 100%; margin-bottom: 1rem">
                    <Textarea type="text" v-model="patientStore.details.ExternalCauseOfInjury.vawc_findings" variant="filled" placeholder="Findings" autoResize />
                    <span class="p-input-icon-left mb-2">
                        <i class="pi pi-search" />
                        <InputText v-model="searchFindings" placeholder="Search findings..." />
                    </span>
                    <DataTable :value="filteredFindings" scrollable scrollHeight="550px" selectionMode="single" @row-select="onFindingsRowSelect">
                        <Column field="findings" header="Findings"></Column>
                    </DataTable>
                </div>
            </SplitterPanel>
            <SplitterPanel class="flex align-items-start justify-content-center">
                <div class="p-fluid" style="width: 100%; margin-bottom: 1rem">
                    <Textarea type="text" v-model="patientStore.details.ExternalCauseOfInjury.vawc_impression" variant="filled" placeholder="Impressions" autoResize />
                    <span class="p-input-icon-left mb-2">
                        <i class="pi pi-search" />
                        <InputText v-model="searchImpressions" placeholder="Search impressions..." />
                    </span>
                    <DataTable :value="filteredImpressions" scrollable scrollHeight="550px" selectionMode="single" @row-select="onImpressionsRowSelect">
                        <Column field="impression" header="Impression"></Column>
                        <Column header="Action" :style="{ width: '50px' }">
                            <template #body="{ data }">
                                <i
                                    v-if="data.inputValue != '0'"
                                    class="pi pi-pencil"
                                    @click="
                                        (event) => {
                                            openSiteOfBodyDialog(data); // Edit impression
                                            event.stopPropagation();
                                        }
                                    "
                                    style="cursor: pointer"
                                ></i>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </SplitterPanel>
        </Splitter>
    </Dialog>

    <!-- Site of Body Dialog -->
    <Dialog v-model:visible="siteOfBodyDialog" header="Additional Input" modal:style="{ width: '50rem' }">
        <div class="p-4">
            <Textarea v-model="siteOfBody" :placeholder="placeholderText" class="font-bold mb-2 mt-1 text-xs" style="text-transform: uppercase; width: 100%; min-width: 600px; height: 200px" autoResize />
            <div class="flex justify-content-end mt-3">
                <Button label="Save" icon="pi pi-check" @click="saveSiteOfBody" />
            </div>
        </div>
    </Dialog>
</template>
