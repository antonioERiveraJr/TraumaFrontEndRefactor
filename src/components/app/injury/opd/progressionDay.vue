<script setup>
import { usePatientStore } from '../../../../store/injury/patientStore';
import InjuryService from '../../../../service/InjuryService';
import { onMounted, watch, ref } from 'vue';

// const emit = defineEmits('update:loading');
const injuryService = new InjuryService();
const patientStore = usePatientStore();
const vaccineDays = ref([]);
// const checkPatientTSSRecord = ref();
const enccode = ref();
const patientData = ref();

const setDay = (day) => {
    console.log('Vaccine Days After Hit: ', vaccineDays);
    if (day === '0') {
        patientStore.details = patientStore.defaultDetails;
    }
    patientStore.progressionDay = day;
    console.log(patientStore.progressionDay);
    if (day === '0') {
        patientStore.details.preAdmissionData.inj_intent_code = '01';
        patientStore.details.preAdmissionData.place_occ_code = '10';
        patientStore.details.preAdmissionData.activity_code = '99';
        patientStore.details.hospitalFacilityData.status_code = '03';
        patientStore.details.hospitalFacilityData.mode_transport_code = '03';
    }
};
const dataIsLoaded = async () => {
    // emit('update:loading', true);
    console.log('hpercode: ', patientStore.header.hpercode);
    vaccineDays.value = patientStore.patientTSSRecord.data.map((record) => record.vaccineday);
    console.log('Vaccine Days: ', vaccineDays);
};
onMounted(() => {
    dataIsLoaded();
});

// Watch for changes in progressionDay
watch(
    () => patientStore.progressionDay,
    async (newDay) => {
        await dataIsLoaded();
        if (patientStore?.patientTSSRecord && patientStore?.patientTSSRecord.data) {
            // alert('hit');
            // Find the record with the matching vaccineday
            const matchingRecord = patientStore?.patientTSSRecord.data.find((record) => record.vaccineday === newDay);
            if (matchingRecord) {
                console.log('Matching record for progression day:', matchingRecord.data);
                await patientStore.loadOPDPatientData(matchingRecord);
                // emit('update:loading', false);
            } else {
                console.log('No matching record found for progression day:', newDay);
                enccode.value = localStorage.getItem('enccode') || enccode.value;
                patientData.value = await injuryService.getOPDPatientData(enccode.value);
                console.log('patientData: ', patientData.value);
                patientStore.loadOPDPatientData(patientData.value);
                // emit('update:loading', false);
            }
        }
    }
);
</script>
<template>
    <div style="width: 100%; height: 100%">
        <div v-if="patientStore.type_prophylaxis === 'PRE-EXPOSURE'" style="background-color: #9bb0bf; width: 100%; height: 100%">
            <div class="flex flex-column justify-content-center" style="height: 100%; width: 100%">
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 30%">
                    <Button
                        @click="setDay('0')"
                        label="Day 0"
                        :badge="vaccineDays.includes('0') ? '!' : null"
                        :badge-class="'bg-gray-300'"
                        style="color: black; background-color: white; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 200%"
                    />
                </div>
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 30%">
                    <Button
                        :badge="vaccineDays.includes('7') ? '!' : null"
                        :badge-class="'bg-gray-300'"
                        @click="setDay('7')"
                        label="Day 7"
                        style="background-color: #9bb0bf; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 200%"
                    />
                </div>
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 30%">
                    <Button
                        :badge="vaccineDays.includes('21') ? '!' : null"
                        :badge-class="'bg-gray-300'"
                        @click="setDay('21')"
                        label="Day 21"
                        style="color: black; background-color: white; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 200%"
                    />
                </div>
            </div>
        </div>
        <div v-if="patientStore.type_prophylaxis === 'POST-EXPOSURE'" style="background-color: #9bb0bf; width: 100%; height: 100%">
            <div class="flex flex-column justify-content-center" style="height: 100%; width: 100%">
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 15%">
                    <Button
                        @click="setDay('0')"
                        label="Day 0"
                        :badge="vaccineDays.includes('0') ? '!' : null"
                        :badge-class="'bg-gray-300'"
                        style="color: black; background-color: white; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 200%"
                    />
                </div>
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 15%">
                    <Button
                        :badge="vaccineDays.includes('3') ? '!' : null"
                        @click="setDay('3')"
                        label="Day 3"
                        style="background-color: #9bb0bf; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 200%"
                    />
                </div>
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 15%">
                    <Button
                        :badge="vaccineDays.includes('7') ? '!' : null"
                        :badge-class="'bg-gray-300'"
                        @click="setDay('7')"
                        label="Day 7"
                        style="color: black; background-color: white; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 200%"
                    />
                </div>
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 15%">
                    <Button
                        :badge="vaccineDays.includes('14') ? '!' : null"
                        @click="setDay('14')"
                        label="Day 14"
                        style="background-color: #9bb0bf; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 200%"
                    />
                </div>
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 15%">
                    <Button
                        :badge="vaccineDays.includes('21') ? '!' : null"
                        :badge-class="'bg-gray-300'"
                        @click="setDay('21')"
                        label="Day 21"
                        style="color: black; background-color: white; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 200%"
                    />
                </div>
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 15%">
                    <Button
                        :badge="vaccineDays.includes('28') ? '!' : null"
                        @click="setDay('28')"
                        label="Day 28"
                        style="background-color: #9bb0bf; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 200%"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
