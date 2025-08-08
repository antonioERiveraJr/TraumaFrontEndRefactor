<script setup>
import { usePatientStore } from '../../../../../store/injury/patientStore';
import { ref, onMounted } from 'vue';
import moment from 'moment';
import InputText from 'primevue/inputtext';
import CheckBoxMultiple from '../../../../custom/checkBoxMultiple.vue';

// Reactive references for date inputs
const yearOnly = ref(null);
const monthYear = ref(null);
const completeDate = ref(null);
const lastTetanusDoseYear = ref(null);
const lastTetanusDoseMonthYear = ref(null);
const lastTetanusDoseCompleteDate = ref(null);
const patientStore = usePatientStore();


// Function to handle ARV date selection
const handlePreviousAntiTetanous = (type) => {
    const date = type === 'year' ? yearOnly.value : type === 'month' ? monthYear.value : completeDate.value;
    const formattedDate = moment(date).format(type === 'year' ? '00/00/YYYY' : type === 'month' ? 'MM/00/YYYY' : 'MM/DD/YYYY');
    patientStore.details.ExternalCauseOfInjury.arvDate = formattedDate;
};

// Function to handle last tetanus dose selection
const handleLastTetanusDoseSelect = (type) => {
    const date = type === 'year' ? lastTetanusDoseYear.value : type === 'month' ? lastTetanusDoseMonthYear.value : lastTetanusDoseCompleteDate.value;
    const formattedDate = moment(date).format(type === 'year' ? '00/00/YYYY' : type === 'month' ? 'MM/00/YYYY' : 'MM/DD/YYYY');
    patientStore.details.ExternalCauseOfInjury.lastTetanusDose = formattedDate;
};

// Options for various dropdowns
const bleedingOptions = [
    { label: 'None', value: 'NONE' },
    { label: 'Spontaneous', value: 'SPONTANEOUS' },
    { label: 'Induced', value: 'INDUCED' }
];

const bitingAnimalOptions = [
    { label: 'Vaccinated', value: 'VACCINATED' },
    { label: 'Unvaccinated', value: 'UNVACCINATED' }
];

const observationOptions = [
    { label: 'Yes', value: 'YES' },
    { label: 'No', value: 'NO' }
];

const washingOptions = [
    { label: 'Yes', value: 'YES' },
    { label: 'No', value: 'NO' }
];

const appliedOptions = [
    { label: 'Yes', value: 'Y' },
    { label: 'No', value: 'N' }
];

const biteDegreeOptions = [
    { label: 'Category level I', value: 'I' },
    { label: 'Category level II', value: 'II' },
    { label: 'Category level III', value: 'III' }
];

// Lifecycle hook to initialize date values
onMounted(async () => {
    if (patientStore.details.ExternalCauseOfInjury.arvDate) {
        const arvDateString = patientStore.details.ExternalCauseOfInjury.arvDate;

        const parts = arvDateString.split('/');

        if (parts[0] == '00' && parts[1] == '00') {
            const yearOnlys = parts[2];
            yearOnly.value = yearOnlys;
        } else if (parts[0] == '00') {
            const month = parts[1];
            const year = parts[2];
            const monthYears = `${month}/${year}`;
            monthYear.value = monthYears;
        } else if (parts.length === 3 && parts[2].length === 4) {
            const month = parseInt(parts[0], 10) - 1;
            const day = parseInt(parts[1], 10);
            const year = parts[2];
            const completeDates = new Date(year, month, day);

            if (!isNaN(completeDates.getTime())) {
                completeDate.value = completeDates;
            } else {
                console.error('Invalid date for completeDate');
            }
        } else {
            console.error('Invalid date format');
        }
    }

    if (patientStore.details.ExternalCauseOfInjury.lastTetanusDose) {
        const arvDateString = patientStore.details.ExternalCauseOfInjury.lastTetanusDose;
        console.log('Raw arvDate:', arvDateString.split('/'));

        const parts = arvDateString.split('/');

        if (parts[0] == '00' && parts[1] == '00') {
            const yearOnlys = parts[2];
            lastTetanusDoseYear.value = yearOnlys;
        } else if (parts[0] == '00') {
            const month = parts[1];
            const year = parts[2];
            const monthYears = `${month}/${year}`;
            lastTetanusDoseMonthYear.value = monthYears;
        } else if (parts.length === 3 && parts[2].length === 4) {
            const month = parseInt(parts[0], 10) - 1;
            const day = parseInt(parts[1], 10);
            const year = parts[2];
            const completeDates = new Date(year, month, day);

            if (!isNaN(completeDates.getTime())) {
                lastTetanusDoseCompleteDate.value = completeDates;
            } else {
                console.error('Invalid date for completeDate');
            }
        } else {
            console.error('Invalid date format');
        }
    }
}); 
</script>
<template>
    <div>
        <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-1/2 p-4" style="height: 60%">
                <div>
                    <div class="flex flex-column">
                        <h5>Bite/Sting</h5>
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">NATURE OF INJURY</strong>
                        </div>
                        <InputText
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_bite_sp"
                            placeholder="Nature of Injury"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_bite_sp === ''
                            }"
                        />
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">BITE CATEGORY</strong>
                        </div>
                        <div style="width: 100%">
                            <Dropdown
                                v-model="patientStore.details.ExternalCauseOfInjury.dogbiteDegree"
                                style="width: 100%"
                                :options="biteDegreeOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Bite Category"
                                :class="{
                                    'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                    'bg-green-100': patientStore.details.ExternalCauseOfInjury.dogbiteDegree === ''
                                }"
                            />
                        </div>
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">BLEEDING OF INJURY</strong>
                        </div>
                        <Dropdown
                            v-model="patientStore.details.ExternalCauseOfInjury.bleeding"
                            :options="bleedingOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Bleeding Type"
                            style="width: 100%"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.bleeding === ''
                            }"
                        />
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">BITING ANIMAL</strong>
                        </div>
                        <Dropdown
                            v-model="patientStore.details.ExternalCauseOfInjury.bitingAnimal"
                            :options="bitingAnimalOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Animal Status"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.bitingAnimal === ''
                            }"
                        />
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">BITING ANIMAL CAN BE OBSERVED</strong>
                        </div>
                        <Dropdown
                            v-model="patientStore.details.ExternalCauseOfInjury.observation"
                            :options="observationOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Observation Status"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.observation === ''
                            }"
                        />
                    </div>

                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">APPLIED ANYTHING TO WOUND</strong>
                        </div>
                        <Dropdown
                            v-model="patientStore.details.preAdmissionData.first_aid_code"
                            :options="appliedOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Washing Status"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.first_aid_code === ''
                            }"
                        />
                    </div>

                    <div class="flex flex-column" v-if="patientStore.details.preAdmissionData.first_aid_code === 'Y'">
                        <div class="grid cols-2 justify-content-around m-2">
                            <div style="width: 48%">
                                <div class="flex justify-content-between">
                                    <strong for="generalData.firstaid_others" style="color: #000080" class="text-sm">First Aid</strong>
                                </div>
                                <div class="flex justify-content-end mr-5" v-if="patientStore.details.preAdmissionData.firstaid_others === ''">
                                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" class="flex justify-content-end" />
                                </div>
                                <InputText
                                    v-model="patientStore.details.preAdmissionData.firstaid_others"
                                    autoResize
                                    placeholder="Enter First Aid"
                                    style="width: 90%"
                                    :class="{
                                        'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                        'bg-green-100': patientStore.details.preAdmissionData.firstaid_others === ''
                                    }"
                                />
                            </div>
                            <div style="width: 48%">
                                <div class="flex justify-content-between">
                                    <strong for="generalData.firstaid_others2" style="color: #000080" class="text-sm">By Whom</strong>
                                </div>
                                <div class="flex justify-content-end mr-5" v-if="patientStore.details.preAdmissionData.firstaid_others2 === ''">
                                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" class="flex justify-content-end" />
                                </div>
                                <InputText
                                    v-model="patientStore.details.preAdmissionData.firstaid_others2"
                                    autoResize
                                    placeholder="Enter By Whom"
                                    style="width: 90%"
                                    :class="{
                                        'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                        'bg-green-100': patientStore.details.preAdmissionData.firstaid_others2 === ''
                                    }"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">WASHING OF WOUND DONE</strong>
                        </div>
                        <Dropdown
                            v-model="patientStore.details.ExternalCauseOfInjury.washingDone"
                            :options="washingOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Washing Status"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.washingDone === ''
                            }"
                        />
                    </div>
                    <div style="width: 100%" v-if="patientStore.details.ExternalCauseOfInjury.washingDone === ('YES' || 'Yes') && patientStore.details.preAdmissionData.first_aid_code !== 'Y'">
                        <strong style="color: #000080; font-size: 11px">WASHED BY:</strong>
                        <div style="width: 100%">
                            <Dropdown
                                style="width: 100%"
                                v-model="patientStore.details.preAdmissionData.washingDone_by"
                                :options="[
                                    { label: 'Parent', value: 'PARENT' },
                                    { label: 'Patient', value: 'PATIENT' },
                                    { label: 'Others', value: 'OTHERS' }
                                ]"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Who Washed"
                                :class="{
                                    'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                    'bg-green-100': patientStore.details.ExternalCauseOfInjury.washingDone_by === ''
                                }"
                            />
                        </div>
                        <div style="width: 100%; margin-top: 2px" v-if="patientStore.details.preAdmissionData.washingDone_by === 'OTHERS'">
                            <InputText
                                style="width: 100%"
                                rows="1"
                                v-model="patientStore.details.preAdmissionData.washingDone_by_others"
                                placeholder="Specify Others"
                                :class="{
                                    'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                    'bg-green-100': patientStore.details.ExternalCauseOfInjury.washingDone_by_others === ''
                                }"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-1/2 p-4" style="height: 60%">
                <h5>Past Medical History</h5>
                <div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">PREVIOUS COMPLETED ARV</strong>
                        </div>
                        <Dropdown
                            v-model="patientStore.details.ExternalCauseOfInjury.previousARV"
                            :options="observationOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Previous ARV"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.previousARV === ''
                            }"
                        />
                    </div>
                    <div
                        class="flex flex-column"
                        v-if="patientStore.details.ExternalCauseOfInjury.previousARV === 'YES'"
                        :class="{
                            'p-inputtext-filled font-bold mb-2 myCSS-inputtext-required': true,
                            'bg-green-100': patientStore.details.ExternalCauseOfInjury.arvDate === ''
                        }"
                    >
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">DATE</strong>
                        </div>
                        <div class="flex cols-3 mb-3">
                            <div style="width: 100%" class="flex justify-content-center">
                                <Calendar v-model="yearOnly" view="year" dateFormat="yy" placeholder="Year Only" @date-select="handlePreviousAntiTetanous('year')" />
                            </div>
                            <div style="width: 100%" class="flex justify-content-center">
                                <Calendar v-model="monthYear" view="month" dateFormat="mm/yy" placeholder="Month and Year Only" @date-select="handlePreviousAntiTetanous('month')" />
                            </div>
                            <div style="width: 100%" class="flex justify-content-center">
                                <Calendar v-model="completeDate" dateFormat="mm/dd/yy" placeholder="Complete Date" @date-select="handlePreviousAntiTetanous('complete')" />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">PREVIOUS ANTI-TETANUS VACCINATION</strong>
                        </div>
                        <Dropdown
                            v-model="patientStore.details.ExternalCauseOfInjury.tetanusVaccination"
                            :options="observationOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Previous Anti-Tetanus Vaccination"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.tetanusVaccination === ''
                            }"
                        />
                    </div>
                    <div
                        class="flex justify-content-end"
                        v-if="
                            patientStore.details.ExternalCauseOfInjury.tetanusVaccination === 'Yes' &&
                            (patientStore.details.ExternalCauseOfInjury.tetanusDoses === '' || patientStore.details.ExternalCauseOfInjury.tetanusDoses === undefined) &&
                            (patientStore.details.ExternalCauseOfInjury.lastTetanusDose === '' || patientStore.details.ExternalCauseOfInjury.LastTetanusDose === undefined)
                        "
                    >
                        <small :class="'required-error'" class="text-red-800 text-xs mt-2 font-bold">Value is required</small>
                    </div>
                    <div
                        class="flex cols-2 justify-content-evenly"
                        v-if="patientStore.details.ExternalCauseOfInjury.tetanusVaccination === 'YES'"
                        :class="{
                            'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                            'bg-green-100': patientStore.details.ExternalCauseOfInjury.lastTetanusDose === ''
                        }"
                    >
                        <div class="flex flex-column mt-2" style="width: 30%">
                            <div class="flex justify-content-between w-full">
                                <strong style="color: #000080; font-size: 11px"># OF DOSES GIVEN</strong>
                            </div>
                            <InputNumber v-model="patientStore.details.ExternalCauseOfInjury.tetanusDoses" placeholder="Enter number of doses" class="mb-2 mt-3 flex justify-content-center" :max="5" />
                        </div>

                        <div class="flex flex-column mt-2" style="width: 100%">
                            <div class="flex justify-content-between w-full">
                                <strong style="color: #000080; font-size: 11px; margin-left: 20px">LAST DOSE GIVEN</strong>
                            </div>
                            <div class="flex cols-3 justify-content-evenly">
                                <div class="col-3 flex justify-content-center" style="width: 33%">
                                    <Calendar v-model="lastTetanusDoseYear" view="year" dateFormat="yy" placeholder="Year Only" @date-select="handleLastTetanusDoseSelect('year')" />
                                </div>
                                <div class="col-3 flex justify-content-center" style="width: 33%">
                                    <Calendar v-model="lastTetanusDoseMonthYear" view="month" dateFormat="mm/yy" placeholder="Month and Year Only" @date-select="handleLastTetanusDoseSelect('month')" />
                                </div>
                                <div class="col-3 flex justify-content-center" style="width: 33%">
                                    <Calendar v-model="lastTetanusDoseCompleteDate" dateFormat="mm/dd/yy" placeholder="Complete Date" @date-select="handleLastTetanusDoseSelect('complete')" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">ALLERGIES</strong>
                        </div>
                        <InputText
                            v-model="patientStore.details.ExternalCauseOfInjury.allergies"
                            placeholder="Enter Allergies"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.allergies === ''
                            }"
                        />
                    </div>

                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">ADVERSE REACTION FROM PREVIOUS VACCINATION</strong>
                        </div>
                        <InputText
                            v-model="patientStore.details.ExternalCauseOfInjury.adverseReaction"
                            placeholder="Enter Adverse Reactions"
                            :class="{
                                'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.ExternalCauseOfInjury.adverseReaction === ''
                            }"
                        />
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-1/2 md:w-1/2">
                            <strong style="color: #000080; font-size: 11px">OTHER PERTINENT</strong>
                        </div>
                        <Textarea
                            id="objective"
                            type="text"
                            v-model="patientStore.details.ExternalCauseOfInjury.bite_more_details"
                            autoResize
                            class="font-bold mb-2 mt-1 h-5rem text-xs"
                            style="text-transform: uppercase; width: 100%"
                            placeholder="Details....."
                        />
                    </div>
                </div>
            </div>
        </div>

        <div
            :class="
                (patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
                    patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
                    patientStore.details.ExternalCauseOfInjury.hrig !== 'Y' &&
                    patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
                    patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
                    patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
                    patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y') ||
                (patientStore.details.ExternalCauseOfInjury.pvrv_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_4 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv === 'Y') ||
                (patientStore.details.ExternalCauseOfInjury.pcec_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_4 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pcec === 'Y') ||
                (patientStore.details.ExternalCauseOfInjury.hrig === 'Y' && patientStore.details.ExternalCauseOfInjury.hrig_num === '') ||
                (patientStore.details.ExternalCauseOfInjury.erig === 'Y' && patientStore.details.ExternalCauseOfInjury.erig_num === '') ||
                (patientStore.details.ExternalCauseOfInjury.ats === 'Y' && patientStore.details.ExternalCauseOfInjury.ats_num === '')
                    ? 'card custom-shadow mt-3 relative'
                    : 'card mt-3'
            "
            style="width: 100%"
        >
            <h5 class="flex justify-content-center mb-5">VACCINE TO BE GIVEN</h5>

            <div class="grid grid-cols-4 gap-4 flex justify-content-evenly">
                <CheckBoxMultiple class="justify-content-center" style="width: 13%" v-model="patientStore.details.ExternalCauseOfInjury.pvrv" label="PVRV" />
                <CheckBoxMultiple class="justify-content-center" style="width: 13%" v-model="patientStore.details.ExternalCauseOfInjury.pcec" label="PCEC" />
                <CheckBoxMultiple class="justify-content-center" style="width: 13%" v-model="patientStore.details.ExternalCauseOfInjury.hrig" label="HRIG" />
                <CheckBoxMultiple class="justify-content-center" style="width: 13%" v-model="patientStore.details.ExternalCauseOfInjury.erig" label="ERIG" />
                <CheckBoxMultiple class="justify-content-center" style="width: 13%" v-model="patientStore.details.ExternalCauseOfInjury.ats" label="ATS" />
                <CheckBoxMultiple class="justify-content-center" style="width: 13%" v-model="patientStore.details.ExternalCauseOfInjury.tt" label="TT" />
                <CheckBoxMultiple class="justify-content-center" style="width: 13%" v-model="patientStore.details.ExternalCauseOfInjury.vaccine_none" label="NONE" />
            </div>
            <div class="grid grid-cols-4 gap-4 justify-content-evenly mt-4">
                <div style="width: 13%">
                    <Transition name="slide-fade" mode="out-in">
                        <div v-if="patientStore.details.ExternalCauseOfInjury.pvrv === 'Y'" style="width: 100%" class="flex justify-content-evenly mb-2">
                            <CheckBoxMultiple class="flex justify-content-center" style="width: 35%" v-model="patientStore.details.ExternalCauseOfInjury.pvrv_site_2" label="2-sites" />
                            <CheckBoxMultiple class="flex justify-content-center" style="width: 35%" v-model="patientStore.details.ExternalCauseOfInjury.pvrv_site_4" label="4-sites" />
                        </div>
                    </Transition>
                </div>
                <div style="width: 13%">
                    <Transition name="slide-fade" mode="out-in">
                        <div v-if="patientStore.details.ExternalCauseOfInjury.pcec === 'Y'" style="width: 100%" class="flex justify-content-evenly mb-2">
                            <CheckBoxMultiple class="flex justify-content-center" style="width: 35%" v-model="patientStore.details.ExternalCauseOfInjury.pcec_site_2" label="2-sites" />
                            <CheckBoxMultiple class="flex justify-content-center" style="width: 35%" v-model="patientStore.details.ExternalCauseOfInjury.pcec_site_4" label="4-sites" />
                        </div>
                    </Transition>
                </div>
                <div style="width: 13%">
                    <Transition name="slide-fade" mode="out-in">
                        <div v-if="patientStore.details.ExternalCauseOfInjury.hrig === 'Y'" style="width: 100%" class="flex justify-content-evenly">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputNumber type="number" suffix=" mL" :min="0" :max="25" id="hrig" v-model="patientStore.details.ExternalCauseOfInjury.hrig_num" />
                                    <label for="hrig">Amount to be Given</label>
                                </span>
                            </div>
                        </div>
                    </Transition>
                </div>
                <div style="width: 13%">
                    <Transition name="slide-fade" mode="out-in">
                        <div v-if="patientStore.details.ExternalCauseOfInjury.erig === 'Y'" style="width: 100%" class="flex justify-content-evenly">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputNumber type="number" suffix=" mL" :min="0" :max="25" id="erig" v-model="patientStore.details.ExternalCauseOfInjury.erig_num" />
                                    <label for="erig">Amount to be Given</label>
                                </span>
                            </div>
                        </div>
                    </Transition>
                </div>
                <div style="width: 13%">
                    <Transition name="slide-fade" mode="out-in">
                        <div v-if="patientStore.details.ExternalCauseOfInjury.ats === 'Y'" style="width: 100%" class="flex justify-content-evenly">
                            <div class="field" style="width: 100%">
                                <span class="p-float-label">
                                    <Dropdown
                                        style="width: 80%"
                                        v-model="patientStore.details.ExternalCauseOfInjury.ats_num"
                                        :options="[
                                            { label: '1500 ui', value: '1500' },
                                            { label: '3000 ui', value: '3000' },
                                            { label: '4500 ui', value: '4500' },
                                            { label: '6000 ui', value: '6000' }
                                        ]"
                                        optionLabel="label"
                                        optionValue="value"
                                    />
                                    <label for="ats">Amount to be Given</label>
                                </span>
                            </div>
                        </div>
                    </Transition>
                </div>
                <div style="width: 13%"></div>
                <div style="width: 13%"></div>
                <div
                    v-if="
                        (patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
                            patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
                            patientStore.details.ExternalCauseOfInjury.hrig !== 'Y' &&
                            patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
                            patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
                            patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
                            patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y') ||
                        (patientStore.details.ExternalCauseOfInjury.pvrv_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_4 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv === 'Y') ||
                        (patientStore.details.ExternalCauseOfInjury.pcec_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_4 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pcec === 'Y') ||
                        (patientStore.details.ExternalCauseOfInjury.hrig === 'Y' && patientStore.details.ExternalCauseOfInjury.hrig_num === '') ||
                        (patientStore.details.ExternalCauseOfInjury.erig === 'Y' && patientStore.details.ExternalCauseOfInjury.erig_num === '') ||
                        (patientStore.details.ExternalCauseOfInjury.ats === 'Y' && patientStore.details.ExternalCauseOfInjury.ats_num === '')
                    "
                    class="bg-red-200 p-2 absolute bottom-0 left-0 text-center text-gray-700 font-semibold italic"
                    style="border-radius: 0 0 1rem 1rem; width: 100%; font-size: 1rem; margin: 0 !important"
                >
                    Value is Required
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.rainbow-border {
    border: 1px solid transparent;
    border-image: linear-gradient(to right, hsl(30, 56%, 89%), #e8e8af, #96d996, #7171df, #bf8ee2, #c99cdc) 1;
    border-radius: 1px;
    padding: 1px;
    background-color: #f9f9f9;
}

.slide-fade-enter-active {
    transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

.bg::before {
    content: '';
    background: url('@/assets/images/BGHMC.png') no-repeat center center fixed;
    opacity: 0.1;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
.custom-shadow {
    box-shadow: 0 2px 7px rgba(255, 0, 0, 0.5);
    transition: box-shadow 0.3s ease;
}

.custom-shadow:hover {
    box-shadow: 0 6px 20px rgba(255, 0, 0, 0.75);
}
</style>
