import { required } from '@vee-validate/rules';
import { defineRule } from 'vee-validate';
import { usePatientStore } from '../store/injury/PatientStore';

defineRule('requiredIf', (value, [condition]) => {
    return condition === 'true' ? !!value : true;
});

defineRule('required', required);

export default function createValidationRules() {
    const patientStore = usePatientStore();

    const validationRules = {
        ExternalCauseOfInjury: {
            previousARV: { required: true },
            arvDate: { requiredIf: patientStore.details.ExternalCauseOfInjury.previousARV === 'Y' },
            tetanusVaccination: { required: true },
            tetanusDoses: { requiredIf: patientStore.details.ExternalCauseOfInjury.tetanusVaccination === 'Y' },
            lastTetanusDose: { requiredIf: patientStore.details.ExternalCauseOfInjury.tetanusVaccination === 'Y' },
            allergies: { required: true },
            adverseReaction: { required: true },
            ext_bite_sp: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            dogbiteDegree: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            bleeding: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            bitingAnimal: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            observation: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            washingDone: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            washingDone_by: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.details.ExternalCauseOfInjury.washingDone === 'Y' && patientStore.type_prophylaxis === 'POST-EXPOSURE'
            }
        },
        followUp: {
            complaints: { requiredIf: !patientStore.isUpdateForm && patientStore.progressionDay !== '0' && patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' && patientStore.patientTSSRecord?.data?.[0] },
            adverse_reaction: { requiredIf: !patientStore.isUpdateForm && patientStore.progressionDay !== '0' && patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' && patientStore.patientTSSRecord?.data?.[0] },
            biting: {
                requiredIf:
                    !patientStore.isUpdateForm && patientStore.type_prophylaxis === 'POST-EXPOSURE' && patientStore.progressionDay !== '0' && patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' && patientStore.patientTSSRecord?.data?.[0]
            },
            finding: {
                requiredIf:
                    !patientStore.isUpdateForm && patientStore.type_prophylaxis === 'PRE-EXPOSURE' && patientStore.progressionDay !== '0' && patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' && patientStore.patientTSSRecord?.data?.[0]
            },
            finding_sp: {
                requiredIf:
                    !patientStore.isUpdateForm &&
                    patientStore.details.followUp.finding === 'WITH FINDINGS' &&
                    patientStore.progressionDay !== '0' &&
                    patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' &&
                    patientStore.patientTSSRecord?.data?.[0]
            },
            // others: { requiredIf:!patientStore.isUpdateForm && patientStore.progressionDay !== '0'&& patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' &&  patientStore.patientTSSRecord?.data?.[0] },
            wound_description: {
                requiredIf:
                    !patientStore.isUpdateForm && patientStore.type_prophylaxis === 'POST-EXPOSURE' && patientStore.progressionDay !== '0' && patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' && patientStore.patientTSSRecord?.data?.[0]
            },
            erythema: {
                requiredIf:
                    !patientStore.isUpdateForm && patientStore.type_prophylaxis === 'POST-EXPOSURE' && patientStore.progressionDay !== '0' && patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' && patientStore.patientTSSRecord?.data?.[0]
            },
            discharge: {
                requiredIf:
                    !patientStore.isUpdateForm && patientStore.type_prophylaxis === 'POST-EXPOSURE' && patientStore.progressionDay !== '0' && patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' && patientStore.patientTSSRecord?.data?.[0]
            },
            tenderness: {
                requiredIf:
                    !patientStore.isUpdateForm && patientStore.type_prophylaxis === 'POST-EXPOSURE' && patientStore.progressionDay !== '0' && patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' && patientStore.patientTSSRecord?.data?.[0]
            },
            hematoma: {
                requiredIf:
                    !patientStore.isUpdateForm && patientStore.type_prophylaxis === 'POST-EXPOSURE' && patientStore.progressionDay !== '0' && patientStore.patientTSSRecord?.data?.[0]?.primeTSS !== 'I' && patientStore.patientTSSRecord?.data?.[0]
            }
        },
        ABTC: {
            erig: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.hrig !== 'Y' &&
                    patientStore.details.ABTC.pvrv !== 'Y' &&
                    patientStore.details.ABTC.pcec !== 'Y' &&
                    patientStore.details.ABTC.ats !== 'Y' &&
                    patientStore.details.ABTC.tt !== 'Y' &&
                    patientStore.details.ABTC.vaccine_none !== 'Y'
            },
            pvrv: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.hrig !== 'Y' &&
                    patientStore.details.ABTC.erig !== 'Y' &&
                    patientStore.details.ABTC.pcec !== 'Y' &&
                    patientStore.details.ABTC.ats !== 'Y' &&
                    patientStore.details.ABTC.tt !== 'Y' &&
                    patientStore.details.ABTC.vaccine_none !== 'Y'
            },
            pcec: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.hrig !== 'Y' &&
                    patientStore.details.ABTC.pvrv !== 'Y' &&
                    patientStore.details.ABTC.erig !== 'Y' &&
                    patientStore.details.ABTC.ats !== 'Y' &&
                    patientStore.details.ABTC.tt !== 'Y' &&
                    patientStore.details.ABTC.vaccine_none !== 'Y'
            },
            hrig: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.erig !== 'Y' &&
                    patientStore.details.ABTC.pvrv !== 'Y' &&
                    patientStore.details.ABTC.pcec !== 'Y' &&
                    patientStore.details.ABTC.ats !== 'Y' &&
                    patientStore.details.ABTC.tt !== 'Y' &&
                    patientStore.details.ABTC.vaccine_none !== 'Y'
            },
            ats: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.erig !== 'Y' &&
                    patientStore.details.ABTC.pvrv !== 'Y' &&
                    patientStore.details.ABTC.pcec !== 'Y' &&
                    patientStore.details.ABTC.hrig !== 'Y' &&
                    patientStore.details.ABTC.tt !== 'Y' &&
                    patientStore.details.ABTC.vaccine_none !== 'Y'
            },
            tt: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.erig !== 'Y' &&
                    patientStore.details.ABTC.pvrv !== 'Y' &&
                    patientStore.details.ABTC.pcec !== 'Y' &&
                    patientStore.details.ABTC.ats !== 'Y' &&
                    patientStore.details.ABTC.hrig !== 'Y' &&
                    patientStore.details.ABTC.vaccine_none !== 'Y'
            },
            vaccine_none: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.erig !== 'Y' &&
                    patientStore.details.ABTC.pvrv !== 'Y' &&
                    patientStore.details.ABTC.pcec !== 'Y' &&
                    patientStore.details.ABTC.ats !== 'Y' &&
                    patientStore.details.ABTC.tt !== 'Y' &&
                    patientStore.details.ABTC.hrig !== 'Y'
            },
            pvrv_site_1_id: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.pvrv === 'Y' &&
                    patientStore.details.ABTC.pvrv_site_4 !== 'Y' &&
                    patientStore.details.ABTC.pvrv_site_2 !== 'Y' &&
                    patientStore.details.ABTC.pvrv_site_1_im !== 'Y'
            },
            pvrv_site_1_im: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.pvrv === 'Y' &&
                    patientStore.details.ABTC.pvrv_site_4 !== 'Y' &&
                    patientStore.details.ABTC.pvrv_site_2 !== 'Y' &&
                    patientStore.details.ABTC.pvrv_site_1_id !== 'Y'
            },
            pcec_site_1_im: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.pcec === 'Y' &&
                    patientStore.details.ABTC.pcec_site_4 !== 'Y' &&
                    patientStore.details.ABTC.pcec_site_2 !== 'Y' &&
                    patientStore.details.ABTC.pcec_site_1_id !== 'Y'
            },
            pcec_site_1_id: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.pcec === 'Y' &&
                    patientStore.details.ABTC.pcec_site_4 !== 'Y' &&
                    patientStore.details.ABTC.pcec_site_2 !== 'Y' &&
                    patientStore.details.ABTC.pcec_site_1_im !== 'Y'
            },
            pvrv_site_2: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.pvrv === 'Y' &&
                    patientStore.details.ABTC.pvrv_site_4 !== 'Y' &&
                    patientStore.details.ABTC.pvrv_site_1_im !== 'Y' &&
                    patientStore.details.ABTC.pvrv_site_1_id !== 'Y'
            },
            pvrv_site_4: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.pvrv === 'Y' &&
                    patientStore.details.ABTC.pvrv_site_2 !== 'Y' &&
                    patientStore.details.ABTC.pvrv_site_1_im !== 'Y' &&
                    patientStore.details.ABTC.pvrv_site_1_id !== 'Y'
            },
            pcec_site_2: {  
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.pcec === 'Y' &&
                    patientStore.details.ABTC.pcec_site_4 !== 'Y' &&
                    patientStore.details.ABTC.pcec_site_1_im !== 'Y' &&
                    patientStore.details.ABTC.pcec_site_1_id !== 'Y'
            },
            pcec_site_4: {
                requiredIf:
                    patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' &&
                    patientStore.details.ABTC.pcec === 'Y' &&
                    patientStore.details.ABTC.pcec_site_2 !== 'Y' &&
                    patientStore.details.ABTC.pcec_site_1_im !== 'Y' &&
                    patientStore.details.ABTC.pcec_site_1_id !== 'Y'
            },
            hrig_num: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.details.ABTC.hrig === 'Y'
            },
            erig_num: {
                requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.details.ABTC.erig === 'Y' && patientStore.details.ABTC.skintest === 'Y'
            },
            ats_num: { requiredIf: patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y' && patientStore.details.ExternalCauseOfInjury.ats === 'Y' && patientStore.details.ABTC.skintest === 'Y' }
        },
        preAdmissionData: {
            place_occ_code: {
                requiredIf: patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            activity_code: {
                requiredIf: patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            inj_intent_code: {
                requiredIf: patientStore.type_prophylaxis === 'POST-EXPOSURE'
            }
        },
        generalData: {
            doctor_injtme: {
                requiredIf: patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            plc_regcode: {
                requiredIf: patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            plc_provcode: {
                requiredIf: patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            plc_ctycode: {
                requiredIf: patientStore.type_prophylaxis === 'POST-EXPOSURE'
            }
        },
        hospitalFacilityData: {
            status_code: {
                requiredIf: patientStore.type_prophylaxis === 'POST-EXPOSURE'
            },
            mode_transport_code: {
                requiredIf: patientStore.type_prophylaxis === 'POST-EXPOSURE'
            }
        },
        noPhysical: {
            requiredIf: ![
                patientStore.details.natureOfInjury.noi_no_physical,
                patientStore.details.natureOfInjury.noi_abrasion,
                patientStore.details.natureOfInjury.noi_burn_r,
                patientStore.details.natureOfInjury.noi_avulsion,
                patientStore.details.natureOfInjury.noi_owound,
                patientStore.details.natureOfInjury.noi_incision,
                patientStore.details.natureOfInjury.noi_amp,
                patientStore.details.natureOfInjury.noi_punc,
                patientStore.details.natureOfInjury.noi_others
            ].includes('Y')
        }
    };

    // Function to check each rule and log required fields and their status
    const logRequiredFieldsStatus = () => {
        // console.log('Checking required fields...');
        for (const [section, rules] of Object.entries(validationRules)) {
            for (const [field, rule] of Object.entries(rules)) {
                const isRequired = rule.required || (rule.requiredIf && eval(rule.requiredIf));
                const value = patientStore.details.ExternalCauseOfInjury[field] || patientStore.details[field]; // Adjust based on the field's actual path

                if (isRequired) {
                    if (value) {
                        // console.log(`Field ${section}.${field} is required and filled: ${value}`);
                    } else {
                        // console.log(`Field ${section}.${field} is required but not filled.`);
                    }
                }
            }
        }
    };

    logRequiredFieldsStatus();

    return validationRules;
}
