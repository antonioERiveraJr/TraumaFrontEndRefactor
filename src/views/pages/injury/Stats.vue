<script setup>
import { ref } from 'vue';
import injuryService from '../../../service/InjuryService'; 

const InjuryService = new injuryService();
const dateFrom = ref();
const dateTo = ref();
const loading = ref(false);
const isRefreshDisabled = ref(false);

const generateReport = async (isOneiss) => {
    loading.value = true;
    const array = await InjuryService.generateStats(dateFrom.value, dateTo.value, isOneiss);
    const respone = await InjuryService.generateStatsToExcel(array);
    console.log('response: ', respone);
    loading.value = false;
};
</script>
<template>
    <div style="height: 54vh">
        <div v-if="loading == true" class="flex justify-content-center align-items-center" style="top: 0; left: 0; width: 100%; height: 80vh; backdrop-filter: blur(5px); z-index: 9999; background-color: rgba(255, 255, 255, 0.5)">
            <img src="../../../assets/images/loader.gif" style="height: 10rem; width: 10rem" />
        </div>
        <div v-else style="height: 100%">
            <div style="width: 100%; height: 25%; margin-bottom: 2%" class="mx-2">
                <label for="date" class="p-float-label font-sans text-black-500 text-xl flex font-bold" style="color: #3366ff; width: 100%"><strong>DATE FROM:</strong></label>
                <input type="date" id="date" v-model="dateFrom" class="p-2 border rounded flex justify-content-center" style="width: 100%; height: 100%; font-size: xx-large" />
            </div>
            <div style="width: 100%; height: 25%; margin-bottom: 2%" class="mx-2">
                <label for="date" class="p-float-label font-sans text-black-500 text-xl font-bold" style="color: #3366ff; width: 100%"><strong>DATE TO:</strong></label>
                <input type="date" id="time" v-model="dateTo" class="p-2 border rounded flex justify-content-center" style="width: 100%; height: 100%; font-size: xx-large" />
            </div>
            <div class="mt-5 mx-2 flex justify-content-between" style="width: 100%; height: 100%">
                <Button type="button" label="ONEISS" @click="generateReport(true)" :disabled="isRefreshDisabled" style="width: 48%; height: 25%; padding: 0px 8px" />
                <Button type="button" label="BGHMC" @click="generateReport(false)" :disabled="isRefreshDisabled" style="width: 48%; height: 25%; padding: 0px 8px" />
            </div>
        </div>
    </div>
</template>
