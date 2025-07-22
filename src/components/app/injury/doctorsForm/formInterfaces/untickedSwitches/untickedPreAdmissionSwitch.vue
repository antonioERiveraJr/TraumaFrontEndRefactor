<script setup>
import { usePatientStore } from '../../../../../../store/injury/patientStore';
import InputTextCheckBoxDoctor2 from '../../../../../custom/inputTextCheckBoxDoctor2.vue';
import LibraryService from '@/service/LibraryService';
import { defineProps, watch, ref, onMounted } from 'vue';
const patientStore = usePatientStore();
const libraryService = new LibraryService();

const props = defineProps({
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    }
});
const widths = ref();
const heights = ref();

onMounted(() => {
    widths.value = props.width;
    heights.value = props.height;
});
watch(
    () => props.width,
    (newWidth) => {
        widths.value = newWidth;
    },
    { immediate: true }
);
watch(
    () => props.height,
    (newHeight) => {
        heights.value = newHeight;
    },
    { immediate: true }
);
</script>
<template>
    <div :style="{ width: widths < 1500 ? '100%' : '66%' }" class="mt-1">
        <div :class="['grid grid-cols-3 card flex justify-content-center relative', { 'custom-shadow': noPhysical }]">
            <div :style="{ width: widths < 950 ? '100%' : widths < 1100 ? '49%' : '32%' }">
                <div>
                    <InputTextCheckBoxDoctor2
                        v-model:modelValue="patientStore.details.natureOfInjury.noi_abrasion"
                        v-model:desc="patientStore.details.natureOfInjury.noi_abradtl"
                        v-model:isMultiple="patientStore.details.multipleFields.multiple_abrasion"
                        label="Abrasion"
                        :binary="true"
                    />
                </div>
                <Transition name="slide-fade" mode="out-in">
                    <div class="burns" v-if="patientStore.details.natureOfInjury.noi_burn_r !== 'Y'">
                        <div class="flex align-content-center align-items-center mt-1">
                            <InputSwitch v-model="patientStore.details.natureOfInjury.noi_burn_r" trueValue="Y" falseValue="N" id="inputswitch" />
                            <label for="inputswitch" class="mx-2 font-bold">Burn</label>
                        </div>
                        <div v-if="patientStore.details.natureOfInjury.noi_burn_r == 'Y'" class="mt-1 ml-4">
                            <div class="flex column">
                                <div class="flex justify-content-between w-25rem">
                                    <label style="color: #000080" for="natureOfInjury.burnDegrees" class="text-s mt-1">Burn Degree</label>
                                    <div class="flex justify-content-end" v-if="!burnDegreeValue">
                                        <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
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
                                    'p-inputtext-filled font-bold max-w-full w-25rem myCSS-inputtext-required text-s': true,
                                    'bg-white-100': !burnDegreeValue
                                }"
                            />
                            <div v-if="burnDegreeValue">
                                <label style="color: #000080" for="natureOfInjury.noi_burndtl" class="text-s mt-1">Specify</label>
                                <TextAreaPreAdmissionDoctor v-model:desc="patientStore.details.natureOfInjury.noi_burndtl" v-model:isMultiple="patientStore.details.multipleFields.multiple_burn" />
                                <div class="flex justify-content-center w-24rem">
                                    <div class="flex justify-content-end" v-if="patientStore.details.natureOfInjury.noi_burndtl === ''">
                                        <small :class="'required-error'" class="text-red-800 text-s font-bold mt-1">Value is required</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_avulsion"
                    v-model:desc="patientStore.details.natureOfInjury.noi_avuldtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_avulsion"
                    label="Avulsion"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_owound"
                    v-model:desc="patientStore.details.natureOfInjury.noi_owoudtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_laceration"
                    label="Laceration"
                    :binary="true"
                />

                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_incision"
                    v-model:desc="patientStore.details.natureOfInjury.noi_incision_sp"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_incision"
                    label="Incision"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_amp"
                    v-model:desc="patientStore.details.natureOfInjury.noi_ampdtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_traumatic_amputation"
                    label="Traumatic Amputation"
                    :binary="true"
                />
            </div>
            <div :style="{ width: widths < 950 ? '100%' : widths < 1100 ? '49%' : '32%' }">
                <Transition name="slide-fade" mode="out-in">
                    <div class="brain" v-if="patientStore.details.natureOfInjury.noi_brain !== 'Y'">
                        <div class="flex align-content-center align-items-center mt-1">
                            <InputSwitch v-model="patientStore.details.natureOfInjury.noi_brain" trueValue="Y" falseValue="N" id="inputswitch" />
                            <label for="inputswitch" class="mx-2 font-bold">Traumatic Brain Injury</label>
                        </div>
                        <div v-if="patientStore.details.natureOfInjury.noi_brain == 'Y'" class="mt-1 ml-4">
                            <div class="flex column">
                                <div class="flex justify-content-between w-25rem">
                                    <label style="color: #000080" for="natureOfInjury.noi_brain_stg" class="text-s mt-1"><i>Severity Level</i></label>
                                    <div class="flex justify-content-end" v-if="patientStore.details.natureOfInjury.noi_brain_stg === ''">
                                        <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                    </div>
                                </div>
                            </div>
                            <Dropdown
                                id="natureOfInjury.noi_brain_stg"
                                v-model="patientStore.details.natureOfInjury.noi_brain_stg"
                                placeholder="Select Severity"
                                :options="libraryService.getBrainInjury()"
                                optionLabel="level_desc"
                                optionValue="level_code"
                                :class="{
                                    'p-inputtext-filled font-bold max-w-full w-25rem myCSS-inputtext-required text-s': true,
                                    'bg-white-100': !patientStore.details.natureOfInjury.noi_brain_stg
                                }"
                            />
                            <div v-if="patientStore.details.natureOfInjury.noi_brain_stg">
                                <label style="color: #000080" for="natureOfInjury.noi_braindtl" class="text-s mt-1">Specify</label>
                                <TextAreaPreAdmissionDoctor v-model:desc="patientStore.details.natureOfInjury.noi_braindtl" v-model:isMultiple="patientStore.details.multipleFields.multiple_traumatic_brain" />
                                <div class="flex justify-content-center w-25rem">
                                    <div class="flex justify-content-end" v-if="patientStore.details.natureOfInjury.noi_braindtl === ''">
                                        <small :class="'required-error'" class="text-red-800 text-s font-bold mt-1">Value is required</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_gunshot"
                    v-model:desc="patientStore.details.natureOfInjury.noi_gunshotdtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_gunshot"
                    label="Gunshot Wound"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_stab_wound"
                    v-model:desc="patientStore.details.natureOfInjury.noi_stab_wounddtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_stab"
                    label="Stab Wound"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_concussion"
                    v-model:desc="patientStore.details.natureOfInjury.noi_concussiondtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_concussion"
                    label="Concussion"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_contusion"
                    v-model:desc="patientStore.details.natureOfInjury.noi_contudtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_contusion"
                    label="Contusion"
                    :binary="true"
                />
            </div>
            <div :style="{ width: widths < 950 ? '100%' : widths < 1100 ? '49%' : '32%' }">
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_ope"
                    v-model:desc="patientStore.details.natureOfInjury.noi_fropdtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_open"
                    label="Fracture (Closed)"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_clo"
                    v-model:desc="patientStore.details.natureOfInjury.noi_frcldtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_closed"
                    label="Fracture (Open)"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_disl_open"
                    v-model:desc="patientStore.details.natureOfInjury.noi_disl_open_sp"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_dislocation_open"
                    label="Dislocation (Open)"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_disl_close"
                    v-model:desc="patientStore.details.natureOfInjury.noi_disl_close_sp"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_dislocation_closed"
                    label="Dislocation (Close)"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_punc"
                    v-model:desc="patientStore.details.natureOfInjury.noi_punc_sp"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_puncture"
                    label="Puncture"
                    :binary="true"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_others"
                    v-model:desc="patientStore.details.natureOfInjury.noi_otherinj"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_other"
                    label="Others"
                    :binary="true"
                />
            </div>

            <div class="line"></div>
            <div :class="noPhysical ? 'grid grid-cols-3 gap-2 mb-3 flex justify-content-evenly' : 'grid grid-cols-3 gap-2 flex justify-content-evenly'" style="width: 100%">
                <Transition name="slide-fade" mode="out-in">
                    <div v-if="patientStore.details.ExternalCauseOfInjury.vawc !== 'Y'" class="flex">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.vawc" trueValue="Y" falseValue="N" @click="focusElement('VAWCDropdown')" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 align-self-center font-bold"> VAWC </label>
                    </div>
                </Transition>
                <Transition name="slide-fade" mode="out-in">
                    <div v-if="patientStore.details.forTransportVehicularAccident.risk_none !== 'Y'">
                        <div class="flex">
                            <InputSwitch v-model="patientStore.details.forTransportVehicularAccident.risk_none" trueValue="Y" falseValue="N" id="inputswitch" @click="autoOpenFactor" />
                            <label for="inputswitch" class="mx-2 align-self-center font-bold" style="position: relative">
                                Contributing Factor
                                <i v-if="isCrashIncident" v-badge.danger="'required'" style="font-size: 2rem; position: absolute; top: -10px; right: 0px" v-tooltip.bottom="`Required when Road Crash Incident`" />
                                <i class="pi pi-info-circle text-blue-500" style="font-size: 1rem; cursor: pointer" v-tooltip.bottom="'Reasons that may have led to the incident'"></i>
                            </label>
                        </div>
                        <div class="flex justify-content-start mt-2" v-if="patientStore.details.forTransportVehicularAccident.risk_none === 'Y'">
                            <div
                                class="flex justify-content-end"
                                v-if="
                                    (patientStore.details.forTransportVehicularAccident.risk_alcliq === '' || patientStore.details.forTransportVehicularAccident.risk_alcliq !== 'Y') &&
                                    (patientStore.details.forTransportVehicularAccident.risk_sleep === '' || patientStore.details.forTransportVehicularAccident.risk_sleep !== 'Y') &&
                                    (patientStore.details.forTransportVehicularAccident.risk_smoke === '' || patientStore.details.forTransportVehicularAccident.risk_smoke !== 'Y') &&
                                    (patientStore.details.forTransportVehicularAccident.risk_mobpho === '' || patientStore.details.forTransportVehicularAccident.risk_mobpho !== 'Y') &&
                                    (patientStore.details.forTransportVehicularAccident.risk_other === '' || patientStore.details.forTransportVehicularAccident.risk_other !== 'Y') &&
                                    (patientStore.details.forTransportVehicularAccident.risk_not_applicable === '' || patientStore.details.forTransportVehicularAccident.risk_not_applicable !== 'Y')
                                "
                            >
                                <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                            </div>
                        </div>
                        <div v-if="patientStore.details.forTransportVehicularAccident.risk_none === 'Y'" class="flex flex-column mt-5">
                            <div
                                class="grid grid-cols-2 gap-1 flex justify-content-center"
                                style="width: 28rem"
                                :class="{
                                    'bg-white-100':
                                        patientStore.details.forTransportVehicularAccident.risk_alcliq !== 'Y' &&
                                        patientStore.details.forTransportVehicularAccident.risk_sleep !== 'Y' &&
                                        patientStore.details.forTransportVehicularAccident.risk_smoke !== 'Y' &&
                                        patientStore.details.forTransportVehicularAccident.risk_mobpho !== 'Y' &&
                                        patientStore.details.forTransportVehicularAccident.risk_othe !== 'Y'
                                }"
                            >
                                <div class="flex" style="width: 13rem">
                                    <InputSwitch id="alcohol" trueValue="Y" falseValue="N" v-model="patientStore.details.forTransportVehicularAccident.risk_alcliq" class="small-switch" />
                                    <label for="alcohol" class="ml-2 text-s">ALCOHOL/LIQUOR</label>
                                </div>
                                <div class="flex" style="width: 13rem">
                                    <InputSwitch id="sleepy" v-model="patientStore.details.forTransportVehicularAccident.risk_sleep" class="small-switch" trueValue="Y" falseValue="N" />
                                    <label for="sleepy" class="ml-2 text-s">SLEEPY</label>
                                </div>
                                <div class="flex" style="width: 13rem">
                                    <InputSwitch id="smoking" v-model="patientStore.details.forTransportVehicularAccident.risk_smoke" class="small-switch" trueValue="Y" falseValue="N" />
                                    <label for="smoking" class="ml-2 text-s">SMOKING</label>
                                </div>

                                <div class="flex" style="width: 13rem">
                                    <InputSwitch id="using_mobile" v-model="patientStore.details.forTransportVehicularAccident.risk_mobpho" class="small-switch" trueValue="Y" falseValue="N" />
                                    <label for="using_mobile" class="ml-2 text-s">USING MOBLIE</label>
                                </div>
                                <div class="flex" style="width: 13rem">
                                    <InputSwitch id="others" v-model="patientStore.details.forTransportVehicularAccident.risk_other" class="small-switch" trueValue="Y" falseValue="N" />
                                    <label for="others" class="ml-2 text-s">OTHERS</label>
                                </div>
                            </div>
                            <div class="flex column" v-if="patientStore.details.forTransportVehicularAccident.risk_other === 'Y'">
                                <div class="flex justify-content-start" v-if="patientStore.details.forTransportVehicularAccident.risk_etc_spec === ''">
                                    <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                </div>
                                <Textarea
                                    v-model="patientStore.details.forTransportVehicularAccident.risk_etc_spec"
                                    id="natureOfInjury.noi_burndtl"
                                    :class="{
                                        'p-inputtext-filled max-w-full mt-1 w-25rem myCSS-inputtext-required text-s font-bold': true,
                                        'bg-white-100': patientStore.details.forTransportVehicularAccident.risk_etc_spec === 'Y'
                                    }"
                                    autoresize
                                    style="text-transform: uppercase"
                                />
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
            <div class="flex justify-content-center absolute top-0">
                <InputSwitch v-model="patientStore.details.natureOfInjury.noi_no_physical" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="font-bold ml-2 mt-1"> NO EXTERNAL SIGN OF PHYSICAL INJURY </label>
            </div>
            <div v-if="noPhysical" class="bg-red-200 p-2 absolute bottom-0 text-center text-gray-700 font-semibold italic" style="border-radius: 0 0 1rem 1rem; width: 100%; font-size: 1rem; margin: 0 !important">Value is Required</div>
        </div>
    </div>
</template>

<style>
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
</style>
