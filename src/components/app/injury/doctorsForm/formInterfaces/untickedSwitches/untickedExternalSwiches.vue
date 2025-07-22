<script setup>
import { usePatientStore } from '../../../../../../store/injury/patientStore';
import InputTextCheckBoxDoctor2 from '../../../../../custom/inputTextCheckBoxDoctor2.vue';
import LibraryService from '@/service/LibraryService';
import { ref, watch, onMounted } from 'vue';
const libraryService = new LibraryService();
const burnDetailsDoctor = libraryService.getBurnDetailsDoctor();
const drowningDetails = libraryService.getDrowningDetails();
const exposureDetails = libraryService.getExposureDetails();
const firecrackerDetails = libraryService.getFireCrackerDetails();
const vehicleTypes = libraryService.getVehicleTypes();
const collisionTypes = libraryService.getCollisionTypes();
const positions = libraryService.getPositions();

const patientStore = usePatientStore();
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
    <div :style="{ width: widths < 950 ? '100%' : widths < 1600 ? '49%' : '24%' }">
        <Transition name="slide-fade" mode="out-in">
            <div class="flex flex-column" v-if="patientStore.details.ExternalCauseOfInjury.ext_bite !== 'Y'">
                <div class="flex justify-content-between items-center">
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.details.ExternalCauseOfInjury.ext_bite_sp === ''">
                        <small class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'">
                        <button @click="openBiteDialog" style="font-size: 8px; background: none; border: none; cursor: pointer">
                            <div class="bite-details-container">
                                <strong>BITE DETAILS</strong>
                            </div>
                        </button>
                    </div>
                </div>
                <div class="bite flex align-content-center mt-1">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_bite" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 align-self-center font-bold"> Bite/Sting </label>
                </div>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="burns" v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor !== 'Y'">
                <div class="flex align-content-center align-items-center mt-1">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Burns</label>
                </div>
                <div v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor == 'Y'" class="mt-1 ml-4">
                    <Dropdown
                        id="ExternalCauseOfInjury.ref_burn_code_doctor"
                        required
                        v-model="patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor"
                        placeholder="Select Burn Type"
                        :options="burnDetailsDoctor"
                        optionLabel="ref_burn_desc"
                        optionValue="ref_burn_code"
                    />
                    <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor === ''">
                        <small class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor == '06'">
                        <Textarea
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_sp_doctor"
                            id="ExternalCauseOfInjury.ext_burn_sp_doctor"
                            class="p-inputtext-filled font-bold max-w-full mt-1 w-25rem myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase"
                        />
                        <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_sp_doctor === ''">
                            <small class="text-red-800 text-xs font-bold">Value is required</small>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor2 v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_chem" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_chem_sp" label="Chemical Substance" :binary="true" />
        <Transition name="slide-fade" mode="out-in">
            <div class="drowns" v-if="patientStore.details.ExternalCauseOfInjury.ext_drown_r !== 'Y'">
                <div class="flex align-content-center align-items-center mt-1">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_drown_r" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Drowning</label>
                </div>

                <div v-if="patientStore.details.ExternalCauseOfInjury.ext_drown_r == 'Y'" class="mt-1 ml-4">
                    <Dropdown
                        id="ExternalCauseOfInjury.ext_expo_nature_r"
                        required
                        v-model="patientStore.details.ExternalCauseOfInjury.ref_drowning_cope"
                        placeholder="Please select"
                        :options="drowningDetails"
                        optionLabel="ref_drowning_desc"
                        optionValue="ref_drowning_cope"
                    />
                    <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_drown_r == 'Y' && patientStore.details.ExternalCauseOfInjury.ref_drowning_cope === ''">
                        <small class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ref_drowning_cope == '06'">
                        <Textarea
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_drown_sp"
                            id="ExternalCauseOfInjury.ext_drown_sp"
                            class="p-inputtext-filled font-bold max-w-full mt-1 w-25rem myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase"
                        />
                        <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_drown_sp === ''">
                            <small class="text-red-800 text-xs font-bold">Value is required</small>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="exposure" v-if="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r !== 'Y'">
                <div class="flex align-content-center align-items-center mt-1">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Exposure to Forces of Nature</label>
                </div>

                <div v-if="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r == 'Y'" class="mt-1 ml-4">
                    <Dropdown
                        id="ExternalCauseOfInjury.ext_expo_nature_r"
                        required
                        v-model="patientStore.details.ExternalCauseOfInjury.ref_expnature_code"
                        placeholder="Please select"
                        :options="exposureDetails"
                        optionLabel="ref_expnature_desc"
                        optionValue="ref_expnature_code"
                        class="p-inputtext-filled font-bold max-w-full w-25rem myCSS-inputtext-required"
                    />
                    <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ref_expnature_code === '' && patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r === 'Y'">
                        <small class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>

                    <div v-if="patientStore.details.ExternalCauseOfInjury.ref_expnature_code == '07'">
                        <Textarea
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp"
                            id="ExternalCauseOfInjury.noi_burndtl"
                            class="p-inputtext-filled font-bold max-w-full mt-1 w-25rem myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase"
                        />
                        <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp === ''">
                            <small class="text-red-800 text-xs font-bold">Value is required</small>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor2 v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_fall" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_falldtl" label=" Fall" :binary="true" />
    </div>

    <div :style="{ width: widths < 950 ? '100%' : widths < 1600 ? '49%' : '24%' }">
        <Transition name="slide-fade" mode="out-in">
            <div class="firecrackers" v-if="patientStore.details.ExternalCauseOfInjury.ext_firecracker_r !== 'Y'">
                <div class="flex align-content-center align-items-center mt-1">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_firecracker_r" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 font-bold">Firecracker</label>
                </div>

                <div v-if="patientStore.details.ExternalCauseOfInjury.ext_firecracker_r == 'Y'" class="mt-1 ml-4">
                    <Dropdown
                        id="ExternalCauseOfInjury.firecracker_code"
                        required
                        v-model="patientStore.details.ExternalCauseOfInjury.firecracker_code"
                        placeholder="Please select"
                        :options="firecrackerDetails"
                        optionLabel="firecracker_desc"
                        optionValue="firecracker_code"
                    />
                    <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_firecracker_r == 'Y' && patientStore.details.ExternalCauseOfInjury.firecracker_code === ''">
                        <small class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>

                    <div v-if="patientStore.details.ExternalCauseOfInjury.firecracker_code == '88'">
                        <Textarea
                            v-model="patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp"
                            id="ExternalCauseOfInjury.ext_firecracker_sp"
                            class="p-inputtext-filled font-bold max-w-full mt-1 w-25rem myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase"
                        />
                        <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp === ''">
                            <small class="text-red-800 text-xs font-bold">Value is required</small>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor2 v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_foreign_body" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_foreign_body_sp" label="Foreign Body Ingestion" :binary="true" />
        <InputTextCheckBoxDoctor2 v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion_sp" label="Caustic Ingestion" :binary="true" />
        <Transition name="slide-fade" mode="out-in">
            <div class="hang flex align-content-center mt-1" v-if="patientStore.details.ExternalCauseOfInjury.ext_hang !== 'Y'">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_hang" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Hanging/Strangulation </label>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor2 :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_crushing" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_crushing_sp" label="Crushing" :binary="true" />
        <InputTextCheckBoxDoctor2 :isExternal="true" v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_stab_wound" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_stab_wound_sp" label="Stab Wound" :binary="true" />
    </div>

    <div :style="{ width: widths < 950 ? '100%' : widths < 1600 ? '49%' : '24%' }">
        <InputTextCheckBoxDoctor2
            :isExternal="true"
            v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_sharp"
            v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_sharp_sp"
            label=" Contact with sharp objects"
            :binary="true"
        />
        <InputTextCheckBoxDoctor2
            :isExternal="true"
            v-model:modelValue="patientStore.details.ExternalCauseOfInjury.contact_blurt"
            v-model:desc="patientStore.details.ExternalCauseOfInjury.contact_blurt_sp"
            label="Contact with Blunt Object"
            :binary="true"
        />
        <Transition name="slide-fade" mode="out-in">
            <div class="htd flex align-content-center mt-1" v-if="patientStore.details.ExternalCauseOfInjury.ext_vape !== 'Y'">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_vape" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Vapor/HTD Product </label>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="gunshot flex align-content-center mt-1" v-if="patientStore.details.ExternalCauseOfInjury.ext_gun !== 'Y'">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_gun" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Gunshot </label>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="mauling flex align-content-center mt-1" v-if="patientStore.details.ExternalCauseOfInjury.ext_battery !== 'Y'">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_battery" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Battery </label>
                <i class="pi pi-info-circle text-blue-500 ml-2" style="cursor: pointer" v-tooltip="'Battery involves intentional physical contact causing harm.'"></i>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="mauling flex align-content-center mt-1" v-if="patientStore.details.ExternalCauseOfInjury.ext_assault !== 'Y'">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_assault" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Assault </label>
                <i class="pi pi-info-circle text-blue-500 ml-2" style="cursor: pointer" v-tooltip="'Assault is an act that creates fear of imminent harm or injury.'"></i>
            </div>
        </Transition>
    </div>

    <div :style="{ width: widths < 950 ? '100%' : widths < 1600 ? '49%' : '24%' }">
        <Transition name="slide-fade" mode="out-in">
            <div class="vehicularAccident" v-if="patientStore.details.ExternalCauseOfInjury.ext_transport !== 'Y'">
                <div class="vehicularAccident flex align-content-center mt-1">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_transport" trueValue="Y" falseValue="N" id="inputswitch" @click="autoOpenDialogTranspo" />
                    <label for="inputswitch" class="mx-2 align-self-center font-bold"> Road Crash Incident</label>
                </div>
                <div v-if="patientStore.details.ExternalCauseOfInjury.ext_transport == 'Y'" class="flex flex-wrap mt-1 ml-4">
                    <label for="preAdmissionData.ext_transport" class="text-xs" style="color: #000080">Transport Type</label>
                    <Dropdown
                        id="ExternalCauseOfInjury.ext_transport"
                        required
                        v-model="patientStore.details.forTransportVehicularAccident.vehicle_type_id"
                        placeholder="Please select"
                        :options="vehicleTypes"
                        optionLabel="vehicle_type_desc"
                        optionValue="vehicle_type_id"
                    />
                    <label for="preAdmissionData.ref_veh_acctype_code" class="text-xs" style="color: #000080">Collision Type</label>
                    <Dropdown
                        id="ExternalCauseOfInjury.ref_veh_acctype_code"
                        required
                        v-model="patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code"
                        placeholder="Please select"
                        :options="collisionTypes"
                        optionLabel="ref_veh_acctype_desc"
                        optionValue="ref_veh_acctype_code"
                    />
                    <label for="preAdmissionData.vehicle_code" class="text-xs" style="color: #000080">Vehicles Involved - Patient's Vehicle</label>
                    <Dropdown
                        id="forTransportVehicularAccident.vehicle_code"
                        required
                        v-model="patientStore.details.forTransportVehicularAccident.vehicle_code"
                        placeholder="Please select"
                        :options="vehicleCodes"
                        optionLabel="vehicle_desc"
                        optionValue="vehicle_code"
                    />
                    <div v-if="patientStore.details.forTransportVehicularAccident.vehicle_code == '88'" class="ml-3">
                        <label for="forTransportVehicularAccident.pat_veh_sp" class="text-xs" style="color: #000080">Specify</label>

                        <InputText
                            v-model="patientStore.details.forTransportVehicularAccident.pat_veh_sp"
                            id="forTransportVehicularAccident.pat_veh_sp"
                            placeholder=""
                            class="p-inputtext-filled font-bold max-w-full w-16rem mb-1 myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase"
                        />
                        <div class="flex justify-content-end" v-if="patientStore.details.forTransportVehicularAccident.pat_veh_sp === ''">
                            <small class="text-red-800 text-xs font -bold">Value is required</small>
                        </div>
                    </div>
                    <div v-if="patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code == '10'">
                        <label for="preAdmissionData.etc_veh" class="text-xs" style="color: #000080">Vehicles Involved - Other Vehicle</label>
                        <Dropdown
                            id="forTransportVehicularAccident.etc_veh"
                            required
                            v-model="patientStore.details.forTransportVehicularAccident.etc_veh"
                            placeholder="Please select"
                            :options="vehicleCodes"
                            optionLabel="vehicle_desc"
                            optionValue="vehicle_code"
                        />
                        <div v-if="patientStore.details.forTransportVehicularAccident.etc_veh == '88'" class="ml-3">
                            <label for="preAdmissionData.etc_veh" class="text-xs" style="color: #000080">Specify</label>
                            <InputText
                                v-model="patientStore.details.forTransportVehicularAccident.etc_veh_sp"
                                id="ExternalCauseOfInjury.etc_veh"
                                placeholder=""
                                class="p-inputtext-filled font-bold max-w-full w-23rem mb-1 myCSS-inputtext-required text-xs"
                                autoresize
                                style="text-transform: uppercase"
                            />
                            <div class="flex justify -content-end" v-if="patientStore.details.forTransportVehicularAccident.etc_veh_sp === ''">
                                <small class="text-red-800 text-xs font-bold">Value is required</small>
                            </div>
                        </div>
                    </div>

                    <label for="preAdmissionData.position_code" class="text-xs" style="color: #000080">Position of Patient in Vehicle</label>
                    <Dropdown
                        id="ExternalCauseOfInjury.position_code"
                        required
                        v-model="patientStore.details.forTransportVehicularAccident.position_code"
                        placeholder="Please select"
                        :options="positions"
                        optionLabel="position_desc"
                        optionValue="position_code"
                    />
                    <div class="ml-3" v-if="patientStore.details.forTransportVehicularAccident.position_code == '88'">
                        <label for="preAdmissionData.pos_pat_sp" class="text-xs" style="color: #000080">Specify</label>

                        <InputText
                            v-model="patientStore.details.forTransportVehicularAccident.pos_pat_sp"
                            id="ExternalCauseOfInjury.pos_pat_sp"
                            placeholder=""
                            class="p-inputtext-filled font-bold max-w-full w-23rem mb-1 myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase"
                        />
                        <div class="flex justify-content-end" v-if="patientStore.details.forTransportVehicularAccident.pos_pat_sp === ''">
                            <small class="text-red-800 text-xs font-bold">Value is required</small>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="mauling flex align-content-center mt-1" v-if="patientStore.details.ExternalCauseOfInjury.ext_neglect !== 'Y'">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_neglect" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Neglect </label>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div class="mauling flex align-content-center mt-1" v-if="patientStore.details.ExternalCauseOfInjury.ext_sexual !== 'Y'">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_sexual" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Sexual Abuse </label>
            </div>
        </Transition>
        <InputTextCheckBoxDoctor2 v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_other" v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_other_sp" label="Others, (Specify)" :binary="true" />
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
