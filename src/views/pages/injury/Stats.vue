<script setup>
import { ref } from 'vue';
import injuryService from '../../../service/InjuryService';
import LoginStats from '../auth/LoginStats.vue';

const InjuryService = new injuryService();
const dateFrom = ref();
const dateTo = ref();
const loading = ref(false);
const isRefreshDisabled = ref(false);
const showDialog = ref(false);

const generateReport = async (isOneiss) => {
    loading.value = true;
    const array = await InjuryService.generateStats(dateFrom.value, dateTo.value, isOneiss);
    if (array?.response?.status === 401) {
        showDialog.value = true;
        console.log('showDialog: ', showDialog);
    } else {
        await InjuryService.generateStatsToExcel(array);
    }
    loading.value = false;
};
const handleLoginSuccess = async () => {
    showDialog.value = false; // Close the dialog
    await generateReport(true); // Call generateReport with true or false as needed
};
</script>
<template>
    <div style="height: 54vh">
        <Dialog v-model:visible="showDialog" :closable="false">
            <LoginStats @login-success="handleLoginSuccess" />
        </Dialog>
        <div v-if="loading" class="flex justify-content-center align-items-center" style="top: 0; left: 0; width: 100%; height: 80vh; backdrop-filter: blur(5px); z-index: 9999; background-color: rgba(255, 255, 255, 0.5)">
            <img src="../../../assets/images/loader.gif" style="height: 10rem; width: 10rem" />
        </div>

        <div v-else :class="{ blurred: showDialog }" style="height: 100%">
            <div style="width: 100%; height: 25%; margin-bottom: 2%" class="mx-2">
                <label for="date" class="p-float-label font-sans text-black-500 text-xl flex font-bold" style="color: #3366ff; width: 100%"><strong>DATE FROM:</strong></label>
                <input type="date" id="date" v-model="dateFrom" class="p-2 border rounded flex justify-content-center" style="width: 100%; height: 100%; font-size: xx-large" />
            </div>
            <div style="width: 100%; height: 25%; margin-bottom: 2%" class="mx-2">
                <label for="time" class="p-float-label font-sans text-black-500 text-xl font-bold" style="color: #3366ff; width: 100%"><strong>DATE TO:</strong></label>
                <input type="date" id="time" v-model="dateTo" class="p-2 border rounded flex justify-content-center" style="width: 100%; height: 100%; font-size: xx-large" />
            </div>
            <div class="mt-5 mx-2 flex justify-content-between" style="width: 100%; height: 100%">
                <Button type="button" label="ONEISS" @click="generateReport(true)" :disabled="isRefreshDisabled" style="width: 48%; height: 25%; padding: 0px 8px" />
                <Button type="button" label="BGHMC" @click="generateReport(false)" :disabled="isRefreshDisabled" style="width: 48%; height: 25%; padding: 0px 8px" />
            </div>

            <div v-if="showDialog" style="background-color: azure" class="overlay" @click.prevent></div>
        </div>
    </div>
</template>

<style scoped>
.blurred {
    filter: blur(5px); /* Adjust the blur intensity as needed */
    transition: filter 0.3s ease; /* Smooth transition */
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    z-index: 9998; /* Behind the loader and above other content */
}
</style>
