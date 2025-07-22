<script setup>
import { useToast } from 'primevue/usetoast';
import { inject } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { usePatientStore } from '@/store/injury/PatientStore';
import useToastWaitingForFetch from '@/composables/useToastWaitingForFetch';
import createValidationRules from '../../validation/injuryValidations';
import InjuryService from '../../service/InjuryService';

const injuryService = new InjuryService();
const toast = useToast();
const v = inject('v$');
const patientStore = usePatientStore();
const confirm = useConfirm();

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

    await injuryService.updateMedilogs(patientStore.enccode, patientStore.details.generalData.doctor_injtme, patientStore.header.injrem, placeOccCode, injIntentCode);

    patientStore.details.hospitalFacilityData.disposition_code = patientStore.header.dispcode;
    patientStore.details.hospitalFacilityData.condition_code = patientStore.header.condcode;
    patientStore.status = '1';

    return await patientStore.saveFormattedData();
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

const submitForm = async () => {
    const result = await v.value.$validate();
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

const confirmSaves = async () => {
    if (patientStore.details.ExternalCauseOfInjury.ref_expnature_code !== '07') {
        patientStore.details.ExternalCauseOfInjury.ext_expo_nature_sp = '';
    }

    const isFormValid = () => {
        const validationRules = createValidationRules();
        removeUnusedString();
        const missingFields = [];

        for (const [section, fields] of Object.entries(validationRules)) {
            for (const [field, rules] of Object.entries(fields)) {
                if (rules.required && !patientStore.details[section][field]) {
                    missingFields.push(field);
                }
                if (rules.requiredIf && !patientStore.details[section][field]) {
                    missingFields.push(field);
                }
            }
        }

        return missingFields.length === 0;
    };

    if (!isFormValid()) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'The form contains invalid entries',
            life: 2000
        });
        return;
    }

    confirm.require({
        target: event.currentTarget,
        group: 'headless',
        message: 'Save changes?',
        accept: async () => {
            try {
                patientStore.details.ExternalCauseOfInjury.ext_others_external = patientStore.details.ExternalCauseOfInjury.ext_others_external_preview;
                await submitForm();
                patientStore.loadSignal = true;
            } catch (error) {
                console.error('Error saving data:', error);
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Save operation cancelled', life: 3000 });
        }
    });
};
</script>
<template>
    <Toast />
    <ConfirmPopup group="headless" class="flex justify-content-center">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div>
                <span>{{ message.message }}</span>
                <div class="flex align-items-center justify-content-center mt-2">
                    <Button label="Save" @click="acceptCallback" size="small"></Button>
                    <Button label="Cancel" outlined @click="rejectCallback" severity="secondary" size="small" text></Button>
                </div>
            </div>
        </template>
    </ConfirmPopup>
    <div class="flex justify-content-center">
        <Button @click="confirmSaves" label="Save" style="width: 100%; height: 100%;"></Button>
    </div>
</template>

<style scoped> 
</style>
