<script setup>
import { usePatientStore } from '@/store/injury/PatientStore';
import { useLocationsStore } from '../../../../store/general/LocationsStore';

import { ref, watch, defineEmits, onUnmounted } from 'vue';

import createValidationRules from '../../../../validation/injuryValidations';
import useVuelidate from '@vuelidate/core';

import LibraryService from '@/service/LibraryService';
import InjuryService from '@/service/InjuryService';
import Swal from 'sweetalert2';

const patientStore = usePatientStore();
const locationsStore = useLocationsStore();
const validationRules = createValidationRules();
const injuryService = new InjuryService();
const libraryService = new LibraryService();
const emit = defineEmits(['update:requiredCountGeneralData']);
const detailsData = patientStore.details;
const loadingProvinces = ref(false);
const date = ref();
const time = ref();
const newDate = ref();
const newTime = ref();
const focusElement = (refName) => {
    const element = ref[refName];
    if (element) {
        element.focus();
    }
};
const v$ = useVuelidate(validationRules, detailsData);
const injuryIntents = libraryService.getInjuryIntents();
const modesOfTransport = libraryService.getModesOfTransport();
const statusReaching = libraryService.getStatusReaching();
const loading = ref(true);
const injuryDate = ref(patientStore.details.generalData.doctor_injtme);
const dateSituation = ref('Complete');
const erDate = ref();
const disableProv = ref(true);
const disableCity = ref(true);
const disableBrgy = ref(true);
const requiredCount = ref(0);
const allLoc = [];
const distinctRegions = ref();
const distinctProvince = ref();
const distinctCity = ref();
const distinctBarangays = ref();
const options = ref(['COORDINATED', 'UNCOORDINATED']);
async function loadLocations() {
    // console.log('hit');

    try {
        allLoc.value = await locationsStore.getLocations();
        // console.log('alloc: ', allLoc?.value?.data);
        // Access the data array
        const locationsArray = allLoc?.value?.data;

        // Check if locationsArray is an array
        if (!Array.isArray(locationsArray)) {
            throw new Error('Expected locations.data to be an array');
        }
        distinctRegions.value = Array.from(new Map(locationsArray.map((location) => [location.regcode, location])).values())
            .map((location) => ({
                regcode: location.regcode,
                regname: location.regname
            }))
            .sort((a, b) => a.regname.localeCompare(b.regname));
        patientStore.storeRegions = distinctRegions;

        // Check if region does exist or not
        if (patientStore?.details?.generalData?.plc_regcode != null) {
            disableProv.value = false;
            if (Array.isArray(allLoc)) {
                distinctProvince.value = Array.from(new Map(allLoc?.value?.data.filter((location) => location.regcode === patientStore.details.generalData.plc_regcode).map((location) => [location.provcode, location])).values()).map((location) => ({
                    provcode: location.provcode,
                    provname: location.provname
                }));
                patientStore.storeProvinces = distinctProvince;
            } else {
                console.error('Expected locations.data to be an array');
                distinctProvince.value = [];
            }
        } else {
            distinctProvince.value = Array.from(new Map(locationsArray.map((location) => [location.provcode, location])).values())
                .map((location) => ({
                    regcode: location.regcode,
                    provcode: location.provcode,
                    provname: location.provname
                }))
                .sort((a, b) => a.provname.localeCompare(b.provname));
            patientStore.storeProvinces = distinctProvince;
        }

        // Check if province does exist or not
        if (patientStore?.details?.generalData?.plc_provcode != null) {
            disableCity.value = false;

            patientStore.details.generalData.ctycode = '';
            if (Array.isArray(allLoc)) {
                distinctCity.value = Array.from(new Map(allLoc?.value?.data.filter((location) => location.provcode === patientStore.details.generalData.plc_provcode).map((location) => [location.ctycode, location])).values()).map((location) => ({
                    ctycode: location.ctycode,
                    ctyname: location.ctyname
                }));
                // console.log('distinctCity: ', distinctCity.value);
                patientStore.locationLoaded = true;
                patientStore.storeCities = distinctCity;
            } else {
                console.error('Expected locations.data to be an array');
                distinctCity.value = [];
            }
        } else {
            distinctCity.value = Array.from(new Map(locationsArray.map((location) => [location.ctycode, location])).values())
                .map((location) => ({
                    provcode: location.provcode,
                    ctycode: location.ctycode,
                    ctyname: location.ctyname
                }))
                .sort((a, b) => a.ctyname.localeCompare(b.ctyname));
            patientStore.storeCities = distinctCity;
            patientStore.locationLoaded = true;
        }

        // Check if city does exist or not

        if (patientStore?.details?.generalData?.plc_ctycode != null) {
            // console.log('hit');
            if (Array.isArray(allLoc)) {
                distinctBarangays.value = Array.from(new Map(allLoc?.value?.data.filter((location) => location.ctycode === patientStore.details.generalData.plc_ctycode).map((location) => [location.bgycode, location])).values()).map((location) => ({
                    bgycode: location.bgycode,
                    bgyname: location.bgyname
                }));
                patientStore.locationLoaded = true;
                patientStore.storeBrgy = distinctBarangays;
            } else {
                console.error('Expected locations.data to be an array');
                distinctBarangays.value = [];
            }
        } else {
            // console.log('hit2');
            distinctBarangays.value = Array.from(new Map(locationsArray.map((location) => [location.bgycode, location])).values())
                .map((location) => ({
                    ctycode: location.ctycode,
                    bgycode: location.bgycode,
                    bgyname: location.bgyname
                }))
                .sort((a, b) => a.bgyname.localeCompare(b.regname));
            patientStore.storeBrgy = distinctBarangays;
            patientStore.locationLoaded = true;
        }

        // console.log('regions: ', patientStore.storeRegions, '\n', 'provinces: ', patientStore.storeProvinces, '\n', 'cities: ', patientStore.storeCities, '\n', 'bgy: ', patientStore.storeBrgy, '\n');
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
    // await locationsStore.getRegions();
    // if (patientStore.details.generalData.plc_regcode) {
    //     disableProv.value = false;
    //     loadingProvinces.value = true;
    //     await locationsStore.getProvinces(patientStore.details.generalData.plc_regcode);
    //     loadingProvinces.value = false;
    // } else {
    //     disableProv.value = true;
    // }
    // if (patientStore.details.generalData.plc_provcode) {
    //     disableCity.value = false;
    //     loadingCity.value = true;
    //     await locationsStore.getCities(patientStore.details.generalData.plc_provcode);
    //     loadingCity.value = false;
    // } else {
    //     disableCity.value = true;
    // }
    // if (patientStore.details.generalData.plc_ctycode) {
    //     disableBrgy.value = false;
    //     loadingBrgy.value = true;
    //     await locationsStore.getBgys(patientStore.details.generalData.plc_ctycode);
    //     loadingBrgy.value = false;
    // } else {
    //     disableBrgy.value = true;
    // }
}

const validate = async () => {
    const preAdmissionData = await v$.value.preAdmissionData.$validate();
    const generalData = await v$.value.generalData.$validate();
    return { preAdmissionData, generalData };
};

const transRefType = [
    { ref_code: '0', ref_desc: '' },
    {
        ref_code: '1',
        ref_desc: 'Referred by another hospital',
        model: patientStore.details.hospitalFacilityData.trans_ref,
        truevalue: 'Y',
        falsevalue: 'N'
    },
    {
        ref_code: '2',
        ref_desc: 'Transferred from another hospital',
        model: patientStore.details.hospitalFacilityData.trans_ref2,
        truevalue: 'Y',
        falsevalue: 'N'
    }
];

const transRefValue = ref('0');
function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate.replace(',', '');
}
const patientDataIsLoaded = async () => {
    loading.value = false;

    await loadLocations();
    onResize();
    const enccode = patientStore.enccode;
    if (enccode) {
        const response = await injuryService.getPatientReferral(enccode);
        if (response.message === 'Success' && response.data.length > 0) {
            patientStore.details.hospitalFacilityData.coord_uncoord = 'COORDINATED';
            if (patientStore.details.hospitalFacilityData.coord_uncoord === 'COORDINATED') {
                transRefValue.value = '1';
                patientStore.details.hospitalFacilityData.ref_physician = response.data[0].referredByName;
                patientStore.details.hospitalFacilityData.ref_hosp_code_sp = response.data[0].initiatingFacility;
            } else {
                patientStore.details.hospitalFacilityData.coord_uncoord = 'UNCOORDINATED';
            }
        } else {
            patientStore.details.hospitalFacilityData.coord_uncoord = 'UNCOORDINATED';
        }
    }
    if (patientStore.details.generalData.doctor_injtme) {
        const injtme = new Date(patientStore.details.generalData.doctor_injtme);
        date.value = injtme;
        time.value = injtme;
        injuryDate.value = injtme;
    }
    if (patientStore.details.generalData.doctor_injtme === '1900-01-01 00:00:00.000' || patientStore.details.generalData.doctor_injtme === '00/00/0000') {
        dateSituation.value = 'Unknown';
        patientStore.details.generalData.doctor_doi = 'Unknown';
        patientStore.details.generalData.doctor_toi = 'Unknown';
    } else {
        dateSituation.value = 'Complete';
    }
    if (patientStore.details.hospitalFacilityData.trans_ref == 'Y') {
        transRefValue.value = '1';
    }
    if (patientStore.details.hospitalFacilityData.trans_ref2 == 'Y') {
        transRefValue.value = '2';
    }

    if (patientStore.details.generalData.doctor_injtme) {
        const injtme = new Date(patientStore.details.generalData.doctor_injtme);
        date.value = injtme;
        time.value = injtme;
        injuryDate.value = injtme;
        newDate.value = `${injtme.getFullYear()}-${(injtme.getMonth() + 1).toString().padStart(2, '0')}-${injtme.getDate().toString().padStart(2, '0')}`;
        newTime.value = `${injtme.getHours().toString().padStart(2, '0')}:${injtme.getMinutes().toString().padStart(2, '0')}`;
    }
};

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const gcsCodeScore = ref();
const onResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
};
watch(
    () => patientStore.details.generalData.plc_regcode,
    async (newRegionCode) => {
        if (newRegionCode) {
            disableProv.value = false;

            patientStore.details.generalData.provcode = '';
            if (Array.isArray(allLoc)) {
                distinctProvince.value = Array.from(new Map(allLoc?.value?.data.filter((location) => location.regcode === newRegionCode).map((location) => [location.provcode, location])).values()).map((location) => ({
                    provcode: location.provcode,
                    provname: location.provname
                }));
            } else {
                console.error('Expected locations.data to be an array');
                distinctProvince.value = [];
            }
        } else {
            disableProv.value = true;
            distinctProvince.value = [];
        }
    }
);

watch(
    () => patientStore.details.generalData.plc_provcode,
    async (newProvinceCode) => {
        if (newProvinceCode) {
            disableCity.value = false;

            patientStore.details.generalData.ctycode = '';
            if (Array.isArray(allLoc)) {
                distinctCity.value = Array.from(new Map(allLoc?.value?.data.filter((location) => location.provcode === newProvinceCode).map((location) => [location.ctycode, location])).values()).map((location) => ({
                    ctycode: location.ctycode,
                    ctyname: location.ctyname
                }));
            } else {
                console.error('Expected locations.data to be an array');
                distinctCity.value = [];
            }
        } else {
            disableCity.value = true;
            distinctCity.value = [];
        }
    }
);

watch(
    () => patientStore.details.generalData.plc_ctycode,
    async (newCityCode) => {
        disableBrgy.value = false;
        if (newCityCode) {
            if (Array.isArray(allLoc)) {
                distinctBarangays.value = Array.from(new Map(allLoc?.value?.data.filter((location) => location.ctycode === newCityCode).map((location) => [location.bgycode, location])).values()).map((location) => ({
                    bgycode: location.bgycode,
                    bgyname: location.bgyname
                }));
            } else {
                console.error('Expected locations.data to be an array');
                distinctBarangays.value = [];
            }
        } else {
            disableBrgy.value = false;
            distinctBarangays.value = [];
        }
    }
);

window.addEventListener('resize', onResize);

onUnmounted(() => {
    window.removeEventListener('resize', onResize);
});
watch(
    () => patientStore.dataIsLoaded,
    (newValue) => {
        if (newValue === true) {
            patientDataIsLoaded();
        }
    }
);
watch(
    () => transRefValue.value,
    (value) => {
        if (value == '0') {
            patientStore.details.hospitalFacilityData.trans_ref = '';
            patientStore.details.hospitalFacilityData.trans_ref2 = '';
        }
        if (value == '1') {
            patientStore.details.hospitalFacilityData.trans_ref = 'Y';
            patientStore.details.hospitalFacilityData.trans_ref2 = '';
        }
        if (value == '2') {
            patientStore.details.hospitalFacilityData.trans_ref = '';
            patientStore.details.hospitalFacilityData.trans_ref2 = 'Y';
        }
    }
);

watch(
    () => patientStore.submitForm,
    async (value) => {
        if (value) {
            await validate();
        }
    }
);

watch(
    () => patientStore.details.hospitalFacilityData.coord_uncoord,
    (newValue) => {
        patientStore.details.hospitalFacilityData.coord_uncoord = newValue;
    }
);
watch(erDate, (newValue) => {
    if (newValue) {
        patientStore.header.doctor_admdate = formatDate(newValue);
    }
});
watch(
    () => [patientStore.details.hospitalFacilityData.gcs_eye, patientStore.details.hospitalFacilityData.gcs_motor, patientStore.details.hospitalFacilityData.gcs_verbal],
    () => {
        const gcsCode = patientStore.details.hospitalFacilityData.gcs_eye + patientStore.details.hospitalFacilityData.gcs_verbal + patientStore.details.hospitalFacilityData.gcs_motor;
        gcsCodeScore.value = Number(patientStore.details.hospitalFacilityData.gcs_eye) + Number(patientStore.details.hospitalFacilityData.gcs_verbal) + Number(patientStore.details.hospitalFacilityData.gcs_motor);
        patientStore.details.hospitalFacilityData.gcs_score = gcsCodeScore;
        patientStore.details.hospitalFacilityData.gcs_beh_code = gcsCode;
        const gcsLabels = [
            `\nEye Opening Response: ${libraryService.getGCS().find((option) => option.behavior === '1' && option.score === patientStore.details.hospitalFacilityData.gcs_eye)?.formattedLabel}`,
            `\nBest Verbal Response:  ${libraryService.getGCS().find((option) => option.behavior === '2' && option.score === patientStore.details.hospitalFacilityData.gcs_verbal)?.formattedLabel}`,
            `\nBest Motor Response: ${libraryService.getGCS().find((option) => option.behavior === '3' && option.score === patientStore.details.hospitalFacilityData.gcs_motor)?.formattedLabel}`
        ];
        patientStore.details.hospitalFacilityData.gcs_beh_sp = gcsLabels.join('');
    }
);
watch(
    () => dateSituation.value,
    () => {
        if (dateSituation.value === 'Unknown') {
            patientStore.details.generalData.doctor_injtme = '1900-01-01 00:00:00.000';
            patientStore.details.generalData.doctor_doi = 'Unknown';
            patientStore.details.generalData.doctor_toi = 'Unknown';
        } else {
            patientStore.details.generalData.doctor_injtme = injuryDate.value;
        }
    }
);

watch(
    () => [patientStore.details.preAdmissionData, patientStore.details.generalData, patientStore.details.hospitalFacilityData],
    () => {
        const requiredFields = [
            { value: patientStore.details.preAdmissionData.inj_intent_code, required: true },
            { value: patientStore.details.generalData.doctor_injtme, required: true },
            { value: patientStore.details.generalData.plc_regcode, required: true },
            { value: patientStore.details.generalData.plc_provcode, required: true },
            { value: patientStore.details.generalData.plc_ctycode, required: true },
            { value: patientStore.details.hospitalFacilityData.status_code, required: true },
            { value: patientStore.details.hospitalFacilityData.mode_transport_code, required: true },
            { value: patientStore.details.hospitalFacilityData.coord_uncoord, required: true },
            { value: patientStore.details.hospitalFacilityData.trans_ref || patientStore.details.hospitalFacilityData.trans_ref, required: patientStore.details.hospitalFacilityData.coord_uncoord === 'COORDINATED' },
            { value: patientStore.details.hospitalFacilityData.ref_physician, required: patientStore.details.hospitalFacilityData.trans_ref || patientStore.details.hospitalFacilityData.trans_ref !== '' },
            { value: patientStore.details.hospitalFacilityData.ref_hosp_code_sp, required: patientStore.details.hospitalFacilityData.trans_ref || patientStore.details.hospitalFacilityData.trans_ref !== '' }
        ];
        requiredCount.value = requiredFields.filter((field) => field.required && !field.value).length;
        emit('update:requiredCountGeneralData', requiredCount.value);
    },
    { deep: true }
);

watch(
    () => injuryDate.value,
    (newValue) => {
        patientStore.details.generalData.doctor_injtme = newValue;
        patientStore.details.generalData.doctor_injtme = formatDate(newValue);
        const hours = newValue.getHours();
        const minutes = newValue.getMinutes();
        patientStore.details.generalData.doctor_toi = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const month = newValue.getMonth() + 1;
        const day = newValue.getDate();
        const year = newValue.getFullYear();
        patientStore.details.generalData.doctor_doi = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`; // Format as MM/DD/YYYY
    }
);
watch([newDate, newTime], ([newDateValue, newTimeValue]) => {
    if (newDateValue && newTimeValue) {
        const [year, month, day] = newDateValue.split('-').map(Number);
        const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

        const [hours, minutes] = newTimeValue.split(':').map(Number);
        let adjustedHours = hours;
        let meridian = 'AM';

        if (adjustedHours >= 12) {
            meridian = 'PM';
            if (adjustedHours > 12) {
                adjustedHours -= 12;
            }
        } else if (adjustedHours === 0) {
            adjustedHours = 12;
        }

        const newTimeString = `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${meridian}`;
        const combinedDateTime = `${formattedDate} ${newTimeString}`;
        const combinedDate = new Date(combinedDateTime);

        if (new Date(patientStore.header.admdate) >= combinedDate) {
            injuryDate.value = combinedDate;
        } else {
            newDate.value = null;
            newTime.value = null;
            injuryDate.value = null;
            Swal.fire({
                icon: 'error',
                title: 'Invalid Injury Date/Time',
                text: 'Injury time/date must be earlier than the Date and Time of ER Encounter.'
            });
            console.warn('Warning: Injury Date/Time is invalid and has been reset.');
        }
    }
});
</script>

<template>
    <div class="card shadow-4 overflow-auto h-full opacity-90" style="width: 100%">
        <div v-if="loading">
            <div class="flex flex-wrap align-items-center">
                <h4 class="my-auto font-bold" style="color: #000080">NATURE of INJURY</h4>
            </div>
            <div class="loader"></div>
            <Skeleton class="mb-2" height="3rem" width="25rem" />
            <div class="flex flex-column">
                <label style="color: #000080" class="text-s" for="generalData.inj_intent_code">Injury Intent</label>
                <Skeleton class="mb-2" height="3rem" width="25rem" />
            </div>
            <label style="color: #000080" for="injtme" class="p-float-label text-s fancy-label">Date and Time of Injury</label>
            <Skeleton class="mb-2" height="3rem" width="25rem" />
            <label style="color: #000080" for="admdate" class="p-float-label text-s fancy-label">Date and Time of ER Encounter</label>
            <div class="flex flex-column">
                <label style="color: #000080" class="text-s" for="generalData.plc_regcode">POI Region</label>
                <Skeleton class="mb-2" height="3rem" width="25rem" />
            </div>
            <div class="flex flex-column">
                <label style="color: #000080" class="text-s" for="generalData.plc_provcode">POI Province</label>
                <Skeleton class="mb-2" height="3rem" width="25rem" />
            </div>
            <div class="flex flex-column">
                <label style="color: #000080" class="text-s" for="generalData.plc_ctycode">POI City/Municipality</label>
                <Skeleton class="mb-2" height="3rem" width="25rem" />
            </div>
            <div class="flex flex-column">
                <label style="color: #000080" class="text-s" for="generalData.plc_bgycode">POI Baranggay</label>
                <Skeleton class="mb-2" height="3rem" width="25rem" />
            </div>
        </div>
        <div v-else>
            <div class="grid grid-cols-2 gap-2">
                <div :style="{ width: width < 800 ? '100%' : '49%' }">
                    <div class="flex flex-column">
                        <div class="flex justify-content-between">
                            <label style="color: #000080" class="text-s" for="generalData.inj_intent_code"><i>Injury Intent</i></label>
                            <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.inj_intent_code === ''">
                                <small :class="{ 'required-error': true, zoom: patientStore.details.preAdmissionData.inj_intent_code === '' }" class="text-red-800 text-s font-bold">Value is required</small>
                            </div>
                        </div>
                        <Dropdown
                            id="generalData.inj_intent_code"
                            v-model="patientStore.details.preAdmissionData.inj_intent_code"
                            :options="injuryIntents"
                            optionLabel="inj_intent_desc"
                            optionValue="inj_intent_code"
                            @click="focusElement('injuryIntentDropdown')"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.preAdmissionData.inj_intent_code === ''
                            }"
                        />
                    </div>
                    <div class="flex justify-content-between">
                        <label style="color: #000080" for="injtme" class="text-s p-float-label text-s"><i>Date and Time of Injury</i></label>
                        <div class="flex justify-content-end" v-if="patientStore.details.generalData.doctor_injtme === ''">
                            <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-3 mt-2 mb-2 justify-content-center">
                        <div class="flex align-items-center">
                            <RadioButton v-model="dateSituation" value="Unknown" />
                            <strong class="ml-2">UNKNOWN</strong>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="dateSituation" value="Complete" />
                            <strong class="ml-2">COMPLETE</strong>
                        </div>
                    </div>

                    <div v-if="dateSituation === 'Complete'" class="flex justify-content-center flex-wrap p-fluid">
                        <div class="m-3 flex justify-content-between" style="width: 100%">
                            <div style="width: 98%">
                                <label for="date" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff; width: 98%"><i>Date(dd/mm/yyyy)</i></label>
                                <input type="date" id="date" v-model="newDate" class="text-lg p-2 border rounded" style="width: 98%; height: 3rem" />
                            </div>
                            <div style="width: 98%">
                                <label for="time" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff; width: 98%"><i>Time(12-hour format)</i></label>
                                <input type="time" id="time" v-model="newTime" class="text-lg p-2 border rounded" style="width: 98%; height: 3rem" />
                            </div>
                        </div>
                    </div>
                    <label style="color: #000080" for="admdate" class="p-float-label text-s"><i>Date and Time of ER Encounter</i></label>
                    <InputText id="admdate" type="text" v-model="patientStore.header.admdate" class="p-inputtext-filled font-bold mb-2" style="width: 100%" readonly />

                    <div class="flex flex-column">
                        <div class="flex justify-content-between">
                            <label style="color: #000080" class="text-s" for="generalData.plc_regcode">POI Region</label>
                            <div class="flex justify-content-end" v-if="patientStore.details.generalData.plc_regcode == '' || patientStore.details.generalData.plc_regcode == ' ' || patientStore.details.generalData.plc_regcode == null">
                                <small
                                    :class="{ 'required-error': true, zoom: patientStore.details.generalData.plc_regcode == '' || patientStore.details.generalData.plc_regcode == ' ' || patientStore.details.generalData.plc_regcode == null }"
                                    class="text-red-800 text-s font-bold"
                                    >Value is required</small
                                >
                            </div>
                        </div>

                        <Dropdown
                            id="generalData.plc_regcode"
                            v-model="patientStore.details.generalData.plc_regcode"
                            :options="distinctRegions"
                            optionLabel="regname"
                            optionValue="regcode"
                            filter
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.generalData.plc_regcode == '' || patientStore.details.generalData.plc_regcode == ' ' || patientStore.details.generalData.plc_regcode == null
                            }"
                        />
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between">
                            <label style="color: #000080" class="text-s" for="generalData.plc_provcode"><i>POI Province</i></label>
                            <div class="flex justify-content-end" v-if="patientStore.details.generalData.plc_provcode === '' || patientStore.details.generalData.plc_provcode == null">
                                <small :class="{ 'required-error': true, zoom: patientStore.details.generalData.plc_provcode === '' || patientStore.details.generalData.plc_provcode == null }" class="text-red-800 text-s font-bold"
                                    >Value is required</small
                                >
                            </div>
                        </div>
                        <Dropdown
                            id="generalData.plc_provcode"
                            v-model="patientStore.details.generalData.plc_provcode"
                            :options="distinctProvince"
                            optionLabel="provname"
                            optionValue="provcode"
                            :disabled="disableProv"
                            :loading="loadingProvinces"
                            filter
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.generalData.plc_provcode === '' || patientStore.details.generalData.plc_provcode == null
                            }"
                            :emptyMessage="'Please select a Region first.'"
                        />
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between">
                            <label style="color: #000080" class="text-s" for="generalData.plc_ctycode"><i>POI City/Municipality</i></label>
                            <div class="flex justify-content-end" v-if="patientStore.details.generalData.plc_ctycode === '' || patientStore.details.generalData.plc_ctycode == null">
                                <small :class="{ 'required-error': true, zoom: patientStore.details.generalData.plc_ctycode === '' || patientStore.details.generalData.plc_ctycode == null }" class="text-red-800 text-s font-bold"
                                    >Value is required</small
                                >
                            </div>
                        </div>
                        <Dropdown
                            id="generalData.plc_ctycode"
                            v-model="patientStore.details.generalData.plc_ctycode"
                            :options="distinctCity"
                            optionLabel="ctyname"
                            filter
                            optionValue="ctycode"
                            :disabled="disableCity"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.generalData.plc_ctycode === '' || patientStore.details.generalData.plc_ctycode == null
                            }"
                            :emptyMessage="'Please select a Province first.'"
                        />
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between">
                            <label style="color: #000080" class="text-s" for="generalData.plc_bgycode"><i>POI Baranggay</i></label>
                            <div class="flex justify-content-end" v-if="patientStore.details.generalData.plc_bgycode === '' || patientStore.details.generalData.plc_bgycode == null">
                                <small :class="{ 'required-error': true, zoom: patientStore.details.generalData.plc_bgycode === '' || patientStore.details.generalData.plc_bgycode == null }" class="text-red-800 text-s font-bold"></small>
                            </div>
                        </div>
                        <Dropdown
                            id="generalData.plc_bgycode"
                            v-model="patientStore.details.generalData.plc_bgycode"
                            :options="distinctBarangays"
                            optionLabel="bgyname"
                            optionValue="bgycode"
                            :disabled="disableBrgy"
                            showClear
                            filter
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.generalData.plc_bgycode === '' || patientStore.details.generalData.plc_bgycode == null
                            }"
                            :emptyMessage="'Please select a City first.'"
                        />
                    </div>
                </div>
                <div :style="{ width: width < 800 ? '100%' : '48%' }">
                    <div class="flex justify-content-center">
                        <h4 style="color: #000080" class="font-bold">HOSPITAL DATA</h4>
                    </div>
                    <div class="hospitalData">
                        <div class="flex justify-content-between">
                            <label style="color: #000080" class="text-s" for="preAdmissionData.status_code"><i>Status upon reaching the hospital</i></label>
                            <div class="flex justify-content-end" v-if="patientStore.details.hospitalFacilityData.status_code === ''">
                                <small :class="{ 'required-error': true, zoom: patientStore.details.hospitalFacilityData.status_code === '' }" class="text-red-800 text-s font-bold">Value is required</small>
                            </div>
                        </div>
                        <Dropdown
                            id="preAdmissionData.status_code"
                            v-model="patientStore.details.hospitalFacilityData.status_code"
                            :options="statusReaching"
                            optionLabel="status_desc"
                            optionValue="status_code"
                            :class="{ 'flex p-inputtext-filled font-bold mb-2  mt-1 font-bold myCSS-inputtext-required': true, 'bg-green-100': patientStore.details.hospitalFacilityData.status_code === '' }"
                        />
                        <div class="flex justify-content-between">
                            <label style="color: #000080" class="text-s" for="preAdmissionData.mode_transport_code"><i>Mode of Transport</i></label>
                            <div class="flex justify-content-end" v-if="patientStore.details.hospitalFacilityData.mode_transport_code === ''">
                                <small :class="{ 'required-error': true, zoom: patientStore.details.hospitalFacilityData.mode_transport_code === '' }" class="text-red-800 text-s font-bold">Value is required</small>
                            </div>
                        </div>
                        <Dropdown
                            id="preAdmissionData.mode_transport_code"
                            v-model="patientStore.details.hospitalFacilityData.mode_transport_code"
                            :options="modesOfTransport"
                            optionLabel="mode_desc"
                            optionValue="mode_code"
                            :class="{ 'flex p-inputtext-filled font-bold mb-2  mt-1 font-bold myCSS-inputtext-required': true, 'bg-green-100': patientStore.details.hospitalFacilityData.mode_transport_code === '' }"
                        />
                        <div v-if="patientStore.details.hospitalFacilityData.mode_transport_code == '04'" class="mb-3" style="width: 100%">
                            <div class="flex justify-content-between">
                                <label style="color: #000080" class="text-xs" for="preAdmissionData.mode_transport_code"><i>Specify</i></label>
                                <div class="flex justify-content-end" v-if="patientStore.details.hospitalFacilityData.stat_reachdtl === ''">
                                    <small :class="{ 'required-error': true, zoom: patientStore.details.hospitalFacilityData.stat_reachdtl === '' }" class="text-red-800 text-s font-bold">Value is required</small>
                                </div>
                            </div>
                            <InputText style="text-transform: uppercase; width: 100%" class="flex font-bold" placeholder="Mode of Transport" v-model="patientStore.details.hospitalFacilityData.stat_reachdtl" />
                        </div>
                        <SelectButton v-model="patientStore.details.hospitalFacilityData.coord_uncoord" :options="options" class="flex justify-content-center" />
                        <div v-if="patientStore.details.hospitalFacilityData.coord_uncoord === 'COORDINATED'">
                            <div class="flex justify-content-between">
                                <label style="color: #000080" class="text-s" for="preAdmissionData.trans_type"><i>Transferred from/Referred by another hospital?</i></label>
                                <div class="flex justify-content-end">
                                    <small v-if="patientStore.details.hospitalFacilityData.trans_ref === '' && patientStore.details.hospitalFacilityData.trans_ref2 === ''" class="text-red-800 text-s font-bold">Value is required</small>
                                </div>
                            </div>
                            <Dropdown
                                id="preAdmissionData.trans_type"
                                v-model="transRefValue"
                                :options="transRefType"
                                optionLabel="ref_desc"
                                optionValue="ref_code"
                                class="flex p-inputtext-filled font-bold mb-2 mt-1 font-bold myCSS-inputtext-required bg-green-100"
                            />
                            <div v-if="transRefValue != '0'" class="ml-1 grid grid-cols-2 mt-2" style="width: 100%">
                                <div :style="{ width: width < 1200 ? '100%' : '49%' }">
                                    <div class="flex justify-content-between">
                                        <label style="color: #000080" class="text-s" for="hospitalFacilityData.ref_physician"><i>Referring Physician</i></label>
                                        <div class="flex justify-content-end">
                                            <small v-if="patientStore.details.hospitalFacilityData.ref_physician === ''" class="text-red-800 text-s font-bold">Value is required</small>
                                        </div>
                                    </div>

                                    <InputText
                                        style="text-transform: uppercase; width: 100%"
                                        placeholder="Referring Physician"
                                        v-model="patientStore.details.hospitalFacilityData.ref_physician"
                                        :class="{ 'p-inputtext-filled font-bold mb-2 mt-1 font-bold myCSS-inputtext-required': true, 'bg-green-100': patientStore.details.hospitalFacilityData.ref_physician === '' }"
                                    />
                                </div>

                                <div :style="{ width: width < 1200 ? '100%' : '49%' }">
                                    <div class="flex justify-content-between">
                                        <label style="color: #000080" class="text-s" for="hospitalFacilityData.ref_hosp_code_sp"><i>Referring Hospital</i></label>
                                        <div class="flex justify-content-end">
                                            <small v-if="patientStore.details.hospitalFacilityData.ref_hosp_code_sp === ''" class="text-red-800 text-s font-bold">Value is required</small>
                                        </div>
                                    </div>

                                    <InputText
                                        style="text-transform: uppercase; width: 100%"
                                        class="mt-1"
                                        placeholder="Referring Hospital"
                                        v-model="patientStore.details.hospitalFacilityData.ref_hosp_code_sp"
                                        :class="{ 'p-inputtext-filled font-bold mb-2 mt-1 font-bold myCSS-inputtext-required': true, 'bg-green-100': patientStore.details.hospitalFacilityData.ref_hosp_code_sp === '' }"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.line {
    height: 1px;
    background-color: rgb(139, 134, 134);
    width: 100%;
    margin: 20px 0;
}

.required-error {
}

.fancy-label {
    font-weight: bold;
    color: #4a4a4a;
}

.fancy-textarea {
    border: 1px solid #007bff;
    border-radius: 4px;
    padding: 10px;
    font-size: 14px;
}

.fancy-date-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #007bff;
    border-radius: 4px;
    padding: 10px;
    background-color: #f8f9fa;
}

.date-text {
    font-size: 14px;
    color: #6c757d;
}

.date-icon {
    font-size: 1.2em;
    color: #007bff;
}
</style>
