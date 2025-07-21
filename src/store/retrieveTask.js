import { defineStore } from 'pinia';
import axios from 'axios';

export const usePatTask = defineStore('patTask', {
    state: () => ({
        API_URL: import.meta.env.VITE_HOSPAPI_BASE_URL,
        entries: [],
        enccode: '',
        header: [],
        form1: {
            enccode: '',
            // enccode:this.enccode,
            entryBy: null,
            status: '',
            generalData: {
                hpercode: '',
                reg_no: '',
                pat_phil_health_no: '',
                plc_regcode: '',
                plc_provcode: '',
                plc_ctycode: '',
                date_of_birth: '',
                inj_date: '',
                encounter_date: '',
                date_report: '',
                inj_time: '',
                encounter_time: '',
                time_report: '',
                status: ''
            },
            preAdmissionData: {
                first_aid_code: '',
                inj_intent_code: '',
                firstaid_others: '',
                firstaid_others2: '',
                poc_etc_spec: '',
                act_etc_spec: ''
                // risk_factor_code: 'Y',
                // risk_factor_alcohol:false,
                // risk_factor_sleepy:false,
                // risk_factor_smoking:false,
                // risk_factor_mobile:false,
                // risk_factor_oth:false,
                // risk_factor_oth_sp:'',
                // safety_code:'Y',
                // safety_ukn:false,
                // safety_air:false,
                // safety_helm:false,
                // safety_child:false,
                // safety_belt:false,
                // safety_life_vest:false,
                // safety_oth:false,
                // safety_oth_sp:''
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
                ext_vape: '',
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
            },
            bghdata: {
                bleeding: 'n',
                bitingAnimal: '',
                observation: '',
                washingDone: '',
                appliedToWound: '',
                previousARV: '',
                arvDate: '',
                tetanusVaccination: '',
                allergies: '',
                adverseReaction: ''
            }
        }
    }),
    setup() {
        // API_URL = import.meta.env.VITE_HOSPAPI_BASE_URL
    },
    actions: {},
    getters: {
        getUsers(state) {
            return state.entries;
        },
        async getRetrieveInjuryDataJson() {
            const enccode1 = {
                enccode: this.enccode
            };
            // const response = await axios.post("http://192.168.7.66:8040/api/retrieveInjuryDataJSON",enccode1)

            // const API_URL = this.API_URL

            // const response = await axios.post("http://192.168.7.66:8040/api/spRetrieveInjuryDataJSON",enccode1).then(res => { return res.data})
            // const response = await axios.post(import.meta.env.VITE_HOSPAPI_BASE_URL+"spRetrieveInjuryDataJSON",enccode1).then(res => { return res.data})
            const response = await axios.post(this.API_URL + 'spRetrieveInjuryDataJSON', enccode1).then((res) => {
                return res.data;
            });
            // if(!Object.keys(response.data).length){
            //     console.log("no data found");
            // }
            // const response = await axios.post("http://192.168.7.3:8040/api/spRetrieveInjuryDataJSON",enccode1).then(res => { return res.data})
            console.log('response', response);
            // console.log('response stringify', JSON.stringify(response));
            // console.log('response objetct.keys', Object.keys(response).length);
            // console.log('response[0]', response[0]);
            // console.log('response[0]', response[0].data);
            // console.log('response[0]', JSON.parse(response[0].data));
            // console.log('response.data', response.data);

            //  console.log('this.form1 before', this.form1);
            // if(response[0].data.length > 0 ) {this.form1 = JSON.parse(response[0].data)}
            // if(Object.keys(response).length > 0 ) {this.form1 = JSON.parse(response[0].data)}
            if (Object.keys(response).length == 0) {
                this.form1.enccode = this.enccode;
            }
            if (Object.keys(response).length > 0) {
                this.form1 = JSON.parse(response[0].data);
            }

            // if(response.length > 0 ) this.form1 = JSON.parse(response[0].data)
            // if(response.length > 0 ) this.form1 = response
            // this.form1.enccode = this.enccode
            //  console.log('retrieve.this.form1', this.form1);
            // console.log('retrieve.this.form1.enccode', this.form1.enccode);
            return this.form1;
        },
        async getPatHeader() {
            const enccode1 = {
                enccode1: this.enccode
            };
            // const response = await axios.post("http://192.168.7.66:8040/api/injuryHeader",enccode1)
            // const response = await axios.post("http://192.168.7.66:8040/api/injuryHeader",enccode1)//.then(res => {return res.data})
            const response = await axios.post(this.API_URL + 'injuryHeader', enccode1); //.then(res => {return res.data})
            // const response = await axios.post("http://192.168.7.3:8040/api/injuryHeader",enccode1)//.then(res => {return res.data})
            // console.log('response.data',response.data[0]);
            this.header = response.data[0];
            // return response.data[0]
            return this.header;
        }
    }
});
