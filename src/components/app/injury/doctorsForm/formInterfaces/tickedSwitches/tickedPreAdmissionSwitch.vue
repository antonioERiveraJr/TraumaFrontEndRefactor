<script setup>
import { watch } from 'vue';
import { usePatientStore } from '../../../../../../store/injury/patientStore';
import InputTextCheckBoxDoctor from '../../../../../custom/inputTextCheckBoxDoctor.vue';
import LibraryService from '@/service/LibraryService';
const props = defineProps({
    dataIsLoaded: {
        required: true,
        default: false,
        type: Boolean
    }
});
const patientStore = usePatientStore();
const libraryService = new LibraryService();
watch(
    () => props.dataIsLoaded,
    (newValue) => {
        console.log(newValue);
    }
);
</script>

<template>
    <div v-if="props.dataIsLoaded">
        <div>
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_abrasion"
                v-model:desc="patientStore.details.natureOfInjury.noi_abradtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_abrasion"
                hint="Site and Laterality"
                label="Abrasion"
                :binary="true"
            />
        </div>

        <Transition name="slide-fade" mode="out-in">
            <div class="burns rainbow-border bg-white-100" v-if="patientStore?.details?.natureOfInjury?.noi_burn_r === 'Y'" style="border: 2px dashed #808080">
                <div v-if="!burnDegreeValue" class="flex justify-content-end mb-2" style="width: 10rem">
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="flex jsutify-content-between">
                    <InputSwitch v-model="patientStore.details.natureOfInjury.noi_burn_r" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Burn</label>
                </div>
                <div v-if="patientStore?.details?.natureOfInjury?.noi_burn_r == 'Y'" class="mt-1 ml-4">
                    <div class="flex column">
                        <div class="flex justify-content-between" style="width: 100%">
                            <label style="color: #000080" for="natureOfInjury.burnDegrees" class="text-s mt-1"><i>Burn Degree</i></label>
                        </div>
                    </div>
                    <Dropdown
                        id="natureOfInjury.burnDegrees"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !burnDegreeValue }"
                        v-model="burnDegreeValue"
                        placeholder="Select Burn Type"
                        :options="burnDegrees"
                        optionLabel="degree_burn_desc"
                        optionValue="degree_burn"
                        style="width: 100%"
                    />
                    <div v-if="burnDegreeValue">
                        <div>
                            <div class="flex justify-content-start mt-2" style="width: 100%">
                                <div class="flex justify-content-start" v-if="patientStore?.details?.natureOfInjury?.noi_burndtl === ''"><i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 8rem" /></div>
                            </div>
                            <label style="color: #000080" for="natureOfInjury.noi_burndtl" class="text-s mt-1"><i>Specify</i></label>
                        </div>
                        <Transition name="slide-fade" mode="out-in">
                            <TextAreaPreAdmissionDoctor v-model:desc="patientStore.details.natureOfInjury.noi_burndtl" v-model:isMultiple="patientStore.details.multipleFields.multiple_burn" style="width: 100%" />
                        </Transition>
                    </div>
                </div>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_avulsion"
            v-model:desc="patientStore.details.natureOfInjury.noi_avuldtl"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_avulsion"
            hint="Site and Laterality"
            label="Avulsion"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_owound"
            v-model:desc="patientStore.details.natureOfInjury.noi_owoudtl"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_laceration"
            hint="Site and Laterality"
            label="Laceration"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_incision"
            v-model:desc="patientStore.details.natureOfInjury.noi_incision_sp"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_incision"
            hint="Site and Laterality"
            label="Incision"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_amp"
            v-model:desc="patientStore.details.natureOfInjury.noi_ampdtl"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_traumatic_amputation"
            hint="Site and Laterality"
            label="Traumatic Amputation"
            :binary="true"
        />
        <Transition name="slide-fade" mode="out-in">
            <div class="brain bg-white-100 rainbow-border" v-if="patientStore?.details?.natureOfInjury?.noi_brain === 'Y'" style="border: 2px dashed #808080">
                <div class="flex align-content-center align-items-center mt-1">
                    <InputSwitch v-model="patientStore.details.natureOfInjury.noi_brain" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Traumatic Brain Injury</label>
                </div>
                <div v-if="patientStore?.details?.natureOfInjury?.noi_brain == 'Y'" class="mt-1 ml-4">
                    <div class="flex column">
                        <div class="flex justify-content-between" style="width: 100%">
                            <label style="color: #000080" for="natureOfInjury.noi_brain_stg" class="text-s mt-1"><i>Severity Level</i></label>
                            <div class="flex mr-5" v-if="patientStore?.details?.natureOfInjury?.noi_brain_stg === ''">
                                <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 10rem" />
                            </div>
                        </div>
                    </div>
                    <Dropdown
                        id="natureOfInjury.noi_brain_stg"
                        v-model="patientStore.details.natureOfInjury.noi_brain_stg"
                        placeholder="Select Severity Level"
                        :options="libraryService.getBrainInjury()"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.natureOfInjury.noi_brain_stg }"
                        optionLabel="level_desc"
                        style="width: 100%"
                        optionValue="level_code"
                    />
                    <div v-if="patientStore?.details?.natureOfInjury?.noi_brain_stg">
                        <div>
                            <div class="flex justify-content-start mr-5" v-if="patientStore?.details?.natureOfInjury?.noi_braindtl === ''"><i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 8rem" /></div>

                            <label style="color: #000080" for="natureOfInjury.noi_braindtl" class="text-s mt-1">Specify</label>
                        </div>

                        <Transition name="slide-fade" mode="out-in">
                            <TextAreaPreAdmissionDoctor v-model:desc="patientStore.details.natureOfInjury.noi_braindtl" v-model:isMultiple="patientStore.details.multipleFields.multiple_traumatic_brain" />
                        </Transition>
                    </div>
                </div>
                <h4 style="color: #000080" class="font-bold flex justify-content-center">GCS</h4>
                <div>
                    <div>
                        <div class="flex flex-wrap justify-content-center">
                            <Dropdown
                                id="patientStore.details.hospitalFacilityData.gcs_eye"
                                class="m-1 mt-2"
                                v-model="patientStore.details.hospitalFacilityData.gcs_eye"
                                placeholder="Eye Opening Response"
                                :options="libraryService.getGCS().filter((option) => option.behavior === '1')"
                                optionLabel="formattedLabel"
                                :style="{ width: width < 1500 ? '100%' : '30%' }"
                                optionValue="score"
                                :class="{
                                    'p-inputtext-filled font-bold  myCSS-inputtext-required text-s': true,
                                    'bg-white-100': !patientStore.details.hospitalFacilityData.gcs_eye
                                }"
                            />
                            <Dropdown
                                id="patientStore.details.hospitalFacilityData.gcs_verbal"
                                class="m-1"
                                v-model="patientStore.details.hospitalFacilityData.gcs_verbal"
                                placeholder="Best Verbal Response"
                                :options="libraryService.getGCS().filter((option) => option.behavior === '2')"
                                optionLabel="formattedLabel"
                                :style="{ width: width < 1500 ? '100%' : '30%' }"
                                optionValue="score"
                                :class="{
                                    'p-inputtext-filled font-bold  myCSS-inputtext-required text-s': true,
                                    'bg-white-100': !patientStore.details.hospitalFacilityData.gcs_verbal
                                }"
                            />
                            <div :style="{ width: width < 1500 ? '100%' : '30%' }">
                                <Dropdown
                                    id="patientStore.details.hospitalFacilityData.gcs_motor"
                                    class="m-1"
                                    v-model="patientStore.details.hospitalFacilityData.gcs_motor"
                                    placeholder="Best Motor Response"
                                    :options="libraryService.getGCS().filter((option) => option.behavior === '3')"
                                    optionLabel="formattedLabel"
                                    style="width: 100%"
                                    optionValue="score"
                                    :class="{
                                        'p-inputtext-filled font-bold  myCSS-inputtext-required text-s': true,
                                        'bg-white-100': !patientStore.details.hospitalFacilityData.gcs_motor
                                    }"
                                />
                                <div class="flex justify-content-center" v-if="patientStore.details.hospitalFacilityData.gcs_code === 'GLASGOW COMA SCALE' && !patientStore.details.hospitalFacilityData.gcs_score">
                                    <small class="text-red-800 text-s font-bold">Value is required</small>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Message class="flex justify-content-center" severity="success" v-if="gcsCodeScore > 12" :closable="false">{{ gcsCodeScore }}:Mild </Message>
                            <Message class="flex justify-content-center" v-if="gcsCodeScore > 8 && gcsCodeScore < 13" :closable="false">{{ gcsCodeScore }}: Moderate Client</Message>
                            <Message class="flex justify-content-center" severity="warn" v-if="gcsCodeScore < 9" :closable="false">{{ gcsCodeScore }}: Severe </Message>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_gunshot"
            v-model:desc="patientStore.details.natureOfInjury.noi_gunshotdtl"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_gunshot"
            hint="Site and Laterality"
            label="Gunshot Wound"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_stab_wound"
            v-model:desc="patientStore.details.natureOfInjury.noi_stab_wounddtl"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_stab"
            hint="Site and Laterality"
            label="Stab Wound"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_concussion"
            v-model:desc="patientStore.details.natureOfInjury.noi_concussiondtl"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_concussion"
            hint="Site and Laterality"
            label="Concussion"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_contusion"
            v-model:desc="patientStore.details.natureOfInjury.noi_contudtl"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_contusion"
            hint="Site and Laterality"
            label="Contusion"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_ope"
            v-model:desc="patientStore.details.natureOfInjury.noi_fropdtl"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_open"
            hint="Site and Laterality"
            label="Fracture (Closed)"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_clo"
            v-model:desc="patientStore.details.natureOfInjury.noi_frcldtl"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_closed"
            hint="Site and Laterality"
            label="Fracture (Open)"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_disl_open"
            v-model:desc="patientStore.details.natureOfInjury.noi_disl_open_sp"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_dislocation_open"
            hint="Site and Laterality"
            label="Dislocation (Open)"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_disl_close"
            v-model:desc="patientStore.details.natureOfInjury.noi_disl_close_sp"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_dislocation_closed"
            hint="Site and Laterality"
            label="Dislocation (Close)"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_punc"
            v-model:desc="patientStore.details.natureOfInjury.noi_punc_sp"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_puncture"
            hint="Site and Laterality"
            label="Puncture"
            :binary="true"
        />
        <InputTextCheckBoxDoctor
            v-model:modelValue="patientStore.details.natureOfInjury.noi_others"
            v-model:desc="patientStore.details.natureOfInjury.noi_otherinj"
            v-model:isMultiple="patientStore.details.multipleFields.multiple_other"
            hint="Site and Laterality"
            label="Others"
            :binary="true"
        />
        <Transition name="slide-fade" mode="out-in">
            <div style="border: 2px dashed #808080" class="mauling flex flex-column mt-3 rainbow-border bg-white-100" v-if="patientStore.details.ExternalCauseOfInjury.vawc === 'Y'">
                <div class="flex justify-content-end"></div>
                <div class="flex justify-content-betweeen">
                    <div class="mauling flex align-content-center">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.vawc" trueValue="Y" falseValue="N" @click="focusElement('VAWCDropdown')" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 align-self-center font-bold"> VAWC </label>
                    </div>
                </div>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div style="border: 2px dashed #808080" class="flex flex-column rainbow-border bg-white-100" v-if="patientStore.details.forTransportVehicularAccident.risk_none === 'Y'">
                <div
                    v-if="
                        (patientStore.details.forTransportVehicularAccident.risk_alcliq === '' || patientStore.details.forTransportVehicularAccident.risk_alcliq !== 'Y') &&
                        (patientStore.details.forTransportVehicularAccident.risk_sleep === '' || patientStore.details.forTransportVehicularAccident.risk_sleep !== 'Y') &&
                        (patientStore.details.forTransportVehicularAccident.risk_smoke === '' || patientStore.details.forTransportVehicularAccident.risk_smoke !== 'Y') &&
                        (patientStore.details.forTransportVehicularAccident.risk_mobpho === '' || patientStore.details.forTransportVehicularAccident.risk_mobpho !== 'Y') &&
                        (patientStore.details.forTransportVehicularAccident.risk_other === '' || patientStore.details.forTransportVehicularAccident.risk_other !== 'Y') &&
                        (patientStore.details.forTransportVehicularAccident.risk_not_applicable === '' || patientStore.details.forTransportVehicularAccident.risk_not_applicable !== 'Y')
                    "
                    class="flex justify-content-end"
                    style="width: 10rem"
                >
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="flex justify-content-between">
                    <div class="bite flex align-content-center mt-1">
                        <InputSwitch v-model="patientStore.details.forTransportVehicularAccident.risk_none" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 align-self-center font-bold"> Contributing Factor </label>
                    </div>
                    <i style="color: blue; font-style: italic">Reasons that may have led to the incident</i>
                </div>
                <div class="flex justify-content-center card">
                    <div class="grid grid-cols-4 gap-4">
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_alcliq" label="ALCOHOL/LIQUOR" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_smoke" label="SMOKING" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_sleep" label="SLEEPY" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_mobpho" label="USING MOBILE" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_not_applicable" label="NONE" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_other" label="OTHER" />
                        <div style="width: 100%" v-if="patientStore.details.forTransportVehicularAccident.risk_other === 'Y'">
                            <Textarea v-model="patientStore.details.forTransportVehicularAccident.risk_etc_spec" placeholder="Please specify..." rows="1" resizable autoResize style="width: 100%" class="font-bold p-2 border rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
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
