<script setup>
import { usePatientStore } from '../../../../store/injury/patientStore';
import { onMounted, ref, watch } from 'vue';
import createValidationRules from '../../../../validation/injuryValidations';
import useVuelidate from '@vuelidate/core';
import LibraryService from '@/service/LibraryService';
import SaveBackRemovePanelButton from '../../../custom/SaveBackRemovePanelButton.vue';
import InputTextCheckBoxExternal from '../../../custom/inputTextCheckBoxExternal.vue';

const patientStore = usePatientStore();
const loading = ref(true);
const validationRules = createValidationRules();
const libraryService = new LibraryService();
const v$ = useVuelidate(validationRules, patientStore.details);
const burnDetails = libraryService.getBurnDetails();
const drowningDetails = libraryService.getDrowningDetails();
const exposureDetails = libraryService.getExposureDetails();
const firecrackerDetails = libraryService.getFireCrackerDetails();
const vehicleTypes = libraryService.getVehicleTypes();
const collisionTypes = libraryService.getCollisionTypes();
const positions = libraryService.getPositions();
const displayGeneratedDiagnosis = ref(false);
const landVehicles = libraryService.getLandVehicles();
const airVehicles = libraryService.getAirVehicles();
const waterVehicles = libraryService.getWaterVehicles();
const vehicleCodes = ref([]);
const generatedText = ref('');
const selectedBurnDegree = ref();
const unrecognizedFieldsPreview = ref(patientStore?.details?.ExternalCauseOfInjury?.ext_others_external_preview);
const getRequiredValidation = (field) => {
    return v$.value.$silentErrors.some((error) => error.$property === field);
};
const generateText = () => {
    let text = 'PREADMISSION DATA:\n';
    let text2 = '\nEXTERNAL CAUSE:\n';

    if (patientStore.details.natureOfInjury.degree_burn1 === 'Y') {
        selectedBurnDegree.value = '1';
    } else if (patientStore.details.natureOfInjury.degree_burn2 === 'Y') {
        selectedBurnDegree.value = '2';
    } else if (patientStore.details.natureOfInjury.degree_burn3 === 'Y') {
        selectedBurnDegree.value = '3';
    } else if (patientStore.details.natureOfInjury.degree_burn4 === 'Y') {
        selectedBurnDegree.value = '4';
    }
    if (patientStore.details.preAdmissionData.place_occ_code) {
        text += `Place of Occurrence: ${patientStore.details.preAdmissionData.place_occ_code};\n`;
    }
    if (patientStore.details.preAdmissionData.activity_code) {
        text += `Activity: ${patientStore.details.preAdmissionData.activity_code};\n`;
    }
    if (patientStore.details.preAdmissionData.first_aid_code) {
        text += `First Aid Given: ${patientStore.details.preAdmissionData.first_aid_code};\n`;
    }
    if (patientStore.details.preAdmissionData.firstaid_others) {
        text += `First Aid Details: ${patientStore.details.preAdmissionData.firstaid_others};\n`;
    }
    if (patientStore.details.preAdmissionData.firstaid_others2) {
        text += `First Aid Given By: ${patientStore.details.preAdmissionData.firstaid_others2};\n`;
    }
    if (patientStore.details.natureOfInjury.noi_abrasion === 'Y') {
        text += `Abrasion;`;
        if (patientStore.details.natureOfInjury.noi_abradtl) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_abradtl};`;
        }
        text += '\n';
    }
    if (patientStore.details.natureOfInjury.noi_burn_r === 'Y') {
        text += `Burns;`;

        // Retrieve burn degree details
        const burnDegreeDetails = libraryService.getBurnDegreeDetails(); // Assuming this method exists
        const burnDegreeOption = burnDegreeDetails.find((option) => option.degree_burn === selectedBurnDegree.value);
        const burnDegreeDescription = burnDegreeOption ? burnDegreeOption.degree_burn_desc : 'Not specified';

        text += ` Level: ${burnDegreeDescription};`;

        if (patientStore.details.natureOfInjury.noi_burndtl) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_burndtl};`;
        }
        text += '\n\n';
    }
    if (patientStore.details.natureOfInjury.noi_avulsion === 'Y') {
        text += `Avulsion;`;
        if (patientStore.details.natureOfInjury.noi_avuldtl) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_avuldtl};`;
        }
        text += '\n\n';
    }
    if (patientStore.details.natureOfInjury.noi_concussion === 'Y') {
        text += ` Concussion;`;
        if (patientStore.details.natureOfInjury.noi_concussiondtl) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_concussiondtl};`;
        }
        text += '\n\n';
    }
    if (patientStore.details.natureOfInjury.noi_contusion === 'Y') {
        text += ` Contusion;`;
        if (patientStore.details.natureOfInjury.noi_contudtl) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_contudtl};`;
        }
        text += '\n\n';
    }
    if (patientStore.details.natureOfInjury.noi_frac_ope === 'Y') {
        text += `Fracture (Closed);`;
        if (patientStore.details.natureOfInjury.noi_fropdtl) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_fropdtl};`;
        }
        text += '\n\n';
    }
    if (patientStore.details.natureOfInjury.noi_frac_clo === 'Y') {
        text += `Fracture (Open);`;
        if (patientStore.details.natureOfInjury.noi_frcldtl) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_frcldtl};`;
        }
        text += '\n\n';
    }
    if (patientStore.details.natureOfInjury.noi_owound === 'Y') {
        text += `Open Wound / Laceration;`;
        if (patientStore.details.natureOfInjury.noi_owoudtl) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_owoudtl};`;
        }
        text += '\n\n';
    }
    if (patientStore.details.natureOfInjury.noi_amp === 'Y') {
        text += `Traumatic Amputation;`;
        if (patientStore.details.natureOfInjury.noi_ampdtl) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_ampdtl};`;
        }
        text += '\n\n';
    }
    if (patientStore.details.natureOfInjury.noi_others === 'Y') {
        text += `Others;`;
        if (patientStore.details.natureOfInjury.noi_otherinj) {
            text += ` Details: ${patientStore.details.natureOfInjury.noi_otherinj};`;
        }
        text += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y') {
        text2 += `Bite/Sting;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_bite_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_bite_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_burn_r === 'Y') {
        text2 += `Burns;`;
        const burnDetails = libraryService.getBurnDetails();
        const burnOption = burnDetails.find((option) => option.ref_burn_code === patientStore.details.ExternalCauseOfInjury.ref_burn_code);
        const burnDescription = burnOption ? burnOption.ref_burn_desc : 'Not specified';

        text2 += ` Level: ${burnDescription};`;

        if (patientStore.details.ExternalCauseOfInjury.ext_burn_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_burn_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_chem === 'Y') {
        text2 += `Chemical Substance;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_chem_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_chem_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_sharp === 'Y') {
        text2 += `Contact with Sharp Objects;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_sharp_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_sharp_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_drown_r === 'Y') {
        text2 += `Drowning;`;

        const drowningDetails = libraryService.getDrowningDetails();

        const drowningOption = drowningDetails.find((detail) => detail.ref_drowning_cope === patientStore.details.ExternalCauseOfInjury.ref_drowning_cope);
        const drowningDescription = drowningOption ? drowningOption.ref_drowning_desc : 'Not specified';

        text2 += ` Option: ${drowningDescription};`;

        if (patientStore.details.ExternalCauseOfInjury.ext_drown_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_drown_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r === 'Y') {
        text2 += `Exposure to Forces of Nature;`;

        const exposureOptions = libraryService.getExposureDetails();
        const exposureOption = exposureOptions.find((option) => option.ref_expnature_code === patientStore.details.ExternalCauseOfInjury.ref_expnature_code);
        const exposureDescription = exposureOption ? exposureOption.ref_expnature_desc : 'Not specified';

        text2 += ` Option: ${exposureDescription};`;

        if (patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_fall === 'Y') {
        text2 += `Fall;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_falldtl) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_falldtl};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_firecracker_r === 'Y') {
        text2 += `Firecracker;`;

        const firecrackerDetails = libraryService.getFireCrackerDetails();
        const firecrackerOption = firecrackerDetails.find((option) => option.firecracker_code === patientStore.details.ExternalCauseOfInjury.firecracker_code);
        const firecrackerDescription = firecrackerOption ? firecrackerOption.firecracker_desc : 'Not specified';

        text2 += ` Type: ${firecrackerDescription};`;

        if (patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_vape === 'Y') {
        text2 += `Vapor/HTD Product;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_vape_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_vape_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_gun === 'Y') {
        text2 += `Gunshot;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_gun_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_gun_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_hang === 'Y') {
        text2 += `Hanging/Strangulation;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_hang_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_hang_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_maul === 'Y') {
        text2 += `Mauling/Assault;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_maul_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_maul_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y') {
        text2 += `Transport/Vehicular Accident:\n`;
        if (patientStore.details.forTransportVehicularAccident.vehicle_type_id) {
            const vehicleType = libraryService.getVehicleTypes().find((type) => type.vehicle_type_id === patientStore.details.forTransportVehicularAccident.vehicle_type_id);
            text2 += `Transport Type: ${vehicleType ? vehicleType.vehicle_type_desc : 'Not specified'};\n`;
        }
        if (patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code) {
            const collisionType = libraryService.getCollisionTypes().find((type) => type.ref_veh_acctype_code === patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code);
            text2 += `Collision Type: ${collisionType ? collisionType.ref_veh_acctype_desc : 'Not specified'};\n`;
        }
        if (patientStore.details.forTransportVehicularAccident.vehicle_code) {
            const vehicleCode = vehicleCodes.value.find((vehicle) => vehicle.vehicle_code === patientStore.details.forTransportVehicularAccident.vehicle_code);
            text2 += `Vehicles Involved - Patient's Vehicle: ${vehicleCode ? vehicleCode.vehicle_desc : 'Not specified'};\n`;
        }
        if (patientStore.details.forTransportVehicularAccident.vehicle_code === '88' && patientStore.details.forTransportVehicularAccident.pat_veh_sp) {
            text2 += `Specify Patient's Vehicle: ${patientStore.details.forTransportVehicularAccident.pat_veh_sp};\n`;
        }
        if (patientStore.details.forTransportVehicularAccident.etc_veh) {
            const vehicleCode = vehicleCodes.value.find((vehicle) => vehicle.vehicle_code === patientStore.details.forTransportVehicularAccident.etc_veh);
            text2 += `Vehicles Involved - Other Vehicle: ${vehicleCode ? vehicleCode.vehicle_desc : 'Not specified'};\n`;
        }
        if (patientStore.details.forTransportVehicularAccident.etc_veh === '88' && patientStore.details.forTransportVehicularAccident.etc_veh_sp) {
            text2 += `Specify Other's Vehicle: ${patientStore.details.forTransportVehicularAccident.etc_veh_sp};\n`;
        }
        if (patientStore.details.forTransportVehicularAccident.position_code) {
            const position = libraryService.getPositions().find((pos) => pos.position_code === patientStore.details.forTransportVehicularAccident.position_code);
            text2 += `Position of Patient in Vehicle: ${position ? position.position_desc : 'Not specified'};\n`;
        }
        if (patientStore.details.forTransportVehicularAccident.position_code === '88' && patientStore.details.forTransportVehicularAccident.pos_pat_sp) {
            text2 += `Specify Position: ${patientStore.details.forTransportVehicularAccident.pos_pat_sp};\n`;
        }
        text2 += '\n';
    }

    if (patientStore.details.ExternalCauseOfInjury.ext_sexual === 'Y') {
        text2 += `S.A.;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_sexual_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_sexual_sp};`;
        }
        text2 += '\n\n';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_other === 'Y') {
        text2 += `Others;`;
        if (patientStore.details.ExternalCauseOfInjury.ext_other_sp) {
            text2 += ` Details: ${patientStore.details.ExternalCauseOfInjury.ext_other_sp};`;
        }
        text2 += '\n\n';
    }
    text2 += `VAWC: ${patientStore.details.ExternalCauseOfInjury.vawc === 'Y' ? 'Yes' : 'No'};\n`;
    if (patientStore.details.forTransportVehicularAccident.risk_none === 'Y') {
        text2 += `Risk Factors: `;
        if (patientStore.details.forTransportVehicularAccident.risk_alcliq === 'Y') {
            text2 += `Alcohol/Liquor; `;
        }
        if (patientStore.details.forTransportVehicularAccident.risk_sleep === 'Y') {
            text2 += `Sleepy; `;
        }
        if (patientStore.details.forTransportVehicularAccident.risk_smoke === 'Y') {
            text2 += `Smoking; `;
        }
        if (patientStore.details.forTransportVehicularAccident.risk_mobpho === 'Y') {
            text2 += `Using Mobile; `;
        }
        if (patientStore.details.forTransportVehicularAccident.risk_other === 'Y') {
            text2 += `Others: ${patientStore.details.forTransportVehicularAccident.risk_etc_spec}; `;
        }
        text2 += `\n\n`;
    }
    if (patientStore.details.forTransportVehicularAccident.safe_none === 'Y') {
        text2 += `Safety Measures: `;
        if (patientStore.details.forTransportVehicularAccident.safe_unkn === 'Y') {
            text2 += `Unknown; `;
        }
        if (patientStore.details.forTransportVehicularAccident.safe_airbag === 'Y') {
            text2 += `Airbag; `;
        }
        if (patientStore.details.forTransportVehicularAccident.safe_helmet === 'Y') {
            text2 += `Helmet; `;
        }
        if (patientStore.details.forTransportVehicularAccident.safe_cseat === 'Y') {
            text2 += `Child Seat; `;
        }
        if (patientStore.details.forTransportVehicularAccident.safe_sbelt === 'Y') {
            text2 += `Seat Belt; `;
        }
        if (patientStore.details.forTransportVehicularAccident.safe_vest === 'Y') {
            text2 += `Life Vest; `;
        }
        if (patientStore.details.forTransportVehicularAccident.safe_other === 'Y') {
            text2 += `Others: ${patientStore.details.forTransportVehicularAccident.safe_other_sp}; `;
        }
        text2 += `\n`;
    }

    generatedText.value = text + text2;
};
watch(
    () => [patientStore.details.preAdmissionData, patientStore.details.forTransportVehicularAccident, patientStore.details.ExternalCauseOfInjury, patientStore.details.natureOfInjury],
    () => {
        generateText();
    },
    { deep: true }
);
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
    () => patientStore.details.forTransportVehicularAccident.vehicle_code,
    (newVal) => {
        if (newVal === '00') {
            patientStore.details.forTransportVehicularAccident.position_code = '10';
        }
    }
);
watch(
    () => patientStore.details.forTransportVehicularAccident.vehicle_type_id,
    (value) => {
        loadVehicles(value);
    }
);
watch(
    () => [patientStore.details.ExternalCauseOfInjury.ext_assault, patientStore.details.ExternalCauseOfInjury.ext_battery],
    () => {
        if (patientStore.details.ExternalCauseOfInjury.ext_battery === 'Y' || patientStore.details.ExternalCauseOfInjury.ext_assault === 'Y') {
            patientStore.details.ExternalCauseOfInjury.ext_maul = 'Y';
        }
    }
);
watch(
    () => [patientStore.details.ExternalCauseOfInjury.ext_other_sp, patientStore.details.ExternalCauseOfInjury.ext_others_external],
    () => {
        if (patientStore.details.ExternalCauseOfInjury.ext_other_sp === '') {
            unrecognizedFieldsPreview.value = patientStore.details.ExternalCauseOfInjury.ext_others_external;
        } else {
            unrecognizedFieldsPreview.value = (patientStore.details.ExternalCauseOfInjury.ext_other_sp || '') + ', ' + (patientStore.details.ExternalCauseOfInjury.ext_others_external || '');
        }
        // unrecognizedFieldsPreview.value = (patientStore.details.ExternalCauseOfInjury.ext_other_sp || '') + ', ' + (patientStore.details.ExternalCauseOfInjury.ext_others_external || '');
    }
);
watch(
    () => unrecognizedFieldsPreview.value,
    (newValue) => {
        // alert('hit');
        patientStore.details.ExternalCauseOfInjury.ext_others_external_preview = newValue;
    }
);
onMounted(async () => {

    if (patientStore.details.ExternalCauseOfInjury.ext_battery === 'Y') {
        patientStore.details.ExternalCauseOfInjury.ext_maul = 'Y';
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_assault === 'Y') {
        patientStore.details.ExternalCauseOfInjury.ext_maul = 'Y';
    }
    // if (patientStore.details.ExternalCauseOfInjury.ext_others_external) {
    // unrecognizedFields.value = 'Y';
    // patientStore.details.ExternalCauseOfInjury.ext_other = 'Y';
    // patientStore.details.ExternalCauseOfInjury.ext_other_sp = patientStore.details.ExternalCauseOfInjury.ext_other_sp + '\n' + patientStore.details.ExternalCauseOfInjury.ext_others_external;
    // }
    // if (patientStore.details.natureOfInjury.noi_othersPhysical) {
    //     patientStore.details.natureOfInjury.noi_others = 'Y';
    //     patientStore.details.natureOfInjury.noi_otherinj = patientStore.details.ExternalCauseOfInjury.ext_other_sp + '\n' + patientStore.details.natureOfInjury.noi_othersPhysical;
    // }
    const fullUrl = window.location.href;
    const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
    const match3 = fullUrl.match(/[?&]access_token=([^&#]*)/);
    const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
    const enccode = match ? match[1] : null;
    const empID = match2 ? match2[1] : null;
    const getToken = match3 ? match3[1] : null;

    if (enccode === null && empID === null && getToken === null) {
        displayGeneratedDiagnosis.value = true;
    }
    if (patientStore.details.forTransportVehicularAccident.vehicle_type_id) {
        loadVehicles(patientStore.details.forTransportVehicularAccident.vehicle_type_id);
    }
    loading.value = false;
});
</script>
<template>
    <div class="card shadow-4 max-h-full h-full opacity-90" style="width: 30rem">
        <div v-if="!loading">
            <div class="flex align-items-center">
                <h4 class="font-bold w-28" style="color: #000080">EXTERNAL CAUSES</h4>
            </div>
        </div>

        <InputTextCheckBoxExternal
            v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_bite"
            v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_bite_sp"
            label="Bite/Sting"
            :binary="true"
            :required="getRequiredValidation('ext_bite_sp')"
            :class="{
                'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.details.ExternalCauseOfInjury.ext_bite_sp === ''
            }"
        />
        <!-- {{ patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor }} -->
        <div class="burns">
            <div class="flex align-content-center align-items-center mt-1">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_r" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 font-bold">Burns</label>
            </div>
            <div v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_r == 'Y'" class="mt-1 ml-4">
                <Dropdown
                    id="ExternalCauseOfInjury.ref_burn_code"
                    required
                    v-model="patientStore.details.ExternalCauseOfInjury.ref_burn_code"
                    placeholder="Select Burn Type"
                    :options="burnDetails"
                    optionLabel="ref_burn_desc"
                    optionValue="ref_burn_code"
                    :class="{
                        'p-inputtext-filled font-bold max-w-full w-25rem myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_burn_r == 'Y' && patientStore.details.ExternalCauseOfInjury.ref_burn_code == ''
                    }"
                />
                <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ref_burn_code === ''">
                    <small class="text-red-800 text-xs font-bold">Value is required</small>
                </div>
                <div v-if="patientStore.details.ExternalCauseOfInjury.ref_burn_code == '06'">
                    <Textarea
                        v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_sp"
                        id="ExternalCauseOfInjury.ext_burn_sp"
                        class="p-inputtext-filled font-bold max-w-full mt-1 w-24rem myCSS-inputtext-required text-xs"
                        autoresize
                        style="text-transform: uppercase"
                        :class="{
                            'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_burn_sp === '' && patientStore.details.ExternalCauseOfInjury.ref_burn_code === '06'
                        }"
                    />
                    <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_sp === ''">
                        <small class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
            </div>
        </div>

        <InputTextCheckBoxExternal
            v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_chem"
            v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_chem_sp"
            label="Chemical Substance"
            :binary="true"
            :required="getRequiredValidation('ext_chem_sp')"
            :class="{
                'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_chem === 'Y' && patientStore.details.ExternalCauseOfInjury.ext_chem_sp === ''
            }"
        />

        <InputTextCheckBoxExternal
            v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_sharp"
            v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_sharp_sp"
            label=" Contact with sharp objects"
            :binary="true"
            :required="getRequiredValidation('ext_sharp_sp')"
            :class="{
                'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_sharp === 'Y' && patientStore.details.ExternalCauseOfInjury.ext_sharp_sp === ''
            }"
        />

        <div class="drowns">
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
                    :class="{
                        'p-inputtext-filled font-bold max-w-full w-25rem myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_drown_r == 'Y' && patientStore.details.ExternalCauseOfInjury.ref_drowning_cope == ''
                    }"
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
                        placeholder="Specify"
                        style="text-transform: uppercase"
                        :class="{
                            'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_drown_sp === '' && patientStore.details.ExternalCauseOfInjury.ref_drowning_cope === '06'
                        }"
                    />
                    <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_drown_sp === ''">
                        <small class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="exposure">
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
                    :class="{
                        'bg-green-100': patientStore.details.ExternalCauseOfInjury.ref_expnature_code === ''
                    }"
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
                        placeholder="Specify"
                        style="text-transform: uppercase"
                        :class="{
                            'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp === ''
                        }"
                    />
                    <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp === ''">
                        <small class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
            </div>
        </div>
        <InputTextCheckBoxExternal
            v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_fall"
            v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_falldtl"
            label=" Fall"
            :binary="true"
            :required="getRequiredValidation('ext_falldtl')"
            :class="{
                'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_fall === 'Y' && patientStore.details.ExternalCauseOfInjury.ext_falldtl === ''
            }"
        />
        <div class="firecrackers">
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
                    :class="{
                        'p-inputtext-filled font-bold max-w-full w-25rem myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_firecracker_r == 'Y' && patientStore.details.ExternalCauseOfInjury.firecracker_code == ''
                    }"
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
                        placeholder="Specify"
                        style="text-transform: uppercase"
                        :class="{
                            'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp === '' && patientStore.details.ExternalCauseOfInjury.firecracker_code === '88'
                        }"
                    />
                    <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp === ''">
                        <small class="text-red-800 text-xs font-bold">Value is required</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="htd flex align-content-center mt-1">
            <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_vape" trueValue="Y" falseValue="N" id="inputswitch" />
            <label for="inputswitch" class="mx-2 align-self-center font-bold"> Vapor/HTD Product </label>
        </div>
        <div class="gunshot flex align-content-center mt-1">
            <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_gun" trueValue="Y" falseValue="N" id="inputswitch" />
            <label for="inputswitch" class="mx-2 align-self-center font-bold"> Gunshot </label>
        </div>

        <div class="hang flex align-content-center mt-1">
            <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_hang" trueValue="Y" falseValue="N" id="inputswitch" />
            <label for="inputswitch" class="mx-2 align-self-center font-bold"> Hanging/Strangulation </label>
        </div>

        <div class="mauling flex align-content-center mt-1">
            <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_maul" trueValue="Y" falseValue="N" id="inputswitch" />
            <label for="inputswitch" class="mx-2 align-self-center font-bold"> Mauling/Assault </label>
        </div>

        <!-- {{ patientStore.details.forTransportVehicularAccident }} -->
        <div class="vehicularAccident">
            <div class="vehicularAccident flex align-content-center mt-1" v-if="patientStore.details.preAdmissionData.inj_intent_code === '01'">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_transport" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Transport/Vehiculars Accident</label>
            </div>
            <div v-if="patientStore.details.ExternalCauseOfInjury.ext_transport == 'Y'" class="flex flex-wrap mt-1 ml-4">
                <label for="preAdmissionData.ext_transport" class="text-xs" style="color: #3366ff"><i>Transport Type</i></label>
                <Dropdown
                    id="ExternalCauseOfInjury.ext_transport"
                    required
                    v-model="patientStore.details.forTransportVehicularAccident.vehicle_type_id"
                    placeholder="Please select"
                    :options="vehicleTypes"
                    optionLabel="vehicle_type_desc"
                    optionValue="vehicle_type_id"
                    :class="{
                        'p-inputtext-filled font-bold max-w-full w-25rem mb-1 myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.forTransportVehicularAccident.vehicle_type_id === ''
                    }"
                />
                <label for="preAdmissionData.ref_veh_acctype_code" class="text-xs" style="color: #3366ff"><i>Collision Type</i></label>
                <Dropdown
                    id="ExternalCauseOfInjury.ref_veh_acctype_code"
                    required
                    v-model="patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code"
                    placeholder="Please select"
                    :options="collisionTypes"
                    optionLabel="ref_veh_acctype_desc"
                    optionValue="ref_veh_acctype_code"
                    :class="{
                        'p-inputtext-filled font-bold max-w-full w-25rem mb-1 myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code === ''
                    }"
                />
                <label for="preAdmissionData.vehicle_code" class="text-xs" style="color: #3366ff"><i>Vehicles Involved - Patient's Vehicle</i></label>
                <Dropdown
                    id="forTransportVehicularAccident.vehicle_code"
                    required
                    v-model="patientStore.details.forTransportVehicularAccident.vehicle_code"
                    placeholder="Please select"
                    :options="vehicleCodes"
                    optionLabel="vehicle_desc"
                    optionValue="vehicle_code"
                    :class="{
                        'p-inputtext-filled font-bold max-w-full w-25rem mb-1 myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.details.forTransportVehicularAccident.vehicle_code === ''
                    }"
                />
                <div v-if="patientStore.details.forTransportVehicularAccident.vehicle_code == '88'" class="ml-3">
                    <div class="flex justify-content-between">
                        <label for="forTransportVehicularAccident.pat_veh_sp" class="text-xs" style="color: #3366ff"><i>Specify</i> </label>
                        <div class="flex justify-content-end" v-if="patientStore.details.forTransportVehicularAccident.pat_veh_sp === ''">
                            <small class="text-red-800 text-xs font-bold">Value is required</small>
                        </div>
                    </div>

                    <InputText
                        v-model="patientStore.details.forTransportVehicularAccident.pat_veh_sp"
                        id="forTransportVehicularAccident.pat_veh_sp"
                        placeholder="Specify Vehicles Involved - Patient's Vehicle"
                        class="p-inputtext-filled font-bold max-w-full w-23rem mb-1 myCSS-inputtext-required text-xs"
                        autoresize
                        style="text-transform: uppercase"
                        :class="{
                            'bg-green-100': patientStore.details.forTransportVehicularAccident.pat_veh_sp === '' && patientStore.details.forTransportVehicularAccident.vehicle_code === '88'
                        }"
                    />
                </div>
                <div v-if="patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code == '10'">
                    <label for="preAdmissionData.etc_veh" class="text-xs" style="color: #3366ff"><i>Vehicles Involved - Other Vehicle</i></label>
                    <Dropdown
                        id="forTransportVehicularAccident.etc_veh"
                        required
                        v-model="patientStore.details.forTransportVehicularAccident.etc_veh"
                        placeholder="Please select"
                        :options="vehicleCodes"
                        optionLabel="vehicle_desc"
                        optionValue="vehicle_code"
                        :class="{
                            'p-inputtext-filled font-bold max-w-full w-24rem mb-1 myCSS-inputtext-required': true,
                            'bg-green-100': patientStore.details.forTransportVehicularAccident.etc_veh === ''
                        }"
                    />
                    <div v-if="patientStore.details.forTransportVehicularAccident.etc_veh == '88'" class="ml-3">
                        <div class="flex justify-content-between">
                            <label for="preAdmissionData.etc_veh" class="floex justify-content-start text-xs" style="color: #3366ff"><i>Specify</i></label>
                            <div class="flex justify-content-end" v-if="patientStore.details.forTransportVehicularAccident.etc_veh_sp === ''">
                                <small class="text-red-800 text-xs font-bold">Value is required</small>
                            </div>
                        </div>

                        <InputText
                            v-model="patientStore.details.forTransportVehicularAccident.etc_veh_sp"
                            id="ExternalCauseOfInjury.etc_veh"
                            placeholder="Specify Vehicles Involved - Other Vehicle"
                            class="p-inputtext-filled font-bold max-w-full w-23rem mb-1 myCSS-inputtext-required text-xs"
                            autoresize
                            style="text-transform: uppercase"
                            :class="{
                                'bg-green-100': patientStore.details.forTransportVehicularAccident.etc_veh_sp === '' && patientStore.details.forTransportVehicularAccident.etc_veh === '88'
                            }"
                        />
                    </div>
                </div>

                <label for="preAdmissionData.position_code" class="text-xs" style="color: #3366ff"><i>Position of Patient in Vehicle</i></label>
                <Dropdown
                    id="ExternalCauseOfInjury.position_code"
                    required
                    v-model="patientStore.details.forTransportVehicularAccident.position_code"
                    placeholder="Please select"
                    :options="positions"
                    optionLabel="position_desc"
                    optionValue="position_code"
                    :class="{ 'p-inputtext-filled font-bold max-w-full w-25rem mb-1 myCSS-inputtext-required': true, 'bg-green-100': patientStore.details.forTransportVehicularAccident.position_code === '' }"
                />
                <div class="ml-3" v-if="patientStore.details.forTransportVehicularAccident.position_code == '88'">
                    <div class="flex justify-content-between">
                        <label for="preAdmissionData.pos_pat_sp" class="text-xs" style="color: #3366ff"><i>Specify</i></label>
                        <div class="flex justify-content-end" v-if="patientStore.details.forTransportVehicularAccident.pos_pat_sp === ''">
                            <small class="text-red-800 text-xs font-bold">Value is required</small>
                        </div>
                    </div>

                    <InputText
                        v-model="patientStore.details.forTransportVehicularAccident.pos_pat_sp"
                        id="ExternalCauseOfInjury.pos_pat_sp"
                        placeholder="Specify Position of Patient in Vehicle"
                        class="p-inputtext-filled font-bold max-w-full w-23rem mb-1 myCSS-inputtext-required text-xs"
                        autoresize
                        style="text-transform: uppercase"
                        :class="{
                            'bg-green-100': patientStore.details.forTransportVehicularAccident.pos_pat_sp === '' && patientStore.details.forTransportVehicularAccident.position_code === '88'
                        }"
                    />
                </div>
            </div>
                <!-- {{ patientStore.details.ExternalCauseOfInjury.ext_transport }}
                {{ patientStore.details.forTransportVehicularAccident }} -->
            <div class="mauling flex align-content-center mt-1">
                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_sexual" trueValue="Y" falseValue="N" id="inputswitch" />
                <label for="inputswitch" class="mx-2 align-self-center font-bold"> S.A. </label>
            </div>
            <InputTextCheckBoxExternal
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_other"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_other_sp"
                label="Others, (Specify)"
                :binary="true"
                :required="getRequiredValidation('ext_other')"
                :class="{
                    'bg-green-100': patientStore.details.ExternalCauseOfInjury.ext_other === 'Y' && patientStore.details.ExternalCauseOfInjury.ext_other_sp === ''
                }"
            />
            <!-- <InputTextCheckBoxExternal
                v-model:modelValue="unrecognizedFields"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_others_external"
                label="Unrecognized Fields"
                :binary="true"
                :required="getRequiredValidation('ext_others_external')" 
            /> -->
            <!-- <Textarea
                v-if="patientStore.details.ExternalCauseOfInjury.ext_others_external"
                id="ExternalCauseOfInjury.ext_other_ext"
                v-model="patientStore.details.ExternalCauseOfInjury.ext_others_external"
                style="text-transform: uppercase"
                autoresize
            /> -->
            <!-- {{ patientStore.details.ExternalCauseOfInjury.ext_others_external }} -->
            <!-- {{ patientStore.details.ExternalCauseOfInjury.ext_others_external_preview }}  -->
            <div class="field mt-5" v-if="patientStore.details.ExternalCauseOfInjury.ext_others_external" style="border: 3px dashed #808080">
                <span class="p-float-label">
                    <Textarea inputId="Unrecognized Fields" style="width: 100%" v-model="unrecognizedFieldsPreview"></Textarea>
                    <label style="width: 100%" for="Unrecognized Fields">Unrecognized Fields</label>
                </span>
            </div>
            <div class="line"></div>

            <div class="flex justify-content-end" v-if="patientStore.details.hospitalFacilityData.diagnosis == ''">
                <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
            </div>

            <div class="line"></div>
            <div v-if="patientStore.header.complete_diagnosis">
                <p class="text-2xs text-black-500 flex justify-content-start"><b>FINAL DIAGNOSIS</b></p>
                <Textarea
                    style="text-transform: uppercase"
                    id="complete_diagnosis"
                    type="text"
                    v-model="patientStore.header.complete_diagnosis"
                    readonly
                    placeholder=""
                    autoResize
                    :class="{
                        'p-inputtext-filled font-bold mb-2 w-25rem text-xs myCSS-inputtext-required': true,
                        'bg-green-100': patientStore.header.complete_diagnosis === ''
                    }"
                />

                <div class="flex justify-content-evenly">
                    <b v-if="patientStore.header.disp_inpat">FINALDISP</b>
                    <b v-if="patientStore.header.outcome_inpat">FINALCOND</b>
                </div>
                <div class="flex justify-content-evenly">
                    <InputText v-if="patientStore.header.disp_inpat" id="disp_inpat" type="text" :value="libraryService.getDispositionCode(patientStore.header.disp_inpat)" class="font-bold mb-2 w-9rem" readonly />
                    <InputText v-if="patientStore.header.outcome_inpat" id="outcome_inpat" type="text" :value="libraryService.getConditionCode(patientStore.header.outcome_inpat)" class="font-bold mb-2 w-9rem" readonly />
                </div>
            </div>

            <Divider class="w-28rem" />
            <div v-if="patientStore.header.status !== '2'">
                <SaveBackRemovePanelButton />
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg-green-100 {
    background-color: #4caf50;
}

.line {
    height: 1px;
    background-color: rgb(139, 134, 134);
    width: 100%;
    margin: 20px 0;
}
</style>
