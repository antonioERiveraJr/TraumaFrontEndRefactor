import { defineStore, createPinia } from 'pinia';
import axios from 'axios';
import { ref, watch, toRefs } from 'vue';

// import { useListStore } from './listStore';

// import { watch, toRefs } from 'vue';
import resetStore from '../plugins/reset-store';
import { useUserStore } from '../general/UserStore';
// import Toast from 'primevue/toast';

//const API_URL = 'http://127.0.0.1:8000/api/user/';
const store = createPinia();
store.use(resetStore);

export default store;
export const usePatientStore = defineStore('PatientStore', () => {
    const progressionDay = ref('');
    const patientTSSRecord = '';
    const submitForm = ref(null);
    const enccode = ref('');
    const admEnccode = ref('');
    const status = ref('');
    // const resetSelectedPatients = ref(false);
    const loadSignal = ref(false);
    const textFactorSafety = ref('');
    const finalDiagnosis = ref('');
    const finalDoctorDetails = ref('');
    const ufiveID = ref();
    const firstDiagnosis = ref(true);
    const registry = ref('');
    const dataIsLoaded = ref(false);
    const latestEntryAvailable = ref(false);
    const selectedPatients = ref([]);
    const noPhysical = ref('');
    const savingDone = ref(false);
    const locationLoaded = ref(false);
    const storeRegions = ref([]);
    const storeProvinces = ref([]);
    const storeCities = ref([]);
    const storeBrgy = ref([]);
    const type_prophylaxis = ref();

    // const entryBy = ref('');

    //experimen

    const noiPoiToiDoi = ref([]);
    const header = ref({
        initiatingFacility: '',
        refferedByName: '',
        archdate: '',
        exportby: '',
        hpercode: '',
        patname: '',
        patlast: '',
        patfirst: '',
        patmiddle: '',
        patsex: '',
        patage: null,
        patbdate: '',
        admdate: '',
        disdate: '',
        injdte: '',
        injtme: '',
        injrem: '',
        dx: '',
        iicode: '',
        injloc: '',
        dispcode: '',
        condcode: '',
        status: '',
        bgycode: '',
        bgyname: '',
        regcode: '',
        regname: ' ',
        provcode: '',
        provname: '',
        ctycode: '',
        ctyname: '',
        subjective: '',
        objective: '',
        complete_diagnosis: '',
        disp_inpat: '',
        outcome_inpat: '',
        // test_noi: '',
        // test_poi: '',
        // test_details: '',
        // test_admdate: '',
        // test_diagnosis: '',
        // test_objective: '',
        doctor_noi: '',
        doctor_poi: '',
        doctor_details: '',
        doctor_admdate: '',
        doctor_diagnosis: '',
        doctor_injtme: '',
        doctor_objective: '',
        diagnosisbite: '',
        final_doctor_details: '',
        final_doctor_objective: '',
        final_doctor_diagnosis: ''
    });
    const defaultHeader = {
        initiatingFacility: '',
        refferedByName: '',
        archdate: '',
        exportby: '',
        hpercode: '',
        patname: '',
        patlast: '',
        patfirst: '',
        patmiddle: '',
        patsex: '',
        patage: null,
        patbdate: '',
        admdate: '',
        disdate: '',
        injdte: '',
        injtme: '',
        injrem: '',
        dx: '',
        iicode: '',
        injloc: '',
        dispcode: '',
        condcode: '',
        status: '',
        bgycode: '',
        bgyname: '',
        regcode: '',
        regname: ' ',
        provcode: '',
        provname: '',
        ctycode: '',
        ctyname: '',
        subjective: '',
        objective: '',
        complete_diagnosis: '',
        disp_inpat: '',
        outcome_inpat: '',
        // test_noi: '',
        // test_poi: '',
        // test_details: '',
        // test_admdate: '',
        // test_diagnosis: '',
        // test_objective: '',
        doctor_noi: '',
        doctor_poi: '',
        doctor_details: '',
        doctor_admdate: '',
        doctor_diagnosis: '',
        doctor_injtme: '',
        doctor_objective: '',
        diagnosisbite: '',
        final_doctor_details: '',
        final_doctor_objective: '',
        final_doctor_diagnosis: ''
    };
    const details = ref({
        enccode: '',
        entryBy: '',
        status: '',
        generalData: {
            comment: '',
            date_of_birth: '',
            date_report: '',
            encounter_date: '',
            encounter_time: '',
            hpercode: '',
            inj_date: '',
            inj_time: '',
            pat_phil_health_no: '',
            plc_bgycode: '',
            plc_ctycode: '',
            plc_provcode: '',
            plc_regcode: ' ',
            reg_no: '',
            status: '',
            time_report: '',
            perpetrator: 'N',
            perpetrator_sp: '',
            perpetrator_oth_sp: '',
            // test_injtme: '',
            // test_toi: '',
            // test_doi: ''
            doctor_injtme: '',
            doctor_toi: '',
            doctor_doi: ''

            // hpercode: '',
            // reg_no: '',
            // pat_phil_health_no: '',
            // plc_regcode: '',
            // plc_provcode: '',
            // plc_ctycode: '',
            // date_of_birth: '',
            // inj_date: '',
            // encounter_date: '',
            // date_report: '',
            // inj_time: '',
            // encounter_time: '',
            // time_report: '',
            // status: ''
        },
        preAdmissionData: {
            first_aid_code: '',
            inj_intent_code: '',
            firstaid_others: '',
            firstaid_others2: '',
            washingDone_by: '',
            washingDone_by_others: '',
            place_occ_code: '',
            poc_wp_spec: '',
            poc_etc_spec: '',
            activity_code: '99',
            act_etc_spec: ''
        },
        natureOfInjury: {
            mult_inj: '',
            noi_abrasion: 'N',
            noi_abradtl: '',
            noi_avulsion: 'N',
            noi_avuldtl: '',
            noi_burn_r: 'N',
            degree_burn1: '',
            degree_burn2: '',
            degree_burn3: '',
            degree_burn4: '',
            noi_burndtl: '',
            noi_concussion: 'N',
            noi_concussiondtl: '',
            noi_contusion: 'N',
            noi_contudtl: '',
            fractureCh: 'N',
            noi_frac_ope: 'N',
            noi_fropdtl: '',
            noi_frac_clo: 'N',
            noi_frcldtl: '',
            noi_owound: 'N',
            noi_owoudtl: '',
            noi_amp: 'N',
            noi_ampdtl: '',
            noi_others: 'N',
            noi_otherinj: '',
            noi_disl_open: 'N',
            noi_disl_open_sp: '',
            noi_disl_close_sp: '',
            noi_disl_close: 'N',
            noi_punc: 'N',
            noi_punc_sp: '',
            noi_gunshot: 'N',
            noi_gunshotdtl: '',
            noi_stab_wound: '',
            noi_stab_wounddtl: '',
            noi_brain: 'N',
            noi_brain_stg: '',
            noi_braindtl: '',
            noi_othersPhysical: '',
            noi_no_physical: '',
            noi_incision: 'N',
            noi_incision_sp: ''
        },
        ExternalCauseOfInjury: {
            prophylaxis: '',
            pvrv: '',
            pcec: '',
            pvrv_site_2: '',
            pcec_site_2: '',
            pvrv_site_4: '',
            pcec_site_4: '',
            hrig: '',
            erig: '',
            hrig_num: '',
            erig_num: '',
            tt: '',
            ats: '',
            tt_num: '',
            ats_num: '',
            vaccine_none: '',
            ext_bite: 'N',
            vawc: 'N',
            ext_bite_sp: '',
            ext_burn_r: 'N',
            ref_burn_code: '',
            ext_burn_sp: '',
            ext_burn_r_doctor: 'N',
            ref_burn_code_doctor: '',
            ext_burn_sp_doctor: '',
            ext_chem_sp: '',
            ext_chem: 'N',
            ext_sharp: 'N',
            ext_sharp_sp: '',
            ext_drown_r: 'N',
            ref_drowning_cope: '',
            ext_drown_sp: '',
            ext_expo_nature_r: 'N',
            ref_expnature_code: '',
            ext_expo_nature_sp: '',
            ext_gun: 'N',
            ext_gun_sp: '',
            ext_hang: 'N',
            ext_vape: 'N',
            ext_maul: 'N',
            ext_transport: 'N',
            ext_fall: 'N',
            ext_falldtl: '',
            ext_firecracker_r: 'N',
            firecracker_code: '',
            ext_firecracker_sp: '',
            ext_neglect: 'N',
            ext_sexual: 'N',
            ext_physical: 'N',
            ext_other: 'N',
            ext_other_sp: '',
            bleeding: '',
            bite_more_details: '',
            bitingAnimal: '',
            observation: '',
            washingDone: '',
            appliedToWound: '',
            appliedToWoundDtl: '',
            previousARV: '',
            arvDate: '',
            tetanusVaccination: '',
            tetanusDoses: '',
            lastTetanusDose: '',
            allergies: '',
            adverseReaction: '',
            dogbiteDegree: '',
            contact_blurt: 'N',
            contact_blurt_sp: '',
            foreign_body_sp: '',
            foreign_body: '',
            vawc_findings: '',
            vawc_impression: '',
            ext_stab_wound: 'N',
            ext_stab_wound_sp: '',
            ext_foreign_body: 'N',
            ext_foreign_body_sp: '',
            ext_encavement: 'N',
            ext_encavement_sp: '',
            ext_crushing: 'N',
            ext_crushing_sp: '',
            ext_caustic_ingestion: 'N',
            ext_caustic_ingestion_sp: '',
            vawc_impression_input: '',
            ext_others_external: '',
            ext_others_external_preview: '',
            ext_battery: 'N',
            ext_assault: 'N',
            ext_battery_sp: '',
            ext_assault_sp: '',
            ext_history: ''
        },
        forTransportVehicularAccident: {
            vehicle_type_id: '',
            ref_veh_acctype_code: '',
            ref_severity: '',
            vehicle_code: '',
            pat_veh_sp: '',
            etc_veh: '',
            etc_veh_sp: '',
            position_code: '',
            pos_pat_sp: '',
            ref_victim: '',
            ref_victom_withother: '',
            place_occ_code: '',
            poc_wp_spec: '',
            poc_etc_spec: '',
            activity_code: '',
            act_etc_spec: '',
            risk_alcliq: 'N',
            risk_smoke: 'N',
            risk_drugs: 'N',
            risk_mobpho: 'N',
            risk_sleep: 'N',
            risk_other: 'N',
            risk_etc_spec: '',
            risk_not_applicable: 'N',
            risk_none: '',
            safe_none: '',
            safe_airbag: 'N',
            safe_helmet: 'N',
            safe_cseat: 'N',
            safe_sbelt: 'N',
            safe_unkn: 'N',
            safe_vest: 'N',
            safe_other: 'N',
            safe_other_sp: '',
            safe_not_applicable: 'N'
        },
        hospitalFacilityData: {
            ptype_code: 'e',
            trans_ref: '',
            trans_ref2: '',
            ref_hosp_code: '',
            ref_hosp_code_sp: '',
            ref_physician: '',
            status_code: '',
            mode_transport_code: '',
            stat_reachdtl: '',
            diagnosis: '',
            customizedDiagnosis: '',
            customizedFinalDiagnosis: '',
            icd_10_nature_er: '',
            icd_10_external_er: '',
            treatmentGiven: '',
            disposition_code: '',
            disp_er_sp: '',
            disp_er_sp_oth: '',
            outcome_code: '',
            coord_uncoord: 'UNCOORDINATED',
            gcs_code: 'Y',
            gcs_beh_code: '',
            gcs_beh_sp: '',
            gcs_score: '',
            gcs_eye: '4',
            gcs_verbal: '5',
            gcs_motor: '6'
        },
        inPatient: {
            complete_diagnosis: '',
            disp_inpat: '',
            disp_inpat_sp2: '',
            disp_inpat_oth: '',
            inPatTransfer: '',
            outcome_inpat: '',
            icd10_nature_inpatient: '',
            icd_10_ext_inpatient: '',
            comments: '',
            noPhysical: '',
            noExternal: '',
            consultant_name: '',
            consultant_mobile: '',
            consultant_address: ''
        },
        multipleFields: {
            multiple_abrasion: false,
            multiple_burn: false,
            multiple_avulsion: false,
            multiple_laceration: false,
            multiple_incision: false,
            multiple_traumatic_amputation: false,
            multiple_traumatic_brain: false,
            multiple_gunshot: false,
            multiple_stab: false,
            multiple_concussion: false,
            multiple_contusion: false,
            multiple_fracture_closed: false,
            multiple_fracture_open: false,
            multiple_dislocation_open: false,
            multiple_dislocation_closed: false,
            multiple_puncture: false,
            multiple_other: false
        },
        followUp: {
            complaints: '',
            complaints_details: '',
            adverse_reaction: '',
            adverse_reaction_details: '',
            biting: '',
            others: '',
            wound_description: '',
            wound_description_others: '',
            erythema: '',
            dischare: '',
            tenderness: '',
            hematoma: ''
        }
    });

    const defaultDetails = ref({
        enccode: '',
        entryBy: '',
        status: '',
        generalData: {
            comment: '',
            date_of_birth: '',
            date_report: '',
            encounter_date: '',
            encounter_time: '',
            hpercode: '',
            inj_date: '',
            inj_time: '',
            pat_phil_health_no: '',
            plc_bgycode: '',
            plc_ctycode: '',
            plc_provcode: '',
            plc_regcode: '',
            reg_no: '',
            status: '',
            time_report: '',
            perpetrator: 'N',
            perpetrator_sp: '',
            perpetrator_oth_sp: '',
            doctor_injtme: '',
            doctor_toi: '',
            doctor_doi: ''
        },
        preAdmissionData: {
            first_aid_code: 'N',
            inj_intent_code: '',
            firstaid_others: '',
            firstaid_others2: '',
            place_occ_code: '',
            poc_etc_spec: '',
            activity_code: '',
            act_etc_spec: '',
            washingDone_by: '',
            washingDone_by_others: ''
        },
        natureOfInjury: {
            mult_inj: '',
            noi_abrasion: 'N',
            noi_abradtl: '',
            noi_avulsion: 'N',
            noi_avuldtl: '',
            noi_burn_r: 'N',
            degree_burn1: '',
            degree_burn2: '',
            degree_burn3: '',
            degree_burn4: '',
            noi_burndtl: '',
            noi_concussion: 'N',
            noi_concussiondtl: '',
            noi_contusion: 'N',
            noi_contudtl: '',
            fractureCh: 'N',
            noi_frac_ope: 'N',
            noi_fropdtl: '',
            noi_frac_clo: 'N',
            noi_frcldtl: '',
            noi_owound: 'N',
            noi_owoudtl: '',
            noi_amp: 'N',
            noi_ampdtl: '',
            noi_others: 'N',
            noi_otherinj: '',
            noi_disl_open: 'N',
            noi_disl_open_sp: '',
            noi_disl_close_sp: '',
            noi_disl_close: 'N',
            noi_punc: 'N',
            noi_punc_sp: '',
            noi_gunshot: 'N',
            noi_gunshotdtl: '',
            noi_stab_wound: 'N',
            noi_stab_wounddtl: '',
            noi_brain: 'N',
            noi_brain_stg: '',
            noi_braindtl: '',
            noi_othersPhysical: '',
            noi_no_physical: '',
            noi_incision: 'N',
            noi_incision_sp: ''
        },
        ExternalCauseOfInjury: {
            prophylaxis: '',
            pvrv: '',
            pcec: '',
            pvrv_site_2: '',
            pcec_site_2: '',
            pvrv_site_4: '',
            pcec_site_4: '',
            hrig: '',
            erig: '',
            hrig_num: '',
            erig_num: '',
            tt: '',
            ats: '',
            tt_num: '',
            ats_num: '',
            vaccine_none: '',
            ext_bite: 'N',
            vawc: 'N',
            ext_bite_sp: '',
            ext_burn_r: 'N',
            ref_burn_code: '',
            ext_burn_sp: '',
            ext_burn_r_doctor: 'N',
            ref_burn_code_doctor: '',
            ext_burn_sp_doctor: '',
            ext_chem: 'N',
            ext_chem_sp: '',
            ext_sharp: 'N',
            ext_sharp_sp: '',
            ext_drown_r: 'N',
            ref_drowning_cope: '',
            ext_drown_sp: '',
            ext_expo_nature_r: 'N',
            ref_expnature_code: '',
            ext_expo_nature_sp: '',
            ext_vape: 'N',
            ext_gun: 'N',
            ext_gun_sp: '',
            ext_hang: 'N',
            ext_maul: 'N',
            ext_transport: 'N',
            ext_fall: 'N',
            ext_falldtl: '',
            ext_firecracker_r: 'N',
            firecracker_code: '',
            ext_firecracker_sp: '',
            ext_neglect: 'N',
            ext_sexual: 'N',
            ext_physical: 'N',
            ext_other: 'N',
            ext_other_sp: '',
            bleeding: '',
            bite_animal: '',
            bitingAnimal: '',
            observation: '',
            washingDone: '',
            appliedToWound: '',
            appliedToWoundDtl: '',
            previousARV: '',
            arvDate: '',
            tetanusVaccination: '',
            tetanusDoses: '',
            lastTetanusDose: '',
            allergies: '',
            adverseReaction: '',
            dogbiteDegree: '',
            contact_blurt: 'N',
            contact_blurt_sp: '',
            foreign_body_sp: '',
            foreign_body: '',
            vawc_findings: '',
            vawc_impression: '',
            ext_stab_wound: 'N',
            ext_stab_wound_sp: '',
            ext_foreign_body: 'N',
            ext_foreign_body_sp: '',
            ext_encavement: 'N',
            ext_encavement_sp: '',
            ext_crushing: 'N',
            ext_crushing_sp: '',
            ext_caustic_ingestion: 'N',
            ext_caustic_ingestion_sp: '',
            vawc_impression_input: '',
            ext_others_external: '',
            ext_others_external_preview: '',
            ext_battery: 'N',
            ext_assault: 'N',
            ext_battery_sp: '',
            ext_assault_sp: '',
            ext_history: ''
        },
        forTransportVehicularAccident: {
            vehicle_type_id: '',
            ref_veh_acctype_code: '',
            ref_severity: '',
            vehicle_code: '',
            pat_veh_sp: '',
            etc_veh: '',
            etc_veh_sp: '',
            position_code: '',
            pos_pat_sp: '',
            ref_victim: '',
            ref_victom_withother: '',
            place_occ_code: '',
            poc_wp_spec: '',
            poc_etc_spec: '',
            activity_code: '',
            act_etc_spec: '',
            risk_alcliq: 'N',
            risk_smoke: 'N',
            risk_drugs: 'N',
            risk_mobpho: 'N',
            risk_sleep: 'N',
            risk_other: 'N',
            risk_etc_spec: '',
            risk_none: '',
            risk_not_applicable: 'N',
            safe_none: '',
            safe_airbag: 'N',
            safe_helmet: 'N',
            safe_cseat: 'N',
            safe_sbelt: 'N',
            safe_unkn: 'N',
            safe_vest: 'N',
            safe_other: 'N',
            safe_other_sp: '',
            safe_not_applicable: 'N'
        },
        hospitalFacilityData: {
            ptype_code: 'e',
            trans_ref: '',
            trans_ref2: '',
            ref_hosp_code: '',
            ref_hosp_code_sp: '',
            ref_physician: '',
            status_code: '',
            mode_transport_code: '',
            customizedDiagnosis: '',
            customizedFinalDiagnosis: '',
            stat_reachdtl: '',
            diagnosis: '',
            icd_10_nature_er: '',
            icd_10_external_er: '',
            treatmentGiven: '',
            disposition_code: '',
            disp_er_sp: '',
            disp_er_sp_oth: '',
            outcome_code: '',
            coord_uncoord: 'UNCOORDINATED',
            gcs_code: 'Y',
            gcs_beh_code: '',
            gcs_beh_sp: '',
            gcs_score: '',
            gcs_eye: '4',
            gcs_verbal: '5',
            gcs_motor: '6'
        },
        inPatient: {
            complete_diagnosis: '',
            noPhysical: '',
            noExternal: '',
            disp_inpat: '',
            disp_inpat_sp2: '',
            disp_inpat_oth: '',
            inPatTransfer: '',
            outcome_inpat: '',
            icd10_nature_inpatient: '',
            icd_10_ext_inpatient: '',
            comments: '',
            consultant_name: '',
            consultant_mobile: '',
            consultant_address: ''
        },
        multipleFields: {
            multiple_abrasion: false,
            multiple_burn: false,
            multiple_avulsion: false,
            multiple_laceration: false,
            multiple_traumatic_amputation: false,
            multiple_traumatic_brain: false,
            multiple_gunshot: false,
            multiple_stab: false,
            multiple_concussion: false,
            multiple_contusion: false,
            multiple_fracture_closed: false,
            multiple_fracture_open: false,
            multiple_dislocation_open: false,
            multiple_dislocation_closed: false,
            multiple_puncture: false,
            multiple_other: false
        },
        followUp: {
            complaints: '',
            complaints_details: '',
            adverse_reaction: '',
            adverse_reaction_details: '',
            biting: '',
            others: '',
            wound_description: '',
            wound_description_others: '',
            erythema: '',
            discharge: '',
            tenderness: '',
            hematoma: ''
        }
    });
    watch(
        () => details.value,
        (newValue) => {
            for (const key in newValue) {
                if (typeof newValue[key] === 'string') {
                    newValue[key] = newValue[key].toUpperCase();
                } else if (typeof newValue[key] === 'object' && newValue[key] !== null) {
                    for (const subKey in newValue[key]) {
                        if (typeof newValue[key][subKey] === 'string') {
                            newValue[key][subKey] = newValue[key][subKey].toUpperCase();
                        }
                    }
                }
            }
        },
        { deep: true }
    );
    watch(
        () => header.value,
        (newValue) => {
            for (const key in newValue) {
                if (typeof newValue[key] === 'string' && key !== 'doctor_poi') {
                    newValue[key] = newValue[key].toUpperCase();
                } else if (typeof newValue[key] === 'object' && newValue[key] !== null) {
                    for (const subKey in newValue[key]) {
                        if (typeof newValue[key][subKey] === 'string') {
                            newValue[key][subKey] = newValue[key][subKey].toUpperCase();
                        }
                    }
                }
            }
        },
        { deep: true }
    );
    // watch(
    //     () => header.value,
    //     (newValue) => {
    //         for (const key in newValue) {
    //             if (typeof newValue[key] === 'string' && !key.startsWith('plc_')) {
    //                 newValue[key] = newValue[key].toUpperCase();
    //             } else if (typeof newValue[key] === 'object' && newValue[key] !== null) {
    //                 for (const subKey in newValue[key]) {
    //                     if (typeof newValue[key][subKey] === 'string' && !subKey.startsWith('plc_')) {
    //                         newValue[key][subKey] = newValue[key][subKey].toUpperCase();
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     { deep: true }
    // );
    // watch(
    //     () => details.value,
    //     (newValue) => {
    //         for (const key in newValue) {
    //             if (typeof newValue[key] === 'string' && !key.startsWith('plc_')) {
    //                 newValue[key] = newValue[key].toUpperCase();
    //             } else if (typeof newValue[key] === 'object' && newValue[key] !== null) {
    //                 for (const subKey in newValue[key]) {
    //                     if (typeof newValue[key][subKey] === 'string' && !subKey.startsWith('plc_')) {
    //                         newValue[key][subKey] = newValue[key][subKey].toUpperCase();
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     { deep: true }
    // );

    // const forSaving = ref({});

    // Function to set the loadList callback
    async function loadOPDPatientData(patientData) {
        if (patientData?.data) {
            console.log('has data: ', patientData.data);
            header.value = patientData.data.header;
            header.value.hpercode = patientData.data.header.hpercode;
            // ufiveID.value = patientData?.data?.details?.ufiveID;
            // header.value = patientData?.data?.header;
            // enccode.value = patientData?.data?.enccode;
            // status.value = patientData?.data?.status;
            if (patientData.data != null) {
                console.log('Details found, using details from server');
                details.value = patientData.data;
                if (progressionDay.value !== patientData.data.progressionDay) {
                    console.log('day not the same : ', progressionDay.value + ': ', patientData.data.progressionDay);
                    details.value.followUp = { ...defaultDetails.value.followUp };
                }
            }
            // else {
            //     // console.log('No details found, using default details');
            //     details.value = { ...defaultDetails.value };
            //     details.value.preAdmissionData.inj_intent_code = '01';
            //     details.value.preAdmissionData.place_occ_code = '10';
            //     details.value.preAdmissionData.activity_code = '99';
            //     details.value.hospitalFacilityData.status_code = '03';
            //     details.value.hospitalFacilityData.mode_transport_code = '03';
            // }
            // admEnccode.value = patientData?.data?.admEnccode;
        } else {
            console.log('doesnt have data: ', patientData);
            header.value.patname = patientData.patientname;
            header.value.hpercode = patientData.hpercode;
            enccode.value = patientData.enccode;
            // header.value.injtme = patientData.opdtime;
            // header.value.injdte = patientData.opdtime;
            header.value.patbdate = patientData.patientbirthdate;
            header.value.admdate = patientData.opdtime;

            //set deafult value of ABTC

            details.value.preAdmissionData.inj_intent_code = '01';
            details.value.preAdmissionData.place_occ_code = '10';
            details.value.preAdmissionData.activity_code = '99';
            details.value.hospitalFacilityData.status_code = '03';
            details.value.hospitalFacilityData.mode_transport_code = '03';
        }
        // console.log('patientData: ', patientData);
        // console.log('header: ', header);

        dataIsLoaded.value = true;
    }

    async function loadPatientData(enc) {
        // alert('hit');
        // console.log('Loading patient data for:', enc);
        // reset();
        try {
            const response = await axios.get('injuryList/' + enc, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken'),
                    withCredentials: true
                }
            });
            console.log('enccodess:', response.data);
            // console.log('admitting enccode:', response.data.admEnccode);

            // console.log('Response from loadPatientData(response):', response);
            ufiveID.value = response?.data?.details?.ufiveID;
            header.value = response.data.header;
            enccode.value = response.data.enccode;
            status.value = response.data.status;
            admEnccode.value = response.data.admEnccode;
            //check if response.data.details has a value
            // console.log('Response from loadPatientData(data.details):', response.data.details);
            if (response.data.details != null) {
                // console.log('Details found, using details from server');
                details.value = response.data.details;
            } else {
                // console.log('No details found, using default details');
                details.value = { ...defaultDetails.value };
            }
            // console.log('header.value.first_aid_code.value:', header.value.iicode);
            // details.value.preAdmissionData.inj_intent_code = header.value.iicode;
            // console.log('Details:', details.value);
            // console.log('Patient data header loaded:', header);
            // console.log('Patient data details loaded:', details);
            header.value.subjective = header.value.subjective.replace(/\n\n/, '');
            header.value.objective = header.value.objective.replace(/\n\n/, '');
            // console.log('ufiveID: ', ufiveID);

            //signal if patient data is loaded
            dataIsLoaded.value = true;
            // console.log('dataIsLoaded: ', dataIsLoaded.value);

            return response.data;
        } catch (error) {
            dataIsLoaded.value = true;
            // console.log('authToken:', localStorage.getItem('authToken'));
            // console.log('Failed to load patient data:', error);
        }
    }

    async function loadPatientDataDev(enc) {
        // alert('hit');

        // reset();
        try {
            const response = await axios.get('injuryListDev/' + enc, {
                // const response = await axios.get('injuryListDev/' + enc, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken'),
                    withCredentials: true
                }
            });
            console.log('enccodes:', response.data);

            // console.log('enccode:', response.data.enccode);
            // console.log('admitting enccode:', response.data.header.admEnccode);
            // console.log('Response from loadPatientData(response):', response);
            ufiveID.value = response?.data?.idufive;
            header.value = response.data.header;
            admEnccode.value = response?.data?.header?.admEnccode;
            enccode.value = response?.data?.enccode;
            status.value = response.data.status;
            //check if response.data.details has a value
            // console.log('Response from loadPatientData(data.details):', response.data.details);
            if (response.data.details != null) {
                // console.log('Details found, using details from server');
                // if (!response.data.details?.multipleFields) {
                //     console.log('Type of details:', Array.isArray(response.data.details));

                //     console.log('details: ', details.value.multipleFields);
                //     response.data.details.push(details.value.multipleFields);
                // }
                // details.value = response.data.details;
                // console.log('Details found, using details from server');

                // Check if details.value.multipleFields exists
                if (!response.data.details?.multipleFields) {
                    // console.log('response: ', response.data.details);

                    // Check if response.data.details is an object or an array
                    if (Array.isArray(response.data.details)) {
                        // If it's an array, push the multipleFields values
                        // alert('hit');
                        response.data.details.push(details.value.multipleFields);
                    } else {
                        // If it's an object, merge the multipleFields into it
                        response.data.details.multipleFields = { ...details.value.multipleFields };
                        // console.log('second', response.data.details);
                    }
                }

                // Update details.value to reflect the new state
                details.value = response.data.details;
            } else {
                // console.log('No details found, using default details');
                details.value = { ...defaultDetails.value };
            }
            // console.log('header.value.first_aid_code.value:', header.value.iicode);
            // details.value.preAdmissionData.inj_intent_code = header.value.iicode;
            // console.log('Details:', details.value);
            // console.log('Patient data header loaded:', header);
            // console.log('Patient data details loaded:', details);
            header.value.subjective = header.value.subjective.replace(/\n\n/, '');
            header.value.objective = header.value.objective.replace(/\n\n/, '');

            dataIsLoaded.value = true;
            // console.log('dataIsLoaded: ', dataIsLoaded.value);
            return response.data;
        } catch (error) {
            dataIsLoaded.value = true;
            // console.log('authToken:', localStorage.getItem('authToken'));
            console.error('Failed to load patient data:', error);
        }
    }

    async function loadAdmittedPatientData(enc) {
        try {
            const response = await axios.get('admittedInjuryListData/' + enc, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken'),
                    withCredentials: true
                }
            });
            // console.log('enccodes:', response.data);

            ufiveID.value = response?.data?.idufive;
            header.value = response.data.header;
            admEnccode.value = response?.data?.header?.admEnccode;
            enccode.value = response?.data?.enccode;
            status.value = response.data.status;

            if (response.data.details != null) {
                if (!response.data.details?.multipleFields) {
                    if (Array.isArray(response.data.details)) {
                        response.data.details.push(details.value.multipleFields);
                    } else {
                        response.data.details.multipleFields = { ...details.value.multipleFields };
                    }
                }
                details.value = response.data.details;
            } else {
                details.value = { ...defaultDetails.value };
            }

            header.value.subjective = header.value.subjective.replace(/\n\n/, '');
            header.value.objective = header.value.objective.replace(/\n\n/, '');

            dataIsLoaded.value = true;
            return response.data;
        } catch (error) {
            dataIsLoaded.value = true;
            console.error('Failed to load patient data:', error);
        }
    }

    // async function getSubjective(){
    //     try {
    //         const response = await axios.get(''
    // }

    function formatDataForSaving() {
        // console.log('preAdmissionData: ', details.value.preAdmissionData.value);
        // console.log('patientStore details', details.value.preAdmissionData);
        // console.log('');

        // alert('sd');
        // forSaving.value = JSON.stringify({
        const user = useUserStore();
        // const enccode = ref(enccode.value);
        // const subjective = ref('NOI: ' + header.value.test_noi + 'POI: ' + header.value.test_poi + 'DOI: ' + header.value.test_doi + 'TOI: ' + header.value.test_toi + '\n' + 'Detail(s): \n' + header.value.test_details.details);
        // const objective = ref(header.value.test_objective);

        // console.log('enccode:', enccode.value , 'subjective:', subjective.value, 'objective:', objective.value);

        // injuryService.updateObjSubj(enccode.value, objective.value, subjective.value);

        // console.log('user:', user);
        let employeeid;
        if (user.userInfo.employeeid) {
            employeeid = user.userInfo.employeeid;
            // console.log('employeeid:', employeeid);
        } else {
            const fullUrl = window.location.href;
            const match2 = fullUrl.match(/[?&]empID=([^&#]*)/);
            const empID = match2 ? match2[1] : null; // Extract the value or set
            // console.log('emplID: ', empID);
            employeeid = empID;

            if (employeeid === null) {
                alert('Missing employeeid');
            }
        }
        // console.log('énccode: ', enccode.value);

        // console.log('status.value:', status.value);

        const dataToReturn = JSON.stringify({
            // enccode: enccode.value,
            // status: status.value,
            // header: { ...header.value },
            // details: {
            ufiveID: ufiveID.value,
            enccode: enccode.value,
            progressionDay: progressionDay.value,
            // entryBy: entryBy.value,
            entryBy: employeeid,
            status: status.value,
            header: { ...header.value },
            generalData: { ...details.value.generalData },
            preAdmissionData: { ...details.value.preAdmissionData },
            natureOfInjury: { ...details.value.natureOfInjury },
            ExternalCauseOfInjury: { ...details.value.ExternalCauseOfInjury },
            forTransportVehicularAccident: { ...details.value.forTransportVehicularAccident },
            hospitalFacilityData: { ...details.value.hospitalFacilityData },
            inPatient: { ...details.value.inPatient },
            bghdata: { ...details.value.bghdata },
            multipleFields: { ...details.value.multipleFields },
            followUp: { ...details.value.followUp }
            // multipleFields: { ...details.value.multipleFields }
            // entryby_doctor: user.userInfo.employeeid,

            // }
        });
        console.log('dataToReturn: ', dataToReturn);
        // alert('read');
        // console.log('dataForSaving:', dataToReturn);
        return dataToReturn;
    }
    async function saveStashedPatients(patient) {
        // alert('hit');
        const response = await axios
            .put(
                'exportToExcelSaveData',

                {
                    enccode: patient,
                    status: '5'
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                // console.log('Response from saveFormattedData:', res);

                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });
        // console.log('response:', response);
        // ;
        return response;
    }

    async function saveFormattedDataArchived(patient) {
        // alert('hit');
        const response = await axios
            .put(
                'exportToExcelSaveData',

                {
                    enccode: patient,
                    status: '2'
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                // console.log('Response from saveFormattedData:', res);

                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });
        // console.log('response:', response);
        // ;
        return response;
    }

    async function saveOPDFormattedData() {
        const formattedData = formatDataForSaving();

        const response = await axios
            .post(
                'saveOPDData',

                {
                    formattedData: formattedData
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });

        console.log('response: ', response, '\n', 'formatted:', formattedData);
        return response;
    }

    async function saveFormattedData() {
        const formattedData = formatDataForSaving();

        // console.log('patientinfo : ', patientInfo);

        // alert('hit');
        // console.log('formattedData:', formattedData);
        // console.log('authToken:', localStorage.getItem('authToken'));

        const response = await axios
            .post(
                'saveData',

                {
                    formattedData: formattedData
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                // console.log('Response from saveFormattedData:', res);

                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });

        // const listStore = useListStore();
        // console.log('listStore.list:', listStore.list);
        //find the index of the current patient and update the list
        // const index = listStore.list.value.findIndex((patient) => patient.enccode === enccode.value);
        // console.log('index:', index);
        // listStore.list.value[index].details = JSON.parse(formattedData);
        // console.log('JSON.parse(formattedData)', JSON.parse(formattedData).value);
        // console.log('listStore.list.value[index].details', listStore.list.value[index].details);

        return response;
    }

    async function removeFromList(enccode) {
        // console.log('patientStore.removeFromList.enccode', enccode);
        const response = await axios
            .post(
                'removeFromRegistry',

                {
                    enccode: enccode
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }
            )
            .then((res) => {
                // console.log('Deleted from registry:', res);
                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });

        return response;
    }

    const { natureOfInjury, ExternalCauseOfInjury } = toRefs(details.value);

    watch(
        () => natureOfInjury.value.noi_burn_r,
        (value) => {
            if (value === undefined) return;
            ExternalCauseOfInjury.value.ext_burn_r = value === 'Y' ? 'Y' : 'N';
        }
    );

    //
    // const { ExternalCauseOfInjury, natureOfInjury } = toRefs(details.value);

    watch(
        () => ExternalCauseOfInjury.value.ext_burn_r,
        (value) => {
            if (value === undefined) return; // Check for undefined
            natureOfInjury.value.noi_burn_r = value === 'Y' ? 'Y' : 'N';
        }
    );
    function resetDialog() {
        //add more  fields as needed
        // NATURE of INJURY (GeneralDataNOI.vue)
        // alert('hit');
        //folowup
        details.value.followUp.complaints = '';
        details.value.followUp.complaints_details = '';
        details.value.followUp.adverse_reaction = '';
        details.value.followUp.adverse_reaction_details = '';
        details.value.followUp.biting = '';
        details.value.followUp.others = '';
        details.value.followUp.wound_description = '';
        details.value.followUp.wound_description_others = '';
        details.value.followUp.erythema = '';
        details.value.followUp.dischare = '';
        details.value.followUp.tenderness = '';
        details.value.followUp.hematoma = '';

        //
        details.value.details.hospitalFacilityData.customizedDiagnosis = '';
        details.value.details.hospitalFacilityData.customizedFinalDiagnosis = '';
        details.value.generalData.doctor_injtme = '';
        details.value.forTransportVehicularAccident.risk_alcliq = 'N';
        details.value.forTransportVehicularAccident.risk_smoke = 'N';
        details.value.forTransportVehicularAccident.risk_drugs = 'N';
        details.value.forTransportVehicularAccident.risk_mobpho = 'n';
        details.value.forTransportVehicularAccident.risk_sleep = 'N';
        details.value.forTransportVehicularAccident.risk_other = 'N';
        details.value.forTransportVehicularAccident.risk_etc_spec = '';
        details.value.forTransportVehicularAccident.risk_none = 'N';
        details.value.forTransportVehicularAccident.safe_none = 'N';
        details.value.forTransportVehicularAccident.safe_airbag = 'N';
        details.value.forTransportVehicularAccident.safe_helmet = 'N';
        details.value.forTransportVehicularAccident.safe_cseat = 'N';
        details.value.forTransportVehicularAccident.safe_sbelt = 'N';
        details.value.forTransportVehicularAccident.safe_unkn = 'N';
        details.value.forTransportVehicularAccident.safe_vest = 'N';
        details.value.forTransportVehicularAccident.safe_other = 'N';
        details.value.forTransportVehicularAccident.safe_other_sp = '';

        details.value.preAdmissionData.inj_intent_code = '';
        details.value.generalData.plc_regcode = '';
        details.value.generalData.plc_provcode = '';
        details.value.generalData.plc_ctycode = '';
        details.value.generalData.plc_bgycode = '';

        // HOSPITAL DATA (HospitalFaacilityData)

        details.value.hospitalFacilityData.status_code = '';
        details.value.hospitalFacilityData.mode_transport_code = '';
        // details.value.hospitalFacilityData.mode_transport_code_sp= '';

        // details.value.hospitalFacilityData.ref_hosp_code= '';  no value
        //not working but correct caller
        details.value.hospitalFacilityData.ref_hosp_code_sp = ''; //
        details.value.hospitalFacilityData.ref_physician = ''; //
        //not working but correct caller
        details.value.hospitalFacilityData.trans_ref = '';
        details.value.hospitalFacilityData.trans_ref = '';
        details.value.hospitalFacilityData.stat_reachdtl = '';
        // PREADMISSION DATA (PreAdmissionDataNew.vue)

        details.value.preAdmissionData.place_occ_code = '';
        details.value.preAdmissionData.poc_etc_spec = '';

        details.value.preAdmissionData.activity_code = '';
        details.value.preAdmissionData.act_etc_spec = '';

        details.value.preAdmissionData.first_aid_code = '';
        details.value.preAdmissionData.firstaid_others = '';
        details.value.preAdmissionData.firstaid_others2 = '';
        details.value.preAdmissionData.washingDone_by = '';
        details.value.preAdmissionData.washingDone_by_others = '';

        // details.value.natureOfInjury='';//some details arent removed especially textbox for others/specify
        // details.value.ExternalCauseOfInjury ='';//some details arent removed especially textbox for others/specify

        details.value.natureOfInjury.noi_abrasion = '';
        details.value.natureOfInjury.noi_abradtl = '';

        details.value.natureOfInjury.noi_burn_r = '';
        details.value.natureOfInjury.degree_burn1 = '';
        details.value.natureOfInjury.degree_burn2 = '';
        details.value.natureOfInjury.degree_burn3 = '';
        details.value.natureOfInjury.degree_burn4 = '';
        details.value.natureOfInjury.noi_burndtl = '';

        details.value.natureOfInjury.noi_avulsion = '';
        details.value.natureOfInjury.noi_avuldtl = '';

        details.value.natureOfInjury.noi_concussion = '';
        details.value.natureOfInjury.noi_concussiondtl = '';

        details.value.natureOfInjury.noi_contusion = '';
        details.value.natureOfInjury.noi_contudtl = '';

        //NOTE!!!!this is frac open
        details.value.natureOfInjury.noi_frac_clo = '';
        details.value.natureOfInjury.noi_frcldtl = '';

        //NOTE!!!!this is frac close
        details.value.natureOfInjury.noi_frac_ope = '';
        details.value.natureOfInjury.noi_fropdtl = '';

        details.value.natureOfInjury.noi_owound = '';
        details.value.natureOfInjury.noi_owoudtl = '';

        details.value.natureOfInjury.noi_incision = '';
        details.value.natureOfInjury.noi_incision_sp = '';

        details.value.natureOfInjury.noi_amp = '';
        details.value.natureOfInjury.noi_ampdtl = '';

        details.value.natureOfInjury.noi_others = '';
        details.value.natureOfInjury.noi_otherinj = '';
        details.value.natureOfInjury.noi_othersPhysical = '';

        // details.value.natureOfInjury.mult_inj='';//

        // EXTERNAL CAUSES (ExternalCauses.vue)
        details.value.ExternalCauseOfInjury.vawc = 'N';
        details.value.ExternalCauseOfInjury.ext_vape = '';
        details.value.ExternalCauseOfInjury.ext_bite = '';
        details.value.ExternalCauseOfInjury.ext_bite_sp = '';
        details.value.ExternalCauseOfInjury.pvrv_site_2 = '';
        details.value.ExternalCauseOfInjury.pcec_site_2 = '';
        details.value.ExternalCauseOfInjury.pvrv_site_4 = '';
        details.value.ExternalCauseOfInjury.pcec_site_5 = '';
        details.value.ExternalCauseOfInjury.prophylaxis = '';
        details.value.ExternalCauseOfInjury.pvrv = '';
        details.value.ExternalCauseOfInjury.pcec = '';
        details.value.ExternalCauseOfInjury.hrig = '';
        details.value.ExternalCauseOfInjury.erig = '';
        details.value.ExternalCauseOfInjury.hrig_num = '';
        details.value.ExternalCauseOfInjury.erig_num = '';
        details.value.ExternalCauseOfInjury.tt = '';
        details.value.ExternalCauseOfInjury.ats = '';
        details.value.ExternalCauseOfInjury.tt_num = '';
        details.value.ExternalCauseOfInjury.ats_num = '';
        details.value.ExternalCauseOfInjury.vaccine_none = '';
        details.value.ExternalCauseOfInjury.ext_burn_r = 'N'; //
        details.value.ExternalCauseOfInjury.ref_burn_code = ''; //
        details.value.ExternalCauseOfInjury.ext_burn_sp = ''; //
        details.value.ExternalCauseOfInjury.ext_burn_r_doctor = 'N'; //
        details.value.ExternalCauseOfInjury.ref_burn_code_doctor = ''; //
        details.value.ExternalCauseOfInjury.ext_burn_sp_doctor = ''; //

        details.value.ExternalCauseOfInjury.ext_chem = ''; //
        details.value.ExternalCauseOfInjury.ext_chem_sp = ''; //

        details.value.ExternalCauseOfInjury.ext_sharp = ''; //
        details.value.ExternalCauseOfInjury.ext_sharp_sp = ''; //

        details.value.ExternalCauseOfInjury.ext_drown_r = ''; //

        details.value.ExternalCauseOfInjury.ref_drowning_cope = ''; //
        details.value.ExternalCauseOfInjury.ext_drown_sp = ''; //

        details.value.ExternalCauseOfInjury.ext_expnature_sp = ''; //
        details.value.ExternalCauseOfInjury.ext_expo_nature_r = ''; //
        details.value.ExternalCauseOfInjury.ref_expnature_code = ''; //
        details.value.ExternalCauseOfInjury.ext_expo_nature_sp = ''; //

        details.value.ExternalCauseOfInjury.ext_fall = ''; //
        details.value.ExternalCauseOfInjury.ext_falldtl = ''; //

        details.value.ExternalCauseOfInjury.firecracker_r = ''; //
        details.value.ExternalCauseOfInjury.firecracker_code = ''; //
        details.value.ExternalCauseOfInjury.ext_firecracker_r = ''; //
        details.value.ExternalCauseOfInjury.ext_firecracker_sp = ''; //

        details.value.ExternalCauseOfInjury.ext_gun = ''; //
        details.value.ExternalCauseOfInjury.ext_gun_sp = ''; //

        details.value.ExternalCauseOfInjury.ext_others_external = ''; //
        details.value.ExternalCauseOfInjury.ext_others_external_preview = ''; //

        details.value.ExternalCauseOfInjury.ext_battery = ''; //
        details.value.ExternalCauseOfInjury.ext_battery_sp = ''; //
        details.value.ExternalCauseOfInjury.ext_assault = ''; //
        details.value.ExternalCauseOfInjury.ext_assault_sp = ''; //
        details.value.ExternalCauseOfInjury.ext_history = '';

        details.value.ExternalCauseOfInjury.ext_hang = ''; //

        details.value.ExternalCauseOfInjury.ext_maul = ''; //

        details.value.forTransportVehicularAccident.vehicle_type_id = ''; //

        details.value.forTransportVehicularAccident.ref_veh_acctype_code = ''; //

        details.value.forTransportVehicularAccident.vehicle_code = ''; //

        details.value.forTransportVehicularAccident.ref_veh_acctype_code = ''; //
        details.value.forTransportVehicularAccident.etc_veh = ''; //
        details.value.forTransportVehicularAccident.pat_veh_sp = ''; //

        details.value.ExternalCauseOfInjury.ext_transport = ''; //
        details.value.forTransportVehicularAccident.position_code = '';
        details.value.forTransportVehicularAccident.pos_pat_sp = '';
        details.value.ExternalCauseOfInjury.pat_veh_sp = ''; //

        details.value.ExternalCauseOfInjury.ext_sexual = ''; //

        details.value.ExternalCauseOfInjury.ext_other = ''; //
        details.value.ExternalCauseOfInjury.ext_other_sp = ''; //
        // details.value.generalData.commment = ''; //comment

        //comment
        details.value.inPatient.comments = '';
        details.value.generalData.perpetrator = '';
        details.value.generalData.perpetrator_sp = '';
        details.value.generalData.perpetrator_oth_sp = '';

        // details.ExternalCauseOfInjury = defaultDetails.value.ExternalCauseOfInjury;

        // details.natureOfInjury = {...defaultDetails.value}
    }

    function resets() {
        // header.value = { ...defaultHeader.value };
        // details.value = { ...defaultDetails.value };
        enccode.value = '';

        // console.log('header :', header.value);
        // console.log('details : ', details.value);
    }
    function reset() {
        // enccode.value = '';
        // alert('hits');
        status.value = '';
        header.value = { ...defaultHeader.value };
        details.value = { ...defaultDetails.value };
        // console.log('old details :', defaultDetails.value);
        // console.log('details : ', details.value);
        // loadSignal.value = false; // Reset loadSignal when resetting the store
    }

    return {
        enccode,
        ufiveID,
        status,
        header,
        resetDialog,
        resets,
        details,
        loadPatientData,
        loadPatientDataDev,
        formatDataForSaving,
        saveFormattedData,
        saveOPDFormattedData,
        saveFormattedDataArchived,
        submitForm,
        loadOPDPatientData,
        defaultDetails,
        // resetSelectedPatients,
        removeFromList,
        reset,
        noiPoiToiDoi,
        defaultHeader,
        loadSignal,
        finalDiagnosis,
        patientTSSRecord,
        finalDoctorDetails,
        textFactorSafety,
        registry,
        dataIsLoaded,
        firstDiagnosis,
        latestEntryAvailable,
        selectedPatients,
        noPhysical,
        savingDone,
        saveStashedPatients,
        locationLoaded,
        storeBrgy,
        storeCities,
        storeProvinces,
        storeRegions,
        progressionDay,
        loadAdmittedPatientData,
        type_prophylaxis
    };
});
