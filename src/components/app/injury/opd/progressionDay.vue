<script setup>
import { usePatientStore } from '../../../../store/injury/patientStore';
import InjuryService from '../../../../service/InjuryService';
import { watch } from 'vue';

const injuryService = new InjuryService();
const patientStore = usePatientStore();
const setDay = (day) => {
    console.log('day hit');
    patientStore.progressionDay = day;
    console.log(patientStore.progressionDay);
};
const dataIsLoaded = async () => {
    console.log('hpercode: ', patientStore.header.hpercode);
    const checkPatientTSSRecord = await injuryService.checkPatientTSSRecord(patientStore.header.hpercode);
    console.log('checkPatientTSSRecord: ', checkPatientTSSRecord);
    patientStore.patientTSSRecord = checkPatientTSSRecord;
};
watch(
    () => patientStore.dataIsLoaded,
    (newValue) => {
        if (newValue === true) {
            console.log('hit this baby');
            dataIsLoaded();
        }
    } 
);
</script>
<template>
    <div style="width: 100vw; height: 100vh">
        <div style="background-color: #4a6274; width: 100vw; height: 100vh">
            <div class="flex justify-content-center" style="height: 50%; width: 100%">
                <Button @click="setDay('0')" label="Day 0" style="color: black; background-color: #f9ddd2; border: 2px solid transparent; width: 33%; height: 100%; font-weight: bolder; font-size: 400%" />
                <Button @click="setDay('3')" label="Day 3" style="background-color: #4a6274; border: 2px solid transparent; width: 34%; height: 100%; font-weight: bolder; font-size: 400%" />
                <Button @click="setDay('7')" label="Day 7" style="color: black; background-color: #f9ddd2; border: 2px solid transparent; width: 33%; height: 100%; font-weight: bolder; font-size: 400%" />
            </div>
            <div class="flex justify-content-center" style="height: 50%; width: 100%">
                <Button @click="setDay('14')" label="Day 14" style="background-color: #4a6274; border: 2px solid transparent; width: 33%; height: 100%; font-weight: bolder; font-size: 400%" />
                <Button @click="setDay('21')" label="Day 21" style="color: black; background-color: #f9ddd2; border: 2px solid transparent; width: 34%; height: 100%; font-weight: bolder; font-size: 400%" />
                <Button @click="setDay('28')" label="Day 28" style="background-color: #4a6274; border: 2px solid transparent; width: 33%; height: 100%; font-weight: bolder; font-size: 400%" />
            </div>
        </div>
    </div>
</template>
