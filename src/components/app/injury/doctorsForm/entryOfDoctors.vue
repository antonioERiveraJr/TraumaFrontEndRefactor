<script setup>
import { ref, watch } from 'vue';
import InjuryService from '../../../../service/InjuryService';
import { usePatientStore } from '../../../../store/injury/patientStore';
import { useUserStore } from '../../../../store/general/UserStore';

const user = useUserStore();
const entries = ref([]);
const showSideBar = ref(false);
const injuryService = new InjuryService();
const patientStore = usePatientStore();
const noRecentData = ref(false);
const loader = ref(false);
const props = defineProps({
    enccode: {
        type: String,
        required: true
    }
});
const patientDataIsLoaded = async () => {
    entries.value = await injuryService.getEntryOfDoctors(props.enccode);
    if (Array.isArray(entries.value) && entries.value.length > 0) {
        patientStore.firstDiagnosis = false;
        try {
            const latestEntry = await injuryService.getLatestEntryOfDoctors(props.enccode);
            if (latestEntry) {
                entries.value = entries.value.map((entry) => ({
                    ...entry,
                    isLatest: entry.id === latestEntry.id,
                    formUser: user.userInfo.employeeid === entry.entryby
                }));
            }
        } catch (error) {
            console.log('Error fetching latest entry: ', error);
        }
    } else {
        noRecentData.value = true;
    }
};
watch(
    () => patientStore.dataIsLoaded,
    (newValue) => {
        if (newValue === true) {
            patientDataIsLoaded();
        }
    }
); 

function rowClass(data) {
    return [{ 'bg-primary': data.primediag === 'Y' }];
}
</script>

<template>
    <div v-if="loader" class="flex justify-content-center align-items-center" style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh; backdrop-filter: blur(5px); z-index: 9999; background-color: rgba(255, 255, 255, 0.5)">
        <img src="@/assets/images/loader.gif" alt="Loading..." style="height: 10rem; width: 10rem" />
    </div>
    <Button
        v-tooltip.top="'List of Forms'"
        class="floating-logo border border-gray-300 rounded-lg bg-blue-400 text-white font-semibold hover:bg-green-600 transition duration-200 ease-in-out shadow-lg"
        icon="pi pi-arrow-up"
        @click="showSideBar = true"
    />

    <Sidebar v-model:visible="showSideBar" header="Left Sidebar" position="bottom" style="height: auto; border-radius: 5px" class="p-2 m-3 rounded-t-lg">
        <div class="card">
            <Message v-if="noRecentData">No Recent Form Submission / Diagnosis</Message>
            <DataTable v-if="!noRecentData" sortField="tstamp" :value="entries" :metaKeySelection="false" selectionMode="single" :rowClass="rowClass">
                <Column
                    ><template #body="slotProps">
                        <i v-if="slotProps.data.formUser" class="pi pi-heart-fill" style="color: lightseagreen" title="Your Entry"></i>
                        <i v-if="slotProps.data.isLatest" class="ml-3 pi pi-bookmark-fill" title="Latest Diagnosis" style="color: red"></i>
                    </template>
                </Column>
                <Column field="entryby" header="Entry By">
                    <template #body="slotProps"> {{ slotProps.data.empprefix }} {{ slotProps.data.firstname }} {{ slotProps.data.lastname }} </template>
                </Column>
                <Column field="diagtext" header="Diagnosis "></Column>
                <Column field="tstamp" header="Date">
                    <template #body="slotProps">
                        {{ new Date(slotProps.data.tstamp).toLocaleDateString('en-US') }}
                        {{ new Date(slotProps.data.tstamp).toLocaleTimeString('en-US', { hour12: true }) }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </Sidebar>
</template>

<style scoped>
.floating-logo {
    position: fixed;
    bottom: 20px;
    animation: zoomInOut 1.25s infinite;
}

@keyframes zoomInOut {
    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}
</style>
