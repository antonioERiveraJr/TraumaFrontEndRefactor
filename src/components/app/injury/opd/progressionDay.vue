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
        patientStore.details = patientStore?.defaultDetails;
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
// const getBadge = (day) => {
//     const matchingRecord = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === day && record.prophylaxis === patientStore.type_prophylaxis);
//     const disableButton = ref(false);
//     if (matchingRecord) {
//         return matchingRecord.tStamp;
//     } else {
//         const checkUnmatched = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === day);
//         if (!checkUnmatched || day === '0') {
//             if (patientStore.type_prophylaxis === 'PRE-EXPOSURE') {
//                 if (day === '0') {
//                     const checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'POST-EXPOSURE');
//                     if (checkProphylaxis) {
//                         if (checkProphylaxis.vaccineday === '0') {
//                             disableButton.value = true;
//                             return `${checkProphylaxis.tStamp}\n${checkProphylaxis.prophylaxis}`;
//                         }
//                     }
//                 } else if (day === '7') {
//                     const checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'POST-EXPOSURE');
//                     if (checkProphylaxis) {
//                         if (checkProphylaxis.vaccineday === '3') {
//                             disableButton.value = true;
//                             return `${checkProphylaxis.tStamp}\n${checkProphylaxis.prophylaxis}`;
//                         }
//                     }
//                 } else if (day === '21') {
//                     const checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'POST-EXPOSURE');
//                     if (checkProphylaxis) {
//                         if (checkProphylaxis.vaccineday === '7') {
//                             disableButton.value = true;
//                             return `${checkProphylaxis.tStamp}\n${checkProphylaxis.prophylaxis}`;
//                         }
//                     }
//                 }
//             } else {
//                 return matchingRecord ? matchingRecord.tStamp : null;
//             }
//         }
//     }
// };
const getBadge = (day) => {
    // console.log('day: ', day);
    const matchingRecord = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === day && record.prophylaxis === patientStore.type_prophylaxis);
    const disableButton = ref(false);

    if (matchingRecord) {
        return matchingRecord.tStamp === null ? '' : { tStamp: matchingRecord.tStamp, disableButton: disableButton.value };
    } else {
        // const checkUnmatched = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === day);
        // console.log('checkUnmatched: ', checkUnmatched);
        // if (!checkUnmatched || day === '0') {
        const checkLog0 = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === '3' || record.vaccineday === '7' || record.vaccineday === '14' || record.vaccineday === '21' || record.vaccineday === '28');

        const checkLog3 = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === '7' || record.vaccineday === '14' || record.vaccineday === '21' || record.vaccineday === '28');

        const checkLog7 = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === '14' || record.vaccineday === '21' || record.vaccineday === '28');

        const checkLog14 = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === '21' || record.vaccineday === '28');

        const checkLog21 = patientStore?.patientTSSRecord?.data?.find((record) => record.vaccineday === '28');

        if (patientStore.type_prophylaxis === 'PRE-EXPOSURE') {
            let checkProphylaxis;

            if (day === '0') {
                // alert('hits');
                checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'POST-EXPOSURE' && record.vaccineday === '0');
                console.log('checkProphylaxis: ', checkProphylaxis);
                if (checkProphylaxis === undefined && checkLog0) {
                    checkProphylaxis = {
                        tStamp: 'TRANSFERRED',
                        prophylaxis: '-',
                        vaccineday: '-'
                    };
                    disableButton.value = true;
                    return checkProphylaxis.tStamp === null ? '' : { tStamp: `${checkProphylaxis.tStamp}\n`, disableButton: disableButton.value };
                }
            } else if (day === '7') {
                // const checkLogPost = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'POST-EXPOSURE' && record.vaccineday === '0');
                // const checkLogPre = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'PRE-EXPOSURE' && record.vaccineday === '0');

                // if (checkLogPost || checkLogPre){

                // }
                // alert('hit');
                checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'POST-EXPOSURE' && record.vaccineday === '3');
                if (checkProphylaxis === undefined && checkLog7) {
                    checkProphylaxis = {
                        tStamp: 'TRANSFERRED',
                        prophylaxis: '-',
                        vaccineday: '-'
                    };
                    disableButton.value = true;
                    return checkProphylaxis.tStamp === null ? '' : { tStamp: `${checkProphylaxis.tStamp}\n`, disableButton: disableButton.value };
                }
            } else if (day === '21') {
                checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'POST-EXPOSURE' && record.vaccineday === '7');
            }

            if (checkProphylaxis) {
                disableButton.value = true;
                return checkProphylaxis.tStamp === null ? '' : { tStamp: `${checkProphylaxis.tStamp}\n${checkProphylaxis.prophylaxis}(day ${checkProphylaxis.vaccineday})`, disableButton: disableButton.value };
            }
        } else if (patientStore.type_prophylaxis === 'POST-EXPOSURE') {
            let checkProphylaxis;
            if (day === '0') {
                checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'PRE-EXPOSURE' && record.vaccineday === '0');

                if (checkProphylaxis === undefined && checkLog0) {
                    checkProphylaxis = {
                        tStamp: 'TRANSFERRED',
                        prophylaxis: '-',
                        vaccineday: '-'
                    };
                    disableButton.value = true;
                    return checkProphylaxis.tStamp === null ? '' : { tStamp: `${checkProphylaxis.tStamp}\n`, disableButton: disableButton.value };
                }
            } else if (day === '3') {
                checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'PRE-EXPOSURE' && record.vaccineday === '7');

                if (checkProphylaxis === undefined) {
                    if (checkProphylaxis === undefined && checkLog3) {
                        checkProphylaxis = {
                            tStamp: 'TRANSFERRED',
                            prophylaxis: '-',
                            vaccineday: '-'
                        };
                        disableButton.value = true;
                        return checkProphylaxis.tStamp === null ? '' : { tStamp: `${checkProphylaxis.tStamp}\n`, disableButton: disableButton.value };
                    }
                }
            } else if (day === '7') {
                checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'PRE-EXPOSURE' && record.vaccineday === '21');
                if (checkProphylaxis === undefined && checkLog7) {
                    console.log('checkProphylaxis: ', checkProphylaxis, '\n checkLog7: ', checkLog7);

                    checkProphylaxis = {
                        tStamp: 'TRANSFERRED',
                        prophylaxis: '-',
                        vaccineday: '-'
                    };
                    disableButton.value = true;
                    return checkProphylaxis.tStamp === null ? '' : { tStamp: `${checkProphylaxis.tStamp}\n`, disableButton: disableButton.value };
                }
            } else if (day === '14') {
                checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'PRE-EXPOSURE' && record.vaccineday === '14');

                if (checkProphylaxis === undefined && checkLog14) {
                    checkProphylaxis = {
                        tStamp: 'TRANSFERRED',
                        prophylaxis: '-',
                        vaccineday: '-'
                    };
                    disableButton.value = true;
                    return checkProphylaxis.tStamp === null ? '' : { tStamp: `${checkProphylaxis.tStamp}\n`, disableButton: disableButton.value };
                }
            } else if (day === '21') {
                checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'PRE-EXPOSURE' && record.vaccineday === '21');

                if (checkProphylaxis === undefined && checkLog21) {
                    checkProphylaxis = {
                        tStamp: 'TRANSFERRED',
                        prophylaxis: '-',
                        vaccineday: '-'
                    };
                    disableButton.value = true;
                    return checkProphylaxis.tStamp === null ? '' : { tStamp: `${checkProphylaxis.tStamp}\n`, disableButton: disableButton.value };
                }
            } else if (day === '28') {
                checkProphylaxis = patientStore?.patientTSSRecord?.data?.find((record) => record.prophylaxis === 'PRE-EXPOSURE' && record.vaccineday === '28');
            }
            if (checkProphylaxis) {
                disableButton.value = true;
                return checkProphylaxis.tStamp === null ? '' : { tStamp: `${checkProphylaxis.tStamp}\n${checkProphylaxis.prophylaxis}(day ${checkProphylaxis.vaccineday})`, disableButton: disableButton.value };
            }
        } else {
            return matchingRecord ? (matchingRecord.tStamp === null ? '' : { tStamp: matchingRecord.tStamp, disableButton: disableButton.value }) : null;
        }
        // }
    }

    // Default return if no conditions are met
    return null; // Return null if no matching record found
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
    vaccineDays.value = patientStore?.patientTSSRecord?.data?.map((record) => record.vaccineday);
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
            // const checkPatientTSSRecord = await injuryService.checkPatientTSSRecord(patientStore.header.hpercode);
            // console.log('checkPatientTSSRecord: ', checkPatientTSSRecord);
            // patientStore.patientTSSRecord = checkPatientTSSRecord;

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
                // patientData.value = patientStore?.OPDPatientData?.find((record) => record.enccode === enccode.value);
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
                        :disabled="getBadge('0')?.disableButton"
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
                        <div style="font-size: 0.4em; color: gray">{{ getBadge('0')?.tStamp }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 29%">
                    <Button
                        @click="setDay('7')"
                        :disabled="getBadge('7')?.disableButton"
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
                        <div style="font-size: 0.4em; color: lightgoldenrodyellow">{{ getBadge('7')?.tStamp }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 29%">
                    <Button
                        @click="setDay('21')"
                        :disabled="getBadge('21')?.disableButton"
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
                        <div style="font-size: 0.4em; color: gray">{{ getBadge('21')?.tStamp }}</div>
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
                        :disabled="getBadge('0')?.disableButton"
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
                        <div style="font-size: 0.4em; color: gray">{{ getBadge('0')?.tStamp }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('3')"
                        :disabled="getBadge('3')?.disableButton"
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
                        <div style="font-size: 0.4em; color: lightgoldenrodyellow">{{ getBadge('3')?.tStamp }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('7')"
                        :disabled="getBadge('7')?.disableButton"
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
                        <div style="font-size: 0.4em; color: gray">{{ getBadge('7')?.tStamp }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('14')"
                        :disabled="getBadge('14')?.disableButton"
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
                        <div style="font-size: 0.4em; color: lightgoldenrodyellow">{{ getBadge('14')?.tStamp }}</div>
                    </Button>
                </div>

                <div style="color: black; background-color: #9bb0bf; border: 2px solid transparent; width: 80%; margin: 5px auto; height: 14%">
                    <Button
                        @click="setDay('21')"
                        :disabled="getBadge('21')?.disableButton"
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
                        <div style="font-size: 0.4em; color: gray">{{ getBadge('21')?.tStamp }}</div>
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
                        <div style="font-size: 0.4em; color: lightgoldenrodyellow">{{ getBadge('28')?.tStamp }}</div>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
