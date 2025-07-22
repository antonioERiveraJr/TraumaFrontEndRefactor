<script setup>
import { usePatientStore } from '../../../../store/injury/patientStore';
import { ref, watch, defineEmits, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import LibraryService from '@/service/LibraryService';
import Textarea from 'primevue/textarea';
import UntickedExternalSwiches from './formInterfaces/untickedSwitches/untickedExternalSwiches.vue';
import TickedExternalSwitches from './formInterfaces/tickedSwitches/tickedExternalSwitches.vue';

const patientStore = usePatientStore();
const loading = ref(true);
const libraryService = new LibraryService();
const biteDialog = ref(false);
const biteButton = ref(false);
const compiledOtherExternal = ref();
const compiledOtherPhysical = ref();
const landVehicles = libraryService.getLandVehicles();
const airVehicles = libraryService.getAirVehicles();
const waterVehicles = libraryService.getWaterVehicles();
const displayGeneratedDiagnosis = ref(false);
const openTransportVehicularDialog = ref(false);
const dataIsLoaded = ref(false);
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
        if (patientStore.details.ExternalCauseOfInjury.ext_battery === 'Y') {
            externalCauses.push(' Battery');
            patientStore.details.generalData.perpetrator = 'Y';
            if (patientStore.details.generalData.perpetrator_sp) {
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
            if (patientStore.details.generalData.perpetrator_sp) {
                if (patientStore.details.generalData.perpetrator_sp === '11') {
                    specifyExternalDetails.push(`SA ${patientStore.details.generalData.perpetrator_oth_sp}\n`);
                } else {
                    specifyExternalDetails.push(`SA(Relationship to Perpetrator): ${libraryService.getPerpetratorRelationships().find((perpetrator) => perpetrator.value === patientStore.details.generalData.perpetrator_sp)?.label}\n`);
                }
            }
        }
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

    dataIsLoaded.value = true;
};
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

// watch(
//     () => biteDialog.value,
//     async (newValue) => {
//         if (
//             (!newValue && patientStore.details.preAdmissionData.first_aid_code === 'Y' && patientStore.details.preAdmissionData.firstaid_others === '') ||
//             (!newValue && patientStore.details.preAdmissionData.first_aid_code === 'Y' && patientStore.details.preAdmissionData.firstaid_others2 === '')
//         ) {
//             if (patientStore.details.preAdmissionData.firstaid_others2 === '') {
//                 await Swal.fire({
//                     icon: 'warning',
//                     title: 'INVALID INPUT',
//                     text: 'Please fill in the By Whom Field',
//                     confirmButtonText: 'OK'
//                 });
//                 biteDialog.value = true;
//             } else {
//                 await Swal.fire({
//                     icon: 'warning',
//                     title: 'INVALID INPUT',
//                     text: 'Please fill in the Firs Aid Field',
//                     confirmButtonText: 'OK'
//                 });
//                 biteDialog.value = true;
//             }
//         }
//     }
// );
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
            <UntickedExternalSwiches :dataIsLoaded="dataIsLoaded" :width="width" :height="height" />
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
    <TickedExternalSwitches :dataIsLoaded="dataIsLoaded" />
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

.details-container {
    border: 4px solid #38afd3;
    background-color: #38afd3;
    padding: 0px;
    border-radius: 3px;
    display: inline-block;
}
</style>
