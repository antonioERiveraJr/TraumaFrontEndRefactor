<script setup>
import { useToast } from 'primevue/usetoast';
import { inject, ref, computed, watch, onMounted } from 'vue';
import { usePatientStore } from '@/store/injury/PatientStore';
import useToastWaitingForFetch from '@/composables/useToastWaitingForFetch';
// import InjuryService from '../../service/InjuryService';
import createValidationRules from '../../validation/ABTCValidation';
import Swal from 'sweetalert2';
import { useUserStore } from '../../store/general/UserStore';
const user = useUserStore();
const toast = useToast();
const emit = defineEmits(['update:saving', 'update:customizedObjectives', 'update:customizedDiagnosis', 'update:customizedDetails']);
const v = inject('v$');
const patientStore = usePatientStore();
// const injuryService = new InjuryService();
const isUpdateForm = ref(false);
const confirmEMRDetails = ref(false);
const isLocked = ref(false);
const props = defineProps({
    latestEntry: {
        type: Object,
        required: false
    },
    objective: {
        type: Array,
        required: false
    },
    details: {
        type: String,
        required: false
    },
    diagnosis: {
        type: String,
        required: false
    }
});

// const diag = ref(props.diagnosis);
// const det = ref(props.details);
// const obj = ref(props.objective);

const diag = ref(patientStore.header.doctor_diagnosis);
const det = ref(patientStore.finalDoctorDetails);
const obj = ref(patientStore.header.doctor_objective);
const plan = ref(patientStore.header.doctor_plan);
const loader = ref(true);

const allowUpdateForm = async () => {
    // console.log('empID: ', user.userInfo.employeeid, 'entryBy: ', props?.latestEntry?.value?.entryby);
    if (user.userInfo.employeeid === props?.latestEntry?.value?.entryby) {
        isUpdateForm.value = true;
    } else {
        loader.value = false;
        patientStore.ufiveID = '';
    }

    loader.value = false;
};

const regionName = computed(() => {
    console.log('regions: ', patientStore.storeRegions);
    const region = patientStore?.storeRegions.find((reg) => reg.regcode === patientStore.details.generalData.plc_regcode);
    return region ? region.regname : 'Unknown Region';
});

const provinceName = computed(() => {
    const province = patientStore?.storeProvinces.find((prov) => prov.provcode === patientStore.details.generalData.plc_provcode);
    return province ? province.provname : 'Unknown Province';
});
const cityName = computed(() => {
    const city = patientStore?.storeCities.find((city) => city.ctycode === patientStore.details.generalData.plc_ctycode);
    return city ? city.ctyname : 'Unknown City';
});
const barangayName = computed(() => {
    const barangay = patientStore?.storeBrgy.find((bgy) => bgy.bgycode === patientStore.details.generalData.plc_bgycode);
    return barangay ? barangay.bgyname : 'Unknown Barangay';
});

const savePatientData = async () => {
    //set to expoert after doctor saved the form
    patientStore.header.status = '1';
    patientStore.status = '1';
    // console.log('stats: ', patientStore.status);

    //

    let injIntentCode = '';
    switch (patientStore.details.preAdmissionData.inj_intent_code) {
        case '01':
            injIntentCode = 'UNINT';
            break;
        case '02':
            injIntentCode = 'VIOLE';
            break;
        case '03':
            injIntentCode = 'SELFI';
            break;
        case '99':
            injIntentCode = 'UNDET';
            break;
        default:
            injIntentCode = '';
    }
    injIntentCode;
    let placeOccCode = '';
    switch (patientStore.details.preAdmissionData.place_occ_code) {
        case '10':
            placeOccCode = 'HOME';
            break;
        case '50':
            placeOccCode = 'ROAD';
            break;
        case '30':
            placeOccCode = 'SCHO';
            break;
        case '60':
            placeOccCode = 'VIDE';
            break;
        case '70':
            placeOccCode = 'WORK';
            break;
        case '99':
            placeOccCode = 'UNDET';
            break;
        case '88':
            placeOccCode = 'OTHE';
            break;
        default:
            placeOccCode = '';
    }
    placeOccCode;
    const getNoi = patientStore.header.doctor_noi.join(', ');
    console.log('noi: ', getNoi);
    // await injuryService.updateMedilogs(patientStore.enccode, patientStore.details.generalData.doctor_injtme, getNoi, placeOccCode, injIntentCode);
    patientStore.details.hospitalFacilityData.disposition_code = patientStore.header.dispcode;
    patientStore.details.hospitalFacilityData.condition_code = patientStore.header.condcode;

    // const insert = await injuryService.insertObjSubj(
    //     patientStore.enccode,
    //     'NOI: ' +
    //         patientStore.header.doctor_noi +
    //         '\nPOI: ' +
    //         `${regionName.value} , ` +
    //         `${provinceName.value} ,` +
    //         `${cityName.value} ,` +
    //         `${barangayName.value} ` +
    //         '\nDOI: ' +
    //         patientStore.details.generalData.doctor_doi +
    //         '\nTOI: ' +
    //         patientStore.details.generalData.doctor_toi +
    //         '\n' +
    //         '\nDetail(s): \n' +
    //         patientStore.header.final_doctor_details,
    //     patientStore.header.final_doctor_objective,
    //     patientStore.header.hpercode,
    //     isUpdateForm.value,
    //     patientStore.ufiveID
    // );

    // if (!patientStore.ufiveID) {
    //     patientStore.ufiveID = insert?.data?.data?.id;
    // }
    // update objective
    (patientStore.header.objective =
        'NOI: ' +
        patientStore.header.doctor_noi +
        ' POI: ' +
        `${regionName.value} , ` +
        `${provinceName.value} ,` +
        `${cityName.value} ,` +
        `${barangayName.value} ` +
        ' DOI: ' +
        patientStore.details.generalData.doctor_doi +
        ' TOI: ' +
        patientStore.details.generalData.doctor_toi +
        '\n' +
        '\nDetail(s): \n' +
        patientStore.header.final_doctor_details),
        //update subjective
        (patientStore.header.subjective = patientStore.header.doctor_objective);

    //update injrem
    patientStore.header.injrem = patientStore.header.doctor_noi;

    //update diagnosis
    patientStore.details.hospitalFacilityData.diagnosis = patientStore.header.final_doctor_diagnosis;
    patientStore.header.dx = patientStore.header.final_doctor_diagnosis;
    // if (patientStore.firstDiagnosis) {
    //     await injuryService.insertBillingDiagnosis(patientStore.enccode, patientStore.header.final_doctor_diagnosis, patientStore.header.hpercode);
    // }
    // await injuryService.insertDiagnosis(patientStore.enccode, patientStore.header.final_doctor_diagnosis, isUpdateForm.value);

    const response = await patientStore.saveOPDFormattedData();
    console.log('insertPlan: ', patientStore.doctor_plan);

    // const insertChiefComplaint = await injuryService.insertChiefComplaint(patientStore.enccode, patientStore.chief_complaint, patientStore.header.hpercode, isUpdateForm.value, patientStore.ufiveID);
    console.log('insertChiefComplaint: ', patientStore.chief_complaint);

    return response;
};

const toastWaitingForFetchSave = useToastWaitingForFetch(
    {
        waitingSeverity: 'info',
        waitingSummary: 'Saving...',
        waitingMessage: 'Please wait...'
    },
    {
        successSeverity: 'success',
        successSummary: 'Save successful',
        successMessage: 'You may now go back to the list...'
    },
    { severity: 'error', summary: 'Error', detail: 'Data not saved' },
    { asyncFunction: savePatientData, asyncFunctionParams: [] }
);

const toOthers = () => {
    //set the value of mult_inj for ONEISS
    const fields = patientStore.details.multipleFields;
    const hasMultipleInjury = Object.values(fields).some((value) => value === 'Y');

    if (hasMultipleInjury) {
        patientStore.details.natureOfInjury.mult_inj = 'Y';
    }
};

const submitForm = async () => {
    const result = await v.value.$validate();
    if (result) {
        const response = await toastWaitingForFetchSave.fetchData();

        patientStore.header.status = '1';
        patientStore.status = '1';
        if (response.status == 200) {
            localStorage.setItem('enccode', JSON.stringify(patientStore.enccode));
            localStorage.setItem('status', JSON.stringify('1'));
            localStorage.setItem('header', JSON.stringify(patientStore.header));
            localStorage.setItem('details', JSON.stringify(patientStore.details));
        }
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'The form contains invalid entries',
            life: 2000
        });
    }
    return result;
};

// Clear all values of the unselected subfields.
const removeUnusedString = () => {
    const externalCause = patientStore.details.ExternalCauseOfInjury;
    const natureOfInjury = patientStore.details.natureOfInjury;
    const transportAccident = patientStore.details.forTransportVehicularAccident;

    const fieldsToClear = [
        { condition: externalCause.ext_drown_r === 'N', fields: ['ExternalCauseOfInjury.ext_drown_sp'] },
        { condition: externalCause.ext_expo_nature_r === 'N', fields: ['ExternalCauseOfInjury.ext_expo_nature_sp'] },
        { condition: externalCause.ext_firecracker_r === 'N', fields: ['ExternalCauseOfInjury.ext_firecracker_sp'] },
        { condition: externalCause.ext_foreign_body === 'N', fields: ['ExternalCauseOfInjury.ext_foreign_body_sp'] },
        { condition: externalCause.ext_caustic_ingestion === 'N', fields: ['ExternalCauseOfInjury.ext_caustic_ingestion_sp'] },
        { condition: externalCause.ext_encavement === 'N', fields: ['ExternalCauseOfInjury.ext_encavement_sp'] },
        { condition: externalCause.ext_crushing === 'N', fields: ['ExternalCauseOfInjury.ext_crushing_sp'] },
        { condition: externalCause.ext_stab_wound === 'N', fields: ['ExternalCauseOfInjury.ext_stab_wound_sp'] },
        { condition: externalCause.ext_sharp === 'N', fields: ['ExternalCauseOfInjury.ext_sharp_sp'] },
        { condition: externalCause.contact_blurt === 'N', fields: ['ExternalCauseOfInjury.contact_blurt_sp'] },
        { condition: externalCause.ext_vape === 'N', fields: ['ExternalCauseOfInjury.ext_vape_sp'] },
        { condition: externalCause.ext_gun === 'N', fields: ['ExternalCauseOfInjury.ext_gun_sp'] },
        { condition: externalCause.ext_hang === 'N', fields: ['ExternalCauseOfInjury.ext_hang_sp'] },
        { condition: externalCause.ext_maul === 'N', fields: ['ExternalCauseOfInjury.ext_maul_sp'] },
        { condition: externalCause.ext_transport === 'N', fields: ['ExternalCauseOfInjury.ext_transport_sp'] },
        { condition: externalCause.ext_sexual === 'N', fields: ['ExternalCauseOfInjury.ext_sexual_sp'] },
        { condition: externalCause.ext_physical === 'N', fields: ['ExternalCauseOfInjury.ext_physical_sp'] },
        { condition: externalCause.ext_neglect === 'N', fields: ['ExternalCauseOfInjury.ext_neglect_sp'] },
        { condition: externalCause.vawc === 'N', fields: ['ExternalCauseOfInjury.vawc_sp'] },
        { condition: natureOfInjury.noi_abrasion === 'N', fields: ['natureOfInjury.noi_abradtl'] },
        { condition: natureOfInjury.noi_avulsion === 'N', fields: ['natureOfInjury.noi_avuldtl'] },
        { condition: natureOfInjury.noi_burn_r === 'N', fields: ['natureOfInjury.degree_burn1', 'natureOfInjury.degree_burn2', 'natureOfInjury.degree_burn3', 'natureOfInjury.degree_burn4', 'natureOfInjury.noi_burndtl'] },
        { condition: natureOfInjury.noi_brain === 'N', fields: ['natureOfInjury.noi_brain_stg', 'natureOfInjury.noi_braindtl'] },
        { condition: natureOfInjury.noi_gunshot === 'N', fields: ['natureOfInjury.noi_gunshotdtl'] },
        { condition: natureOfInjury.noi_stab_wound === 'N', fields: ['natureOfInjury.noi_stab_wounddtl'] },
        { condition: natureOfInjury.noi_disl_open === 'N', fields: ['natureOfInjury.noi_disl_open_sp'] },
        { condition: natureOfInjury.noi_disl_close === 'N', fields: ['natureOfInjury.noi_disl_close_sp'] },
        {
            condition: transportAccident.risk_none === 'N',
            fields: [
                'forTransportVehicularAccident.risk_alcliq',
                'forTransportVehicularAccident.risk_sleep',
                'forTransportVehicularAccident.risk_smoke',
                'forTransportVehicularAccident.risk_mobpho',
                'forTransportVehicularAccident.risk_other',
                'forTransportVehicularAccident.risk_etc_spec'
            ]
        },
        {
            condition: transportAccident.safe_none === 'N',
            fields: [
                'forTransportVehicularAccident.safe_unkn',
                'forTransportVehicularAccident.safe_airbag',
                'forTransportVehicularAccident.safe_helmet',
                'forTransportVehicularAccident.safe_cseat',
                'forTransportVehicularAccident.safe_sbelt',
                'forTransportVehicularAccident.safe_vest',
                'forTransportVehicularAccident.safe_other',
                'forTransportVehicularAccident.safe_etc_spec'
            ]
        },
        { condition: natureOfInjury.noi_concussion === 'N', fields: ['natureOfInjury.noi_concussiondtl'] },
        { condition: natureOfInjury.noi_contusion === 'N', fields: ['natureOfInjury.noi_contudtl'] },
        { condition: natureOfInjury.noi_frac_ope === 'N', fields: ['natureOfInjury.noi_fropdtl'] },
        { condition: natureOfInjury.noi_frac_clo === 'N', fields: ['natureOfInjury.noi_frcldtl'] },
        { condition: natureOfInjury.noi_owound === 'N', fields: ['natureOfInjury.noi_owoudtl'] },
        { condition: natureOfInjury.noi_amp === 'N', fields: ['natureOfInjury.noi_ampdtl'] },
        { condition: natureOfInjury.noi_others === 'N', fields: ['natureOfInjury.noi_otherinj'] },
        { condition: externalCause.ext_bite === 'N', fields: ['ExternalCauseOfInjury.ext_bite_sp', 'ExternalCauseOfInjury.dogbiteDegree', 'ExternalCauseOfInjury.arvDate', 'ExternalCauseOfInjury.lastTetanusDose'] },
        { condition: externalCause.ext_burn_r === 'N', fields: ['ExternalCauseOfInjury.ref_burn_code', 'ExternalCauseOfInjury.ext_burn_sp'] },
        { condition: externalCause.ext_drown_r === 'N', fields: ['ExternalCauseOfInjury.ref_drowning_cope', 'ExternalCauseOfInjury.ext_drown_sp'] },
        { condition: externalCause.ext_expo_nature_r === 'N', fields: ['ExternalCauseOfInjury.ref_expnature_code'] },
        { condition: externalCause.ext_sharp === 'N', fields: ['ExternalCauseOfInjury.ext_sharp_sp'] },
        { condition: externalCause.ext_fall === 'N', fields: ['ExternalCauseOfInjury.ext_falldtl'] },
        { condition: externalCause.ext_chem === 'N', fields: ['ExternalCauseOfInjury.ext_chem_sp'] },
        { condition: externalCause.ext_firecracker_r === 'N', fields: ['ExternalCauseOfInjury.firecracker_code', 'ExternalCauseOfInjury.ext_firecracker_sp'] },
        { condition: externalCause.ext_other === 'N', fields: ['ExternalCauseOfInjury.ext_other_sp'] },
        { condition: patientStore.details.hospitalFacilityData.mode_transport_code !== '04', fields: ['hospitalFacilityData.stat_reachdtl'] }
    ];

    fieldsToClear.forEach(({ condition, fields }) => {
        if (condition) {
            fields.forEach((field) => {
                const [section, key] = field.split('.');
                if (key) {
                    patientStore.details[section][key] = '';
                } else {
                    patientStore.details[section] = '';
                }
            });
        }
    });
};

const confirmSaves = async () => {
    if (!patientStore.header.final_doctor_diagnosis) {
        patientStore.header.final_doctor_diagnosis = patientStore.header.doctor_diagnosis;
    }
    if (!patientStore.header.final_doctor_details) {
        patientStore.header.final_doctor_details = patientStore.finalDoctorDetails;
    }
    if (!patientStore.header.final_doctor_objective) {
        patientStore.header.final_doctor_objective = patientStore.header.doctor_objective;
    }
    removeUnusedString();
    if (patientStore.details.ExternalCauseOfInjury.ref_expnature_code !== '07') {
        patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp = '';
    }
    const isFormValid = () => {
        if (patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y') {
            if (patientStore.details.ExternalCauseOfInjury.allergies === '') {
                patientStore.details.ExternalCauseOfInjury.allergies = 'NONE';
            }
            if (patientStore.details.ExternalCauseOfInjury.adverseReaction === '') {
                patientStore.details.ExternalCauseOfInjury.adverseReaction = 'NONE';
            }
        }
        const validationRules = createValidationRules();
        removeUnusedString();
        const missingFields = [];

        for (const [section, fields] of Object.entries(validationRules)) {
            for (const [field, rules] of Object.entries(fields)) {
                if (rules.required && !patientStore.details[section][field]) {
                    missingFields.push(field);
                }

                if (rules.requiredIf) {
                    const condition = rules.requiredIf;
                    if (condition && !patientStore.details[section][field]) {
                        missingFields.push(field);
                    }
                }
            }
        }

        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields); // Log the missing fields
            return false;
        }
        return true;
    };

    if (!isFormValid()) {
        Swal.fire({
            icon: 'error',
            title: 'Some required fields are blank and need to be completed.',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    } else {
        diag.value = patientStore.header.doctor_diagnosis;
        det.value = patientStore.finalDoctorDetails;
        obj.value = patientStore.header.doctor_objective;
        plan.value = patientStore.doctor_plan;
        confirmEMRDetails.value = true;
    }
    if (diag.value === '') {
        diag.value = patientStore.header.doctor_diagnosis;
    }
    if (det.value === '') {
        det.value = patientStore.finalDoctorDetails;
    }
    if (obj.value === '') {
        obj.value = patientStore.header.doctor_objective;
    }

    // return new Promise((resolve, reject) => {
    //     Swal.fire({
    //         title: 'Do you want to save the changes?',
    //         text: "This will only update the TSS; it won't reflect on the EMR.",
    //         showDenyButton: true,
    //         position: 'bottom',
    //         confirmButtonText: 'Save',
    //         denyButtonText: `Cancel`
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             loader.value = true;
    //             emit('update:saving', true);
    //             try {
    //                 if (patientStore.header.doctor_injtme) {
    //                     patientStore.header.injtme = patientStore.header.doctor_injtme;
    //                 }
    //                 if (patientStore.finalDiagnosis) {
    //                     patientStore.header.doctor_details = patientStore.finalDiagnosis;
    //                 }
    //                 await submitForm();
    //                 await toOthers();
    //                 patientStore.header.doctor_details = patientStore.header.doctor_details + '\n' + patientStore.textFactorSafety;

    //                 confirmEMRDetails.value = false;
    //                 loader.value = false;
    //                 emit('update:saving', false);
    //                 patientStore.loadSignal = true;
    //                 Swal.fire('Saved!', '', 'success');
    //                 resolve();
    //                 await new Promise((resolve) => setTimeout(resolve, 3000)); // Add delay of 1 second
    //                 window.close();
    //             } catch (error) {
    //                 reject(error);
    //             }
    //         } else if (result.isDenied) {
    //             Swal.fire('Changes are not saved', '', 'info');
    //             confirmEMRDetails.value = false;
    //         } else {
    //             console.log('saving cancelled');
    //             confirmEMRDetails.value = false;
    //         }
    //     });
    // });

    //swal alert confirmation for save

    // return new Promise((resolve, reject) => {
    //     Swal.fire({
    //         title: 'Important Information',
    //         text: 'This will only change/update the TSS form and will not affect the data in the EMR.',
    //         icon: 'info',
    //         confirmButtonText: 'OK'
    //     }).then(() => {
    //         //set the values of det, obj, and diag to generated text
    //         diag.value = patientStore.header.doctor_diagnosis;
    //         det.value = patientStore.finalDoctorDetails;
    //         obj.value = patientStore.header.doctor_objective;
    //         plan.value = patientStore.doctor_plan;
    //         confirmEMRDetails.value = true;
    //         Swal.fire({
    //             title: 'Do you want to save the changes on TSS Form only?',
    //             text: 'This will only update the TSS; it will not reflect on the EMR.',
    //             showDenyButton: true,
    //             position: 'bottom',
    //             confirmButtonText: 'Save',
    //             denyButtonText: 'Cancel'
    //         }).then(async (result) => {
    //             if (result.isConfirmed) {
    //                 // Inform the user about the TSS change
    //                 loader.value = true;
    //                 emit('update:saving', true);
    //                 try {
    //                     if (patientStore.header.doctor_injtme) {
    //                         patientStore.header.injtme = patientStore.header.doctor_injtme;
    //                     }
    //                     if (patientStore.finalDiagnosis) {
    //                         patientStore.header.doctor_details = patientStore.finalDiagnosis;
    //                     }
    //                     await submitForm();
    //                     await toOthers();
    //                     patientStore.header.doctor_details += '\n' + patientStore.textFactorSafety;

    //                     confirmEMRDetails.value = false;
    //                     loader.value = false;
    //                     emit('update:saving', false);
    //                     patientStore.loadSignal = true;
    //                     Swal.fire('Saved!', '', 'success');
    //                     resolve();
    //                     await new Promise((resolve) => setTimeout(resolve, 3000)); // Add delay of 3 seconds
    //                     window.close();
    //                 } catch (error) {
    //                     reject(error);
    //                 }
    //             } else if (result.isDenied) {
    //                 Swal.fire('Changes are not saved', '', 'info');
    //                 confirmEMRDetails.value = false;
    //             } else {
    //                 console.log('saving cancelled');
    //                 confirmEMRDetails.value = false;
    //             }
    //         });
    //     });
    // });
};
const saveForm = async () => {
    loader.value = true;
    emit('update:saving', true);
    if (patientStore.header.doctor_injtme) {
        patientStore.header.injtme = patientStore.header.doctor_injtme;
    }
    if (patientStore.finalDiagnosis) {
        patientStore.header.doctor_details = patientStore.finalDiagnosis;
    }
    await submitForm();
    await toOthers();
    patientStore.header.doctor_details += '\n' + patientStore.textFactorSafety;

    confirmEMRDetails.value = false;
    loader.value = false;
    emit('update:saving', false);
    patientStore.loadSignal = true;
    Swal.fire('Saved!', '', 'success');
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Add delay of 3 seconds
    window.close();
};

const cancelForm = async () => {
    confirmEMRDetails.value = false;
    Swal.fire('Changes are not saved', '', 'info');
};
const patientDataIsLoaded = async () => {
    // await user.getUserInfo();
    allowUpdateForm();
};
watch(
    () => patientStore.latestEntryAvailable,
    (newValue) => {
        if (newValue === true) {
            patientDataIsLoaded();
        }
    }
);

watch(
    () => props.details,
    (newValue) => {
        if (newValue) {
            det.value = newValue;
        }
    }
);

watch(
    () => props.objective,
    (newValue) => {
        if (newValue) {
            obj.value = newValue;
        }
    }
);
watch(
    () => props.diagnosis,
    (newValue) => {
        if (newValue) {
            diag.value = newValue;
        }
    }
);
watch(obj, (newValue) => {
    emit('update:customizedObjectives', newValue);
});

watch(diag, (newValue) => {
    emit('update:customizedDiagnosis', newValue);
});

watch(det, (newValue) => {
    emit('update:customizedDetails', newValue);
});
onMounted(() => {
    allowUpdateForm();
});
</script>
<template>
    <!-- <div v-if="loader" class="flex justify-content-center align-items-center" style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh; backdrop-filter: blur(5px); z-index: 9999; background-color: rgba(255, 255, 255, 0.5)"></div> -->
    <div style="width: 100%; height: 100%">
        <span class="flex" style="width: 100%; height: 100%">
            <div v-if="isLocked === '1'"><Message :closable="false">Encounter is Locked</Message></div>
            <div v-else style="width: 100%; height: 100%">
                <div v-if="isUpdateForm" style="width: 100%; height: 100%">
                    <Button
                        label="Update (TSS Only)"
                        icon="pi pi-save"
                        style="background-color: darkolivegreen; width: 100%; height: 100%"
                        class="border border-gray-400 rounded-lg text-white font-semibold hover:bg-green-400 transition duration-200 ease-in-out shadow-lg"
                        v-tooltip.top="{ value: 'Click to update your latest form', class: 'text-center' }"
                        @click="confirmSaves($event)"
                    />
                </div>
                <div v-else style="width: 100%; height: 100%">
                    <Button
                        label="Save (TSS Only)"
                        icon="pi pi-save"
                        style="background-color: darkolivegreen; width: 100%; height: 100%"
                        class="border border-gray-300 rounded-lg text-white font-semibold hover:bg-green-400 transition duration-200 ease-in-out shadow-lg"
                        v-tooltip.top="{ value: 'This will only update the TSS; it will not reflect on the EMR.', class: 'text-center' }"
                        @click="confirmSaves($event)"
                    />
                </div>
            </div>
        </span>
    </div>
    <div v-if="confirmEMRDetails" style="width: 100vw; height: 100vh; position: fixed; z-index: 1000">
        <Dialog
            v-model:visible="confirmEMRDetails"
            header="Verify the details to be saved on the TSS."
            style="width: 100%; height: 100vh; margin-left: 5%; margin-top: 5%"
            :closable="false"
            maximize
            :draggable="false"
            :resizable="false"
            :showHeader="true"
        >
            <Splitter layout="vertical" style="height: 100%">
                <SplitterPanel :size="75">
                    <Splitter style="height: 100%; overflow: auto">
                        <SplitterPanel style="height: 100%" :size="50">
                            <div class="flex justify-content-center">
                                <h5 style="color: #000080" class="font-bold">GENERATED TEXT</h5>
                            </div>
                            <label for="details" class="p-float-label text-black text-s ml-5" style="color: #000080"><i>Details </i></label>
                            <div>
                                <div class="flex align-items-center" style="position: relative">
                                    <Textarea
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
                                                    backgroundColor: '#ececec',
                                                    color: '#666',
                                                    fontSize: '13px'
                                                }
                                            }
                                        }"
                                        style="width: 100%"
                                        v-model="patientStore.finalDoctorDetails"
                                        class="mt-1 justify-content-center mr-2 ml-5"
                                        disabled
                                        autoResize
                                    />
                                    <i class="pi pi-copy cursor-pointer text-5xl" v-tooltip.top="'Copy Details'" @click="det = patientStore.finalDoctorDetails" style="position: absolute; top: -5px; right: -5px; z-index: 1; color: #666" />
                                </div>
                            </div>

                            <label for="details" class="p-float-label text-black text-s ml-5 mt-5" style="color: #000080"><i>Objective </i></label>
                            <div>
                                <div class="flex align-items-center" style="position: relative">
                                    <Textarea
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
                                                    backgroundColor: '#ececec',
                                                    color: '#666',
                                                    fontSize: '13px'
                                                }
                                            }
                                        }"
                                        style="width: 100%"
                                        v-model="patientStore.header.doctor_objective"
                                        class="mt-1 justify-content-center mr-2 ml-5"
                                        disabled
                                        autoResize
                                    />
                                    <i class="pi pi-copy cursor-pointer text-5xl" v-tooltip.top="'Copy Objectives'" @click="obj = patientStore.header.doctor_objective" style="position: absolute; top: -5px; right: -5px; z-index: 1; color: #666" />
                                </div>
                            </div>
                            <label for="details" class="p-float-label text-black text-s ml-5 mt-5" style="color: #000080"><i>Diagnosis </i></label>
                            <div>
                                <div class="flex align-items-center" style="position: relative">
                                    <Textarea
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
                                                    backgroundColor: '#ececec',
                                                    color: '#666',
                                                    fontSize: '13px'
                                                }
                                            }
                                        }"
                                        style="width: 100%"
                                        v-model="patientStore.header.doctor_diagnosis"
                                        class="mt-1 justify-content-center mr-2 ml-5"
                                        disabled
                                        autoResize
                                    />
                                    <i class="pi pi-copy cursor-pointer text-5xl" v-tooltip.top="'Copy Diagnosis'" @click="diag = patientStore.header.doctor_diagnosis" style="position: absolute; top: -5px; right: -5px; z-index: 1; color: #666" />
                                </div>
                            </div>
                            <!-- {{ patientStore.doctor_plan }}
                {{ patientStore.progressionDay }}
                {{ patientStore.type_prophylaxis }}
                {{ patientStore.details.ABTC.booster_regimen }}
                {{ patientStore.details.ABTC.immunization_schedule }} -->
                            <label for="details" class="p-float-label text-black text-s ml-5 mt-5" style="color: #000080"><i>Management/Plan </i></label>
                            <div>
                                <div class="flex align-items-center" style="position: relative">
                                    <Textarea
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
                                                    backgroundColor: '#ececec',
                                                    color: '#666',
                                                    fontSize: '13px'
                                                }
                                            }
                                        }"
                                        style="width: 100%"
                                        v-model="patientStore.doctor_plan"
                                        class="mt-1 justify-content-center mr-2 ml-5"
                                        disabled
                                        autoResize
                                    />
                                    <i class="pi pi-copy cursor-pointer text-5xl" v-tooltip.top="'Copy Plan'" @click="plan = patientStore.doctor_plan" style="position: absolute; top: -5px; right: -5px; z-index: 1; color: #666" />
                                </div>
                            </div>
                        </SplitterPanel>
                        <SplitterPanel style="height: 100%" :size="50">
                            <div class="flex justify-content-center">
                                <h5 style="color: #000080" class="font-bold">FINAL DETAILS TO BE SAVED ON THE TSS</h5>
                            </div>
                            <div class="flex justify-content-center mx-2">
                                <Textarea style="width: 100%" v-model="det" class="mt-1 flex justify-content-center font-bold" autoResize />
                            </div>
                            <div style="width: 100%" class="flex justify-content-center mb-5"><i v-badge.secondary="'final.Detail'" style="font-size: 2rem" /></div>
                            <div class="flex justify-content-center mx-2">
                                <Textarea style="width: 100%" v-model="obj" class="mt-1 flex justify-content-center font-bold" autoResize />
                            </div>
                            <div style="width: 100%" class="flex justify-content-center mb-5"><i v-badge.secondary="'final.Objective'" style="font-size: 2rem" /></div>
                            <div class="flex justify-content-center mx-2">
                                <Textarea style="width: 100%" v-model="diag" class="mt-1 flex justify-content-center font-bold" autoResize />
                            </div>
                            <div style="width: 100%" class="flex justify-content-center mb-5"><i v-badge.secondary="'final.Diagnosis'" style="font-size: 2rem" /></div>
                            <div class="flex justify-content-center mx-2">
                                <Textarea style="width: 100%" v-model="plan" class="mt-1 flex justify-content-center font-bold" autoResize />
                            </div>
                            <div style="width: 100%" class="flex justify-content-center mb-5"><i v-badge.secondary="'final.Plan'" style="font-size: 2rem" /></div>
                        </SplitterPanel>
                    </Splitter>
                </SplitterPanel>
                <SplitterPanel style="background-color: #e5e5e5" :size="5" maxSize="5" class="flex justify-content-center sticky">
                    <div style="width: 50%; height: 100%">
                        <Button
                            label="Confirm"
                            icon="pi pi-save"
                            @click="saveForm"
                            style="background-color: darkolivegreen; width: 100%; height: 100%"
                            class="border border-gray-400 rounded-lg text-white font-semibold hover:bg-green-400 transition duration-200 ease-in-out shadow-lg"
                        />
                    </div>
                    <div style="width: 50%; height: 100%">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            @click="cancelForm"
                            style="background-color: darkorchid; width: 100%; height: 100%"
                            class="border border-gray-300 rounded-lg text-white font-semibold hover:bg-red-400 transition duration-200 ease-in-out shadow-lg"
                        />
                    </div>
                </SplitterPanel>
            </Splitter>
        </Dialog>
    </div>
</template>

<style scoped>
.sticky {
    position: sticky;
    top: 0;
    border-bottom: 2px solid #475d74;
    background-color: white;
    z-index: 10;
}
</style>
