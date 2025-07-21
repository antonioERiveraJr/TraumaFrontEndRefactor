<script setup>
import { usePatientStore } from '../../../../store/injury/patientStore';
import { ref, watch, defineEmits, onUnmounted } from 'vue';
import createValidationRules from '../../../../validation/injuryValidations';
import useVuelidate from '@vuelidate/core';
import Swal from 'sweetalert2';
import LibraryService from '@/service/LibraryService';
import InputTextCheckBoxDoctor2 from '../../../custom/inputTextCheckBoxDoctor2.vue';
import InputTextCheckBoxDoctor from '../../../custom/inputTextCheckBoxDoctor.vue';
import Textarea from 'primevue/textarea';
import BiteForm from '../doctorsForm/subForm/biteForm.vue';
import VawcForm from '../../injury/doctorsForm/subForm/vawcForm.vue';
import VehicularAccidentForm from '../doctorsForm/subForm/vehicularAccidentForm.vue';

const patientStore = usePatientStore();
const loading = ref(true);
const validationRules = createValidationRules();
const libraryService = new LibraryService();
const getRequiredValidation = (field) => {
    return v$.value.$silentErrors.some((error) => error.$property === field);
};
const biteDialog = ref(false);
const vawcDialog = ref(false);
const biteButton = ref(false);
const compiledOtherExternal = ref();
const compiledOtherPhysical = ref();
const v$ = useVuelidate(validationRules, patientStore.details);
const burnDetails = libraryService.getBurnDetails();
const burnDetailsDoctor = libraryService.getBurnDetailsDoctor();
const drowningDetails = libraryService.getDrowningDetails();
const exposureDetails = libraryService.getExposureDetails();
const firecrackerDetails = libraryService.getFireCrackerDetails();
const vehicleTypes = libraryService.getVehicleTypes();
const collisionTypes = libraryService.getCollisionTypes();
const positions = libraryService.getPositions();
const landVehicles = libraryService.getLandVehicles();
const airVehicles = libraryService.getAirVehicles();
const waterVehicles = libraryService.getWaterVehicles();
const displayGeneratedDiagnosis = ref(false);
const isImpressionInputNeeded = ref(false);
const openTransportVehicularDialog = ref(false);
const isInputNull = async () => {
    vawcDialog.value = false;
    if (!patientStore.details.ExternalCauseOfInjury.vawc_impression_input && isImpressionInputNeeded.value) {
        await Swal.fire({
            icon: 'warning',
            title: 'Input Value Needed',
            text: 'Please input a Value',
            confirmButtonText: 'OK'
        });

        return true;
    }

    return false;
};
const vehicleCodes = ref([]);
const generatedText = ref('');

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

const emit = defineEmits(['update:requiredCountExternalCauses']);

const requiredCountExternalCauses = ref(0);

const updateRequiredFieldCount = () => {
    requiredCountExternalCauses.value = 0;
    if (
        ![
            patientStore.details.ExternalCauseOfInjury.ext_bite,
            patientStore.details.ExternalCauseOfInjury.ext_burn_r,
            patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor,
            patientStore.details.ExternalCauseOfInjury.ext_chem,
            patientStore.details.ExternalCauseOfInjury.ext_drown_r,
            patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r,
            patientStore.details.ExternalCauseOfInjury.ext_fall,
            patientStore.details.ExternalCauseOfInjury.ext_firecracker_r,
            patientStore.details.ExternalCauseOfInjury.ext_foreign_body,
            patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion,
            patientStore.details.ExternalCauseOfInjury.ext_encavement,
            patientStore.details.ExternalCauseOfInjury.ext_crushing,
            patientStore.details.ExternalCauseOfInjury.ext_stab_wound,
            patientStore.details.ExternalCauseOfInjury.ext_sharp,
            patientStore.details.ExternalCauseOfInjury.contact_blurt,
            patientStore.details.ExternalCauseOfInjury.ext_vape,
            patientStore.details.ExternalCauseOfInjury.ext_gun,
            patientStore.details.ExternalCauseOfInjury.ext_hang,
            patientStore.details.ExternalCauseOfInjury.ext_maul,
            patientStore.details.ExternalCauseOfInjury.ext_battery,
            patientStore.details.ExternalCauseOfInjury.ext_assault,
            patientStore.details.ExternalCauseOfInjury.ext_transport,
            patientStore.details.ExternalCauseOfInjury.ext_neglect,
            patientStore.details.ExternalCauseOfInjury.ext_sexual,
            patientStore.details.ExternalCauseOfInjury.ext_physical,
            patientStore.details.ExternalCauseOfInjury.ext_other
        ].includes('Y')
    ) {
        requiredCountExternalCauses.value++;
    }
    if (patientStore.details.generalData.perpetrator === 'Y' && !patientStore.details.generalData.perpetrator_sp) requiredCountExternalCauses.value++;
    if (
        patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
        (patientStore.details.ExternalCauseOfInjury.ext_bite_sp === '' ||
            patientStore.details.ExternalCauseOfInjury.dogbiteDegree === '' ||
            patientStore.details.ExternalCauseOfInjury.bleeding === '' ||
            patientStore.details.ExternalCauseOfInjury.bitingAnimal === '' ||
            patientStore.details.ExternalCauseOfInjury.observation === '' ||
            patientStore.details.ExternalCauseOfInjury.first_aid_code === '' ||
            patientStore.details.ExternalCauseOfInjury.washingDone === '' ||
            patientStore.details.ExternalCauseOfInjury.previousARV === '' ||
            patientStore.details.ExternalCauseOfInjury.tetanusVaccination === '' ||
            patientStore.details.ExternalCauseOfInjury.allergies === '' ||
            patientStore.details.ExternalCauseOfInjury.adverseReaction === '' ||
            (patientStore.details.ExternalCauseOfInjury.hrig !== 'Y' &&
                patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
                patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
                patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
                patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
                patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
                patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y') ||
            (patientStore.details.ExternalCauseOfInjury.hrig === 'Y' && patientStore.details.ExternalCauseOfInjury.hrig_num === '') ||
            (patientStore.details.ExternalCauseOfInjury.erig === 'Y' && patientStore.details.ExternalCauseOfInjury.erig_num === '') ||
            (patientStore.details.ExternalCauseOfInjury.ats === 'Y' && patientStore.details.ExternalCauseOfInjury.ats_num === '') ||
            (patientStore.details.ExternalCauseOfInjury.pvrv === 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_4 !== 'Y') ||
            (patientStore.details.ExternalCauseOfInjury.pcec === 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_4 !== 'Y'))
    )
        requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_burn_r === 'Y' && !patientStore.details.ExternalCauseOfInjury.ref_burn_code) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_burn_r === 'Y' && patientStore.details.ExternalCauseOfInjury.ref_burn_code === '06' && !patientStore.details.ExternalCauseOfInjury.ext_burn_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_chem === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_chem_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_drown_r === 'Y' && !patientStore.details.ExternalCauseOfInjury.ref_drowning_cope) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_drown_r === 'Y' && patientStore.details.ExternalCauseOfInjury.ref_drowning_cope === '06' && !patientStore.details.ExternalCauseOfInjury.ext_drown_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r === 'Y' && !patientStore.details.ExternalCauseOfInjury.ref_expnature_code) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r === 'Y' && patientStore.details.ExternalCauseOfInjury.ref_expnature_code === '07' && !patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp)
        requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_fall === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_falldtl) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_firecracker_r === 'Y' && !patientStore.details.ExternalCauseOfInjury.firecracker_code) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_firecracker_r === 'Y' && patientStore.details.ExternalCauseOfInjury.firecracker_code === '88' && !patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp)
        requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_foreign_body === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_foreign_body_sp) requiredCountExternalCauses.value++;
    // if (patientStore.details.ExternalCauseOfInjury.ext_battery === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_battery_sp) requiredCountExternalCauses.value++;
    // if (patientStore.details.ExternalCauseOfInjury.ext_assault === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_assault_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_encavement === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_encavement_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_crushing === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_crushing_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_stab_wound === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_stab_wound_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_sharp === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_sharp_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.contact_blurt === 'Y' && !patientStore.details.ExternalCauseOfInjury.contact_blurt_sp) requiredCountExternalCauses.value++;
    if (patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y') {
        if (!patientStore.details.forTransportVehicularAccident.vehicle_type_id) requiredCountExternalCauses.value++;
        if (!patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code) requiredCountExternalCauses.value++;
        if (!patientStore.details.forTransportVehicularAccident.vehicle_code) requiredCountExternalCauses.value++;
        if (patientStore.details.forTransportVehicularAccident.vehicle_code === '88' && !patientStore.details.forTransportVehicularAccident.pat_veh_sp) requiredCountExternalCauses.value++;
        if (patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code === '10' && !patientStore.details.forTransportVehicularAccident.etc_veh) requiredCountExternalCauses.value++;
        if (patientStore.details.forTransportVehicularAccident.etc_veh === '88' && !patientStore.details.forTransportVehicularAccident.etc_veh_sp) requiredCountExternalCauses.value++;
        if (!patientStore.details.forTransportVehicularAccident.position_code) requiredCountExternalCauses.value++;
        if (patientStore.details.forTransportVehicularAccident.position_code === '88' && !patientStore.details.forTransportVehicularAccident.pos_pat_sp) requiredCountExternalCauses.value++;
    }
    if (patientStore.details.ExternalCauseOfInjury.ext_other === 'Y' && !patientStore.details.ExternalCauseOfInjury.ext_other_sp) requiredCountExternalCauses.value++;
};


const autoOpenDialogTranspo = () => {
    if (patientStore.details.ExternalCauseOfInjury.ext_transport == 'N') {
        openTransportVehicularDialog.value = true;
        patientStore.details.forTransportVehicularAccident.risk_none = 'Y';
        patientStore.details.forTransportVehicularAccident.safe_none = 'Y';
    }
};
const generateText = () => {
    try {
        const selectedBurnDegree = ref(0);
        if (patientStore.details.natureOfInjury.degree_burn1 === 'Y') {
            selectedBurnDegree.value = '(Degree Level I)';
        } else if (patientStore.details.natureOfInjury.degree_burn2 === 'Y') {
            selectedBurnDegree.value = '(Degree Level II)';
        } else if (patientStore.details.natureOfInjury.degree_burn3 === 'Y') {
            selectedBurnDegree.value = '(Degree Level III)';
        } else if (patientStore.details.natureOfInjury.degree_burn4 === 'Y') {
            selectedBurnDegree.value = '(Degree Level IV)';
        }
        const physicalInjuries = [];
        const externalCauses = [];
        const specifyDetails = [];
        const isMultiple = ref(0);
        const specifyExternalDetails = [];
        const triggerMultiplePhysicalInjury = ref(0);
        const storeOtherPhysical = [];
        const storeOtherExternal = [];
        if (patientStore.details.natureOfInjury.noi_abrasion === 'Y') {
            if (patientStore.details.multipleFields.abrasion) {
                physicalInjuries.push('Multiple Abrasion');
                isMultiple.value++;
            } else {
                physicalInjuries.push('Abrasion');
            }
            triggerMultiplePhysicalInjury.value++;

            if (patientStore.details.natureOfInjury.noi_abradtl) {
                if (patientStore.details.multipleFields.multiple_abrasion) {
                    specifyDetails.push(`Multiple Abrasion: ${patientStore.details.natureOfInjury.noi_abradtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Abrasion: ${patientStore.details.natureOfInjury.noi_abradtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_burn_r === 'Y') {
            physicalInjuries.push('Burn');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_burndtl) {
                if (patientStore.details.multipleFields.multiple_burn) {
                    specifyDetails.push(`Multiple Burn${selectedBurnDegree.value}: ${patientStore.details.natureOfInjury.noi_burndtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Burn${selectedBurnDegree.value}: ${patientStore.details.natureOfInjury.noi_burndtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_avulsion === 'Y') {
            physicalInjuries.push('Avulsion');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_avuldtl) {
                if (patientStore.details.multipleFields.multiple_avulsion) {
                    specifyDetails.push(`Multiple Avulsion: ${patientStore.details.natureOfInjury.noi_avuldtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Avulsion: ${patientStore.details.natureOfInjury.noi_avuldtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_owound === 'Y') {
            physicalInjuries.push('Laceration');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_owoudtl) {
                if (patientStore.details.multipleFields.multiple_laceration) {
                    specifyDetails.push(`Multiple Laceration: ${patientStore.details.natureOfInjury.noi_owoudtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Laceration: ${patientStore.details.natureOfInjury.noi_owoudtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_incision === 'Y') {
            physicalInjuries.push('incision');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_incision_sp) {
                storeOtherPhysical.push(`Incision: ${patientStore.details.natureOfInjury.noi_incision_sp}\n`);
                if (patientStore.details.multipleFields.multiple_incision) {
                    specifyDetails.push(`Multiple incision: ${patientStore.details.natureOfInjury.noi_incision_sp}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`incision: ${patientStore.details.natureOfInjury.noi_incision_sp}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_amp === 'Y') {
            physicalInjuries.push('Traumatic Amputation');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_ampdtl) {
                if (patientStore.details.multipleFields.multiple_traumatic_amputation) {
                    specifyDetails.push(`Multiple Traumatic Amputation: ${patientStore.details.natureOfInjury.noi_ampdtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Traumatic Amputation: ${patientStore.details.natureOfInjury.noi_ampdtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_brain === 'Y') {
            physicalInjuries.push('Traumatic Brain Injury(' + patientStore.details.natureOfInjury.noi_braindtl + ')');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_braindtl) {
                let brainStageDesc = '';
                switch (patientStore.details.natureOfInjury.noi_brain_stg) {
                    case '1':
                        brainStageDesc = 'Mild';
                        break;
                    case '2':
                        brainStageDesc = 'Moderate';
                        break;
                    case '3':
                        brainStageDesc = 'Severe';
                        break;
                }
                storeOtherPhysical.push(`Traumatic Brain Injury(${brainStageDesc}): ${patientStore.details.natureOfInjury.noi_braindtl}\n`);
                if (patientStore.details.multipleFields.multiple_traumatic_brain) {
                    specifyDetails.push(`Multiple Traumatic Brain Injury(${brainStageDesc}): ${patientStore.details.natureOfInjury.noi_braindtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Traumatic Brain Injury(${brainStageDesc}): ${patientStore.details.natureOfInjury.noi_braindtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_gunshot === 'Y') {
            physicalInjuries.push('Gunshot Wound');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_gunshotdtl) {
                storeOtherPhysical.push(`Gunshot Wound: ${patientStore.details.natureOfInjury.noi_gunshotdtl}\n`);
                if (patientStore.details.multipleFields.multiple_gunshot) {
                    specifyDetails.push(`Multiple Gunshot Wound: ${patientStore.details.natureOfInjury.noi_gunshotdtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Gunshot Wound: ${patientStore.details.natureOfInjury.noi_gunshotdtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_stab_wound === 'Y') {
            physicalInjuries.push('Stab Wound');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_stab_wounddtl) {
                storeOtherPhysical.push(`Stab Wound: ${patientStore.details.natureOfInjury.noi_stab_wounddtl}\n`);
                if (patientStore.details.multipleFields.multiple_stab) {
                    specifyDetails.push(`Multiple Stab Wound: ${patientStore.details.natureOfInjury.noi_stab_wounddtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Stab Wound: ${patientStore.details.natureOfInjury.noi_stab_wounddtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_concussion === 'Y') {
            physicalInjuries.push('Concussion');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_concussiondtl) {
                if (patientStore.details.multipleFields.multiple_concussion) {
                    specifyDetails.push(`Multiple Concussion: ${patientStore.details.natureOfInjury.noi_concussiondtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Concussion: ${patientStore.details.natureOfInjury.noi_concussiondtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_contusion === 'Y') {
            physicalInjuries.push('Contusion');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_contudtl) {
                if (patientStore.details.multipleFields.multiple_contusion) {
                    specifyDetails.push(`Multiple Contusion: ${patientStore.details.natureOfInjury.noi_contudtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Contusion: ${patientStore.details.natureOfInjury.noi_contudtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_frac_ope === 'Y') {
            physicalInjuries.push('Fracture (Closed)');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_fropdtl) {
                if (patientStore.details.multipleFields.multiple_fracture_closed) {
                    specifyDetails.push(`Multiple Fracture (Closed): ${patientStore.details.natureOfInjury.noi_fropdtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Fracture (Closed): ${patientStore.details.natureOfInjury.noi_fropdtl}\n`);
                }
            }
        }

        if (patientStore.details.natureOfInjury.noi_frac_clo === 'Y') {
            physicalInjuries.push('Fracture (Open)');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_frcldtl) {
                if (patientStore.details.multipleFields.multiple_fracture_open) {
                    specifyDetails.push(`Multiple Fracture (Open): ${patientStore.details.natureOfInjury.noi_frcldtl}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Fracture (Open): ${patientStore.details.natureOfInjury.noi_frcldtl}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_disl_open === 'Y') {
            physicalInjuries.push('Dislocation (Open)');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_disl_open_sp) {
                storeOtherPhysical.push(`Dislocation (Open): ${patientStore.details.natureOfInjury.noi_disl_open_sp}\n`);
                if (patientStore.details.multipleFields.multiple_dislocation_open) {
                    specifyDetails.push(`Multiple Dislocation (Open): ${patientStore.details.natureOfInjury.noi_disl_open_sp}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Dislocation (Open): ${patientStore.details.natureOfInjury.noi_disl_open_sp}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_disl_close === 'Y') {
            physicalInjuries.push('Dislocation (Close)');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_disl_close_sp) {
                storeOtherPhysical.push(`Dislocation (Close): ${patientStore.details.natureOfInjury.noi_disl_close_sp}\n`);
                if (patientStore.details.multipleFields.multiple_dislocation_closed) {
                    specifyDetails.push(`Multiple Dislocation (Close): ${patientStore.details.natureOfInjury.noi_disl_close_sp}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Dislocation (Close): ${patientStore.details.natureOfInjury.noi_disl_close_sp}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_punc === 'Y') {
            physicalInjuries.push('Puncture');
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_punc_sp) {
                storeOtherPhysical.push(`Puncture: ${patientStore.details.natureOfInjury.noi_punc_sp}\n`);
                if (patientStore.details.multipleFields.multiple_puncture) {
                    specifyDetails.push(`Multiple Puncture: ${patientStore.details.natureOfInjury.noi_punc_sp}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`Puncture: ${patientStore.details.natureOfInjury.noi_punc_sp}\n`);
                }
            }
        }
        if (patientStore.details.natureOfInjury.noi_others === 'Y') {
            physicalInjuries.push(`${patientStore.details.natureOfInjury.noi_otherinj}`);
            triggerMultiplePhysicalInjury.value++;
            if (patientStore.details.natureOfInjury.noi_otherinj) {
                if (patientStore.details.multipleFields.multiple_other) {
                    specifyDetails.push(`Multiple ${patientStore.details.natureOfInjury.noi_otherinj}\n`);
                    isMultiple.value++;
                } else {
                    specifyDetails.push(`${patientStore.details.natureOfInjury.noi_otherinj}\n`);
                }
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y') {
            externalCauses.push(' Bite/Sting');
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_burn_r === 'Y') {
            const burnType = ref('');
            switch (patientStore.details.ExternalCauseOfInjury.ref_burn_code) {
                case '01':
                    burnType.value = 'Heat';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '02':
                    burnType.value = 'Fire';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '03':
                    burnType.value = 'Electricity';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '04':
                    burnType.value = 'Oil';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '05':
                    burnType.value = 'Friction';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '06':
                    burnType.value = patientStore.details.ExternalCauseOfInjury.ext_burn_sp;
                    specifyExternalDetails.push(` ${patientStore.details.ExternalCauseOfInjury.ext_burn_sp}\n`);
                    externalCauses.push(burnType.value);
                    break;
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor === 'Y') {
            const burnType = ref('');
            switch (patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor) {
                case '99':
                    burnType.value = 'Flame Burn';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '98':
                    burnType.value = 'Scald Burn';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '97':
                    burnType.value = 'Electrical Burn';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '96':
                    burnType.value = 'Flash Burn';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '95':
                    burnType.value = 'Chemical Burn';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '94':
                    burnType.value = 'Blast Injury';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '93':
                    burnType.value = 'Contact Burn';
                    specifyExternalDetails.push(`${burnType.value}\n`);
                    externalCauses.push(burnType.value);
                    break;
                case '92':
                    burnType.value = patientStore.details.ExternalCauseOfInjury.ext_burn_sp_doctor;
                    specifyExternalDetails.push(` ${patientStore.details.ExternalCauseOfInjury.ext_burn_sp_doctor}\n`);
                    externalCauses.push(burnType.value);
                    break;
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_chem === 'Y') {
            externalCauses.push(' Chemical Substance');
            if (patientStore.details.ExternalCauseOfInjury.ext_chem_sp) {
                specifyExternalDetails.push(`Chemical Substance: ${patientStore.details.ExternalCauseOfInjury.ext_chem_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_drown_r === 'Y') {
            externalCauses.push(' Drowning');
            if (patientStore.details.ExternalCauseOfInjury.ext_drown_sp || patientStore.details.ExternalCauseOfInjury.ref_drowning_cope) {
                switch (patientStore.details.ExternalCauseOfInjury.ref_drowning_cope) {
                    case '01':
                        specifyExternalDetails.push(`Drowning: Sea\n`);
                        break;
                    case '02':
                        specifyExternalDetails.push(`Drowning: River\n`);
                        break;
                    case '03':
                        specifyExternalDetails.push(`Drowning: lake\n`);
                        break;
                    case '04':
                        specifyExternalDetails.push(`Drowning: Pool\n`);
                        break;
                    case '05':
                        specifyExternalDetails.push(`Drowning: Bathtub\n`);
                        break;
                    case '06':
                        specifyExternalDetails.push(`Drowning:${patientStore.details.ExternalCauseOfInjury.ext_drown_sp}\n`);
                        break;
                }
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r === 'Y') {
            externalCauses.push(' Exposure to Forces of Nature');
            if (patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp || patientStore.details.ExternalCauseOfInjury.ref_expnature_code) {
                switch (patientStore.details.ExternalCauseOfInjury.ref_expnature_code) {
                    case '01':
                        specifyExternalDetails.push(`Exposure to Forces of Nature: Earthquake\n`);
                        break;
                    case '02':
                        specifyExternalDetails.push(`Exposure to Forces of Nature: Volcanic Eruption\n`);
                        break;
                    case '03':
                        specifyExternalDetails.push(`Exposure to Forces of Nature: Typhoon\n`);
                        break;
                    case '04':
                        specifyExternalDetails.push(`Exposure to Forces of Nature: Landslide\n`);
                        break;
                    case '05':
                        specifyExternalDetails.push(`Exposure to Forces of Nature: Tidal Wave\n`);
                        break;
                    case '06':
                        specifyExternalDetails.push(`Exposure to Forces of Nature: Flood\n`);
                        break;
                    case '07':
                        specifyExternalDetails.push(`Exposure to Forces of Nature: ${patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp}\n`);
                        break;
                }
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_fall === 'Y') {
            externalCauses.push(' Fall');
            if (patientStore.details.ExternalCauseOfInjury.ext_falldtl) {
                specifyExternalDetails.push(`Fall: ${patientStore.details.ExternalCauseOfInjury.ext_falldtl}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_firecracker_r === 'Y') {
            externalCauses.push(' Firecracker');
            if (patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp || patientStore.details.ExternalCauseOfInjury.firecracker_code) {
                switch (patientStore.details.ExternalCauseOfInjury.firecracker_code) {
                    case '01':
                        specifyExternalDetails.push(`Firecracker: Piccolo\n`);
                        break;
                    case '02':
                        specifyExternalDetails.push(`Firecracker: Kwitis\n`);
                        break;
                    case '03':
                        specifyExternalDetails.push(`Firecracker: 5-Star\n`);
                        break;
                    case '04':
                        specifyExternalDetails.push(`Firecracker: Home-made firecrackers\n`);
                        break;
                    case '88':
                        +specifyExternalDetails.push(`Firecracker: ${patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp}\n`);
                        break;
                }
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_foreign_body === 'Y') {
            externalCauses.push(' Foreign Body Ingestion');
            if (patientStore.details.ExternalCauseOfInjury.ext_foreign_body_sp) {
                storeOtherExternal.push(`Foreign Body Ingestiony: ${patientStore.details.ExternalCauseOfInjury.ext_foreign_body_sp}`);
                specifyExternalDetails.push(`Foreign Body Ingestion: ${patientStore.details.ExternalCauseOfInjury.ext_foreign_body_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion === 'Y') {
            externalCauses.push(' Caustic Ingestion');
            if (patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion_sp) {
                storeOtherExternal.push(`Caustic Ingestion: ${patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion_sp}`);
                specifyExternalDetails.push(`Caustic Ingestion: ${patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_encavement === 'Y') {
            externalCauses.push(' Encavement');
            if (patientStore.details.ExternalCauseOfInjury.ext_encavement_sp) {
                storeOtherExternal.push(`Encavement: ${patientStore.details.ExternalCauseOfInjury.ext_encavement_sp}`);
                specifyExternalDetails.push(`Encavement: ${patientStore.details.ExternalCauseOfInjury.ext_encavement_sp}\n`);
            }
        }

        if (patientStore.details.ExternalCauseOfInjury.ext_crushing === 'Y') {
            externalCauses.push(' Crushing');
            if (patientStore.details.ExternalCauseOfInjury.ext_crushing_sp) {
                storeOtherExternal.push(`Crushing: ${patientStore.details.ExternalCauseOfInjury.ext_crushing_sp}`);
                specifyExternalDetails.push(`Crushing: ${patientStore.details.ExternalCauseOfInjury.ext_crushing_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_stab_wound === 'Y') {
            externalCauses.push(patientStore.details.ExternalCauseOfInjury.ext_stab_wound_sp);
            if (patientStore.details.ExternalCauseOfInjury.ext_stab_wound_sp) {
                storeOtherExternal.push(`Stab Wound: ${patientStore.details.ExternalCauseOfInjury.ext_stab_wound_sp}`);
                specifyExternalDetails.push(`Stab Wound: ${patientStore.details.ExternalCauseOfInjury.ext_stab_wound_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_sharp === 'Y') {
            externalCauses.push(' Contact with Sharp Objects');
            if (patientStore.details.ExternalCauseOfInjury.ext_sharp_sp) {
                specifyExternalDetails.push(`Contact with Sharp Objects: ${patientStore.details.ExternalCauseOfInjury.ext_sharp_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.contact_blurt === 'Y') {
            externalCauses.push(' Contact with Blunt Object');
            if (patientStore.details.ExternalCauseOfInjury.contact_blurt_sp) {
                storeOtherExternal.push(`Contact with Blunt Object: ${patientStore.details.ExternalCauseOfInjury.contact_blurt_sp}`);
                specifyExternalDetails.push(`Contact with Blunt Object: ${patientStore.details.ExternalCauseOfInjury.contact_blurt_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_vape === 'Y') {
            externalCauses.push(' Vapor/HTD Product');
            if (patientStore.details.ExternalCauseOfInjury.ext_vape_sp) {
                storeOtherExternal.push(`Vapor/HTD Product: ${patientStore.details.ExternalCauseOfInjury.ext_vape_sp}`);
                specifyExternalDetails.push(`Vapor/HTD Product: ${patientStore.details.ExternalCauseOfInjury.ext_vape_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_gun === 'Y') {
            externalCauses.push(' Gunshot Wound');
            if (patientStore.details.ExternalCauseOfInjury.ext_gun_sp) {
                storeOtherExternal.push(`Gunshot Wound: ${patientStore.details.ExternalCauseOfInjury.ext_gun_sp}`);
                specifyExternalDetails.push(`Gunshot Wound: ${patientStore.details.ExternalCauseOfInjury.ext_gun_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_hang === 'Y') {
            externalCauses.push(' Hanging/Strangulation');
            if (patientStore.details.ExternalCauseOfInjury.ext_hang_sp) {
                specifyExternalDetails.push(`Hanging/Strangulation: ${patientStore.details.ExternalCauseOfInjury.ext_hang_sp}\n`);
            }
        }
        // if (patientStore.details.ExternalCauseOfInjury.ext_maul === 'Y') {
        //     externalCauses.push(' Mauling/Assault');
        //     if (patientStore.details.ExternalCauseOfInjury.ext_maul_sp) {
        //         specifyExternalDetails.push(`Mauling/Assault: ${patientStore.details.ExternalCauseOfInjury.ext_maul_sp}\n`);
        //     }
        // }

        //batery and assault
        if (patientStore.details.ExternalCauseOfInjury.ext_battery === 'Y') {
            externalCauses.push(' Battery');
            // console.log('hit');
            //trigger perpetrator (REQUIRED)
            patientStore.details.generalData.perpetrator = 'Y';
            if (patientStore.details.generalData.perpetrator_sp) {
                // storeOtherExternal.push(`Battery: ${patientStore.details.ExternalCauseOfInjury.ext_battery_sp}`);
                if (patientStore.details.generalData.perpetrator_sp === '11') {
                    specifyExternalDetails.push(`Battery: ${patientStore.details.generalData.perpetrator_oth_sp}\n`);
                } else {
                    specifyExternalDetails.push(`Battery (Relationship to Perpetrator): ${libraryService.getPerpetratorRelationships().find((perpetrator) => perpetrator.value === patientStore.details.generalData.perpetrator_sp)?.label}\n`);
                }
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_assault === 'Y') {
            externalCauses.push(' Assault');
            patientStore.details.generalData.perpetrator = 'Y';
            if (patientStore.details.generalData.perpetrator_sp) {
                // storeOtherExternal.push(`Battery: ${patientStore.details.ExternalCauseOfInjury.ext_battery_sp}`);
                if (patientStore.details.generalData.perpetrator_sp === '11') {
                    specifyExternalDetails.push(`Assault: ${patientStore.details.generalData.perpetrator_oth_sp}\n`);
                } else {
                    specifyExternalDetails.push(`Assault(Relationship to Perpetrator): ${libraryService.getPerpetratorRelationships().find((perpetrator) => perpetrator.value === patientStore.details.generalData.perpetrator_sp)?.label}\n`);
                }
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y') {
            externalCauses.push(' Road Crash Incident');
            const tally = {
                '               Transport Type': libraryService.getVehicleTypes().find((type) => type.vehicle_type_id === patientStore.details.forTransportVehicularAccident.vehicle_type_id)?.vehicle_type_desc || 'Not specified',
                '               Collision Type': libraryService.getCollisionTypes().find((type) => type.ref_veh_acctype_code === patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code)?.ref_veh_acctype_desc || 'Not specified',
                "               Vehicles Involved - Patient's Vehicle": vehicleCodes.value.find((vehicle) => vehicle.vehicle_code === patientStore.details.forTransportVehicularAccident.vehicle_code)?.vehicle_desc || 'Not specified',
                "               Specify Patient's Vehicle": patientStore.details.forTransportVehicularAccident.vehicle_code === '88' ? patientStore.details.forTransportVehicularAccident.pat_veh_sp : undefined,
                '               Vehicles Involved - Other Vehicle': vehicleCodes.value.find((vehicle) => vehicle.vehicle_code === patientStore.details.forTransportVehicularAccident.etc_veh)?.vehicle_desc || 'Not specified',
                "               Specify Other's Vehicle": patientStore.details.forTransportVehicularAccident.etc_veh === '88' ? patientStore.details.forTransportVehicularAccident.etc_veh_sp : undefined,
                '               Position of Patient in Vehicle': libraryService.getPositions().find((pos) => pos.position_code === patientStore.details.forTransportVehicularAccident.position_code)?.position_desc || 'Not specified',
                '               Specify Position': patientStore.details.forTransportVehicularAccident.position_code === '88' ? patientStore.details.forTransportVehicularAccident.pos_pat_sp : undefined
            };
            const filteredTally = Object.fromEntries(
                Object.entries(tally).filter(([key, value]) => {
                    return value !== undefined && value !== null && value !== '' && value !== 'Invalid date';
                })
            );
            const testDetails = Object.keys(filteredTally)
                .map((label) => `${label}: ${filteredTally[label]}`)
                .join('\n');
            const trimDetails = 'Road Crash Incident:\n' + testDetails;
            specifyExternalDetails.push(trimDetails);
            patientStore.header.doctor_details = trimDetails + '\n' + patientStore?.details?.ExternalCauseOfInjury?.ext_history;
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_sexual === 'Y') {
            externalCauses.push(' Sexual Abuse.');
            patientStore.details.generalData.perpetrator = 'Y';
            // if (patientStore.details.ExternalCauseOfInjury.ext_sexual_sp) {
            //     specifyExternalDetails.push(`Sexual Abuse: ${patientStore.details.ExternalCauseOfInjury.ext_sexual_sp}\n`);
            // }
            if (patientStore.details.generalData.perpetrator_sp) {
                // storeOtherExternal.push(`Battery: ${patientStore.details.ExternalCauseOfInjury.ext_battery_sp}`);
                if (patientStore.details.generalData.perpetrator_sp === '11') {
                    specifyExternalDetails.push(`SA ${patientStore.details.generalData.perpetrator_oth_sp}\n`);
                } else {
                    specifyExternalDetails.push(`SA(Relationship to Perpetrator): ${libraryService.getPerpetratorRelationships().find((perpetrator) => perpetrator.value === patientStore.details.generalData.perpetrator_sp)?.label}\n`);
                }
            }
        }
        // if (patientStore.details.ExternalCauseOfInjury.ext_physical === 'Y') {
        //     externalCauses.push(' Physical Abuse.');
        //     patientStore.details.generalData.perpetrator = 'Y';
        //     // if (patientStore.details.ExternalCauseOfInjury.ext_sexual_sp) {
        //     //     specifyExternalDetails.push(`Physical Abuse: ${patientStore.details.ExternalCauseOfInjury.ext_physical_sp}\n`);
        //     // }

        // }
        if (patientStore.details.ExternalCauseOfInjury.ext_neglect === 'Y') {
            externalCauses.push(' Neglect.');
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_other === 'Y') {
            externalCauses.push(` ${patientStore.details.ExternalCauseOfInjury.ext_other_sp}`);
            if (patientStore.details.ExternalCauseOfInjury.ext_other_sp) {
                specifyExternalDetails.push(`${patientStore.details.ExternalCauseOfInjury.ext_other_sp}\n`);
            }
        }
        if (patientStore.details.ExternalCauseOfInjury.vawc === 'Y') {
            physicalInjuries.push(' VAWC');
            if (patientStore.details.ExternalCauseOfInjury.vawc_impression && (patientStore.details.ExternalCauseOfInjury.ext_physical === 'Y' || patientStore.details.ExternalCauseOfInjury.ext_sexual === 'Y')) {
                specifyExternalDetails.push(`VAWCs: ${patientStore.details.ExternalCauseOfInjury.vawc_impression}\n`);
            }
        }
        let compiledDiagnosis = '';
        const injuryText = physicalInjuries.join(',');
        const causeText = externalCauses.join(',');
        const diagSubj = specifyDetails.map((detail) => `- ${detail}`).join('');
        compiledOtherPhysical.value = storeOtherPhysical.join('');
        compiledOtherExternal.value = storeOtherExternal.join('');

        if (specifyDetails || specifyExternalDetails) {
            if (patientStore.details.natureOfInjury.noi_no_physical === 'Y') {
                specifyDetails.push('No External Sign of Physical injury');
                compiledDiagnosis = `${causeText}, No External Sign of Physical injury`;
            } else if (triggerMultiplePhysicalInjury.value > 1) {
                compiledDiagnosis = `Multiple phyisical injuries secondary to ${causeText}  \n${diagSubj}`;
            } else if (Object.values(patientStore.details.multipleFields).some((value) => value === true) && isMultiple.value > 0) {
                compiledDiagnosis = `Multiple ${injuryText}  secondary to ${causeText} \n${diagSubj} `;
            } else {
                if (injuryText || causeText) {
                    compiledDiagnosis = `${injuryText} secondary to ${causeText}  \n${diagSubj}`;
                }
            }
            patientStore.header.doctor_objective = specifyDetails.join('');

            patientStore.header.doctor_noi = externalCauses;
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor === 'Y') {
            compiledDiagnosis = `${externalCauses} \n ${specifyDetails}  \n`;
        }
        if (patientStore.details.ExternalCauseOfInjury.ext_bite_sp && patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y') {
            compiledDiagnosis = `${patientStore.details.ExternalCauseOfInjury.ext_bite_sp} (Category ${patientStore.details.ExternalCauseOfInjury.dogbiteDegree}), ${specifyDetails}  \n`;
            patientStore.header.doctor_objective = specifyDetails;
            const tally = {
                '               Nature of Injury': patientStore.details.ExternalCauseOfInjury.ext_bite_sp,
                '               Bite Category': patientStore.details.ExternalCauseOfInjury.dogbiteDegree,
                '               Bleeding of Injury': patientStore.details.ExternalCauseOfInjury.bleeding,
                '               Biting Animal': patientStore.details.ExternalCauseOfInjury.bitingAnimal,
                '               Biting Animal Can Be Observed': patientStore.details.ExternalCauseOfInjury.observation,
                '               Washing of Wound Done': patientStore.details.ExternalCauseOfInjury.washingDone,
                '               Applied Anything to Wound': patientStore.details.preAdmissionData.first_aid_code === 'Y' ? 'Yes' : patientStore.details.preAdmissionData.first_aid_code,
                '               First Aid': patientStore.details.preAdmissionData.firstaid_others,
                '               By Whom': patientStore.details.preAdmissionData.firstaid_others2,
                '               Previous Completed ARV': patientStore.details.ExternalCauseOfInjury.previousARV,
                '               Date of Previous ARV': patientStore.details.ExternalCauseOfInjury.arvDate,
                '               Previous Anti-Tetanus Vaccination': patientStore.details.ExternalCauseOfInjury.tetanusVaccination,
                '               # of Tetanus Doses Given': patientStore.details.ExternalCauseOfInjury.tetanusDoses,
                '               Last Tetanus Dose Given': patientStore.details.ExternalCauseOfInjury.lastTetanusDose,
                '               Allergies': patientStore.details.ExternalCauseOfInjury.allergies,
                '               Adverse Reaction from Previous Vaccination': patientStore.details.ExternalCauseOfInjury.adverseReaction,
                '               Other Pertinent': patientStore.details.ExternalCauseOfInjury.bite_more_details
            };
            const filteredTally = Object.fromEntries(
                Object.entries(tally).filter(([key, value]) => {
                    return value !== undefined && value !== null && value !== '' && value !== 'Invalid date';
                })
            );
            const testDetails = Object.keys(filteredTally)
                .map((label) => `${label}: ${filteredTally[label]}`)
                .join('\n');
            const trimDetails = 'Bite/Sting:\n' + testDetails + '\n\n' + specifyExternalDetails.join('');
            patientStore.header.doctor_details = trimDetails + '\n' + patientStore?.details?.ExternalCauseOfInjury?.ext_history;
        } else {
            patientStore.header.compiledDiagnosis = compiledDiagnosis;
            const trimDetails = specifyExternalDetails.join('');
            const extHistory = patientStore.details.ExternalCauseOfInjury.ext_history || '';
            patientStore.header.doctor_details = trimDetails + '\n' + extHistory;
        }

        generatedText.value = ` ${compiledDiagnosis}`;
        patientStore.header.doctor_diagnosis = generatedText.value;
    } catch (e) {
        console.log('Generate Text Error: ', e);
    }
};
watch(
    () => [patientStore.details.generalData, patientStore.details.preAdmissionData, patientStore.details.forTransportVehicularAccident, patientStore.details.ExternalCauseOfInjury, patientStore.details.natureOfInjury],
    () => {
        generateText();
    },
    { deep: true }
);

watch(
    () => patientStore.details.multipleFields,
    () => {
        generateText();
    },
    { deep: true }
);
watch(
    () => compiledOtherExternal.value,
    (newValue) => {
        patientStore.details.ExternalCauseOfInjury.ext_others_external = newValue;
    }
);
watch(
    () => compiledOtherPhysical.value,
    (newValue) => {
        patientStore.details.natureOfInjury.noi_othersPhysical = newValue;
    }
);
watch(
    () => patientStore.details.forTransportVehicularAccident.vehicle_code,
    (newVal) => {
        if (newVal === '00') {
            patientStore.details.forTransportVehicularAccident.position_code = '10';
        }
    }
);
watch(
    () => patientStore.details.ExternalCauseOfInjury.ext_bite,
    (newValue) => {
        if (newValue === 'Y') {
            biteButton.value = true;
        } else {
            biteButton.value = false;
        }
    }
);
watch(
    () => patientStore.details.forTransportVehicularAccident.vehicle_type_id,
    (value) => {
        loadVehicles(value);
    }
);
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

const onResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
};

window.addEventListener('resize', onResize);

onUnmounted(() => {
    window.removeEventListener('resize', onResize);
});
const patientDataIsLoaded = async () => {
    updateRequiredFieldCount();
    onResize();
    if (patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y') {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        generateText();
    } else {
        generateText();
    }
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
};
// const openVAWCDialog = () => {
//     vawcDialog.value = true;
// };
const openBiteDialog = () => {
    biteDialog.value = true;
};
watch(
    () => patientStore.dataIsLoaded,
    (newValue) => {
        if (newValue === true) {
            patientDataIsLoaded();
        }
    }
);
watch(
    () => patientStore.details.ExternalCauseOfInjury.ext_bite,
    (newValue) => {
        generateText();

        if (newValue === 'Y') {
            openBiteDialog();
        }
    }
);

watch(
    () => biteDialog.value,
    async (newValue) => {
        if (
            (!newValue && patientStore.details.preAdmissionData.first_aid_code === 'Y' && patientStore.details.preAdmissionData.firstaid_others === '') ||
            (!newValue && patientStore.details.preAdmissionData.first_aid_code === 'Y' && patientStore.details.preAdmissionData.firstaid_others2 === '')
        ) {
            if (patientStore.details.preAdmissionData.firstaid_others2 === '') {
                await Swal.fire({
                    icon: 'warning',
                    title: 'INVALID INPUT',
                    text: 'Please fill in the By Whom Field',
                    confirmButtonText: 'OK'
                });
                biteDialog.value = true;
            } else {
                await Swal.fire({
                    icon: 'warning',
                    title: 'INVALID INPUT',
                    text: 'Please fill in the Firs Aid Field',
                    confirmButtonText: 'OK'
                });
                biteDialog.value = true;
            }
        }
    }
);
watch(requiredCountExternalCauses, (newCount) => {
    emit('update:requiredCountExternalCauses', newCount);
});
watch(
    () => [patientStore.details.ExternalCauseOfInjury, patientStore.details.forTransportVehicularAccident, patientStore.details.generalData],
    () => {
        updateRequiredFieldCount();
    },
    { deep: true }
);
const noExternal = ref(true);
watch(
    () =>
        [
            patientStore.details.ExternalCauseOfInjury.ext_bite,
            patientStore.details.ExternalCauseOfInjury.ext_burn_r,
            patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor,
            patientStore.details.ExternalCauseOfInjury.ext_chem,
            patientStore.details.ExternalCauseOfInjury.ext_drown_r,
            patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r,
            patientStore.details.ExternalCauseOfInjury.ext_fall,
            patientStore.details.ExternalCauseOfInjury.ext_firecracker_r,
            patientStore.details.ExternalCauseOfInjury.ext_foreign_body,
            patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion,
            patientStore.details.ExternalCauseOfInjury.ext_encavement,
            patientStore.details.ExternalCauseOfInjury.ext_crushing,
            patientStore.details.ExternalCauseOfInjury.ext_stab_wound,
            patientStore.details.ExternalCauseOfInjury.ext_sharp,
            patientStore.details.ExternalCauseOfInjury.contact_blurt,
            patientStore.details.ExternalCauseOfInjury.ext_vape,
            patientStore.details.ExternalCauseOfInjury.ext_gun,
            patientStore.details.ExternalCauseOfInjury.ext_hang,
            patientStore.details.ExternalCauseOfInjury.ext_maul,
            patientStore.details.ExternalCauseOfInjury.ext_battery,
            patientStore.details.ExternalCauseOfInjury.ext_assault,
            patientStore.details.ExternalCauseOfInjury.ext_transport,
            patientStore.details.ExternalCauseOfInjury.ext_neglect,
            patientStore.details.ExternalCauseOfInjury.ext_sexual,
            patientStore.details.ExternalCauseOfInjury.ext_physical,
            patientStore.details.ExternalCauseOfInjury.ext_other
        ].includes('Y'),
    (hasExternal) => {
        noExternal.value = !hasExternal;
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
    <div :class="noExternal ? 'card custom-shadow mt-3 relative' : 'card mt-3'" style="width: 100%">
        <div :class="noExternal ? 'grid grid-cols-4 gap-2 flex justify-content-center mb-2' : 'grid grid-cols-4 gap-2 flex justify-content-center'">
            <div :style="{ width: width < 950 ? '100%' : width < 1600 ? '49%' : '24%' }">
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
                <!-- <Transition name="slide-fade" mode="out-in">
                    <div class="burns" v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_r !== 'Y'">
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
                            />
                            <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ref_burn_code === ''">
                                <small class="text-red-800 text-xs font-bold">Value is required</small>
                            </div>
                            <div v-if="patientStore.details.ExternalCauseOfInjury.ref_burn_code == '06'">
                                <Textarea
                                    v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_sp"
                                    id="ExternalCauseOfInjury.ext_burn_sp"
                                    class="p-inputtext-filled font-bold max-w-full mt-1 w-25rem myCSS-inputtext-required text-xs"
                                    autoresize
                                    style="text-transform: uppercase"
                                />
                                <div class="flex justify-content-end" v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_sp === ''">
                                    <small class="text-red-800 text-xs font-bold">Value is required</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition> -->
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
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_chem"
                    v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_chem_sp"
                    label="Chemical Substance"
                    :binary="true"
                    :required="getRequiredValidation('ext_chem_sp')"
                />
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
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_fall"
                    v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_falldtl"
                    label=" Fall"
                    :binary="true"
                    :required="getRequiredValidation('ext_falldtl')"
                />
            </div>

            <div :style="{ width: width < 950 ? '100%' : width < 1600 ? '49%' : '24%' }">
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
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_foreign_body"
                    v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_foreign_body_sp"
                    label="Foreign Body Ingestion"
                    :binary="true"
                    :required="getRequiredValidation('ext_foreign_body_sp')"
                />
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion"
                    v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion_sp"
                    label="Caustic Ingestion"
                    :binary="true"
                    :required="getRequiredValidation('ext_caustic_ingestion_sp')"
                />
                <Transition name="slide-fade" mode="out-in">
                    <div class="hang flex align-content-center mt-1" v-if="patientStore.details.ExternalCauseOfInjury.ext_hang !== 'Y'">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_hang" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 align-self-center font-bold"> Hanging/Strangulation </label>
                    </div>
                </Transition>
                <InputTextCheckBoxDoctor2
                    :isExternal="true"
                    v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_crushing"
                    v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_crushing_sp"
                    label="Crushing"
                    :binary="true"
                    :required="getRequiredValidation('ext_crushing_sp')"
                />
                <InputTextCheckBoxDoctor2
                    :isExternal="true"
                    v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_stab_wound"
                    v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_stab_wound_sp"
                    label="Stab Wound"
                    :binary="true"
                    :required="getRequiredValidation('ext_stab_wound_sp')"
                />
            </div>

            <div :style="{ width: width < 950 ? '100%' : width < 1600 ? '49%' : '24%' }">
                <InputTextCheckBoxDoctor2
                    :isExternal="true"
                    v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_sharp"
                    v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_sharp_sp"
                    label=" Contact with sharp objects"
                    :binary="true"
                    :required="getRequiredValidation('ext_sharp_sp')"
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

            <div :style="{ width: width < 950 ? '100%' : width < 1600 ? '49%' : '24%' }">
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

                <!-- <i @click="openVAWCDialog" class="flex badge-button" v-if="patientStore.details.ExternalCauseOfInjury.vawc === 'Y'"></i> -->
                <!-- <Transition name="slide-fade" mode="out-in">
                    <div class="mauling flex align-content-center mt-1" v-if="patientStore.details.ExternalCauseOfInjury.ext_physical !== 'Y'">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_physical" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 align-self-center font-bold"> Physical Abuse </label>
                    </div>
                </Transition> -->
                <InputTextCheckBoxDoctor2
                    v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_other"
                    v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_other_sp"
                    label="Others, (Specify)"
                    :binary="true"
                    :required="getRequiredValidation('ext_other')"
                />
            </div>
        </div>
        <div class="mt-4">
            <strong for="patientHistory" class="font-bold flex justify-content-center text-lg">History of the Patient</strong>
            <Textarea
                v-model="patientStore.details.ExternalCauseOfInjury.ext_history"
                :pt="{
                    root: {
                        style: {
                            width: '100%',
                            overflow: 'hidden',
                            border: '2px dashed #ccc',
                            borderRadius: '4px',
                            padding: '5px',
                            boxSizing: 'border-box',
                            resize: 'none',
                            backgroundColor: '#F2F2F2',
                            color: '#666',
                            fontSize: '13px'
                        }
                    }
                }"
                id="patientHistory"
                placeholder="History of the Patient"
                class="p-inputtext-filled font-bold max-w-full w-full myCSS-inputtext-required text-s mb-2"
                autoResize
            />
        </div>
        <div v-if="noExternal" class="bg-red-200 p-2 absolute bottom-0 left-0 text-center text-gray-700 font-semibold italic" style="border-radius: 0 0 1rem 1rem; width: 100%; font-size: 1rem; margin: 0 !important">Value is Required</div>
    </div>

    <!-- ticked -->

    <div>
        <div style="width: 100%">
            <Transition name="slide-fade" mode="out-in">
                <div class="flex flex-column rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'" style="border: 2px dashed #808080">
                    <div
                        v-if="
                            patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                            (patientStore.details.ExternalCauseOfInjury.ext_bite_sp === '' ||
                                patientStore.details.ExternalCauseOfInjury.dogbiteDegree === '' ||
                                patientStore.details.ExternalCauseOfInjury.bleeding === '' ||
                                patientStore.details.ExternalCauseOfInjury.bitingAnimal === '' ||
                                patientStore.details.ExternalCauseOfInjury.observation === '' ||
                                patientStore.details.ExternalCauseOfInjury.first_aid_code === '' ||
                                patientStore.details.ExternalCauseOfInjury.washingDone === '' ||
                                patientStore.details.ExternalCauseOfInjury.previousARV === '' ||
                                patientStore.details.ExternalCauseOfInjury.tetanusVaccination === '' ||
                                patientStore.details.ExternalCauseOfInjury.allergies === '' ||
                                patientStore.details.ExternalCauseOfInjury.adverseReaction === '' ||
                                (patientStore.details.ExternalCauseOfInjury.hrig !== 'Y' &&
                                    patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
                                    patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
                                    patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
                                    patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
                                    patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
                                    patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y') ||
                                (patientStore.details.ExternalCauseOfInjury.hrig === 'Y' && patientStore.details.ExternalCauseOfInjury.hrig_num === '') ||
                                (patientStore.details.ExternalCauseOfInjury.erig === 'Y' && patientStore.details.ExternalCauseOfInjury.erig_num === '') ||
                                (patientStore.details.ExternalCauseOfInjury.ats === 'Y' && patientStore.details.ExternalCauseOfInjury.ats_num === '') ||
                                (patientStore.details.ExternalCauseOfInjury.pvrv === 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_4 !== 'Y') ||
                                (patientStore.details.ExternalCauseOfInjury.pcec === 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_4 !== 'Y'))
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
                <div class="burns rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_r == 'Y'" style="border: 2px dashed #808080">
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.details.ExternalCauseOfInjury.ref_burn_code === ''" class="flex justify-content-end" style="width: 10rem">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div class="burn flex align-content-center mt-1">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_r" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 align-self-center font-bold"> Burns </label>
                    </div>
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_r == 'Y'" class="mt-1 ml-4">
                        <Dropdown
                            id="ExternalCauseOfInjury.ref_burn_code"
                            required
                            v-model="patientStore.details.ExternalCauseOfInjury.ref_burn_code"
                            placeholder="Select Burn Type"
                            :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.ExternalCauseOfInjury.ref_burn_code }"
                            :options="burnDetails"
                            optionLabel="ref_burn_desc"
                            optionValue="ref_burn_code"
                            style="width: 100%"
                        />
                        <div v-if="patientStore.details.ExternalCauseOfInjury.ref_burn_code == '06'">
                            <div class="flex">
                                <label style="color: #000080" for="ExternalCauseOfInjury.ext_burn_sp " class="text-xs"><i>Specify</i></label>
                            </div>
                            <div class="flex justify-content-center" v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_sp === ''">
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
                <div class="burns rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor == 'Y'" style="border: 2px dashed #808080">
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor === 'Y' && patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor === ''" class="flex justify-content-end" style="width: 10rem">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div class="burn flex align-content-center mt-1">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 align-self-center font-bold"> Burns </label>
                    </div>
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor == 'Y'" class="mt-1 ml-4">
                        <Dropdown
                            id="ExternalCauseOfInjury.ref_burn_code_doctor"
                            required
                            v-model="patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor"
                            placeholder="Select Burn Type"
                            :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor }"
                            :options="burnDetailsDoctor"
                            optionLabel="ref_burn_desc"
                            optionValue="ref_burn_code"
                            style="width: 100%"
                        />
                        <div v-if="patientStore.details.ExternalCauseOfInjury.ref_burn_code_doctor == '92'">
                            <div class="flex">
                                <label style="color: #000080" for="ExternalCauseOfInjury.ext_burn_sp_doctor " class="text-xs"><i>Specify</i></label>
                            </div>
                            <div class="flex justify-content-center" v-if="patientStore.details.ExternalCauseOfInjury.ext_burn_sp_doctor === ''">
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
            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_chem"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_chem_sp"
                label="Chemical Substance"
                :binary="true"
                :required="getRequiredValidation('ext_chem_sp')"
            />
            <Transition name="slide-fade" mode="out-in">
                <div class="drowns rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_drown_r == 'Y'" style="border: 2px dashed #808080">
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_drown_r == 'Y' && patientStore.details.ExternalCauseOfInjury.ref_drowning_cope === ''" class="flex justify-content-end mb-1" style="width: 10rem">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div class="flex jsutify-content-between">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_drown_r" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 font-bold">Drowning</label>
                    </div>

                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_drown_r == 'Y'" class="mt-1 ml-4">
                        <Dropdown
                            id="ExternalCauseOfInjury.ext_expo_nature_r"
                            required
                            v-model="patientStore.details.ExternalCauseOfInjury.ref_drowning_cope"
                            :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.ExternalCauseOfInjury.ref_drowning_cope }"
                            placeholder="Please select"
                            :options="drowningDetails"
                            optionLabel="ref_drowning_desc"
                            optionValue="ref_drowning_cope"
                            style="width: 100%"
                        />
                        <div class="flex mr-5" v-if="patientStore.details.ExternalCauseOfInjury.ext_drown_sp === '' && patientStore.details.ExternalCauseOfInjury.ext_drown_r == 'Y'">
                            <i v-if="patientStore.details.ExternalCauseOfInjury.ref_drowning_cope == '06'" v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                        </div>
                        <div v-if="patientStore.details.ExternalCauseOfInjury.ref_drowning_cope == '06'">
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
                <div class="exposure rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r == 'Y'" style="border: 2px dashed #808080">
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ref_expnature_code === '' && patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r === 'Y'" class="flex justify-content-end mb-2" style="width: 10rem">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div class="flex jsutify-content-between">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 font-bold">Exposure to Forces of Nature</label>
                    </div>

                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r == 'Y'" class="mt-1 ml-4">
                        <Dropdown
                            id="ExternalCauseOfInjury.ext_expo_nature_r"
                            required
                            v-model="patientStore.details.ExternalCauseOfInjury.ref_expnature_code"
                            :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.ExternalCauseOfInjury.ref_expnature_code }"
                            placeholder="Please select"
                            :options="exposureDetails"
                            style="width: 100%"
                            optionLabel="ref_expnature_desc"
                            optionValue="ref_expnature_code"
                            class="p-inputtext-filled font-bold max-w-full myCSS-inputtext-required"
                        />

                        <div v-if="patientStore.details.ExternalCauseOfInjury.ref_expnature_code == '07'">
                            <div class="flex">
                                <label style="color: #000080" for="ExternalCauseOfInjury.ext_expo_nature_sp " class="text-xs"><i>Specify</i></label>
                            </div>
                            <div class="flex justify-content-center" v-if="patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp === ''">
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
            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_fall"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_falldtl"
                label=" Fall"
                :binary="true"
                :required="getRequiredValidation('ext_falldtl')"
            />
            <Transition name="slide-fade" mode="out-in">
                <div class="firecrackers rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_firecracker_r == 'Y'" style="border: 2px dashed #808080">
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_firecracker_r == 'Y' && patientStore.details.ExternalCauseOfInjury.firecracker_code === ''" class="flex justify-content-end mb-2" style="width: 10rem">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div class="flex jsutify-content-between">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_firecracker_r" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 font-bold">Firecracker</label>
                    </div>
                    <div v-if="patientStore.details.ExternalCauseOfInjury.ext_firecracker_r == 'Y'" class="mt-1 ml-4">
                        <Dropdown
                            id="ExternalCauseOfInjury.firecracker_code"
                            required
                            v-model="patientStore.details.ExternalCauseOfInjury.firecracker_code"
                            :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.ExternalCauseOfInjury.firecracker_code }"
                            placeholder="Please select"
                            :options="firecrackerDetails"
                            optionLabel="firecracker_desc"
                            style="width: 100%"
                            optionValue="firecracker_code"
                        />
                        <div class="flex mr-5" v-if="patientStore.details.ExternalCauseOfInjury.ext_firecracker_sp === ''">
                            <i v-if="patientStore.details.ExternalCauseOfInjury.firecracker_code == '88'" v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                        </div>
                        <div v-if="patientStore.details.ExternalCauseOfInjury.firecracker_code == '88'">
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
                :required="getRequiredValidation('ext_foreign_body_sp')"
            />

            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion_sp"
                label="Caustic Ingestion"
                :binary="true"
                :required="getRequiredValidation('ext_caustic_ingestion_sp')"
            />
            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_encavement"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_encavement_sp"
                label="Encavement"
                :binary="true"
                :required="getRequiredValidation('ext_encavement_sp')"
            />
            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_crushing"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_crushing_sp"
                label="Crushing"
                :binary="true"
                :required="getRequiredValidation('ext_crushing_sp')"
            />
            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_stab_wound"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_stab_wound_sp"
                label="Stab Wound"
                :binary="true"
                :required="getRequiredValidation('ext_stab_wound_sp')"
            />
            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_sharp"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_sharp_sp"
                label=" Contact with sharp objects"
                :binary="true"
                :required="getRequiredValidation('ext_sharp_sp')"
            />
            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.contact_blurt"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.contact_blurt_sp"
                label="Contact with Blunt Object"
                :binary="true"
            />

            <Transition name="slide-fade" mode="out-in">
                <div class="htd flex align-content-center mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_vape === 'Y'" style="border: 2px dashed #808080">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_vape" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 align-self-center font-bold"> Vapor/HTD Product </label>
                </div>
            </Transition>
            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_gun"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_gun_sp"
                label="Gunshot"
                :binary="true"
                :required="getRequiredValidation('ext_gun_sp')"
            />
            <Transition name="slide-fade" mode="out-in">
                <div class="hang flex align-content-center mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_hang === 'Y'" style="border: 2px dashed #808080">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_hang" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 align-self-center font-bold"> Hanging/Strangulation </label>
                </div>
            </Transition>
            <!-- <Transition name="slide-fade" mode="out-in">
                <div class="mauling flex align-content-center mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_maul === 'Y'" style="border: 2px dashed #808080">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_maul" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 align-self-center font-bold"> Mauling </label>
                </div>
            </Transition> -->
            <!-- <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_battery"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_battery_sp"
                label="Battery"
                :binary="true"
                :required="getRequiredValidation('ext_battery_sp')"
            /> -->
            <Transition name="slide-fade" mode="out-in">
                <div class="mauling mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_battery === 'Y'" style="border: 2px dashed #808080">
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
                            <div v-if="patientStore.details.ExternalCauseOfInjury.ext_battery === 'Y' && patientStore.details.generalData.perpetrator_sp === ''" class="flex justify-content-end" style="width: 10rem">
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
            <!-- <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_assault"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_assault_sp"
                label="Assault"
                :binary="true"
                :required="getRequiredValidation('ext_assault_sp')"
            /> -->
            <Transition name="slide-fade" mode="out-in">
                <div class="mauling mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_assault === 'Y'" style="border: 2px dashed #808080">
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
                            <div v-if="patientStore.details.ExternalCauseOfInjury.ext_assault === 'Y' && patientStore.details.generalData.perpetrator_sp === ''" class="flex justify-content-end" style="width: 10rem">
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
                <div class="flex flex-column rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y'" style="border: 2px dashed #808080">
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
                <div class="mauling flex align-content-center mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_neglect === 'Y'" style="border: 2px dashed #808080">
                    <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_neglect" trueValue="Y" falseValue="N" id="inputswitch" />
                    <label for="inputswitch" class="mx-2 align-self-center font-bold"> Neglect </label>
                </div>
            </Transition>
            <!-- <Transition name="slide-fade" mode="out-in">
                <div class="mauling flex justify-content-between mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_sexual === 'Y'" style="border: 2px dashed #808080">
                    <div class="flex">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_sexual" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="font-bold ml-2 mt-1"> Sexual Abuse </label>
                    </div>
                      <i @click="openVAWCDialog" class="flex badge-button" v-if="patientStore.details.ExternalCauseOfInjury.vawc === 'Y'">
                        <div class="bite-details-container">
                            <strong>WCPU</strong>
                        </div>
                    
                    <div v-if="patientStore.details.generalData.perpetrator === 'Y'" style="width: 98%;" class="mt-1 ml-4">
                        <div class="flex column">
                            <div class="flex justify-content-between" style="width: 100%">
                                <label style="color: #000080" for="perpetratorRelationships" class="text-s mt-1"><i>Relationship</i></label>
                            </div>
                        </div>
                        <Dropdown
                            id="perpetratorRelationships"
                            class="font-bold"
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
            </Transition> -->
            <Transition name="slide-fade" mode="out-in">
                <div class="mauling mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_sexual === 'Y'" style="border: 2px dashed #808080">
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
                            <div v-if="patientStore.details.ExternalCauseOfInjury.ext_sexual === 'Y' && patientStore.details.generalData.perpetrator_sp === ''" class="flex justify-content-end" style="width: 10rem">
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
            <!-- <Transition name="slide-fade" mode="out-in">
                <div class="mauling flex justify-content-between mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_physical === 'Y'" style="border: 2px dashed #808080">
                    <div class="flex">
                        <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_physical" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="font-bold ml-2 mt-1"> Physical Abuse </label>
                    </div>
                     <i @click="openVAWCDialog" class="badge-button flex" v-if="patientStore.details.ExternalCauseOfInjury.vawc === 'Y'">
                        <div class="bite-details-container">
                            <strong>WCPU</strong>
                        </div>
                    </i>  
                    <div v-if="patientStore.details.generalData.perpetrator === 'Y'" style="width: 98%;" class="mt-1 ml-4">
                        <div class="flex column">
                            <div class="flex justify-content-between" style="width: 100%">
                                <label style="color: #000080" for="perpetratorRelationships" class="text-s mt-1"><i>Relationship</i></label>
                            </div>
                        </div>
                        <Dropdown
                            id="perpetratorRelationships"
                            class="font-bold"
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
            </Transition> -->
            <!-- <Transition name="slide-fade" mode="out-in">
                <div class="mauling mt-1 rainbow-border" v-if="patientStore.details.ExternalCauseOfInjury.ext_physical === 'Y'" style="border: 2px dashed #808080">
                    <div style="width: 100%">
                        <div class="flex">
                            <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.ext_physical" trueValue="Y" falseValue="N" id="inputswitch" />
                            <label for="inputswitch" class="font-bold ml-2 mt-1"> Sexual Abuse</label>
                        </div>
                    </div>
                    <div v-if="patientStore.details.generalData.perpetrator === 'Y'" style="width: 98%" class="mt-1 ml-4">
                        <div class="flex column">
                            <div class="flex justify-content-between" style="width: 100%">
                                <label style="color: #000080" for="perpetratorRelationships" class="text-s mt-1"><i>Relationship</i></label>
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
            </Transition>-->
            <InputTextCheckBoxDoctor
                :isExternal="true"
                v-model:modelValue="patientStore.details.ExternalCauseOfInjury.ext_other"
                v-model:desc="patientStore.details.ExternalCauseOfInjury.ext_other_sp"
                label="Others, (Specify)"
                :binary="true"
                :required="getRequiredValidation('ext_other')"
            />
        </div>
    </div>
    <Dialog v-model:visible="biteDialog" modal header="ANIMAL BITE FORM" :style="{ width: '98%', height: '90vh' }">
        <BiteForm />
    </Dialog>
    <Dialog v-model:visible="vawcDialog" maximizable @hide="isInputNull()" header="Findings and Impressions" position="left" :style="{ width: '64%', height: '90%' }">
        <VawcForm />
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

<style scoped>
.custom-shadow {
    box-shadow: 0 2px 7px rgba(255, 0, 0, 0.5);
    transition: box-shadow 0.3s ease;
}

.custom-shadow:hover {
    box-shadow: 0 6px 20px rgba(255, 0, 0, 0.75);
}
.badge-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.badge-button:focus {
    outline: none;
}

.rainbow-border {
    border: 3px solid transparent;
    margin: 3px;
    border-radius: 3px;
    padding: 3px;
    background-color: #f9f9f9;
}

.fancy-button {
    background-color: #4caf50;
    color: white;
    border: none;
    margin-right: 20px;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.fancy-button:hover {
    background-color: #45a049;
    transform: scale(1.05);
}

.bite-details-container {
    border: 4px solid #38afd3;
    background-color: #38afd3;
    padding: 0px;
    border-radius: 3px;
    display: inline-block;
}

.fancy-button:focus {
    outline: none;
}

/* . {
    background-color: #4caf50;
} */

.try {
    font-size: 10px;
    display: flex;
    justify-content: space-between;
    margin-right: 30%;
}

.line {
    height: 1px;
    background-color: rgb(139, 134, 134);
    width: 100%;
    margin: 5px 0;
}

.p-fluid {
    margin-bottom: 1rem;
}

.p-input-icon-left {
    width: 100%;
}

.DataTable {
    margin-top: 1rem;
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

.details-container {
    border: 4px solid #38afd3;
    background-color: #38afd3;
    padding: 0px;
    border-radius: 3px;
    display: inline-block;
}
</style>
