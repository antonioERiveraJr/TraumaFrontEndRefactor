<script setup>
import { usePatientStore } from '../../../../../../store/injury/patientStore';
import InputTextCheckBoxDoctor from '../../../../../custom/inputTextCheckBoxDoctor.vue';
import LibraryService from '@/service/LibraryService';
import { ref, watch } from 'vue';
import BiteForm from '../../subForm/biteForm.vue';
import Swal from 'sweetalert2';
import VehicularAccidentForm from '../../subForm/vehicularAccidentForm.vue';
const patientStore = usePatientStore;
const libraryService = new LibraryService();
const burnDetails = libraryService.getBurnDetails();
const burnDetailsDoctor = libraryService.getBurnDetailsDoctor();
const drowningDetails = libraryService.getDrowningDetails();
const exposureDetails = libraryService.getExposureDetails();
const firecrackerDetails = libraryService.getFireCrackerDetails();
const openTransportVehicularDialog = ref(false);
const biteDialog = ref(false);
const props = defineProps({
    isDataLoaded: {
        required: true,
        default: false,
        type: Boolean
    }
});
const openBiteDialog = () => {
    biteDialog.value = true;
};

watch(
    () => patientStore?.details?.ExternalCauseOfInjury?.ext_bite,
    (newValue) => {
        if (newValue === 'Y') {
            openBiteDialog();
        }
    }
);

watch(
    () => openTransportVehicularDialog.value,
    async (newValue) => {
        if (!newValue && patientStore.details.forTransportVehicularAccident.pat_veh_sp === '' && patientStore.details.forTransportVehicularAccident.vehicle_code == '88') {
            await Swal.fire({
                icon: 'warning',
                title: 'INVALID INPUT',
                text: 'Please Fill in the Vehicles Involved - Patients Vehicle Specify Field',
                confirmButtonText: 'OK'
            });
            openTransportVehicularDialog.value = true;
        }
        if (!newValue && patientStore.details.forTransportVehicularAccident.etc_veh_sp === '' && patientStore.details.forTransportVehicularAccident.etc_veh == '88') {
            await Swal.fire({
                icon: 'warning',
                title: 'INVALID INPUT',
                text: 'Please Fill in the Vehicles Involved - Other Vehicle Specify Field',
                confirmButtonText: 'OK'
            });
            openTransportVehicularDialog.value = true;
        }
        if (!newValue && patientStore.details.forTransportVehicularAccident.pos_pat_sp === '' && patientStore.details.forTransportVehicularAccident.position_code == '88') {
            await Swal.fire({
                icon: 'warning',
                title: 'INVALID INPUT',
                text: 'Please Fill in the Position of Patient in Vehicle Specify Field',
                confirmButtonText: 'OK'
            });
            openTransportVehicularDialog.value = true;
        }
    }
);
</script>

<template>
    <div style="width: 100%" v-if="props.isdataLoaded">
        <Transition name="slide-fade" mode="out-in">
            <div class="flex flex-column rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_bite === 'Y'" style="border: 2px dashed #808080">
                <div
                    v-if="
                        patientStore?.details?.ExternalCauseOfInjury?.ext_bite === 'Y' &&
                        (patientStore?.details?.ExternalCauseOfInjury?.ext_bite_sp === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.dogbiteDegree === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.bleeding === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.bitingAnimal === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.observation === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.first_aid_code === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.washingDone === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.previousARV === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.tetanusVaccination === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.allergies === '' ||
                            patientStore?.details?.ExternalCauseOfInjury?.adverseReaction === '' ||
                            (patientStore?.details?.ExternalCauseOfInjury?.hrig !== 'Y' &&
                                patientStore?.details?.ExternalCauseOfInjury?.pvrv !== 'Y' &&
                                patientStore?.details?.ExternalCauseOfInjury?.pcec !== 'Y' &&
                                patientStore?.details?.ExternalCauseOfInjury?.erig !== 'Y' &&
                                patientStore?.details?.ExternalCauseOfInjury?.ats !== 'Y' &&
                                patientStore?.details?.ExternalCauseOfInjury?.tt !== 'Y' &&
                                patientStore?.details?.ExternalCauseOfInjury?.vaccine_none !== 'Y') ||
                            (patientStore?.details?.ExternalCauseOfInjury?.hrig === 'Y' && patientStore?.details?.ExternalCauseOfInjury?.hrig_num === '') ||
                            (patientStore?.details?.ExternalCauseOfInjury?.erig === 'Y' && patientStore?.details?.ExternalCauseOfInjury?.erig_num === '') ||
                            (patientStore?.details?.ExternalCauseOfInjury?.ats === 'Y' && patientStore?.details?.ExternalCauseOfInjury?.ats_num === '') ||
                            (patientStore?.details?.ExternalCauseOfInjury?.pvrv === 'Y' && patientStore?.details?.ExternalCauseOfInjury?.pvrv_site_2 !== 'Y' && patientStore?.details?.ExternalCauseOfInjury?.pvrv_site_4 !== 'Y') ||
                            (patientStore?.details?.ExternalCauseOfInjury?.pcec === 'Y' && patientStore?.details?.ExternalCauseOfInjury?.pcec_site_2 !== 'Y' && patientStore?.details?.ExternalCauseOfInjury?.pcec_site_4 !== 'Y'))
                    "
                    class="flex justify-content-end"
                    style="width: 10rem"
                >
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="flex justify-content-between">
                    <div class="bite flex align-content-center mt-1">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_bite" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 align-self-center font-bold"> Bite/Sting </label>
                    </div>
                    <i @click="openBiteDialog" class="badge-button">
                        <div class="bite-details-container">
                            <strong>BITE DETAILS</strong>
                        </div>
                    </i>
                </div>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="burns rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_burn_r == 'Y'" style="border: 2px dashed #808080">
                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_bite === 'Y' && patientStore?.details?.ExternalCauseOfInjury?.ref_burn_code === ''" class="flex justify-content-end" style="width: 10rem">
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="burn flex align-content-center mt-1">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_r" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 align-self-center font-bold"> Burns </label>
                </div>
                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_burn_r == 'Y'" class="mt-1 ml-4">
                    <Dropdown
                        id="ExternalCauseOfInjury.ref_burn_code"
                        required
                        v-model="patientStore.details.ExternalCauseOfInjury.ref_burn_code"
                        placeholder="Select Burn Type"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore?.details?.ExternalCauseOfInjury?.ref_burn_code }"
                        :options="burnDetails"
                        optionLabel="ref_burn_desc"
                        optionValue="ref_burn_code"
                        style="width: 100%"
                    />
                    <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ref_burn_code == '06'">
                        <div class="flex">
                            <label style="color: #000080" for="ExternalCauseOfInjury.ext_burn_sp " class="text-xs"><i>Specify</i></label>
                        </div>
                        <div class="flex justify-content-center" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_burn_sp === ''">
                            <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                        </div>
                        <Textarea
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_sp"
                            id="ExternalCauseOfInjury.ext_burn_sp"
                            class="p-inputtext-filled font-bold max-w-full mt-1myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase; width: 100%"
                        />
                    </div>
                </div>
            </div>
        </Transition>

        <Transition name="slide-fade" mode="out-in">
            <div class="burns rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_burn_r_doctor == 'Y'" style="border: 2px dashed #808080">
                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_burn_r_doctor === 'Y' && patientStore?.details?.ExternalCauseOfInjury?.ref_burn_code_doctor === ''" class="flex justify-content-end" style="width: 10rem">
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="burn flex align-content-center mt-1">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 align-self-center font-bold"> Burns </label>
                </div>
                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_burn_r_doctor == 'Y'" class="mt-1 ml-4">
                    <Dropdown
                        id="ExternalCauseOfInjury.ref_burn_code_doctor"
                        required
                        v-model="patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor"
                        placeholder="Select Burn Type"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore?.details?.ExternalCauseOfInjury?.ref_burn_code_doctor }"
                        :options="burnDetailsDoctor"
                        optionLabel="ref_burn_desc"
                        optionValue="ref_burn_code"
                        style="width: 100%"
                    />
                    <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ref_burn_code_doctor == '92'">
                        <div class="flex">
                            <label style="color: #000080" for="ExternalCauseOfInjury.ext_burn_sp_doctor " class="text-xs"><i>Specify</i></label>
                        </div>
                        <div class="flex justify-content-center" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_burn_sp_doctor === ''">
                            <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                        </div>
                        <Textarea
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_sp_doctor"
                            id="ExternalCauseOfInjury.ext_burn_sp_doctor"
                            class="p-inputtext-filled font-bold max-w-full mt-1myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase; width: 100%"
                        />
                    </div>
                </div>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_chem" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_chem_sp" label="Chemical Substance" :binary="true" />
        <Transition name="slide-fade" mode="out-in">
            <div class="drowns rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_drown_r == 'Y'" style="border: 2px dashed #808080">
                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_drown_r == 'Y' && patientStore?.details?.ExternalCauseOfInjury?.ref_drowning_cope === ''" class="flex justify-content-end mb-1" style="width: 10rem">
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="flex jsutify-content-between">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_drown_r" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Drowning</label>
                </div>

                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_drown_r == 'Y'" class="mt-1 ml-4">
                    <Dropdown
                        id="ExternalCauseOfInjury.ext_expo_nature_r"
                        required
                        v-model="patientStore.details.ExternalCauseOfInjury.ref_drowning_cope"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore?.details?.ExternalCauseOfInjury?.ref_drowning_cope }"
                        placeholder="Please select"
                        :options="drowningDetails"
                        optionLabel="ref_drowning_desc"
                        optionValue="ref_drowning_cope"
                        style="width: 100%"
                    />
                    <div class="flex mr-5" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_drown_sp === '' && patientStore?.details?.ExternalCauseOfInjury?.ext_drown_r == 'Y'">
                        <i v-if="patientStore?.details?.ExternalCauseOfInjury?.ref_drowning_cope == '06'" v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ref_drowning_cope == '06'">
                        <Textarea
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_drown_sp"
                            id="ExternalCauseOfInjury.ext_drown_sp"
                            class="p-inputtext-filled font-bold max-w-full mt-1 flex myCSS-inputtext-required text-xs"
                            autoresize
                            placeholder="Specify"
                            style="text-transform: uppercase; width: 100%"
                        />
                    </div>
                </div>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="exposure rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_expo_nature_r == 'Y'" style="border: 2px dashed #808080">
                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ref_expnature_code === '' && patientStore?.details?.ExternalCauseOfInjury?.ext_expo_nature_r === 'Y'" class="flex justify-content-end mb-2" style="width: 10rem">
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="flex jsutify-content-between">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Exposure to Forces of Nature</label>
                </div>

                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_expo_nature_r == 'Y'" class="mt-1 ml-4">
                    <Dropdown
                        id="ExternalCauseOfInjury.ext_expo_nature_r"
                        required
                        v-model="patientStore.details.ExternalCauseOfInjury.ref_expnature_code"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore?.details?.ExternalCauseOfInjury?.ref_expnature_code }"
                        placeholder="Please select"
                        :options="exposureDetails"
                        style="width: 100%"
                        optionLabel="ref_expnature_desc"
                        optionValue="ref_expnature_code"
                        class="p-inputtext-filled font-bold max-w-full myCSS-inputtext-required"
                    />

                    <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ref_expnature_code == '07'">
                        <div class="flex">
                            <label style="color: #000080" for="ExternalCauseOfInjury.ext_expo_nature_sp " class="text-xs"><i>Specify</i></label>
                        </div>
                        <div class="flex justify-content-center" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_expo_nature_sp === ''">
                            <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                        </div>
                        <Textarea
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp"
                            id="ExternalCauseOfInjury.noi_burndtl"
                            class="p-inputtext-filled font-bold max-w-full mt-1 myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase; width: 100%"
                        />
                    </div>
                </div>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_fall" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_falldtl" label=" Fall" :binary="true" />
        <Transition name="slide-fade" mode="out-in">
            <div class="firecrackers rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_firecracker_r == 'Y'" style="border: 2px dashed #808080">
                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_firecracker_r == 'Y' && patientStore?.details?.ExternalCauseOfInjury?.firecracker_code === ''" class="flex justify-content-end mb-2" style="width: 10rem">
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="flex jsutify-content-between">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_firecracker_r" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Firecracker</label>
                </div>
                <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_firecracker_r == 'Y'" class="mt-1 ml-4">
                    <Dropdown
                        id="ExternalCauseOfInjury.firecracker_code"
                        required
                        v-model="patientStore.details.ExternalCauseOfInjury.firecracker_code"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore?.details?.ExternalCauseOfInjury?.firecracker_code }"
                        placeholder="Please select"
                        :options="firecrackerDetails"
                        optionLabel="firecracker_desc"
                        style="width: 100%"
                        optionValue="firecracker_code"
                    />
                    <div class="flex mr-5" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_firecracker_sp === ''">
                        <i v-if="patientStore?.details?.ExternalCauseOfInjury?.firecracker_code == '88'" v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div v-if="patientStore?.details?.ExternalCauseOfInjury?.firecracker_code == '88'">
                        <Textarea
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp"
                            id="ExternalCauseOfInjury.ext_firecracker_sp"
                            class="p-inputtext-filled font-bold max-w-full mt-1 myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase; width: 100%"
                        />
                    </div>
                </div>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor
            :isExternal="true"
            v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_foreign_body"
            v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_foreign_body_sp"
            label="Foreign Body Ingestion"
            :binary="true"
        />

        <InputTextCheckBoxDoctor
            :isExternal="true"
            v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion"
            v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion_sp"
            label="Caustic Ingestion"
            :binary="true"
        />
        <InputTextCheckBoxDoctor :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_encavement" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_encavement_sp" label="Encavement" :binary="true" />
        <InputTextCheckBoxDoctor :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_crushing" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_crushing_sp" label="Crushing" :binary="true" />
        <InputTextCheckBoxDoctor :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_stab_wound" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_stab_wound_sp" label="Stab Wound" :binary="true" />
        <InputTextCheckBoxDoctor :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_sharp" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_sharp_sp" label=" Contact with sharp objects" :binary="true" />
        <InputTextCheckBoxDoctor
            :isExternal="true"
            v-model:modelValue="patientStore.details.ExternalCauseOfInjury.contact_blurt"
            v-model:desc="patientStore.details.ExternalCauseOfInjury.contact_blurt_sp"
            label="Contact with Blunt Object"
            :binary="true"
        />

        <Transition name="slide-fade" mode="out-in">
            <div class="htd flex align-content-center mt-1 rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_vape === 'Y'" style="border: 2px dashed #808080">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_vape" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Vapor/HTD Product </label>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_gun" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_gun_sp" label="Gunshot" :binary="true" />
        <Transition name="slide-fade" mode="out-in">
            <div class="hang flex align-content-center mt-1 rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_hang === 'Y'" style="border: 2px dashed #808080">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_hang" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Hanging/Strangulation </label>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="mauling mt-1 rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_battery === 'Y'" style="border: 2px dashed #808080">
                <div class="flex justify-content-between" style="width: 100%">
                    <div class="flex">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_battery" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="font-bold ml-2 mt-1"> Battery</label>
                    </div>
                    <strong style="color: blue; font-style: italic">Battery involves intentional physical contact causing harm.</strong>
                </div>
                <div v-if="patientStore.details.generalData.perpetrator === 'Y'" style="width: 98%" class="mt-1 ml-4">
                    <div class="flex column">
                        <div class="flex justify-content-between" style="width: 100%">
                            <label style="color: #000080" for="perpetratorRelationships" class="text-s mt-1"><i>Relationship</i></label>
                        </div>
                        <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_battery === 'Y' && patientStore.details.generalData.perpetrator_sp === ''" class="flex justify-content-end" style="width: 10rem">
                            <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                        </div>
                    </div>
                    <Dropdown
                        id="perpetratorRelationships"
                        class="font-bold mr-5"
                        v-model="patientStore.details.generalData.perpetrator_sp"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.generalData.perpetrator_sp }"
                        placeholder="Relationship to Perpetrator"
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
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="mauling mt-1 rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_assault === 'Y'" style="border: 2px dashed #808080">
                <div style="width: 100%" class="flex justify-content-between">
                    <div class="flex">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_assault" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="font-bold ml-2 mt-1"> Assault</label>
                    </div>
                    <strong style="color: blue; font-style: italic">
                        Assault is an act that creates fear of imminent harm or injury.
                        <span style="color: red">(Use Battery when it involves intentional harmful physical contact.)</span>
                    </strong>
                </div>
                <div v-if="patientStore.details.generalData.perpetrator === 'Y'" style="width: 98%" class="mt-1 ml-4">
                    <div class="flex column">
                        <div class="flex justify-content-between" style="width: 100%">
                            <label style="color: #000080" for="perpetratorRelationships" class="text-s mt-1"><i>Relationship</i></label>
                        </div>
                        <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_assault === 'Y' && patientStore.details.generalData.perpetrator_sp === ''" class="flex justify-content-end" style="width: 10rem">
                            <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                        </div>
                    </div>
                    <Dropdown
                        id="perpetratorRelationships"
                        class="font-bold mr-5"
                        v-model="patientStore.details.generalData.perpetrator_sp"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.generalData.perpetrator_sp }"
                        placeholder="Relationship to Perpetrator"
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
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="flex flex-column rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_transport === 'Y'" style="border: 2px dashed #808080">
                <div
                    v-if="
                        patientStore.details.forTransportVehicularAccident.vehicle_type_id === '' &&
                        patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code === '' &&
                        patientStore.details.forTransportVehicularAccident.vehicle_code === ''
                    "
                    class="flex justify-content-end"
                    style="width: 10rem"
                >
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="flex justify-content-between">
                    <div class="bite flex align-content-center mt-1">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_transport" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 align-self-center font-bold"> Road Crash Incident </label>
                    </div>
                    <i class="badge-button">
                        <div class="details-container" @click="openTransportVehicularDialog = true">
                            <strong>REPORT</strong>
                        </div>
                    </i>
                </div>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="mauling flex align-content-center mt-1 rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_neglect === 'Y'" style="border: 2px dashed #808080">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_neglect" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Neglect </label>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="mauling mt-1 rainbow-border" v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_sexual === 'Y'" style="border: 2px dashed #808080">
                <div style="width: 100%">
                    <div class="flex">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_sexual" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="font-bold ml-2 mt-1"> Sexual Abuse</label>
                    </div>
                </div>
                <div v-if="patientStore.details.generalData.perpetrator === 'Y'" style="width: 98%" class="mt-1 ml-4">
                    <div class="flex column">
                        <div class="flex justify-content-between" style="width: 100%">
                            <label style="color: #000080" for="perpetratorRelationships" class="text-s mt-1"><i>Relationship</i></label>
                        </div>
                        <div v-if="patientStore?.details?.ExternalCauseOfInjury?.ext_sexual === 'Y' && patientStore.details.generalData.perpetrator_sp === ''" class="flex justify-content-end" style="width: 10rem">
                            <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                        </div>
                    </div>
                    <Dropdown
                        id="perpetratorRelationships"
                        class="font-bold mr-5"
                        v-model="patientStore.details.generalData.perpetrator_sp"
                        :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.generalData.perpetrator_sp }"
                        placeholder="Relationship to Perpetrator"
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
            </div>
        </Transition>
        <InputTextCheckBoxDoctor :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_other" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_other_sp" label="Others, (Specify)" :binary="true" /> -->
    </div>
    <Dialog v-model:visible="biteDialog" modal header="ANIMAL BITE FORM" :style="{ width: '98%', height: '90vh' }">
        <BiteForm />
    </Dialog>
    <Dialog v-model:visible="openTransportVehicularDialog" @hide="openTransportVehicularDialog = false" style="width: 65%">
        <template #header>
            <div class="flex justify-content-center" style="width: 100%">
                <h1 class="font-bold" style="color: #000080">Road Crash Incident Report</h1>
            </div>
        </template>
        <VehicularAccidentForm />
    </Dialog>
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

.rainbow-border {
    border: 3px solid transparent;
    margin: 3px;
    border-radius: 3px;
    padding: 3px;
    background-color: #f9f9f9;
}
</style>
