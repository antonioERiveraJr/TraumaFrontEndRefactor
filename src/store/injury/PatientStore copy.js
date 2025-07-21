import { defineStore, createPinia } from 'pinia';
import axios from 'axios';
import { ref, watch } from 'vue';

// import { useListStore } from './listStore';

import resetStore from '../plugins/reset-store';
import { useUserStore } from '../general/UserStore';

//const API_URL = 'http://127.0.0.1:8000/api/user/';
const store = createPinia();
store.use(resetStore);
export default store;
export const usePatientStore = defineStore('PatientStore', () => {
    // const patient = ref({});
    const submitForm = ref(null);
    const enccode = ref('');
    const status = ref('');
    // const entryBy = ref('');

    const noiPoiToiDoi = ref([]);
    const header = ref({
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
        objective: ''
    });
    const details = ref({
        enccode: '',
        entryBy: '',
        status: '',
        generalData: {
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
            time_report: ''
        },
        preAdmissionData: {
            first_aid_code: '',
            inj_intent_code: '',
            firstaid_others: '',
            firstaid_others2: '',
            place_occ_code: '',
            poc_etc_spec: '',
            activity_code: '',
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
            noi_otherinj: ''
        },
        ExternalCauseOfInjury: {
            ext_bite: 'N',
            ext_bite_sp: '',
            ext_burn_r: 'N',
            ref_burn_code: '',
            ext_burn_sp: '',
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
            ext_sexual: 'N',
            ext_other: 'N',
            ext_other_sp: ''
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
            risk_alcliq: '',
            risk_smoke: '',
            risk_drugs: '',
            risk_mobpho: '',
            risk_sleep: '',
            risk_other: '',
            risk_etc_spec: '',
            risk_none: '',
            safe_none: '',
            safe_airbag: '',
            safe_helmet: '',
            safe_cseat: '',
            safe_sbelt: '',
            safe_unkn: '',
            safe_vest: '',
            safe_other: '',
            safe_other_sp: ''
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
            icd_10_nature_er: '',
            icd_10_external_er: '',
            treatmentGiven: '',
            disposition_code: '',
            disp_er_sp: '',
            disp_er_sp_oth: '',
            outcome_code: ''
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
            consultant_name: '',
            consultant_mobile: '',
            consultant_address: ''
        }
    });

    const defaultDetails = ref({
        enccode: '',
        entryBy: '',
        status: '',
        generalData: {
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
            time_report: ''
        },
        preAdmissionData: {
            first_aid_code: '',
            inj_intent_code: '',
            firstaid_others: '',
            firstaid_others2: '',
            place_occ_code: '',
            poc_etc_spec: '',
            activity_code: '',
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
            noi_otherinj: ''
        },
        ExternalCauseOfInjury: {
            ext_bite: 'N',
            ext_bite_sp: '',
            ext_burn_r: 'N',
            ref_burn_code: '',
            ext_burn_sp: '',
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
            ext_sexual: 'N',
            ext_other: 'N',
            ext_other_sp: ''
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
            risk_alcliq: '',
            risk_smoke: '',
            risk_drugs: '',
            risk_mobpho: '',
            risk_sleep: '',
            risk_other: '',
            risk_etc_spec: '',
            risk_none: '',
            safe_none: '',
            safe_airbag: '',
            safe_helmet: '',
            safe_cseat: '',
            safe_sbelt: '',
            safe_unkn: '',
            safe_vest: '',
            safe_other: '',
            safe_other_sp: ''
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
            icd_10_nature_er: '',
            icd_10_external_er: '',
            treatmentGiven: '',
            disposition_code: '',
            disp_er_sp: '',
            disp_er_sp_oth: '',
            outcome_code: ''
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
            consultant_name: '',
            consultant_mobile: '',
            consultant_address: ''
        }
    });

    // const forSaving = ref({});

    async function loadPatientData(enc) {
        // console.log('Loading patient data for:', enc);

        // reset();
        try {
            const response = await axios.get('injuryList/' + enc, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            // console.log('Response from loadPatientData(response):', response);
            header.value = response.data.header;
            enccode.value = response.data.enccode;
            status.value = response.data.status;
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
            details.value.preAdmissionData.inj_intent_code = header.value.iicode;
            // console.log('Details:', details.value);
            // console.log('Patient data header loaded:', header);
            // console.log('Patient data details loaded:', details);
            header.value.subjective = header.value.subjective.replace(/\n\n/, '');
            header.value.objective = header.value.objective.replace(/\n\n/, '');
            return response.data;
        } catch (error) {
            // console.log('authToken:', localStorage.getItem('authToken'));
            console.error('Failed to load patient data:', error);
        }
    }

    function formatDataForSaving() {
        const user = useUserStore();
        // console.log('user:', user);
        let employeeid;
        if (user.userInfo.employeeid) {
            // employeeid = user.userInfo.employeeid;
            // console.log('employeeid:', employeeid);
        }
        // console.log('status.value:', status.value);
        return JSON.stringify({
            enccode: enccode.value,

            entryBy: employeeid,
            status: status.value,
            generalData: { ...details.value.generalData },
            preAdmissionData: { ...details.value.preAdmissionData },
            natureOfInjury: { ...details.value.natureOfInjury },
            ExternalCauseOfInjury: { ...details.value.ExternalCauseOfInjury },
            forTransportVehicularAccident: { ...details.value.forTransportVehicularAccident },
            hospitalFacilityData: { ...details.value.hospitalFacilityData },
            inPatient: { ...details.value.inPatient }
            // }
        });
    }

    // async function saveFormattedData() {
    //     const formattedData = formatDataForSaving();
    //     const response = await axios
    //         .post(
    //             'saveData',
    //             {
    //                 formattedData: formattedData
    //             },
    //             {
    //                 headers: {
    //                     Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //                 }
    //             }
    //         )
    //         .then((res) => {
    //             console.log('Response from saveFormattedData:', res);
    //             return res;
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             return err.response;
    //         });

    //     console.log('JSON.parse(formattedData)', JSON.parse(formattedData).value);
    //     // return response;
    // }

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
                return res;
            })
            .catch((err) => {
                console.error(err);
                return err.response;
            });
        return response;
    }

    watch(details.value.natureOfInjury.noi_burn_r, (value) => {
        if (!value) return;
        if (value == 'Y') {
            details.value.ExternalCauseOfInjury.ext_burn_r = 'Y';
        } else {
            details.value.ExternalCauseOfInjury.ext_burn_r = 'N';
        }
    });
    watch(details.value.ExternalCauseOfInjury.ext_burn_r, (value) => {
        if (!value) return;
        if (value == 'Y') {
            details.value.natureOfInjury.noi_burn_r = 'Y';
        } else {
            details.value.natureOfInjury.noi_burn_r = 'N';
        }
    });

    function reset() {
        status.value = '';
        header.value = { ...header.value };
        details.value = null;
        // console.log('patientStore.reset.details:', details.value);
    }

    return {
        enccode,
        status,
        header,
        details,
        loadPatientData,
        formatDataForSaving,
        saveFormattedData,
        submitForm,
        defaultDetails,
        removeFromList,
        reset,
        noiPoiToiDoi
    };
});
