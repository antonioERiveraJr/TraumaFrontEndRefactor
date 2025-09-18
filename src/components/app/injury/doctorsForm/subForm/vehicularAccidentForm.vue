<script setup>
import { usePatientStore } from '../../../../../store/injury/patientStore';
import { ref, watch, onMounted } from 'vue';
import LibraryService from '@/service/LibraryService';
import CheckBoxMultiple from '@/components/custom/checkBoxMultiple.vue';

const libraryService = new LibraryService();
const patientStore = usePatientStore();
const vehicleTypes = libraryService.getVehicleTypes();
const collisionTypes = libraryService.getCollisionTypes();
const positions = libraryService.getPositions();
const landVehicles = libraryService.getLandVehicles();
const airVehicles = libraryService.getAirVehicles();
const waterVehicles = libraryService.getWaterVehicles();

// Reactive references for vehicle type
const vehicleCodes = ref([]);
const loadVehicles = (vehicle_type_id) => {
    switch (vehicle_type_id) {
        case '01':
            vehicleCodes.value = landVehicles;
            break;
        case '02':
            vehicleCodes.value = waterVehicles;
            break;
        case '03':
            vehicleCodes.value = airVehicles;
            break;
        default:
            vehicleCodes.value = [];
            break;
    }
};
watch(
    () => patientStore.details.forTransportVehicularAccident.vehicle_type_id,
    (value) => {
        loadVehicles(value);
    }
);
onMounted(async () => {
    loadVehicles(patientStore.details.forTransportVehicularAccident.vehicle_type_id);
});
</script>
<template>
    <div style="width: 100%">
        <div style="width: 100%" class="rainbow-border bg-green-100">
            <div class="flex flex-column mb-3">
                <div class="flex justify-content-between w-1/2 md:w-1/2">
                    <strong style="color: #000080">Transport Type</strong>
                </div>
                <div v-if="patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.details.ExternalCauseOfInjury.ext_bite_sp === ''" style="width: 96%">
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" class="flex justify-content-end" />
                </div>
                <Dropdown
                    id="ExternalCauseOfInjury.ext_transport"
                    required
                    v-model="patientStore.details.forTransportVehicularAccident.vehicle_type_id"
                    placeholder="Please select"
                    :options="vehicleTypes"
                    optionLabel="vehicle_type_desc"
                    optionValue="vehicle_type_id"
                />
            </div>
            <div class="flex flex-column mb-3">
                <div class="flex justify-content-between w-1/2 md:w-1/2">
                    <strong style="color: #000080">Collision Type</strong>
                </div>
                <Dropdown
                    id="ExternalCauseOfInjury.ref_veh_acctype_code"
                    required
                    v-model="patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code"
                    placeholder="Please select"
                    :options="collisionTypes"
                    optionLabel="ref_veh_acctype_desc"
                    optionValue="ref_veh_acctype_code"
                />
            </div>
            <div class="flex flex-column mb-3">
                <div class="flex justify-content-between w-1/2 md:w-1/2">
                    <strong style="color: #000080">Vehicles Involved - Patient's Vehicle</strong>
                </div>
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
                    <div class="flex">
                        <label style="color: #000080" for="forTransportVehicularAccident.pat_veh_sp" class="text-xs"><i>Specify</i></label>
                    </div>
                    <div class="flex justify-content-center" v-if="patientStore.details.forTransportVehicularAccident.pat_veh_sp === ''">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 90%" />
                    </div>
                    <Textarea
                        v-model="patientStore.details.forTransportVehicularAccident.pat_veh_sp"
                        id="forTransportVehicularAccident.pat_veh_sp"
                        class="p-inputtext-filled font-bold max-w-full mt-1 myCSS-inputtext-required text-xs"
                        autoresize
                        style="text-transform: uppercase; width: 100%"
                    />
                </div>
            </div>
            <div class="flex flex-column mb-3" v-if="patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code == '10'">
                <div class="flex justify-content-between w-1/2 md:w-1/2">
                    <strong style="color: #000080">Vehicles Involved - Other Vehicle</strong>
                </div>
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
                    <div class="flex">
                        <label style="color: #000080" for="forTransportVehicularAccident.etc_veh_sp" class="text-xs"><i>Specify</i></label>
                    </div>
                    <div class="flex justify-content-center" v-if="patientStore.details.forTransportVehicularAccident.etc_veh_sp === ''">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 90%" />
                    </div>
                    <Textarea
                        v-model="patientStore.details.forTransportVehicularAccident.etc_veh_sp"
                        id="forTransportVehicularAccident.etc_veh_sp"
                        class="p-inputtext-filled font-bold max-w-full mt-1 myCSS-inputtext-required text-xs"
                        autoresize
                        style="text-transform: uppercase; width: 100%"
                    />
                </div>
            </div>
            <div class="flex flex-column mb-3">
                <div class="flex justify-content-between w-1/2 md:w-1/2">
                    <strong style="color: #000080">Position of Patient in Vehicle</strong>
                </div>
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
                    <div class="flex">
                        <label style="color: #000080" for="forTransportVehicularAccident.pos_pat_sp" class="text-xs"><i>Specify</i></label>
                    </div>
                    <div class="flex justify-content-center" v-if="patientStore.details.forTransportVehicularAccident.pos_pat_sp === ''">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 90%" />
                    </div>
                    <Textarea
                        v-model="patientStore.details.forTransportVehicularAccident.pos_pat_sp"
                        id="forTransportVehicularAccident.pos_pat_sp"
                        class="p-inputtext-filled font-bold max-w-full mt-1 myCSS-inputtext-required text-xs"
                        autoresize
                        style="text-transform: uppercase; width: 100%"
                    />
                </div>
            </div>
            <div style="border: 2px dashed #808080" class="flex flex-column rainbow-border bg-white-100" v-if="patientStore.details.forTransportVehicularAccident.risk_none === 'Y'">
                <div
                    v-if="
                        (patientStore.details.forTransportVehicularAccident.risk_alcliq === '' || patientStore.details.forTransportVehicularAccident.risk_alcliq === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.risk_sleep === '' || patientStore.details.forTransportVehicularAccident.risk_sleep === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.risk_smoke === '' || patientStore.details.forTransportVehicularAccident.risk_smoke === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.risk_mobpho === '' || patientStore.details.forTransportVehicularAccident.risk_mobpho === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.risk_other === '' || patientStore.details.forTransportVehicularAccident.risk_other === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.risk_not_applicable === '' || patientStore.details.forTransportVehicularAccident.risk_not_applicable === 'N')
                    "
                    class="flex justify-content-start"
                    style="width: 10rem"
                >
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>
                <div class="flex justify-content-between">
                    <label style="color: #000080" for="inputswitch" class="mx-2 align-self-center font-bold"> Contributing Factor </label>
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

            <div style="border: 2px dashed #808080" class="flex mt-4 flex-column rainbow-border bg-white-100" v-if="patientStore.details.forTransportVehicularAccident.safe_none === 'Y'">
                <div
                    v-if="
                        (patientStore.details.forTransportVehicularAccident.safe_unkn === '' || patientStore.details.forTransportVehicularAccident.safe_unkn === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.safe_airbag === '' || patientStore.details.forTransportVehicularAccident.safe_airbag === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.safe_helmet === '' || patientStore.details.forTransportVehicularAccident.safe_helmet === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.safe_cseat === '' || patientStore.details.forTransportVehicularAccident.safe_cseat === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.safe_sbelt === '' || patientStore.details.forTransportVehicularAccident.safe_sbelt === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.safe_vest === '' || patientStore.details.forTransportVehicularAccident.safe_vest === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.safe_other === '' || patientStore.details.forTransportVehicularAccident.safe_other === 'N') &&
                        (patientStore.details.forTransportVehicularAccident.safe_not_applicable === '' || patientStore.details.forTransportVehicularAccident.safe_not_applicable === 'N')
                    "
                    class="flex justify-content-start"
                    style="width: 10rem"
                >
                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                </div>

                <div class="flex justify-content-between">
                    <label style="color: #000080" for="inputswitch" class="mx-2 align-self-center font-bold"> Safety Gear and Measures </label
                    ><i style="color: red; font-style: italic"> Safety equipment of the patient that was used during the incident, depending on the vehicle type </i>
                </div>
                <div class="flex justify-content-center card">
                    <div class="grid grid-cols-4 gap-4">
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_helmet" label="HELMET" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_sbelt" label="SEAT BELT" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_airbag" label="AIRBAG" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_cseat" label="CHILD SEAT" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_vest" label="LIFE VEST" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_unkn" label="UNKNOWN" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_not_applicable" label="NONE" />
                        <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_other" label="OTHER" />
                        <div style="width: 100%" v-if="patientStore.details.forTransportVehicularAccident.safe_other === 'Y'">
                            <Textarea v-model="patientStore.details.forTransportVehicularAccident.safe_other_sp" placeholder="Please specify..." rows="1" resizable autoResize style="width: 100%" class="p-2 border rounded font-bold" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.rainbow-border {
    border: 6px solid transparent;
    border-image: linear-gradient(to right, hsl(30, 56%, 89%), #e8e8af, #96d996, #7171df, #bf8ee2, #c99cdc) 1;
    border-radius: 6px;
    padding: 6px;
    background-color: #f9f9f9;
}
</style>
