<script setup>
// Import necessary stores and libraries
import { usePatientStore } from '@/store/injury/PatientStore';
import { useLocationsStore } from '../../../../store/general/LocationsStore';
import { ref, onMounted, watch } from 'vue';
import createValidationRules from '../../../../validation/injuryValidations';
import useVuelidate from '@vuelidate/core';
import LibraryService from '@/service/LibraryService';

// Initialize stores and services
const patientStore = usePatientStore();
const locationsStore = useLocationsStore();
const validationRules = createValidationRules();
const libraryService = new LibraryService();

// Reactive references
const detailsData = patientStore.details;
const v$ = useVuelidate(validationRules, detailsData);
const injuryIntents = libraryService.getInjuryIntents();
const modesOfTransport = libraryService.getModesOfTransport();
const statusReaching = libraryService.getStatusReaching();
const loading = ref(true);

// Date and time management
const injuryDate = ref(patientStore.details.generalData.doctor_injtme);
const disableProv = ref(true);
const disableCity = ref(true);
const disableBrgy = ref(false);
const newDate = ref();
const newTime = ref();
const transRefValue = ref('0');

// Arrays to hold location data
const allLoc = [];
const newLoc = [];
const distinctRegions = ref();
const distinctProvince = ref();
const distinctCity = ref();
const distinctBarangays = ref();

// Function to format date for display
function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate.replace(',', '');
}

// Transport reference types for dropdown
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

// Function to validate form data
const validate = async () => {
    const preAdmissionData = await v$.value.preAdmissionData.$validate();
    const generalData = await v$.value.generalData.$validate();
    return { preAdmissionData, generalData };
};

// Function to load location data from the store
async function loadLocations() {
    try {
        allLoc.value = await locationsStore.getLocations();
        // console.log('locations: ', allLoc);
        newLoc.value = await locationsStore.getNewLocations();
        console.log('new location: ', newLoc);
        // const newRegion = await locationsStore.getNewRegion();
        // const newProvince = await locationsStore.getNewProvince();
        // const newCity = await locationsStore.getNewCity();
        // const newBarangay = await locationsStore.getNewBarangay();

        // console.log('newRegion: ', newRegion);
        // console.log('newProvince: ', newProvince);
        // console.log('newCity: ', newCity);
        // console.log('newBarangay: ', newBarangay);

        const locationsArray = newLoc?.value?.data;
        // const regionsArray = newRegion?.data;
        // const provinceArrray = newProvince?.data;
        // const cityArray = newCity?.data;
        // const barangayArray = newBarangay?.data;

        // Ensure locationsArray is an array
        if (!Array.isArray(locationsArray)) {
            throw new Error('Expected locations.data to be an array');
        }

        // Extract distinct regions from locations 
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
            if (Array.isArray(newLoc)) {
                distinctProvince.value = Array.from(new Map(newLoc?.value?.data.filter((location) => location.regcode === patientStore.details.generalData.plc_regcode).map((location) => [location.provcode, location])).values()).map((location) => ({
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

        console.log('province : ', distinctProvince);
        // Logic for populating cities based on selected province
        if (patientStore?.details?.generalData?.plc_provcode != null) {
            disableCity.value = false;

            patientStore.details.generalData.ctycode = '';
            if (Array.isArray(newLoc)) {
                distinctCity.value = Array.from(new Map(newLoc?.value?.data.filter((location) => location.provcode === patientStore.details.generalData.plc_provcode).map((location) => [location.ctycode, location])).values()).map((location) => ({
                    ctycode: location.ctycode,
                    ctyname: location.ctyname
                }));
                patientStore.locationLoaded = true;
                patientStore.storeCities = distinctCity;
            } else {
                console.error('Expected locations.data to be an array');
                distinctCity.value = [];
            }
        } else {
            // Populate all cities if no province is selected
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

        // Logic for populating barangays based on selected city
        if (patientStore?.details?.generalData?.plc_ctycode != null) {
            if (Array.isArray(newLoc)) {
                distinctBarangays.value = Array.from(new Map(newLoc?.value?.data.filter((location) => location.ctycode === patientStore.details.generalData.plc_ctycode).map((location) => [location.bgycode, location])).values()).map((location) => ({
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
            // Populate all barangays if no city is selected
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
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
}

// Watchers for reactive updates
watch(
    () => patientStore.details.generalData.plc_regcode,
    async (newRegionCode) => {
        if (newRegionCode) {
            disableProv.value = false;

            patientStore.details.generalData.provcode = '';
            if (Array.isArray(newLoc)) {
                distinctProvince.value = Array.from(new Map(newLoc?.value?.data.filter((location) => location.regcode === newRegionCode).map((location) => [location.provcode, location])).values()).map((location) => ({
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
            if (Array.isArray(newLoc)) {
                distinctCity.value = Array.from(new Map(newLoc?.value?.data.filter((location) => location.provcode === newProvinceCode).map((location) => [location.ctycode, location])).values()).map((location) => ({
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
        // disableBrgy.value = false;
        if (newCityCode) {
            if (Array.isArray(newLoc)) {
                distinctBarangays.value = Array.from(new Map(newLoc?.value?.data.filter((location) => location.ctycode === newCityCode).map((location) => [location.bgycode, location])).values()).map((location) => ({
                    bgycode: location.bgycode,
                    bgyname: location.bgyname
                }));
            } else {
                console.error('Expected locations.data to be an array');
                distinctBarangays.value = [];
            }
        } else {
            // disableBrgy.value = false;
            distinctBarangays.value = [];
        }
    }
);

watch(
    () => transRefValue.value,
    (value) => {
        // Update transport reference values based on selection
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

// Watch for form submission to trigger validation
watch(
    () => patientStore.submitForm,
    async (value) => {
        if (value) {
            await validate();
        }
    }
);

// Watch for changes to injury date and update related fields
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

// Watch for changes to new date and time inputs to update injury date
watch([newDate, newTime], ([newDateValue, newTimeValue]) => {
    if (newDateValue && newTimeValue) {
        const [year, month, day] = newDateValue.split('-').map(Number);
        const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

        const [hours, minutes] = newTimeValue.split(':').map(Number);
        let adjustedHours = hours;
        let meridian = 'AM';

        // Convert to 12-hour format
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
        injuryDate.value = new Date(combinedDateTime);
    }
});

// Watch for changes to encounter code and initialize date fields
watch(
    () => patientStore.enccode,
    () => {
        if (patientStore.details.generalData.doctor_injtme) {
            const injtme = new Date(patientStore.details.generalData.doctor_injtme);
            injuryDate.value = injtme;
        }
        if (patientStore.header.injtme) {
            const injtme = new Date(patientStore.header.injtme);
            newDate.value = `${injtme.getFullYear()}-${(injtme.getMonth() + 1).toString().padStart(2, '0')}-${injtme.getDate().toString().padStart(2, '0')}`;
            newTime.value = `${injtme.getHours().toString().padStart(2, '0')}:${injtme.getMinutes().toString().padStart(2, '0')}`;
            injuryDate.value = injtme;
        }
    },
    {
        immediate: true
    }
);

// Load locations and initialize transport reference values on component mount
onMounted(async () => {
    await loadLocations();
    if (patientStore.details.hospitalFacilityData.trans_ref == 'Y') {
        transRefValue.value = '1';
    }
    if (patientStore.details.hospitalFacilityData.trans_ref2 == 'Y') {
        transRefValue.value = '2';
    }
    loading.value = false;
});
</script>

<template>
    <div class="card shadow-4 max-h-full h-full opacity-90">
        <!-- Loader displayed while data is being fetched -->
        <div v-if="loading">
            <div class="flex flex-wrap align-items-center">
                <h4>NATURE of INJURY</h4>
            </div>
            <div class="loader"></div>
            <label for="injrem" class="p-float-label">NATURE OF INJURY</label>
            <Skeleton class="mb-2" height="3rem" width="27rem" />
            <div class="flex flex-column">
                <label for="generalData.inj_intent_code">INJURY INTENT</label>
                <Skeleton class="mb-2" height="3rem" width="27rem" />
            </div>

            <label for="injtme" class="p-float-label">DATE AND TIME OF INJURY</label>
            <Skeleton class="mb-2" height="3rem" width="27rem" />

            <label for="admdate" class="p-float-label">DATE AND TIME OF ER ENCOUNTER</label>

            <!-- Skeleton placeholders for region, province, city, and barangay -->
            <div class="flex flex-column">
                <label for="generalData.plc_regcode">POI REGION</label>
                <Skeleton class="mb-2" height="3rem" width="27rem" />
            </div>
            <div class="flex flex-column">
                <label for="generalData.plc_provcode">POI PROVINCE</label>
                <Skeleton class="mb-2" height="3rem" width="27rem" />
            </div>
            <div class="flex flex-column">
                <label for="generalData.plc_ctycode">POI CITY/MUNICIPALITY</label>
                <Skeleton class="mb-2" height="3rem" width="27rem" />
            </div>
            <div class="flex flex-column">
                <label for="generalData.plc_bgycode">POI BARANGAY</label>
                <Skeleton class="mb-2" height="3rem" width="27rem" />
            </div>
        </div>

        <!-- Form displayed after loading -->
        <div v-else>
            <div class="flex align-items-center">
                <h4 class="font-bold" style="color: #000080">NATURE OF INJURY</h4>
            </div>
            <label for="injrem" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Nature of Injury</i></label>
            <Textarea id="injrem" type="text" v-model="patientStore.header.injrem" class="p-inputtext-filled font-bold mb-2 w-27rem text-xs" readonly autoResize />

            <!-- Injury intent selection -->
            <div class="flex flex-column">
                <div class="flex justify-content-between w-27rem">
                    <label for="generalData.inj_intent_code" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Injury Intent</i></label>
                    <div v-if="patientStore.details.preAdmissionData.inj_intent_code === ''">
                        <small :class="{ 'required-error': true, zoom: patientStore.details.preAdmissionData.inj_intent_code === '' }" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
                <Dropdown
                    id="generalData.inj_intent_code"
                    v-model="patientStore.details.preAdmissionData.inj_intent_code"
                    :options="injuryIntents"
                    optionLabel="inj_intent_desc"
                    placeholder="Injury Intent"
                    optionValue="inj_intent_code"
                    :class="{
                        'p-inputtext-filled font-bold mb-2 w-27rem myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.preAdmissionData.inj_intent_code === ''
                    }"
                />
            </div>

            <!-- Date and time input for injury -->
            <label for="injtme" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Date and Time of Injury</i></label>
            <div class="card flex flex-wrap gap-2">
                <div>
                    <label for="date" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff; width: 11rem"><i>Date (dd/mm/yyyy)</i></label>
                    <input type="date" id="date" v-model="newDate" class="text-lg p-2 border rounded" style="width: 11rem; height: 3rem" />
                </div>
                <div>
                    <label for="time" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff; width: 11rem"><i>Time (12-hour format)</i></label>
                    <input type="time" id="time" v-model="newTime" class="text-lg p-2 border rounded" style="width: 11rem; height: 3rem" />
                </div>
            </div>

            <!-- Message for unknown date -->
            <Message :closable="false" v-if="patientStore.details.generalData.doctor_injtme === '00/00/0000' || patientStore.details.generalData.doctor_injtme === '1900-01-01 00:00:00.000'"> UNKNOWN</Message>

            <!-- Display ER Encounter date -->
            <label for="admdate" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Date and Time of ER Encounter</i></label>
            <InputText id="admdate" type="text" v-model="patientStore.header.admdate" class="p-inputtext-filled font-bold mb-2 w-27rem" readonly />

            <!-- Region selection -->
            <div class="flex flex-column">
                <div class="flex justify-content-between w-27rem">
                    <label for="generalData.plc_regcode" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>POI Region</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.generalData.plc_regcode == '' || patientStore.details.generalData.plc_regcode == ' ' || patientStore.details.generalData.plc_regcode == null">
                        <small
                            :class="{ 'required-error': true, zoom: patientStore.details.generalData.plc_regcode == '' || patientStore.details.generalData.plc_regcode == ' ' || patientStore.details.generalData.plc_regcode == null }"
                            class="text-red-800 text-xs font-bold"
                            >Value is required</small
                        >
                    </div>
                </div>
                <Dropdown
                    id="generalData.plc_regcode"
                    v-model="patientStore.details.generalData.plc_regcode"
                    :options="distinctRegions"
                    optionLabel="regname"
                    placeholder="Region"
                    optionValue="regcode"
                    :class="{
                        'p-inputtext-filled font-bold mb-2 w-27rem myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.generalData.plc_regcode == '' || patientStore.details.generalData.plc_regcode == ' ' || patientStore.details.generalData.plc_regcode == null
                    }"
                />
            </div>

            <!-- Province selection -->
            <div class="flex flex-column">
                <div class="flex justify-content-between w-27rem">
                    <label for="generalData.plc_provcode" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>POI Province</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.generalData.plc_provcode === '' || patientStore.details.generalData.plc_provcode == null">
                        <small :class="{ 'required-error': true, zoom: patientStore.details.generalData.plc_provcode === '' || patientStore.details.generalData.plc_provcode == null }" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
                <Dropdown
                    id="generalData.plc_provcode"
                    v-model="patientStore.details.generalData.plc_provcode"
                    :options="distinctProvince"
                    optionLabel="provname"
                    optionValue="provcode"
                    :disabled="disableProv"
                    filter
                    placeholder="Province"
                    :class="{
                        'p-inputtext-filled font-bold mb-2 w-27rem myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.generalData.plc_provcode === '' || patientStore.details.generalData.plc_provcode == null
                    }"
                    :emptyMessage="'Please select a Region first.'"
                />
            </div>

            <!-- City/Municipality selection -->
            <div class="flex flex-column">
                <div class="flex justify-content-between w-27rem">
                    <label for="generalData.plc_ctycode" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>POI City/Municipality</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.generalData.plc_ctycode === '' || patientStore.details.generalData.plc_ctycode == null">
                        <small :class="{ 'required-error': true, zoom: patientStore.details.generalData.plc_ctycode === '' || patientStore.details.generalData.plc_ctycode == null }" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
                <Dropdown
                    id="generalData.plc_ctycode"
                    v-model="patientStore.details.generalData.plc_ctycode"
                    :options="distinctCity"
                    optionLabel="ctyname"
                    optionValue="ctycode"
                    :disabled="disableCity"
                    filter
                    placeholder="Municipality"
                    :class="{
                        'p-inputtext-filled font-bold mb-2 w-27rem myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.generalData.plc_ctycode === '' || patientStore.details.generalData.plc_ctycode == null
                    }"
                    :emptyMessage="'Please select a Province first.'"
                />
            </div>

            <!-- Barangay selection -->
            <div class="flex flex-column">
                <div class="flex justify-content-between w-27rem">
                    <label for="generalData.plc_bgycode" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>POI Barangay</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.generalData.plc_bgycode === '' || patientStore.details.generalData.plc_bgycode == null">
                        <small :class="{ 'required-error': true, zoom: patientStore.details.generalData.plc_bgycode === '' || patientStore.details.generalData.plc_bgycode == null }" class="text-red-800 text-xs font-bold"></small>
                    </div>
                </div>
                <Dropdown
                    id="generalData.plc_bgycode"
                    v-model="patientStore.details.generalData.plc_bgycode"
                    :options="distinctBarangays"
                    optionLabel="bgyname"
                    placeholder="Barangay"
                    optionValue="bgycode"
                    class="font-bold"
                    filter
                    showClear
                    :disabled="disableBrgy"
                    :emptyMessage="'Please select a City first.'"
                />
            </div>

            <Divider />
            <div class="flex align-items-center">
                <h4 class="font-bold" style="color: #000080">HOSPITAL DATA</h4>
            </div>
            <div class="hospitalData">
                <!-- Status upon reaching hospital -->
                <div class="flex justify-content-between w-27rem">
                    <label for="preAdmissionData.status_code" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Status Upon Reaching the Hospital</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.hospitalFacilityData.status_code === ''">
                        <small :class="{ 'required-error': true, zoom: patientStore.details.hospitalFacilityData.status_code === '' }" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
                <Dropdown
                    id="preAdmissionData.status_code"
                    v-model="patientStore.details.hospitalFacilityData.status_code"
                    :options="statusReaching"
                    optionLabel="status_desc"
                    placeholder="Status Upon Reaching Hospital"
                    optionValue="status_code"
                    :class="{ 'p-inputtext-filled font-bold mb-2 w-27rem mt-1 font-bold myCSS-inputtext-required': true, 'bg-green-100': patientStore.details.hospitalFacilityData.status_code === '' }"
                />

                <!-- Mode of transport selection -->
                <div class="flex justify-content-between w-27rem">
                    <label for="preAdmissionData.mode_transport_code" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Mode of Transport</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.hospitalFacilityData.mode_transport_code === ''">
                        <small :class="{ 'required-error': true, zoom: patientStore.details.hospitalFacilityData.mode_transport_code === '' }" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
                <Dropdown
                    id="preAdmissionData.mode_transport_code"
                    v-model="patientStore.details.hospitalFacilityData.mode_transport_code"
                    :options="modesOfTransport"
                    optionLabel="mode_desc"
                    placeholder="Mode of Transport"
                    optionValue="mode_code"
                    :class="{ 'p-inputtext-filled font-bold mb-2 w-27rem mt-1 font-bold myCSS-inputtext-required': true, 'bg-green-100': patientStore.details.hospitalFacilityData.mode_transport_code === '' }"
                />

                <!-- If transport code is '04', provide an option to specify -->
                <div v-if="patientStore.details.hospitalFacilityData.mode_transport_code == '04'">
                    <div class="flex justify-content-between">
                        <label for="patientStore.details.hospitalFacilityData.stat_reachdtl" class="text-xs" style="color: #3366ff"><i>Specify</i> </label>
                        <div class="flex justify-content-end" v-if="patientStore.details.hospitalFacilityData.stat_reachdtl === ''">
                            <small class="text-red-800 text-xs font-bold">Value is required</small>
                        </div>
                    </div>
                    <InputText style="text-transform: uppercase" class="w-27rem font-bold" placeholder="Mode of Transport" v-model="patientStore.details.hospitalFacilityData.stat_reachdtl" />
                </div>

                <!-- Transfer/referral information -->
                <div>
                    <label for="preAdmissionData.trans_type" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Transferred from/ Referred by Another Hospital</i></label>
                    <Dropdown id="preAdmissionData.trans_type" v-model="transRefValue" :options="transRefType" optionLabel="ref_desc" optionValue="ref_code" class="p-inputtext-filled font-bold mb-2 w-27rem mt-1 font-bold myCSS-inputtext-required" />
                    <div v-if="transRefValue != '0'" class="ml-3">
                        <label for="preAdmissionData.trans_type" class="p-float-label font-sans text-black-300 text-xs" style="color: #3366ff"><i>Referring Physician</i></label>
                        <InputText style="text-transform: uppercase" class="w-25rem" placeholder="Referring Physician" v-model="patientStore.details.hospitalFacilityData.ref_physician" />
                        <label for="preAdmissionData.trans_type" class="p-float-label font-sans text-black-300 text-xs" style="color: #3366ff"><i>Referring Hospital</i></label>
                        <InputText style="text-transform: uppercase" class="w-25rem mt-1" placeholder="Referring Hospital" v-model="patientStore.details.hospitalFacilityData.ref_hosp_code_sp" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes zoomInOut {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}
</style>
