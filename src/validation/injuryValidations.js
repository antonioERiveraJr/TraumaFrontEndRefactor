import { required } from '@vee-validate/rules'; // For the rules
import { defineRule } from 'vee-validate';
import { usePatientStore } from '../store/injury/patientStore';
import { computed } from 'vue'; 
defineRule('required', required);

// Custom requiredIf rule
defineRule('requiredIf', (value, [condition]) => {
    return condition === 'true' ? !!value : true;
}); 

export default function createValidationRules() {
    const patientStore = usePatientStore();
 
    const valid_firstaid_others = computed(() => {
        return patientStore.details.preAdmissionData.first_aid_code === 'Y';
    });

    const degree_burn = computed(() => {
        return (
            patientStore.details.natureOfInjury.degree_burn1 === 'Y' || patientStore.details.natureOfInjury.degree_burn2 === 'Y' || patientStore.details.natureOfInjury.degree_burn3 === 'Y' || patientStore.details.natureOfInjury.degree_burn4 === 'Y'
        );
    });

    const validationRules = {
        inPatient: {
            noPhysical: {
                requiredIf: ![
                    patientStore.details.natureOfInjury.noi_no_physical,
                    patientStore.details.natureOfInjury.noi_abrasion,
                    patientStore.details.natureOfInjury.noi_burn_r,
                    patientStore.details.natureOfInjury.noi_avulsion,
                    patientStore.details.natureOfInjury.noi_owound,
                    patientStore.details.natureOfInjury.noi_incision,
                    patientStore.details.natureOfInjury.noi_amp,
                    patientStore.details.natureOfInjury.noi_brain,
                    patientStore.details.natureOfInjury.noi_gunshot,
                    patientStore.details.natureOfInjury.noi_stab_wound,
                    patientStore.details.natureOfInjury.noi_concussion,
                    patientStore.details.natureOfInjury.noi_contusion,
                    patientStore.details.natureOfInjury.noi_frac_clo,
                    patientStore.details.natureOfInjury.noi_frac_ope,
                    patientStore.details.natureOfInjury.noi_disl_open,
                    patientStore.details.natureOfInjury.noi_disl_close,
                    patientStore.details.natureOfInjury.noi_punc,
                    patientStore.details.natureOfInjury.noi_others
                ].includes('Y')
            },
            noExternal: {
                requiredIf: ![
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
                    patientStore.details.ExternalCauseOfInjury.ext_transport,
                    patientStore.details.ExternalCauseOfInjury.ext_neglect,
                    patientStore.details.ExternalCauseOfInjury.ext_sexual,
                    patientStore.details.ExternalCauseOfInjury.ext_physical,
                    patientStore.details.ExternalCauseOfInjury.ext_other,
                    patientStore.details.ExternalCauseOfInjury.ext_assault,
                    patientStore.details.ExternalCauseOfInjury.ext_battery
                ].includes('Y')
            }
        },
        // Rest of the validation rules remain unchanged
        forTransportVehicularAccident: {
            pat_veh_sp: {
                requiredIf: patientStore.details.forTransportVehicularAccident.vehicle_code === '88'
            },
            vehicle_type_id: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y'
            },
            ref_veh_acctype_code: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y'
            },
            vehicle_code: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y'
            },
            position_code: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y'
            },
            pos_pat_sp: {
                requiredIf: patientStore.details.forTransportVehicularAccident.position_code === '88'
            },
            etc_veh: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y' && patientStore.details.forTransportVehicularAccident.ref_veh_acctype_code === '10'
            },
            etc_veh_sp: {
                requiredIf: patientStore.details.forTransportVehicularAccident.etc_veh === '88'
            },
            // New validation for risk factors

            risk_alcliq: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.risk_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_sleep != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_smoke != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_mobpho != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_other !== 'Y'
            },
            risk_sleep: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.risk_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_alcliq != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_smoke != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_mobpho != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_other !== 'Y'
            },
            risk_smoke: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.risk_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_sleep != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_alcliq != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_mobpho != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_other !== 'Y'
            },
            risk_mobpho: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.risk_mobpho === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_sleep != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_smoke != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_alcliq != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_other !== 'Y'
            },

            risk_other: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.risk_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_sleep != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_smoke != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_mobpho != 'Y' &&
                    patientStore.details.forTransportVehicularAccident.risk_alcliq !== 'Y'
            },
            risk_etc_spec: {
                requiredIf: patientStore.details.forTransportVehicularAccident.risk_other === 'Y' && patientStore.details.forTransportVehicularAccident.risk_etc_spec === ''
            },
            safe_none: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y'
            },

            risk_none: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y'
            },
            safe_unkn: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
            },
            safe_airbag: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
            },
            safe_helmet: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
            },
            safe_cseat: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
            },
            safe_sbelt: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
            },
            safe_vest: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
            },
            safe_other: {
                requiredIf:
                    patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                    patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y'
            },

            safety_etc_spec: {
                requiredIf: patientStore.details.forTransportVehicularAccident.safe_none === 'Y' && patientStore.details.forTransportVehicularAccident.safe_other_spec === ''
            }
        },
        generalData: {
            perpetrator_sp: {
                requiredIf: patientStore.details.generalData.perpetrator === 'Y'
            },
            plc_regcode: {
                required: true
            },
            plc_provcode: {
                required: true
            },
            plc_ctycode: {
                required: true
            },
            doctor_doi: {
                required: true
            }
        },
        preAdmissionData: {
            inj_intent_code: {
                required: true
            },
            first_aid_code: {
                required: true
            },
            firstaid_others2: {
                required: valid_firstaid_others.value
            },
            firstaid_others: {
                required: valid_firstaid_others.value
            },
            place_occ_code: {
                required: true
            },
            activity_code: {
                required: true
            },
            act_etc_spec: {
                requiredIf: patientStore.details.preAdmissionData.activity_code === '88'
            },
            poc_etc_spec: {
                requiredIf: patientStore.details.preAdmissionData.place_occ_code === '88'
            }
        },
        natureOfInjury: {
            noi_brain_stg: {
                requiredIf: patientStore.details.natureOfInjury.noi_brain === 'Y'
            },
            noi_braindtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_brain_stg != '' && patientStore.details.natureOfInjury.noi_brain_stg != undefined
            },
            noi_gunshotdtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_gunshot === 'Y'
            },
            noi_stab_wounddtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_stab_wound === 'Y'
            },
            // noi_stab_wounddtl: {
            //     requiredIf: patientStore.details.natureOfInjury.noi_stab_wound === 'Y'
            // },
            noi_disl_open_sp: {
                requiredIf: patientStore.details.natureOfInjury.noi_disl_open === 'Y'
            },
            noi_disl_close_sp: {
                requiredIf: patientStore.details.natureOfInjury.noi_disl_close === 'Y'
            },
            noi_abradtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_abrasion === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_abrasion === 'N'
            },
            noi_avuldtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_avulsion === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_avulsion === 'N'
            },
            degree_burn1: {
                requiredIf: patientStore.details.natureOfInjury.noi_burn_r === 'Y' && !degree_burn.value
                // resetIfN: patientStore.details.natureOfInjury.noi_burn_r === 'N'
            },
            degree_burn2: {
                requiredIf: patientStore.details.natureOfInjury.noi_burn_r === 'Y' && !degree_burn.value
                // resetIfN: patientStore.details.natureOfInjury.noi_burn_r === 'N'
            },
            degree_burn3: {
                requiredIf: patientStore.details.natureOfInjury.noi_burn_r === 'Y' && !degree_burn.value
                // resetIfN: patientStore.details.natureOfInjury.noi_burn_r === 'N'
            },
            degree_burn4: {
                requiredIf: patientStore.details.natureOfInjury.noi_burn_r === 'Y' && !degree_burn.value
                // resetIfN: patientStore.details.natureOfInjury.noi_burn_r === 'N'
            },
            noi_burndtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_burn_r === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_burn_r === 'N'
            },
            noi_concussiondtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_concussion === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_concussion === 'N'
            },
            noi_contudtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_contusion === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_contusion === 'N'
            },
            noi_fropdtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_frac_ope === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_frac_ope=== 'N'
            },
            noi_frcldtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_frac_clo === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_frac_clo === 'N'
            },
            noi_owoudtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_owound === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_owound === 'N'
            },
            noi_incision_sp: {
                requiredIf: patientStore.details.natureOfInjury.noi_incision === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_owound === 'N'
            },
            noi_ampdtl: {
                requiredIf: patientStore.details.natureOfInjury.noi_amp === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_amp === 'N'
            },
            noi_otherinj: {
                requiredIf: patientStore.details.natureOfInjury.noi_others === 'Y'
                // resetIfN: patientStore.details.natureOfInjury.noi_others === 'N'
            },
            noi_punc_sp: {
                requiredIf: patientStore.details.natureOfInjury.noi_punc === 'Y'
            }
        },

        ExternalCauseOfInjury: {
            //animal bite form
            // erig: {
            //     requiredIf:
            //         patientStore.details.ExternalCauseOfInjury.hrig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y'
            // },
            // pvrv: {
            //     requiredIf:
            //         patientStore.details.ExternalCauseOfInjury.hrig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y'
            // },
            // pcec: {
            //     requiredIf:
            //         patientStore.details.ExternalCauseOfInjury.hrig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y'
            // },
            // hrig: {
            //     requiredIf:
            //         patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y'
            // },
            // ats: {
            //     requiredIf:
            //         patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.hrig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y'
            // },
            // tt: {
            //     requiredIf:
            //         patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.hrig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.vaccine_none !== 'Y'
            // },
            // vaccine_none: {
            //     requiredIf:
            //         patientStore.details.ExternalCauseOfInjury.erig !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pvrv !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.pcec !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.ats !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.tt !== 'Y' &&
            //         patientStore.details.ExternalCauseOfInjury.hrig !== 'Y'
            // },

            ext_bite_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            },
            // dogbiteDegree: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            // },
            // bleeding: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            // },
            // bitingAnimal: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            // },
            // observation: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            // },
            // washingDone: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            // },
            // washingDone_by: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.washingDone === 'Y'
            // },
            // previousARV: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            // },
            // tetanusVaccination: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            // },
            // allergies: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            // },
            // adverseReaction: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y'
            // },
            // pvrv_site_2: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.pvrv === 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_4 !== 'Y'
            // },
            // pvrv_site_4: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.pvrv === 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_2 !== 'Y'
            // },
            // pcec_site_2: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.pcec === 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_4 !== 'Y'
            // },
            // pcec_site_4: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.pcec === 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_2 !== 'Y'
            // },
            // hrig_num: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.hrig === 'Y'
            // },
            // erig_num: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.erig === 'Y'
            // },
            // ats_num: { requiredIf: patientStore.details.ExternalCauseOfInjury.ats === 'Y' },
            //
            ext_encavement_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_encavement === 'Y'
            },
            ext_crushing_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_crushing === 'Y'
            },
            ext_stab_wound_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_stab_wound === 'Y'
            },
            ext_foreign_body_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_foreign_body === 'Y'
            },
            ext_caustic_ingestion_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_caustic_ingestion === 'Y'
            },
            contact_blurt_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.contact_blurt === 'Y'
            },
            foreign_body_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.foreign_body === 'Y'
            },
            ext_expo_nature_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ref_expnature_code == '07'
            },
            ref_drowning_cope: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_drown_r === 'Y'
            },

            // ext_gun_sp: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_gun === 'Y'
            //     // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_bite === 'N'
            // },
            ref_burn_code: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_burn_r === 'Y'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_burn_r === 'N'
            },

            ref_burn_code_doctor: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_burn_r_doctor === 'Y'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_burn_r === 'N'
            },
            ext_burn_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ref_burn_code === '06' && patientStore.details.ExternalCauseOfInjury.ext_burn_r === 'Y'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_burn_code === 'N'
            },
            ext_drown_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_drown_r === 'Y' && patientStore.details.ExternalCauseOfInjury.ref_drowning_cope === '06'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_drown_r === 'N'
            },
            ref_expnature_code: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r === 'Y'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_expo_nature_r === 'N'
            },
            ext_sharp_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_sharp === 'Y'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_sharp === 'N'
            },
            // ext_assault_sp: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_assault === 'Y'
            //     // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_sharp === 'N'
            // },
            // ext_battery_sp: {
            //     requiredIf: patientStore.details.ExternalCauseOfInjury.ext_battery === 'Y'
            //     // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_sharp === 'N'
            // },
            ext_falldtl: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_fall === 'Y'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_fall === 'N'
            },
            ext_chem_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_chem === 'Y'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_chem === 'N'
            },
            firecracker_code: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_firecracker_r === 'Y'
            },
            ext_firecracker_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_firecracker_r === 'Y' && patientStore.details.ExternalCauseOfInjury.firecracker_code === '88'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_firecracker_r === 'N'
            },
            ext_other_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_other === 'Y'
                // resetIfN: patientStore.details.ExternalCauseOfInjury.ext_other === 'N'
            }
        },
        hospitalFacilityData: {
            status_code: { required: true },
            // gcs_beh_code: {
            //     requiredIf: patientStore.details.hospitalFacilityData.gcs_code === 'Glasgow Coma Scale'
            // },
            gcs_score: {
                requiredIf: patientStore.details.hospitalFacilityData.gcs_code === 'Glasgow Coma Scale'
            },
            mode_transport_code: { required: true },
            // diagnosis:{
            //     required:true
            // },
            stat_reachdtl: {
                requiredIf: patientStore.details.hospitalFacilityData.mode_transport_code === '04'
                // resetIfN: patientStore.details.hospitalFacilityData.mode_transport_code !== '04'
            }
        }
    };
    // console.log('validation: ', validationRules);

    return validationRules;
}
