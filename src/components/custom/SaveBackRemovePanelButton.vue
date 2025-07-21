<script setup>
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { inject } from 'vue';
import { usePatientStore } from '@/store/injury/PatientStore';
import useToastWaitingForFetch from '@/composables/useToastWaitingForFetch';
import createValidationRules from '../../validation/injuryValidations';
import InjuryService from '../../service/InjuryService';

const injuryService = new InjuryService();
const toast = useToast();
const confirm = useConfirm();
const v = inject('v$');
const patientStore = usePatientStore();

const savePatientData = async () => {
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
    const savingMed = await injuryService.updateMedilogs(patientStore.enccode, patientStore.details.generalData.doctor_injtme, patientStore.header.injrem, placeOccCode, injIntentCode);
    console.log('savingMed: ', savingMed);
    patientStore.details.hospitalFacilityData.disposition_code = patientStore.header.dispcode;
    patientStore.details.hospitalFacilityData.condition_code = patientStore.header.condcode;

    patientStore.status = '1';


    const response = await patientStore.saveFormattedData();

    console.log('rsavePatientData esponse', response);
    return response;
};

const removePatientFromList = async () => {
    return await patientStore.removeFromList(patientStore.enccode);
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
        successMessage: 'You may now go back to the  list...'
    },
    { severity: 'error', summary: 'Error', detail: 'Data not saved' },
    { asyncFunction: savePatientData, asyncFunctionParams: [] }
);

const toastWaitingForFetchDelete = useToastWaitingForFetch(
    {
        waitingSeverity: 'info',
        waitingSummary: 'Deleting...',
        waitingMessage: 'Please wait...'
    },
    {
        successSeverity: 'success',
        successSummary: 'Delete successful!',
        successMessage: 'Going back to list...'
    },
    { severity: 'error', summary: 'Error', detail: 'Data not saved' },
    { asyncFunction: removePatientFromList, asyncFunctionParams: [] }
);

const submitForm = async () => {
    const result = await v.value.$validate();
    console.log('validate result: ', result);

    console.log('v.value.$errors', v.value.$errors);
    if (result) {

        const response = await toastWaitingForFetchSave.fetchData();
        if (response.status == 200) {

            localStorage.setItem('enccode', JSON.stringify(patientStore.enccode));
            localStorage.setItem('status', JSON.stringify(patientStore.status));
            localStorage.setItem('header', JSON.stringify(patientStore.header));
            localStorage.setItem('details', JSON.stringify(patientStore.details));

            patientStore.loadSignal = true;
            patientStore.savingDone = true;
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

const confirmSaves = async (event, onSaveSuccess) => {
    console.log('hit1');
    if (patientStore.details.ExternalCauseOfInjury.ref_expnature_code !== '07') {
        patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp = '';
    }
    const isFormValid = () => {
        console.log('hit2');
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
            return false;
        }
        return true;
    };

    if (!isFormValid()) {
        console.log('invalid FormData');
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'The form contains invalid entries',
            life: 2000
        });
        return;
    }

    return new Promise((resolve, reject) => {
        console.log('hit3');
        confirm.require({
            target: event.target,
            message: 'Save changes?',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    patientStore.details.ExternalCauseOfInjury.ext_others_external = patientStore.details.ExternalCauseOfInjury.ext_others_external_preview;
                    await submitForm();
                    patientStore.loadSignal = true;
                    resolve();
                } catch (error) {
                    reject(error);
                }
            },
            reject: () => {
                reject(new Error('User  canceled the save operation.'));
            }
        });
    });
};

</script>
<template>
    <div>
        <span class="p-buttonset flex justify-content-end">
            <Button label="Save" icon="pi pi-save" size="small" class="w-auto" v-tooltip.top="'Save changes'"
                @click="confirmSaves($event)" />
        </span>
    </div>
</template>

<style scoped></style>
