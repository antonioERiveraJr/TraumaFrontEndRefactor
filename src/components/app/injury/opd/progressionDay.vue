<script setup>
import { usePatientStore } from '../../../../store/injury/patientStore';
import InjuryService from '../../../../service/InjuryService';
import { onMounted, watch, ref } from 'vue';
import Swal from 'sweetalert2';
// const emit = defineEmits('update:loading');
const injuryService = new InjuryService();
const patientStore = usePatientStore();
const vaccineDays = ref([]);
// const checkPatientTSSRecord = ref();
const enccode = ref();
const patientData = ref();

const setDay = (day) => {
    // console.log('Vaccine Days After Hit: ', vaccineDays);
    if (day === '0') {
        patientStore.details = patientStore.defaultDetails;
    }
    patientStore.progressionDay = day;
    // console.log(patientStore.progressionDay);
    if (day === '0') {
        patientStore.details.preAdmissionData.inj_intent_code = '01';
        patientStore.details.preAdmissionData.place_occ_code = '10';
        patientStore.details.preAdmissionData.activity_code = '99';
        patientStore.details.hospitalFacilityData.status_code = '03';
        patientStore.details.hospitalFacilityData.mode_transport_code = '03';
    }
};
const getBadge = (day) => {
    const matchingRecord = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === day);
    return matchingRecord ? matchingRecord.tStamp : null;
};
const newCase = async () => {
    Swal.fire({
        title: 'Do you want to create a new case for this patient?',
        // showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`
    }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            await injuryService.newCase(patientStore.header.hpercode);
            Swal.fire('New case created successfully!', '', 'success');
            window.location.reload();
        } else if (result.isDenied) {
            Swal.fire('New case creation canceled.', '', 'info');
        }
    });
};
const dataIsLoaded = async () => {
    // emit('update:loading', true);
    // console.log('hpercode: ', patientStore.header.hpercode);
    vaccineDays.value = patientStore?.patientTSSRecord?.data.map((record) => record.vaccineday);
    // console.log('tsssrecode: ', patientStore);
};
onMounted(() => {
    dataIsLoaded();
});

// Watch for changes in progressionDay
watch(
    () => patientStore.progressionDay,
    async (newDay) => {
        patientStore.loadSignal = true;
        await dataIsLoaded();
        if (patientStore?.patientTSSRecord && patientStore?.patientTSSRecord.data) {
            const checkPatientTSSRecord = await injuryService.checkPatientTSSRecord(patientStore.header.hpercode, patientStore.type_prophylaxis);
            // console.log('checkPatientTSSRecord: ', checkPatientTSSRecord);
            patientStore.patientTSSRecord = checkPatientTSSRecord;

            // alert('hit');
            // Find the record with the matching vaccineday
            const matchingRecord = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === newDay);

            if (matchingRecord) {
                // console.log('Matching record for progression day:', matchingRecord.data);
                await patientStore.loadOPDPatientData(matchingRecord);
                // emit('update:loading', false);
            } else {
                // console.log('No matching record found for progression day:', newDay);
                enccode.value = localStorage.getItem('enccode') || enccode.value;
                patientData.value = await injuryService.getOPDPatientData(enccode.value);
                // console.log('patientData: ', patientData.value);
                patientStore.loadOPDPatientData(patientData.value);
                // patientStore.details.followUp = { ...patientStore.defaultDetails.followUp };
                // patientStore.details.ABTC = { ...patientStore.defaultDetails.ABTC };

                // emit('update:loading', false);
            }
            patientStore.loadSignal = false;
        } else {
            patientStore.loadSignal = false;
        }
    }
);
</script>
<template>
    <div style="width: 100%; height: 100%">
        <div v-if="patientStore.type_prophylaxis === 'PRE-EXPOSURE'" style="background-color: #9bb0bf; width: 100%; height: 100%">
            <div class="flex flex-column justify-content-center" style="height: 100%; width: 100%">
                <div v-if="!patientStore?.primetss" style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 5%">
                    <Button
                        @click="newCase()"
                        label="NEW CASE"
                        :badge-class="'bg-gray-300'"
                        :badge-style="{ fontSize: '0.8em', padding: '2px 4px' }"
                        style="color: white; background-color: lightslategray; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 100%"
                    />
                </div>
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 29%">
                    <Button
                        @click="setDay('0')"
                        style="
                            color: black;
                            background-color: white;
                            border: 2px solid transparent;
                            width: 100%;
                            margin: 5px auto;
                            height: 100%;
                            font-weight: bolder;
                            font-size: 200%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <div style="font-size: 1.2em">Day 0</div>
                        <div style="font-size: 0.4em; color: black">{{ getBadge('0') }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 29%">
                    <Button
                        @click="setDay('7')"
                        style="
                            color: white;
                            background-color: #9bb0bf;
                            border: 2px solid transparent;
                            width: 100%;
                            margin: 5px auto;
                            height: 100%;
                            font-weight: bolder;
                            font-size: 200%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <div style="font-size: 1.2em">Day 7</div>
                        <div style="font-size: 0.4em; color: white">{{ getBadge('7') }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 29%">
                    <Button
                        @click="setDay('21')"
                        style="
                            color: black;
                            background-color: white;
                            border: 2px solid transparent;
                            width: 100%;
                            margin: 5px auto;
                            height: 100%;
                            font-weight: bolder;
                            font-size: 200%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <div style="font-size: 1.2em">Day 21</div>
                        <div style="font-size: 0.4em; color: black">{{ getBadge('21') }}</div>
                    </Button>
                </div>
            </div>
        </div>
        <div v-if="patientStore.type_prophylaxis === 'POST-EXPOSURE'" style="background-color: #9bb0bf; width: 100%; height: 100%">
            <div class="flex flex-column justify-content-center" style="height: 100%; width: 100%">
                <div v-if="!patientStore?.primetss" style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 5%">
                    <Button
                        @click="newCase()"
                        label="NEW CASE"
                        :badge-class="'bg-gray-300'"
                        style="color: white; background-color: lightslategray; border: 2px solid transparent; width: 100%; margin: 5px auto; height: 100%; font-weight: bolder; font-size: 100%"
                    />
                </div>
                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('0')"
                        style="
                            color: black;
                            background-color: white;
                            border: 2px solid transparent;
                            width: 100%;
                            margin: 5px auto;
                            height: 100%;
                            font-weight: bolder;
                            font-size: 200%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <div style="font-size: 1em">Day 0</div>
                        <div style="font-size: 0.4em; color: black">{{ getBadge('0') }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('3')"
                        style="
                            color: white;
                            background-color: #9bb0bf;
                            border: 2px solid transparent;
                            width: 100%;
                            margin: 5px auto;
                            height: 100%;
                            font-weight: bolder;
                            font-size: 200%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <div style="font-size: 1em">Day 3</div>
                        <div style="font-size: 0.4em; color: white">{{ getBadge('3') }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('7')"
                        style="
                            color: black;
                            background-color: white;
                            border: 2px solid transparent;
                            width: 100%;
                            margin: 5px auto;
                            height: 100%;
                            font-weight: bolder;
                            font-size: 200%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <div style="font-size: 1em">Day 7</div>
                        <div style="font-size: 0.4em; color: black">{{ getBadge('7') }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('14')"
                        style="
                            color: white;
                            background-color: #9bb0bf;
                            border: 2px solid transparent;
                            width: 100%;
                            margin: 5px auto;
                            height: 100%;
                            font-weight: bolder;
                            font-size: 200%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <div style="font-size: 1em">Day 14</div>
                        <div style="font-size: 0.4em; color: white">{{ getBadge('14') }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('21')"
                        style="
                            color: black;
                            background-color: white;
                            border: 2px solid transparent;
                            width: 100%;
                            margin: 5px auto;
                            height: 100%;
                            font-weight: bolder;
                            font-size: 200%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <div style="font-size: 1em">Day 21</div>
                        <div style="font-size: 0.4em; color: black">{{ getBadge('21') }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('28')"
                        style="
                            color: white;
                            background-color: #9bb0bf;
                            border: 2px solid transparent;
                            width: 100%;
                            margin: 5px auto;
                            height: 100%;
                            font-weight: bolder;
                            font-size: 200%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <div style="font-size: 1em">Day 28</div>
                        <div style="font-size: 0.4em; color: white">{{ getBadge('28') }}</div>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
