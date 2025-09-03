<script setup>
import { usePatientStore } from '../../../../store/injury/patientStore';
import createValidationRules from '../../../../validation/injuryValidations';
import useVuelidate from '@vuelidate/core';
import { onMounted, ref, computed, watch, onUpdated } from 'vue';
import LibraryService from '@/service/LibraryService';
import Divider from 'primevue/divider';
import InputSwitch from 'primevue/inputswitch';
import TextAreaPreAdmission from '../../../custom/textAreaPreAdmission.vue';
import CheckBoxMultiple from '../../../custom/checkBoxMultiple.vue';
import InjuryService from '../../../../service/InjuryService';

// Initialize patient store and loading state
const patientStore = usePatientStore();
const injuryService = new InjuryService();
const loading = ref(true);
const libraryService = new LibraryService();
const places = libraryService.getPlaces();
const activities = libraryService.getActivities();
const unrecognizedFieldPreview = ref(patientStore?.details?.natureOfInjury?.noi_othersPhysical + ', ' + patientStore?.details?.natureOfInjury?.noi_otherinj);
const firstAidGivens = libraryService.getFirstAidGivens();
const firstAIdPreview = ref('');
const v$ = useVuelidate(createValidationRules(), patientStore.details);
const compiledSelectedDiagnosis = ref(patientStore.details.hospitalFacilityData.customizedDiagnosis);
const diagnosisDialog = ref(false);
const listOfDiagnosis = ref();
const selectedDiagnoses = ref([]);
const listOfDiagnosisCounter = ref();

const addDiagnosis = (diagnosis) => {
    if (!selectedDiagnoses.value.includes(diagnosis)) {
        selectedDiagnoses.value.push(diagnosis);
        compiledSelectedDiagnosis.value = selectedDiagnoses.value.map((d) => d.diagtext).join('\n\n ');
        patientStore.details.hospitalFacilityData.customizedDiagnosis = compiledSelectedDiagnosis;
    }
};

const removeDiagnosis = (diagnosis) => {
    selectedDiagnoses.value = selectedDiagnoses.value.filter((d) => d.tstamp !== diagnosis.tstamp);

    // Compile selected diagnoses into a string after removal
    const compiledSelectedDiagnosis = selectedDiagnoses.value.map((d) => d.diagtext).join('\n\n '); // Join with a comma

    // Update the patient store
    patientStore.details.hospitalFacilityData.customizedDiagnosis = compiledSelectedDiagnosis;
};
// Function to validate nature of injury
const validate = async () => {
    const natureOfInjury = await v$.value.natureOfInjury.$validate();
    return { natureOfInjury };
};

const burnDegrees = [
    {
        degree_burn: '1',
        degree_burn_desc: '1st Degree',
        model: patientStore.details.preAdmissionData.degree_burn1,
        truevalue: 'Y',
        falsevalue: 'N'
    },
    {
        degree_burn: '2',
        degree_burn_desc: '2nd Degree',
        model: patientStore.details.preAdmissionData.degree_burn2,
        truevalue: 'Y',
        falsevalue: 'N'
    },
    {
        degree_burn: '3',
        degree_burn_desc: '3rd Degree',
        model: patientStore.details.preAdmissionData.degree_burn3,
        truevalue: 'Y',
        falsevalue: 'N'
    },
    {
        degree_burn: '4',
        degree_burn_desc: '4th Degree',
        model: patientStore.details.preAdmissionData.degree_burn4,
        truevalue: 'Y',
        falsevalue: 'N'
    }
];

const burnDegree = computed({
    get() {
        return getBurnDegree();
    },
    set(value) {
        if (value == '1') {
            patientStore.details.natureOfInjury.degree_burn1 = burnDegrees[0].truevalue;
            patientStore.details.natureOfInjury.degree_burn2 = '';
            patientStore.details.natureOfInjury.degree_burn3 = '';
            patientStore.details.natureOfInjury.degree_burn4 = '';
        } else if (value == '2') {
            patientStore.details.natureOfInjury.degree_burn1 = '';
            patientStore.details.natureOfInjury.degree_burn2 = burnDegrees[1].truevalue;
            patientStore.details.natureOfInjury.degree_burn3 = '';
            patientStore.details.natureOfInjury.degree_burn4 = '';
        } else if (value == '3') {
            patientStore.details.natureOfInjury.degree_burn1 = '';
            patientStore.details.natureOfInjury.degree_burn2 = '';
            patientStore.details.natureOfInjury.degree_burn3 = burnDegrees[2].truevalue;
            patientStore.details.natureOfInjury.degree_burn4 = '';
        } else if (value == '4') {
            patientStore.details.natureOfInjury.degree_burn1 = '';
            patientStore.details.natureOfInjury.degree_burn2 = '';
            patientStore.details.natureOfInjury.degree_burn3 = '';
            patientStore.details.natureOfInjury.degree_burn4 = burnDegrees[3].truevalue;
        }
        return getBurnDegree();
    }
});

const getBurnDegree = () => {
    if (patientStore.details.natureOfInjury.degree_burn1 == 'Y') {
        return '1';
    }
    if (patientStore.details.natureOfInjury.degree_burn2 == 'Y') {
        return '2';
    }
    if (patientStore.details.natureOfInjury.degree_burn3 == 'Y') {
        return '3';
    }
    if (patientStore.details.natureOfInjury.degree_burn4 == 'Y') {
        return '4';
    }
};

const burnDegreeValue = ref(burnDegree.value);

watch(
    () => burnDegreeValue.value,
    (value) => {
        burnDegree.value = value;
    }
);

const multInj = computed(() => {
    const values = [
        patientStore.details.natureOfInjury.noi_abrasion,
        patientStore.details.natureOfInjury.noi_burn_r,
        patientStore.details.natureOfInjury.noi_avulsion,
        patientStore.details.natureOfInjury.noi_concussion,
        patientStore.details.natureOfInjury.noi_contusion,
        patientStore.details.natureOfInjury.noi_frac_ope,
        patientStore.details.natureOfInjury.noi_frac_clo,
        patientStore.details.natureOfInjury.noi_owound,
        patientStore.details.natureOfInjury.noi_amp,
        patientStore.details.natureOfInjury.noi_others
    ];
    return values.filter((value) => value == 'Y').length > 1 ? 'Y' : 'N';
});

watch(multInj, (value) => {
    patientStore.details.preAdmissionData.mult_inj = value;
});

watch(
    () => loading.value,
    () => {
        burnDegreeValue.value = getBurnDegree();
    }
);
onUpdated(() => {
    burnDegreeValue.value = getBurnDegree();
});
onMounted(async () => {
    const fetchListOfDiagnosis = await injuryService.getListOfDiagnosis(patientStore.enccode);
    // console.log('list of diagnosis: ', fetchListOfDiagnosis, patientStore.enccode);
    listOfDiagnosis.value = fetchListOfDiagnosis;
    // console.log('compiled: ', patientStore.details.hospitalFacilityData.customizedDiagnosis);
    listOfDiagnosisCounter.value = listOfDiagnosis.value.length;
    patientStore.details.hospitalFacilityData.diagnosis = patientStore.header.dx;
    // console.log('diagnosis: ', patientStore.details.hospitalFacilityData.diagnosis, '\n finalDiag: ', patientStore.header.complete_diagnosis);
    loading.value = false;
    if (patientStore.details.ExternalCauseOfInjury.washingDone === 'YES' && patientStore.details.preAdmissionData.first_aid_code === 'Y') {
        firstAIdPreview.value = 'WASHING OF WOUND DONE ' + patientStore.details.preAdmissionData.firstaid_others;
    } else if (patientStore.details.ExternalCauseOfInjury.washingDone === 'YES' && patientStore.details.preAdmissionData.first_aid_code === 'N') {
        firstAIdPreview.value = 'WASHING OF WOUND DONE';
    } else if (patientStore.details.ExternalCauseOfInjury.washingDone === 'YES' && patientStore.details.preAdmissionData.first_aid_code === 'U') {
        firstAIdPreview.value = 'WASHING OF WOUND DONE';
    }
    await new Promise((resolve) => setTimeout(resolve, 7000));

    if (patientStore.details.forTransportVehicularAccident.safe_not_applicable === 'Y') {
        patientStore.details.forTransportVehicularAccident.safe_none = 'N';
    }
    if (patientStore.details.forTransportVehicularAccident.risk_not_applicable === 'Y') {
        patientStore.details.forTransportVehicularAccident.risk_none = 'N';
    }
    unrecognizedFieldPreview.value = patientStore?.details?.natureOfInjury?.noi_othersPhysical + ', ' + patientStore?.details?.natureOfInjury?.noi_otherinj;
});
watch(
    () => [patientStore.details.preAdmissionData.first_aid_code, patientStore.details.preAdmissionData.firstaid_others],
    () => {
        if (patientStore.details.ExternalCauseOfInjury.washingDone === 'YES' && patientStore.details.preAdmissionData.first_aid_code === 'Y') {
            firstAIdPreview.value = 'WASHING OF WOUND DONE ' + patientStore.details.preAdmissionData.firstaid_others;
        } else if (patientStore.details.ExternalCauseOfInjury.washingDone === 'YES' && patientStore.details.preAdmissionData.first_aid_code === 'N') {
            firstAIdPreview.value = 'WASHING OF WOUND DONE';
        } else if (patientStore.details.ExternalCauseOfInjury.washingDone === 'YES' && patientStore.details.preAdmissionData.first_aid_code === 'U') {
            firstAIdPreview.value = 'WASHING OF WOUND DONE';
        }
    }
);
watch(
    () => patientStore.dataIsLoaded,
    (newValue) => {
        if (newValue === true) {
            if (patientStore.details.ExternalCauseOfInjury.washingDone === 'YES' && patientStore.details.preAdmissionData.first_aid_code === 'Y') {
                firstAIdPreview.value = 'WASHING OF WOUND DONE ' + patientStore.details.preAdmissionData.firstaid_others;
            } else if (patientStore.details.ExternalCauseOfInjury.washingDone === 'YES' && patientStore.details.preAdmissionData.first_aid_code === 'N') {
                firstAIdPreview.value = 'WASHING OF WOUND DONE';
            } else if (patientStore.details.ExternalCauseOfInjury.washingDone === 'YES' && patientStore.details.preAdmissionData.first_aid_code === 'U') {
                firstAIdPreview.value = 'WASHING OF WOUND DONE';
            }
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
    () => [patientStore.details.natureOfInjury.noi_othersPhysical, patientStore.details.natureOfInjury.noi_otherinj],
    () => {
        unrecognizedFieldPreview.value = (patientStore.details.natureOfInjury.noi_othersPhysical || '') + ', ' + (patientStore.details.natureOfInjury.noi_otherinj || '');
    }
);
watch(
    () => patientStore.details.hospitalFacilityData.customizedDiagnosis,
    (newValue) => {
        console.log('customizedDiagnosis: ', newValue);
    }
);
</script>
<template>
    <div class="card shadow-4 max-h-full h-full opacity-90">
        <div class="flex align-items-center">
            <h4 class="font-bold" style="color: #000080">PREADMISSION DATA</h4>
        </div>

        <div class="preadmissionData">
            <div class="sticky">
                <!-- <label for="hospitalFacilityData.diagnosis" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Initial Impression/Diagnosis</i></label> -->
                <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding: 10px">
                    <label for="hospitalFacilityData.diagnosis" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff">
                        <i>Initial Impression/Diagnosis</i>
                    </label>
                    <button v-if="listOfDiagnosisCounter > 1" class="button" @click="diagnosisDialog = true" style="padding: 5px 10px; font-size: 8px; background-color: lightgray; color: white; border: none; border-radius: 2px; cursor: pointer">
                        +
                    </button>
                </div>

                <div class="flex justify-content-end" v-if="patientStore.details.hospitalFacilityData.diagnosis == ''">
                    <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                </div>
                <Textarea
                    style="text-transform: uppercase"
                    id="hospitalFacilityData.diagnosis"
                    type="text"
                    v-model="patientStore.details.hospitalFacilityData.diagnosis"
                    placeholder=""
                    readonly
                    autoResize
                    :class="{
                        'p-inputtext-filled font-bold mb-2 w-26rem text-xs myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.hospitalFacilityData.diagnosis === ''
                    }"
                />
                <!-- {{ patientStore.details.hospitalFacilityData.customizedDiagnosis }} -->
                <div class="field mt-5" v-if="patientStore.details.hospitalFacilityData.customizedDiagnosis !== (undefined && null && '')">
                    <span class="p-float-label" v-if="patientStore.details.hospitalFacilityData.customizedDiagnosis !== ''">
                        <Textarea disabled inputId="Customized Diagnosis Preview" class="font-bold" style="width: 100%" autoResize disable v-model="patientStore.details.hospitalFacilityData.customizedDiagnosis"></Textarea>
                        <label style="width: 100%" for="Unrecognized Fields">Customized Diagnosis Preview</label>
                    </span>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="flex justify-content-between w-26rem">
                    <label for="preAdmissionData.place_occ_code" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Place of Occurence</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.place_occ_code === ''">
                        <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
                <Dropdown
                    id="preAdmissionData.place_occ_code"
                    v-model="patientStore.details.preAdmissionData.place_occ_code"
                    :options="places"
                    placeholder="Place of Occurence"
                    optionLabel="place_occ_desc"
                    optionValue="place_occ_code"
                    :class="{
                        'p-inputtext-filled font-bold mb-1 w-26rem mt-1 myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.preAdmissionData.place_occ_code === ''
                    }"
                />
                <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.place_occ_code === '88' && patientStore.details.preAdmissionData.poc_etc_spec === ''">
                    <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                </div>
                <Textarea
                    v-if="patientStore.details.preAdmissionData.place_occ_code == '88' || patientStore.details.preAdmissionData.place_occ_code == '70'"
                    id="preAdmissionData.poc_etc_spec"
                    type="text"
                    v-model="patientStore.details.preAdmissionData.poc_etc_spec"
                    placeholder="Specify"
                    :class="{
                        'p-inputtext-filled font-bold mb-1 w-26rem text-xs myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.preAdmissionData.poc_etc_spec === ''
                    }"
                    style="text-transform: uppercase"
                    autoResize
                />
            </div>

            <div class="flex flex-column">
                <div class="flex justify-content-between w-26rem">
                    <label for="preAdmissionData.activity_code" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Activity of the Patient at the Time of the Incident</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.activity_code === ''">
                        <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
                <Dropdown
                    id="preAdmissionData.activity_code"
                    v-model="patientStore.details.preAdmissionData.activity_code"
                    :options="activities"
                    placeholder="Activity of the Patient at the Time of the Incident"
                    optionLabel="activity_desc"
                    optionValue="activity_code"
                    :class="{
                        'p-inputtext-filled font-bold mb-1 w-26rem mt-1 myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.preAdmissionData.activity_code === ''
                    }"
                />
                <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.activity_code === '88' && patientStore.details.preAdmissionData.act_etc_spec === ''">
                    <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                </div>
                <Textarea
                    v-if="patientStore.details.preAdmissionData.activity_code == '88'"
                    id="preAdmissionData.act_etc_spec"
                    type="text"
                    v-model="patientStore.details.preAdmissionData.act_etc_spec"
                    placeholder="Specify"
                    :class="{
                        'p-inputtext-filled font-bold mb-1 w-26rem text-xs myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.preAdmissionData.act_etc_spec === ''
                    }"
                    style="text-transform: uppercase"
                />
            </div>

            <div class="flex flex-column">
                <div class="flex justify-content-between w-26rem">
                    <label for="generalData.inj_intent_code" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>First Aid Given?</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.first_aid_code === ''">
                        <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
                <Dropdown
                    id="generalData.inj_intent_code"
                    v-model="patientStore.details.preAdmissionData.first_aid_code"
                    :options="firstAidGivens"
                    placeholder="First Aid Given"
                    optionLabel="first_aid_desc"
                    optionValue="first_aid_code"
                    :class="{
                        'p-inputtext-filled font-bold mb-2 w-26rem myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.preAdmissionData.first_aid_code === ''
                    }"
                />

                <div class="ml-4 flex flex-column" v-if="patientStore.details.preAdmissionData.first_aid_code == 'Y'">
                    <div class="flex flex-column">
                        <div class="flex justify-content-between w-24rem">
                            <label for="generalData.firstaid_others" class="p-float-label font-sans text-black-300 text-xs" style="color: #3366ff"><i>First Aid</i></label>
                            <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.firstaid_others === ''">
                                <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                            </div>
                        </div>
                        <Textarea
                            style="text-transform: uppercase"
                            id="generalData.firstaid_others"
                            type="text"
                            v-model="patientStore.details.preAdmissionData.firstaid_others"
                            placeholder=""
                            :class="{
                                'p-inputtext-filled font-bold mb-2 w-24rem text-xs myCSS-inputtext-required': true,
                                'bg-green-100': patientStore.details.preAdmissionData.firstaid_others === ''
                            }"
                        />
                    </div>
                    <label for="generalData.firstaid_others2" class="p-float-label font-sans text-black-300 text-xs" style="color: #3366ff"><i>By Whom</i></label>
                    <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.firstaid_others2 === ''">
                        <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                    <InputText
                        style="text-transform: uppercase"
                        id="generalData.firstaid_others2"
                        type="text"
                        v-model="patientStore.details.preAdmissionData.firstaid_others2"
                        placeholder=""
                        :class="{
                            'p-inputtext-filled font-bold mb-2 w-24rem text-xs': true,
                            'bg-green-100': patientStore.details.preAdmissionData.firstaid_others2 === ''
                        }"
                    />
                </div>
            </div>
            <div class="field mt-5" v-if="patientStore.details.ExternalCauseOfInjury.washingDone === 'YES'">
                <span class="p-float-label">
                    <Textarea disabled inputId="Unrecognized Fields" class="font-bold" style="width: 100%" disable v-model="firstAIdPreview"></Textarea>
                    <label style="width: 100%" for="Unrecognized Fields">First Aid Preview</label>
                </span>
            </div>

            <Divider />

            <div>
                <InputTextCheckBox
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_abrasion"
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_abrasion"
                    v-model:desc="patientStore.details.natureOfInjury.noi_abradtl"
                    label="Abrasion"
                    :binary="true"
                    :class="{
                        'bg-green-100': patientStore.details.natureOfInjury.noi_abrasion === 'Y' && patientStore.details.natureOfInjury.noi_abradtl === ''
                    }"
                />
            </div>
            <div class="burns">
                <div class="flex align-content-center align-items-center mt-1">
                    <InputSwitch v-model="patientStore.details.natureOfInjury.noi_burn_r" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Burn</label>
                </div>

                <div v-if="patientStore.details.natureOfInjury.noi_burn_r == 'Y'" class="mt-1 ml-4">
                    <div class="flex column">
                        <div class="flex justify-content-between w-24rem">
                            <label for="natureOfInjury.burnDegrees" class="text-xs mt-1">Burn Degree</label>
                            <div class="flex justify-content-end" v-if="!burnDegreeValue">
                                <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                            </div>
                        </div>
                    </div>
                    <Dropdown
                        id="natureOfInjury.burnDegrees"
                        v-model="burnDegreeValue"
                        placeholder="Select Burn Type"
                        :options="burnDegrees"
                        optionLabel="degree_burn_desc"
                        optionValue="degree_burn"
                        :class="{
                            'p-inputtext-filled font-bold max-w-full w-24rem myCSS-inputtext-required text-xs': true,
                            'bg-green-100': !burnDegreeValue
                        }"
                    />
                    <div v-if="burnDegreeValue">
                        <label for="natureOfInjury.noi_burndtl" class="text-xs mt-1">Specify</label>
                        <TextAreaPreAdmission v-model:desc="patientStore.details.natureOfInjury.noi_burndtl" />
                        <div class="flex justify-content-end w-24rem">
                            <div class="flex justify-content-end" v-if="patientStore.details.natureOfInjury.noi_burndtl === ''">
                                <small :class="'required-error'" class="text-red-800 text-xs font-bold mt-1">Value is required</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <InputTextCheckBox
                v-model:isMultiple="patientStore.details.multipleFields.multiple_avulsion"
                v-model:modelValue="patientStore.details.natureOfInjury.noi_avulsion"
                v-model:desc="patientStore.details.natureOfInjury.noi_avuldtl"
                label="Avulsion"
                :binary="true"
                :class="{
                    'bg-green-100': patientStore.details.natureOfInjury.noi_avulsion === 'Y' && patientStore.details.natureOfInjury.noi_avuldtl === ''
                }"
            />
            <div class="flex justify-content-end" v-if="patientStore.details.natureOfInjury.noi_avulsion === 'Y' && patientStore.details.natureOfInjury.noi_avudtl === ''">
                <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
            </div>
            <InputTextCheckBox
                v-model:isMultiple="patientStore.details.multipleFields.multiple_concussion"
                v-model:modelValue="patientStore.details.natureOfInjury.noi_concussion"
                v-model:desc="patientStore.details.natureOfInjury.noi_concussiondtl"
                label="Concussion"
                :binary="true"
                :class="{
                    'bg-green-100': patientStore.details.natureOfInjury.noi_concussion === 'Y' && patientStore.details.natureOfInjury.noi_concussiondtl === ''
                }"
            />
            <InputTextCheckBox
                v-model:isMultiple="patientStore.details.multipleFields.multiple_contusion"
                v-model:modelValue="patientStore.details.natureOfInjury.noi_contusion"
                v-model:desc="patientStore.details.natureOfInjury.noi_contudtl"
                label="Contusion"
                :binary="true"
                :class="{
                    'bg-green-100': patientStore.details.natureOfInjury.noi_contusion === 'Y' && patientStore.details.natureOfInjury.noi_contudtl === ''
                }"
            />
            <InputTextCheckBox
                v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_open"
                v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_ope"
                v-model:desc="patientStore.details.natureOfInjury.noi_fropdtl"
                label="Fracture (Closed)"
                :binary="true"
                :class="{
                    'bg-green-100': patientStore.details.natureOfInjury.noi_frac_ope === 'Y' && patientStore.details.natureOfInjury.noi_fropdtl === ''
                }"
            />
            <InputTextCheckBox
                v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_closed"
                v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_clo"
                v-model:desc="patientStore.details.natureOfInjury.noi_frcldtl"
                label="Fracture (Open)"
                :binary="true"
                :class="{
                    'bg-green-100': patientStore.details.natureOfInjury.noi_frac_clo === 'Y' && patientStore.details.natureOfInjury.noi_frcldtl === ''
                }"
            />
            <InputTextCheckBox
                v-model:isMultiple="patientStore.details.multipleFields.multiple_laceration"
                v-model:modelValue="patientStore.details.natureOfInjury.noi_owound"
                v-model:desc="patientStore.details.natureOfInjury.noi_owoudtl"
                label="Open Wound / Laceration"
                :binary="true"
                :class="{
                    'bg-green-100': patientStore.details.natureOfInjury.noi_owound === 'Y' && patientStore.details.natureOfInjury.noi_owoudtl === ''
                }"
            />
            <InputTextCheckBox
                v-model:isMultiple="patientStore.details.multipleFields.multiple_traumatic_amputation"
                v-model:modelValue="patientStore.details.natureOfInjury.noi_amp"
                v-model:desc="patientStore.details.natureOfInjury.noi_ampdtl"
                label="Traumatic Amputation"
                :binary="true"
                :class="{
                    'bg-green-100': patientStore.details.natureOfInjury.noi_amp === 'Y' && patientStore.details.natureOfInjury.noi_ampdtl === ''
                }"
            />
            <InputTextCheckBox
                v-model:isMultiple="patientStore.details.multipleFields.multiple_other"
                v-model:modelValue="patientStore.details.natureOfInjury.noi_others"
                v-model:desc="patientStore.details.natureOfInjury.noi_otherinj"
                label="Others"
                :binary="true"
                :class="{
                    'bg-green-100': patientStore.details.natureOfInjury.noi_others === 'Y' && patientStore.details.natureOfInjury.noi_otherinj === ''
                }"
            />
            <div class="field mt-5" v-if="patientStore.details.natureOfInjury.noi_othersPhysical" style="border: 3px dashed #808080">
                <span class="p-float-label">
                    <Textarea inputId="Unrecognized Fields" style="width: 100%" v-model="unrecognizedFieldPreview"></Textarea>
                    <label style="width: 100%" for="Unrecognized Fields">Unrecognized Fields</label>
                </span>
            </div>
            <div class="mauling flex align-content-center mt-3">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.vawc" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> VAWC</label>
            </div>
            <div class="mauling flex align-content-center mt-3">
                <InputSwitch v-model="patientStore.details.generalData.perpetrator" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Perpetrator</label>
            </div>
            <div class="mt-1 ml-4">
                <Dropdown
                    v-if="patientStore.details.generalData.perpetrator === 'Y'"
                    id="perpetratorRelationships"
                    class="font-bold"
                    v-model="patientStore.details.generalData.perpetrator_sp"
                    :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.generalData.perpetrator_sp }"
                    placeholder="Relationship to Victim"
                    :options="libraryService.getPerpetratorRelationships()"
                    optionLabel="label"
                    optionValue="value"
                    style="width: 100%"
                />
                <div v-if="patientStore.details.generalData.perpetrator_sp === '11'">
                    <div>
                        <div class="flex justify-content-start mt-2" style="width: 100%">
                            <div class="flex justify-content-start" v-if="patientStore.details.generalData.perpetrator_oth_sp === ''"><i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 8rem" /></div>
                        </div>
                        <label style="color: #000080" for="natureOfInjury.noi_burndtl" class="text-s mt-1"><i>Specify</i></label>
                    </div>
                    <Transition name="slide-fade" mode="out-in">
                        <Textarea v-model="patientStore.details.generalData.perpetrator_oth_sp" style="width: 100%" class="font-bold" autoResize> </Textarea>
                    </Transition>
                </div>
            </div>
            <div class="mauling flex align-content-center mt-2">
                <InputSwitch v-model="patientStore.details.forTransportVehicularAccident.risk_none" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Contributing Factor </label>
            </div>
            <div class="flex justify-content-start" v-if="patientStore.details.forTransportVehicularAccident.risk_none === 'Y'">
                <div
                    class="flex justify-content-end"
                    v-if="
                        (patientStore.details.forTransportVehicularAccident.risk_alcliq === '' || patientStore.details.forTransportVehicularAccident.risk_alcliq === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.risk_sleep === '' || patientStore.details.forTransportVehicularAccident.risk_sleep === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.risk_smoke === '' || patientStore.details.forTransportVehicularAccident.risk_smoke === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.risk_mobpho === '' || patientStore.details.forTransportVehicularAccident.risk_mobpho === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.risk_other === '' || patientStore.details.forTransportVehicularAccident.risk_other === 'N')
                    "
                >
                    <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                </div>
            </div>

            <div v-if="patientStore.details.forTransportVehicularAccident.risk_none === 'Y'" class="mt-5" style="width: 24rem">
                <div class="flex justify-content-center">
                    <div class="grid grid-cols-4 gap-1">
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_alcliq" label="ALCOHOL/LIQUOR" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_smoke" label="SMOKING" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_sleep" label="SLEEPY" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_mobpho" label="USING MOBILE" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_other" label="OTHER" />
                        <div style="width: 100%" v-if="patientStore.details.forTransportVehicularAccident.risk_other === 'Y'">
                            <Textarea v-model="patientStore.details.forTransportVehicularAccident.risk_etc_spec" placeholder="Please specify..." rows="1" resizable autoResize style="width: 100%" class="font-bold p-2 border rounded" />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="mauling flex align-content-center mt-3">
                    <InputSwitch v-model="patientStore.details.forTransportVehicularAccident.safe_none" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 align-self-center font-bold"> Safety </label>
                </div>
                <div class="flex justify-content-start mt-2" v-if="patientStore.details.forTransportVehicularAccident.safe_none === 'Y'">
                    <div
                        class="flex justify-content-end"
                        v-if="
                            (patientStore.details.forTransportVehicularAccident.safe_unkn === '' || patientStore.details.forTransportVehicularAccident.safe_unkn === 'N') &&
                            (patientStore.details.forTransportVehicularAccident.safe_airbag === '' || patientStore.details.forTransportVehicularAccident.safe_airbag === 'N') &&
                            (patientStore.details.forTransportVehicularAccident.safe_helmet === '' || patientStore.details.forTransportVehicularAccident.safe_helmet === 'N') &&
                            (patientStore.details.forTransportVehicularAccident.safe_cseat === '' || patientStore.details.forTransportVehicularAccident.safe_cseat === 'N') &&
                            (patientStore.details.forTransportVehicularAccident.safe_sbelt === '' || patientStore.details.forTransportVehicularAccident.safe_sbelt === 'N') &&
                            (patientStore.details.forTransportVehicularAccident.safe_vest === '' || patientStore.details.forTransportVehicularAccident.safe_vest === 'N') &&
                            (patientStore.details.forTransportVehicularAccident.safe_other === '' || patientStore.details.forTransportVehicularAccident.safe_other === 'N')
                        "
                    >
                        <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
                <div v-if="patientStore.details.forTransportVehicularAccident.safe_none === 'Y'" class="mx-1 flex flex-column mt-5">
                    <div class="grid grid-cols-2 gap-1 flex justify-content-center" style="width: 28rem">
                        <div class="flex justify-content-center">
                            <div class="grid grid-cols-4 gap-1">
                                <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_unkn" label="UNKNOWN" />
                                <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_helmet" label="HELMET" />
                                <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_sbelt" label="SEAT BELT" />
                                <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_airbag" label="AIRBAG" />
                                <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_cseat" label="CHILD SEAT" />
                                <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_vest" label="LIFE VEST" />
                                <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_other" label="OTHER" />
                                <div style="width: 100%" v-if="patientStore.details.forTransportVehicularAccident.safe_other === 'Y'">
                                    <Textarea v-model="patientStore.details.forTransportVehicularAccident.safe_other_sp" placeholder="Please specify..." rows="1" resizable autoResize style="width: 100%" class="p-2 border rounded font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog v-model:visible="diagnosisDialog" modal header="CUSTOMIZE DIAGNOSIS" :style="{ width: '50%', height: '60%' }">
                <div style="display: flex; justify-content: space-between; padding: 20px">
                    <div style="flex: 1; margin-right: 10px">
                        <strong>List of Diagnosis</strong>
                        <ul>
                            <li v-for="diagnosis in listOfDiagnosis" :key="diagnosis.tstamp">
                                <button @click="addDiagnosis(diagnosis)">{{ diagnosis.diagtext }}</button>
                            </li>
                        </ul>
                    </div>
                    <div style="flex: 1; margin-left: 10px">
                        <strong>Selected Diagnosis</strong>
                        <ul>
                            <li v-for="selected in selectedDiagnoses" :key="selected.tstamp">
                                <button @click="removeDiagnosis(selected)">{{ selected.diagtext }}</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </Dialog>
        </div>
    </div>
</template>

<style scoped>
button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px 0;
}

button:hover {
    background-color: #0056b3;
}
.bg-green-100 {
    background-color: #c6efce;
}

.small-switch {
    width: 50px;
    height: 20px;
}

.sticky {
    position: sticky;
    top: 0;
    border-bottom: 2px solid #475d74;
    background-color: white;
    z-index: 10;
}

.line {
    height: 1px;
    background-color: rgb(139, 134, 134);
    width: 100%;
    margin: 20px 0;
}
</style>
