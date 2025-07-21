<script setup>
import { usePatientStore } from '../../../../store/injury/patientStore';
import createValidationRules from '../../../../validation/injuryValidations';
import useVuelidate from '@vuelidate/core';
import { ref, computed, watch, defineEmits, onUnmounted } from 'vue';
import LibraryService from '@/service/LibraryService';
import InputSwitch from 'primevue/inputswitch';
import TextAreaPreAdmissionDoctor from '../../../custom/textAreaPreAdmissionDoctor.vue';
import InputTextCheckBoxDoctor from '../../../custom/inputTextCheckBoxDoctor.vue';
import InputTextCheckBoxDoctor2 from '../../../custom/inputTextCheckBoxDoctor2.vue';
import Swal from 'sweetalert2';
import VawcForm from '../../injury/doctorsForm/subForm/vawcForm.vue';
import CheckBoxMultiple from '../../../custom/checkBoxMultiple.vue';
const patientStore = usePatientStore();
const loading = ref(true);
const vawcDialog = ref(false);
const libraryService = new LibraryService();
const isImpressionInputNeeded = ref(false);
const isCrashIncident = ref(false);
const gcsCodeScore = ref();
const focusElement = (refName) => {
    const element = ref[refName];
    if (element) {
        element.focus();
    }
};
const v$ = useVuelidate(createValidationRules(), patientStore.details);
const diagnosisLocation = ref('dx');
const validate = async () => {
    const natureOfInjury = await v$.value.natureOfInjury.$validate();
    return { natureOfInjury };
};
const getRequiredValidation = (field) => {
    return v$.value.$errors.some((error) => error.$property === field);
};
const openVAWCDialog = () => {
    vawcDialog.value = true;
};
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
const emit = defineEmits(['update:requiredCountPreAdmission']);
const requiredFieldsCount = () => {
    let count = 0;
    const fields = [
        {
            field: patientStore.noPhysical,
            condition: ![
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
        { field: patientStore.details.preAdmissionData.place_occ_code, condition: true },
        { field: patientStore.details.preAdmissionData.poc_etc_spec, condition: patientStore.details.preAdmissionData.place_occ_code === '88' },
        { field: patientStore.details.preAdmissionData.activity_code, condition: true },
        { field: patientStore.details.preAdmissionData.act_etc_spec, condition: patientStore.details.preAdmissionData.activity_code === '88' },
        { field: patientStore.details.preAdmissionData.first_aid_code, condition: true },
        { field: patientStore.details.preAdmissionData.firstaid_others, condition: patientStore.details.preAdmissionData.first_aid_code === 'Y' },
        { field: patientStore.details.preAdmissionData.firstaid_others2, condition: patientStore.details.preAdmissionData.first_aid_code === 'Y' },
        { field: burnDegreeValue.value, condition: patientStore.details.natureOfInjury.noi_burn_r === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_burndtl, condition: patientStore.details.natureOfInjury.noi_burn_r === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_abradtl, condition: patientStore.details.natureOfInjury.noi_abrasion === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_avuldtl, condition: patientStore.details.natureOfInjury.noi_avulsion === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_owoudtl, condition: patientStore.details.natureOfInjury.noi_owound === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_incision_sp, condition: patientStore.details.natureOfInjury.noi_incision === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_ampdtl, condition: patientStore.details.natureOfInjury.noi_amp === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_brain_stg, condition: patientStore.details.natureOfInjury.noi_brain === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_braindtl, condition: patientStore.details.natureOfInjury.noi_brain === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_gunshotdtl, condition: patientStore.details.natureOfInjury.noi_gunshot === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_stab_wounddtl, condition: patientStore.details.natureOfInjury.noi_stab_wound === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_concussiondtl, condition: patientStore.details.natureOfInjury.noi_concussion === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_contudtl, condition: patientStore.details.natureOfInjury.noi_contusion === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_fropdtl, condition: patientStore.details.natureOfInjury.noi_frac_ope === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_frcldtl, condition: patientStore.details.natureOfInjury.noi_frac_clo === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_disl_open_sp, condition: patientStore.details.natureOfInjury.noi_disl_open === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_disl_close_sp, condition: patientStore.details.natureOfInjury.noi_disl_close === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_otherinj, condition: patientStore.details.natureOfInjury.noi_others === 'Y' },
        { field: patientStore.details.natureOfInjury.noi_punc_sp, condition: patientStore.details.natureOfInjury.noi_punc === 'Y' },
        { field: patientStore.details.forTransportVehicularAccident.risk_none, condition: patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y' },
        { field: patientStore.details.forTransportVehicularAccident.safe_none, condition: patientStore.details.ExternalCauseOfInjury.ext_transport === 'Y' },

        {
            field: patientStore.details.forTransportVehicularAccident.risk_alcliq,
            condition:
                patientStore.details.forTransportVehicularAccident.risk_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_sleep != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_smoke != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_mobpho != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.risk_sleep,
            condition:
                patientStore.details.forTransportVehicularAccident.risk_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_alcliq != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_smoke != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_mobpho != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.risk_smoke,
            condition:
                patientStore.details.forTransportVehicularAccident.risk_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_sleep != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_alcliq != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_mobpho != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.risk_mobpho,
            condition:
                patientStore.details.forTransportVehicularAccident.risk_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_sleep != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_smoke != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_alcliq != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.risk_other,
            condition:
                patientStore.details.forTransportVehicularAccident.risk_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_sleep != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_smoke != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_mobpho != 'Y' &&
                patientStore.details.forTransportVehicularAccident.risk_alcliq !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.safe_none,
            condition:
                patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.safe_unkn,
            condition:
                patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.safe_airbag,
            condition:
                patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.safe_helmet,
            condition:
                patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.safe_cseat,
            condition:
                patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.safe_sbelt,
            condition:
                patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.safe_vest,
            condition:
                patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_other !== 'Y'
        },
        {
            field: patientStore.details.forTransportVehicularAccident.safe_other,
            condition:
                patientStore.details.forTransportVehicularAccident.safe_none === 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y' &&
                patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y'
        }
    ];

    fields.forEach(({ field, condition }) => {
        if (condition && field === '') {
            count++;
        }
    });
    emit('update:requiredCountPreAdmission', count);
};
const places = libraryService.getPlaces();
const activities = libraryService.getActivities();
const firstAidGivens = libraryService.getFirstAidGivens();
const openContributingFactorDialog = ref(false);
const openSafetyDialog = ref(false);
const autoOpenFactor = () => {
    // late update of value that's why its N instead of Y
    if (patientStore.details.forTransportVehicularAccident.risk_none !== 'Y') {
        openContributingFactorDialog.value = true;
    }
};
// const autoOpenSafety = () => {
//     // late update of value that's why its N instead of Y
//     if (patientStore.details.forTransportVehicularAccident.safe_none !== 'Y') {
//         openSafetyDialog.value = true;
//     }
// };
const burnDegrees = [
    {
        degree_burn: '1',
        degree_burn_desc: '1st Degree',
        model: patientStore.details.preAdmissionData.degree_burn1,
        truevalue: 'Y',
        falsevalue: 'N'
    },
    {
        degree_burn: '2',
        degree_burn_desc: '2nd Degree',
        model: patientStore.details.preAdmissionData.degree_burn2,
        truevalue: 'Y',
        falsevalue: 'N'
    },
    {
        degree_burn: '3',
        degree_burn_desc: '3rd Degree',
        model: patientStore.details.preAdmissionData.degree_burn3,
        truevalue: 'Y',
        falsevalue: 'N'
    },
    {
        degree_burn: '4',
        degree_burn_desc: '4th Degree',
        model: patientStore.details.preAdmissionData.degree_burn4,
        truevalue: 'Y',
        falsevalue: 'N'
    }
];
const burnDegree = computed({
    get() {
        return getBurnDegree();
    },
    set(value) {
        if (value == '1') {
            patientStore.details.natureOfInjury.degree_burn1 = burnDegrees[0].truevalue;
            patientStore.details.natureOfInjury.degree_burn2 = '';
            patientStore.details.natureOfInjury.degree_burn3 = '';
            patientStore.details.natureOfInjury.degree_burn4 = '';
        } else if (value == '2') {
            patientStore.details.natureOfInjury.degree_burn1 = '';
            patientStore.details.natureOfInjury.degree_burn2 = burnDegrees[1].truevalue;
            patientStore.details.natureOfInjury.degree_burn3 = '';
            patientStore.details.natureOfInjury.degree_burn4 = '';
        } else if (value == '3') {
            patientStore.details.natureOfInjury.degree_burn1 = '';
            patientStore.details.natureOfInjury.degree_burn2 = '';
            patientStore.details.natureOfInjury.degree_burn3 = burnDegrees[2].truevalue;
            patientStore.details.natureOfInjury.degree_burn4 = '';
        } else if (value == '4') {
            patientStore.details.natureOfInjury.degree_burn1 = '';
            patientStore.details.natureOfInjury.degree_burn2 = '';
            patientStore.details.natureOfInjury.degree_burn3 = '';
            patientStore.details.natureOfInjury.degree_burn4 = burnDegrees[3].truevalue;
        }
        return getBurnDegree();
    }
});
const getBurnDegree = () => {
    if (patientStore.details.natureOfInjury.degree_burn1 == 'Y') {
        return '1';
    }
    if (patientStore.details.natureOfInjury.degree_burn2 == 'Y') {
        return '2';
    }
    if (patientStore.details.natureOfInjury.degree_burn3 == 'Y') {
        return '3';
    }
    if (patientStore.details.natureOfInjury.degree_burn4 == 'Y') {
        return '4';
    }
};
const burnDegreeValue = ref(burnDegree.value);
const multInj = computed(() => {
    const values = [
        patientStore.details.natureOfInjury.noi_abrasion,
        patientStore.details.natureOfInjury.noi_burn_r,
        patientStore.details.natureOfInjury.noi_avulsion,
        patientStore.details.natureOfInjury.noi_concussion,
        patientStore.details.natureOfInjury.noi_contusion,
        patientStore.details.natureOfInjury.noi_frac_ope,
        patientStore.details.natureOfInjury.noi_frac_clo,
        patientStore.details.natureOfInjury.noi_owound,
        patientStore.details.natureOfInjury.noi_amp,
        patientStore.details.natureOfInjury.noi_others
    ];
    return values.filter((value) => value == 'Y').length > 1 ? 'Y' : 'N';
});
const patientDataIsLoaded = async () => {
    requiredFieldsCount();
    patientStore.details.hospitalFacilityData.diagnosis = patientStore.header.dx;
    burnDegreeValue.value = getBurnDegree();
    loading.value = false;
    onResize();
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
    () => burnDegreeValue.value,
    (value) => {
        burnDegree.value = value;
    }
);
watch(multInj, (value) => {
    patientStore.details.preAdmissionData.mult_inj = value;
});
watch(
    () => patientStore.header.doctor_diagnosis,
    () => {
        diagnosisLocation.value = 'doctor_diagnosis';
    }
);
watch(
    () => patientStore.submitForm,
    async (value) => {
        if (value) {
            await validate();
        }
    }
);
// watch(
//     () => patientStore.details.ExternalCauseOfInjury.vawc,
//     () => {
//         if (patientStore.details.ExternalCauseOfInjury.vawc === 'Y') vawcDialog.value = true;
//     }
// );
watch(
    () => openContributingFactorDialog.value,
    async (newValue) => {
        if (!newValue && patientStore.details.forTransportVehicularAccident.risk_etc_spec === '' && patientStore.details.forTransportVehicularAccident.risk_other === 'Y') {
            await Swal.fire({
                icon: 'warning',
                title: 'INVALID INPUT',
                text: 'Value is required for "Others',
                confirmButtonText: 'OK'
            });
            openContributingFactorDialog.value = true;
        }
    }
);
watch(
    () => openSafetyDialog.value,
    async (newValue) => {
        if (!newValue && patientStore.details.forTransportVehicularAccident.safe_other_sp === '' && patientStore.details.forTransportVehicularAccident.safe_other === 'Y') {
            await Swal.fire({
                icon: 'warning',
                title: 'INVALID INPUT',
                text: 'Value is required for "Others',
                confirmButtonText: 'OK'
            });
            openSafetyDialog.value = true;
        }
    }
);
const noPhysical = ref(true);

watch(
    () =>
        ![
            patientStore.details.natureOfInjury.noi_no_physical,
            patientStore.details.natureOfInjury.noi_abrasion,
            patientStore.details.natureOfInjury.noi_burn_r,
            patientStore.details.natureOfInjury.noi_avulsion,
            patientStore.details.natureOfInjury.noi_owound,
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
            patientStore.details.natureOfInjury.noi_others,
            patientStore.details.natureOfInjury.noi_incision
        ].includes('Y'),
    (newValue) => {
        noPhysical.value = newValue;
    }
);
watch(
    () =>
        ![
            patientStore.details.natureOfInjury.noi_abrasion,
            patientStore.details.natureOfInjury.noi_burn_r,
            patientStore.details.natureOfInjury.noi_avulsion,
            patientStore.details.natureOfInjury.noi_owound,
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
            patientStore.details.natureOfInjury.noi_others,
            patientStore.details.natureOfInjury.noi_incision
        ].includes('Y'),
    () => {
        patientStore.details.natureOfInjury.noi_no_physical = 'N';
    }
);
watch(
    () => [patientStore.details.forTransportVehicularAccident, patientStore.details.natureOfInjury, patientStore.details.preAdmissionData],
    () => {
        if (patientStore.details.forTransportVehicularAccident.safe_none !== 'Y') {
            patientStore.details.forTransportVehicularAccident.safe_none = '';
        }
        if (patientStore.details.forTransportVehicularAccident.risk_none !== 'Y') {
            patientStore.details.forTransportVehicularAccident.risk_none = '';
        }
        requiredFieldsCount();
        ``;
    },
    { deep: true }
);
watch(
    () => [patientStore.details.hospitalFacilityData.gcs_eye, patientStore.details.hospitalFacilityData.gcs_motor, patientStore.details.hospitalFacilityData.gcs_verbal],
    () => {
        const gcsCode = patientStore.details.hospitalFacilityData.gcs_eye + patientStore.details.hospitalFacilityData.gcs_verbal + patientStore.details.hospitalFacilityData.gcs_motor;
        gcsCodeScore.value = Number(patientStore.details.hospitalFacilityData.gcs_eye) + Number(patientStore.details.hospitalFacilityData.gcs_verbal) + Number(patientStore.details.hospitalFacilityData.gcs_motor);
        patientStore.details.hospitalFacilityData.gcs_score = gcsCodeScore;
        patientStore.details.hospitalFacilityData.gcs_beh_code = gcsCode;
        const gcsLabels = [
            `\nEye Opening Response: ${libraryService.getGCS().find((option) => option.behavior === '1' && option.score === patientStore.details.hospitalFacilityData.gcs_eye)?.formattedLabel}`,
            `\nBest Verbal Response:  ${libraryService.getGCS().find((option) => option.behavior === '2' && option.score === patientStore.details.hospitalFacilityData.gcs_verbal)?.formattedLabel}`,
            `\nBest Motor Response: ${libraryService.getGCS().find((option) => option.behavior === '3' && option.score === patientStore.details.hospitalFacilityData.gcs_motor)?.formattedLabel}`
        ];
        patientStore.details.hospitalFacilityData.gcs_beh_sp = gcsLabels.join('');
    }
);
watch(
    () => patientStore.details.ExternalCauseOfInjury.ext_transport,
    (newValue) => {
        if (newValue === 'Y') {
            isCrashIncident.value = true;
            requiredFieldsCount();
        } else {
            isCrashIncident.value = false;
            requiredFieldsCount();
        }
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
</script>
<template>
    <div class="card shadow-4 overflow-auto h-full opacity-90" style="width: 100%">
        <div class="grid grid-cols-2 gap-5">
            <div :style="{ width: width < 1500 ? '100%' : '29%' }">
                <div style="width: 100%">
                    <div class="preadmissionData">
                        <div class="flex flex-column">
                            <div class="flex justify-content-between">
                                <!-- {{ patientStore.details.multipleFields }} -->
                                <label style="color: #000080" for="preAdmissionData.place_occ_code" class="text-s"><i>Place of Occurence</i></label>
                                <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.place_occ_code === ''">
                                    <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                </div>
                            </div>
                            <Dropdown
                                id="preAdmissionData.place_occ_code"
                                v-model="patientStore.details.preAdmissionData.place_occ_code"
                                :options="places"
                                optionLabel="place_occ_desc"
                                optionValue="place_occ_code"
                                :class="{
                                    'p-inputtext-filled font-bold mb-1  mt-1 myCSS-inputtext-required': true,
                                    'bg-green-100': patientStore.details.preAdmissionData.place_occ_code === ''
                                }"
                            />
                            <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.place_occ_code === '88' && patientStore.details.preAdmissionData.poc_etc_spec === ''">
                                <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                            </div>
                            <Textarea
                                v-if="patientStore.details.preAdmissionData.place_occ_code == '88' || patientStore.details.preAdmissionData.place_occ_code == '70'"
                                id="preAdmissionData.poc_etc_spec"
                                type="text"
                                v-model="patientStore.details.preAdmissionData.poc_etc_spec"
                                placeholder="Specify"
                                :class="{
                                    'p-inputtext-filled font-bold mb-1  text-s myCSS-inputtext-required': true,
                                    'bg-green-100': patientStore.details.preAdmissionData.poc_etc_spec === ''
                                }"
                                style="text-transform: uppercase"
                                autoResize
                            />
                        </div>

                        <div class="flex flex-column">
                            <div class="flex justify-content-between">
                                <label style="color: #000080" for="preAdmissionData.activity_code" class="text-s"><i>Activity of the Patient at the time of the incident</i></label>
                                <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.activity_code === ''">
                                    <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                </div>
                            </div>

                            <Dropdown
                                id="preAdmissionData.activity_code"
                                v-model="patientStore.details.preAdmissionData.activity_code"
                                :options="activities"
                                optionLabel="activity_desc"
                                optionValue="activity_code"
                                :class="{
                                    'p-inputtext-filled font-bold mb-1  mt-1 myCSS-inputtext-required': true,
                                    'bg-green-100': patientStore.details.preAdmissionData.activity_code === ''
                                }"
                            />
                            <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.activity_code === '88' && patientStore.details.preAdmissionData.act_etc_spec === ''">
                                <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                            </div>
                            <Textarea
                                v-if="patientStore.details.preAdmissionData.activity_code == '88'"
                                id="preAdmissionData.act_etc_spec"
                                type="text"
                                v-model="patientStore.details.preAdmissionData.act_etc_spec"
                                placeholder="Specify"
                                :class="{
                                    'p-inputtext-filled font-bold mb-1  text-s myCSS-inputtext-required': true,
                                    'bg-green-100': patientStore.details.preAdmissionData.act_etc_spec === ''
                                }"
                                style="text-transform: uppercase"
                            />
                        </div>

                        <div class="flex flex-column">
                            <div class="flex justify-content-between">
                                <label style="color: #000080" for="generalData.inj_intent_code" class="text-s"><i>First Aid Given?</i></label>
                                <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.first_aid_code === ''">
                                    <small :class="'required-error'" class="flex text-red-800 text-s font-bold">Value is required</small>
                                </div>
                            </div>
                            <Dropdown
                                id="generalData.inj_intent_code"
                                v-model="patientStore.details.preAdmissionData.first_aid_code"
                                :options="firstAidGivens"
                                optionLabel="first_aid_desc"
                                optionValue="first_aid_code"
                                :class="{
                                    'p-inputtext-filled font-bold mb-2  myCSS-inputtext-required': true,
                                    'bg-green-100': patientStore.details.preAdmissionData.first_aid_code === ''
                                }"
                            />

                            <div class="ml-4 flex flex-column" v-if="patientStore.details.preAdmissionData.first_aid_code == 'Y'">
                                <div class="flex flex-column">
                                    <div class="flex justify-content-between">
                                        <label style="color: #000080" for="generalData.firstaid_others" class="text-s"><i>First Aid</i></label>
                                        <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.firstaid_others === ''">
                                            <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                        </div>
                                    </div>
                                    <Textarea
                                        style="text-transform: uppercase"
                                        id="generalData.firstaid_others"
                                        type="text"
                                        v-model="patientStore.details.preAdmissionData.firstaid_others"
                                        placeholder=""
                                        :class="{
                                            'flex p-inputtext-filled font-bold mb-2  text-s myCSS-inputtext-required': true,
                                            'bg-green-100': patientStore.details.preAdmissionData.firstaid_others === ''
                                        }"
                                    />
                                </div>
                                <div class="flex justify-content-between">
                                    <label style="color: #000080" for="generalData.firstaid_others2" class="text-s"><i>By Whom</i></label>
                                    <div class="flex justify-content-end" v-if="patientStore.details.preAdmissionData.firstaid_others2 === ''">
                                        <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                    </div>
                                </div>
                                <InputText
                                    style="text-transform: uppercase"
                                    id="generalData.firstaid_others2"
                                    type="text"
                                    v-model="patientStore.details.preAdmissionData.firstaid_others2"
                                    placeholder=""
                                    :class="{
                                        'p-inputtext-filled font-bold mb-2  text-s': true,
                                        'bg-green-100': patientStore.details.preAdmissionData.firstaid_others2 === ''
                                    }"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div :style="{ width: width < 1500 ? '100%' : '66%' }" class="mt-1">
                <div :class="['grid grid-cols-3 card flex justify-content-center relative', { 'custom-shadow': noPhysical }]">
                    <div :style="{ width: width < 950 ? '100%' : width < 1100 ? '49%' : '32%' }">
                        <div>
                            <InputTextCheckBoxDoctor2
                                v-model:modelValue="patientStore.details.natureOfInjury.noi_abrasion"
                                v-model:desc="patientStore.details.natureOfInjury.noi_abradtl"
                                v-model:isMultiple="patientStore.details.multipleFields.multiple_abrasion"
                                label="Abrasion"
                                :binary="true"
                                :required="getRequiredValidation('noi_abradtl')"
                            />
                        </div>
                        <Transition name="slide-fade" mode="out-in">
                            <div class="burns" v-if="patientStore.details.natureOfInjury.noi_burn_r !== 'Y'">
                                <div class="flex align-content-center align-items-center mt-1">
                                    <InputSwitch v-model="patientStore.details.natureOfInjury.noi_burn_r" trueValue="Y" falseValue="N" id="inputswitch" />
                                    <label for="inputswitch" class="mx-2 font-bold">Burn</label>
                                </div>
                                <div v-if="patientStore.details.natureOfInjury.noi_burn_r == 'Y'" class="mt-1 ml-4">
                                    <div class="flex column">
                                        <div class="flex justify-content-between w-25rem">
                                            <label style="color: #000080" for="natureOfInjury.burnDegrees" class="text-s mt-1">Burn Degree</label>
                                            <div class="flex justify-content-end" v-if="!burnDegreeValue">
                                                <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                            </div>
                                        </div>
                                    </div>
                                    <Dropdown
                                        id="natureOfInjury.burnDegrees"
                                        v-model="burnDegreeValue"
                                        placeholder="Select Burn Type"
                                        :options="burnDegrees"
                                        optionLabel="degree_burn_desc"
                                        optionValue="degree_burn"
                                        :class="{
                                            'p-inputtext-filled font-bold max-w-full w-25rem myCSS-inputtext-required text-s': true,
                                            'bg-white-100': !burnDegreeValue
                                        }"
                                    />
                                    <div v-if="burnDegreeValue">
                                        <label style="color: #000080" for="natureOfInjury.noi_burndtl" class="text-s mt-1">Specify</label>
                                        <TextAreaPreAdmissionDoctor v-model:desc="patientStore.details.natureOfInjury.noi_burndtl" v-model:isMultiple="patientStore.details.multipleFields.multiple_burn" />
                                        <div class="flex justify-content-center w-24rem">
                                            <div class="flex justify-content-end" v-if="patientStore.details.natureOfInjury.noi_burndtl === ''">
                                                <small :class="'required-error'" class="text-red-800 text-s font-bold mt-1">Value is required</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_avulsion"
                            v-model:desc="patientStore.details.natureOfInjury.noi_avuldtl"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_avulsion"
                            label="Avulsion"
                            :binary="true"
                            :required="getRequiredValidation('noi_avuldtl')"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_owound"
                            v-model:desc="patientStore.details.natureOfInjury.noi_owoudtl"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_laceration"
                            label="Laceration"
                            :binary="true"
                            :required="getRequiredValidation('noi_owoudtl')"
                        />

                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_incision"
                            v-model:desc="patientStore.details.natureOfInjury.noi_incision_sp"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_incision"
                            label="Incision"
                            :binary="true"
                            :required="getRequiredValidation('noi_incision_sp')"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_amp"
                            v-model:desc="patientStore.details.natureOfInjury.noi_ampdtl"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_traumatic_amputation"
                            label="Traumatic Amputation"
                            :binary="true"
                            :required="getRequiredValidation('noi_ampdtl')"
                        />
                    </div>
                    <div :style="{ width: width < 950 ? '100%' : width < 1100 ? '49%' : '32%' }">
                        <Transition name="slide-fade" mode="out-in">
                            <div class="brain" v-if="patientStore.details.natureOfInjury.noi_brain !== 'Y'">
                                <div class="flex align-content-center align-items-center mt-1">
                                    <InputSwitch v-model="patientStore.details.natureOfInjury.noi_brain" trueValue="Y" falseValue="N" id="inputswitch" />
                                    <label for="inputswitch" class="mx-2 font-bold">Traumatic Brain Injury</label>
                                </div>
                                <div v-if="patientStore.details.natureOfInjury.noi_brain == 'Y'" class="mt-1 ml-4">
                                    <div class="flex column">
                                        <div class="flex justify-content-between w-25rem">
                                            <label style="color: #000080" for="natureOfInjury.noi_brain_stg" class="text-s mt-1"><i>Severity Level</i></label>
                                            <div class="flex justify-content-end" v-if="patientStore.details.natureOfInjury.noi_brain_stg === ''">
                                                <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                            </div>
                                        </div>
                                    </div>
                                    <Dropdown
                                        id="natureOfInjury.noi_brain_stg"
                                        v-model="patientStore.details.natureOfInjury.noi_brain_stg"
                                        placeholder="Select Severity"
                                        :options="libraryService.getBrainInjury()"
                                        optionLabel="level_desc"
                                        optionValue="level_code"
                                        :class="{
                                            'p-inputtext-filled font-bold max-w-full w-25rem myCSS-inputtext-required text-s': true,
                                            'bg-white-100': !patientStore.details.natureOfInjury.noi_brain_stg
                                        }"
                                    />
                                    <div v-if="patientStore.details.natureOfInjury.noi_brain_stg">
                                        <label style="color: #000080" for="natureOfInjury.noi_braindtl" class="text-s mt-1">Specify</label>
                                        <TextAreaPreAdmissionDoctor v-model:desc="patientStore.details.natureOfInjury.noi_braindtl" v-model:isMultiple="patientStore.details.multipleFields.multiple_traumatic_brain" />
                                        <div class="flex justify-content-center w-25rem">
                                            <div class="flex justify-content-end" v-if="patientStore.details.natureOfInjury.noi_braindtl === ''">
                                                <small :class="'required-error'" class="text-red-800 text-s font-bold mt-1">Value is required</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_gunshot"
                            v-model:desc="patientStore.details.natureOfInjury.noi_gunshotdtl"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_gunshot"
                            label="Gunshot Wound"
                            :binary="true"
                            :required="getRequiredValidation('noi_concussiondtl')"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_stab_wound"
                            v-model:desc="patientStore.details.natureOfInjury.noi_stab_wounddtl"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_stab"
                            label="Stab Wound"
                            :binary="true"
                            :required="getRequiredValidation('noi_concussiondtl')"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_concussion"
                            v-model:desc="patientStore.details.natureOfInjury.noi_concussiondtl"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_concussion"
                            label="Concussion"
                            :binary="true"
                            :required="getRequiredValidation('noi_concussiondtl')"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_contusion"
                            v-model:desc="patientStore.details.natureOfInjury.noi_contudtl"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_contusion"
                            label="Contusion"
                            :binary="true"
                            :required="getRequiredValidation('noi_contudtl')"
                        />
                    </div>
                    <div :style="{ width: width < 950 ? '100%' : width < 1100 ? '49%' : '32%' }">
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_ope"
                            v-model:desc="patientStore.details.natureOfInjury.noi_fropdtl"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_open"
                            label="Fracture (Closed)"
                            :binary="true"
                            :required="getRequiredValidation('noi_fropdtl')"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_clo"
                            v-model:desc="patientStore.details.natureOfInjury.noi_frcldtl"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_closed"
                            label="Fracture (Open)"
                            :binary="true"
                            :required="getRequiredValidation('noi_frcldtl')"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_disl_open"
                            v-model:desc="patientStore.details.natureOfInjury.noi_disl_open_sp"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_dislocation_open"
                            label="Dislocation (Open)"
                            :binary="true"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_disl_close"
                            v-model:desc="patientStore.details.natureOfInjury.noi_disl_close_sp"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_dislocation_closed"
                            label="Dislocation (Close)"
                            :binary="true"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_punc"
                            v-model:desc="patientStore.details.natureOfInjury.noi_punc_sp"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_puncture"
                            label="Puncture"
                            :binary="true"
                        />
                        <InputTextCheckBoxDoctor2
                            v-model:modelValue="patientStore.details.natureOfInjury.noi_others"
                            v-model:desc="patientStore.details.natureOfInjury.noi_otherinj"
                            v-model:isMultiple="patientStore.details.multipleFields.multiple_other"
                            label="Others"
                            :binary="true"
                            :required="getRequiredValidation('noi_otherinj')"
                        />
                    </div>

                    <div class="line"></div>
                    <div :class="noPhysical ? 'grid grid-cols-3 gap-2 mb-3 flex justify-content-evenly' : 'grid grid-cols-3 gap-2 flex justify-content-evenly'" style="width: 100%">
                        <Transition name="slide-fade" mode="out-in">
                            <div v-if="patientStore.details.ExternalCauseOfInjury.vawc !== 'Y'" class="flex">
                                <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.vawc" trueValue="Y" falseValue="N" @click="focusElement('VAWCDropdown')" id="inputswitch" />
                                <label for="inputswitch" class="mx-2 align-self-center font-bold"> VAWC </label>
                            </div>
                        </Transition>
                        <!-- <Transition name="slide-fade" mode="out-in">
                            <div v-if="patientStore.details.generalData.perpetrator !== 'Y'" class="flex">
                                <InputSwitch v-model="patientStore.details.generalData.perpetrator" trueValue="Y" falseValue="N" @click="focusElement('VAWCDropdown')" id="inputswitch" />
                                <label for="inputswitch" class="mx-2 align-self-center font-bold"> Perpetrator </label>
                            </div>
                        </Transition> -->
                        <Transition name="slide-fade" mode="out-in">
                            <div v-if="patientStore.details.forTransportVehicularAccident.risk_none !== 'Y'">
                                <div class="flex">
                                    <InputSwitch v-model="patientStore.details.forTransportVehicularAccident.risk_none" trueValue="Y" falseValue="N" id="inputswitch" @click="autoOpenFactor" />
                                    <label for="inputswitch" class="mx-2 align-self-center font-bold" style="position: relative">
                                        Contributing Factor
                                        <i v-if="isCrashIncident" v-badge.danger="'required'" style="font-size: 2rem; position: absolute; top: -10px; right: 0px" v-tooltip.bottom="`Required when Road Crash Incident`" />
                                        <i class="pi pi-info-circle text-blue-500" style="font-size: 1rem; cursor: pointer" v-tooltip.bottom="'Reasons that may have led to the incident'"></i>
                                    </label>
                                </div>
                                <div class="flex justify-content-start mt-2" v-if="patientStore.details.forTransportVehicularAccident.risk_none === 'Y'">
                                    <div
                                        class="flex justify-content-end"
                                        v-if="
                                            (patientStore.details.forTransportVehicularAccident.risk_alcliq === '' || patientStore.details.forTransportVehicularAccident.risk_alcliq !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.risk_sleep === '' || patientStore.details.forTransportVehicularAccident.risk_sleep !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.risk_smoke === '' || patientStore.details.forTransportVehicularAccident.risk_smoke !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.risk_mobpho === '' || patientStore.details.forTransportVehicularAccident.risk_mobpho !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.risk_other === '' || patientStore.details.forTransportVehicularAccident.risk_other !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.risk_not_applicable === '' || patientStore.details.forTransportVehicularAccident.risk_not_applicable !== 'Y')
                                        "
                                    >
                                        <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                    </div>
                                </div>
                                <div v-if="patientStore.details.forTransportVehicularAccident.risk_none === 'Y'" class="flex flex-column mt-5">
                                    <div
                                        class="grid grid-cols-2 gap-1 flex justify-content-center"
                                        style="width: 28rem"
                                        :class="{
                                            'bg-white-100':
                                                patientStore.details.forTransportVehicularAccident.risk_alcliq !== 'Y' &&
                                                patientStore.details.forTransportVehicularAccident.risk_sleep !== 'Y' &&
                                                patientStore.details.forTransportVehicularAccident.risk_smoke !== 'Y' &&
                                                patientStore.details.forTransportVehicularAccident.risk_mobpho !== 'Y' &&
                                                patientStore.details.forTransportVehicularAccident.risk_othe !== 'Y'
                                        }"
                                    >
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch id="alcohol" trueValue="Y" falseValue="N" v-model="patientStore.details.forTransportVehicularAccident.risk_alcliq" class="small-switch" />
                                            <label for="alcohol" class="ml-2 text-s">ALCOHOL/LIQUOR</label>
                                        </div>
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch id="sleepy" v-model="patientStore.details.forTransportVehicularAccident.risk_sleep" class="small-switch" trueValue="Y" falseValue="N" />
                                            <label for="sleepy" class="ml-2 text-s">SLEEPY</label>
                                        </div>
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch id="smoking" v-model="patientStore.details.forTransportVehicularAccident.risk_smoke" class="small-switch" trueValue="Y" falseValue="N" />
                                            <label for="smoking" class="ml-2 text-s">SMOKING</label>
                                        </div>

                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch id="using_mobile" v-model="patientStore.details.forTransportVehicularAccident.risk_mobpho" class="small-switch" trueValue="Y" falseValue="N" />
                                            <label for="using_mobile" class="ml-2 text-s">USING MOBLIE</label>
                                        </div>
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch id="others" v-model="patientStore.details.forTransportVehicularAccident.risk_other" class="small-switch" trueValue="Y" falseValue="N" />
                                            <label for="others" class="ml-2 text-s">OTHERS</label>
                                        </div>
                                    </div>
                                    <div class="flex column" v-if="patientStore.details.forTransportVehicularAccident.risk_other === 'Y'">
                                        <div class="flex justify-content-start" v-if="patientStore.details.forTransportVehicularAccident.risk_etc_spec === ''">
                                            <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                        </div>
                                        <Textarea
                                            v-model="patientStore.details.forTransportVehicularAccident.risk_etc_spec"
                                            id="natureOfInjury.noi_burndtl"
                                            :class="{
                                                'p-inputtext-filled max-w-full mt-1 w-25rem myCSS-inputtext-required text-s font-bold': true,
                                                'bg-white-100': patientStore.details.forTransportVehicularAccident.risk_etc_spec === 'Y'
                                            }"
                                            autoresize
                                            style="text-transform: uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Transition>
                        <!-- <Transition name="slide-fade" mode="out-in">
                            <div v-if="patientStore.details.forTransportVehicularAccident.safe_none !== 'Y'">
                                <div class="flex">
                                    <InputSwitch v-model="patientStore.details.forTransportVehicularAccident.safe_none" trueValue="Y" falseValue="N" id="inputswitch" @click="autoOpenSafety" />
                                    <label for="inputswitch" class="mx-2 align-self-center font-bold" style="position: relative">
                                        Safety
                                        <i v-if="isCrashIncident" v-badge.danger="'required'" style="font-size: 2rem; position: absolute; top: -10px; right: 0px" v-tooltip.bottom="`Required when Road Crash Incident`" />
                                        <i class="pi pi-info-circle text-blue-500" style="font-size: 1rem; cursor: pointer" v-tooltip.bottom="'Safety equipment that was not used during the incident, depending on the vehicle type'"></i>
                                    </label>
                                </div>
                                <div class="flex justify-content-start mt-2" v-if="patientStore.details.forTransportVehicularAccident.safe_none === 'Y'">
                                    <div
                                        class="flex justify-content-end"
                                        v-if="
                                            (patientStore.details.forTransportVehicularAccident.safe_unkn === '' || patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.safe_airbag === '' || patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.safe_helmet === '' || patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.safe_cseat === '' || patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.safe_sbelt === '' || patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.safe_vest === '' || patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.safe_other === '' || patientStore.details.forTransportVehicularAccident.safe_other !== 'Y') &&
                                            (patientStore.details.forTransportVehicularAccident.safe_not_applicable === '' || patientStore.details.forTransportVehicularAccident.safe_not_applicable !== 'Y')
                                        "
                                    >
                                        <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                    </div>
                                </div>
                                <div v-if="patientStore.details.forTransportVehicularAccident.safe_none === 'Y'" class="flex flex-column mt-5">
                                    <div class="grid grid-cols-2 gap-1 flex justify-content-center">
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch trueValue="Y" falseValue="N" class="small-switch" v-model="patientStore.details.forTransportVehicularAccident.safe_unkn" />
                                            <label for="unknown" class="ml-2 text-s">UNKNOWN</label>
                                        </div>
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch trueValue="Y" falseValue="N" id="air" class="small-switch" v-model="patientStore.details.forTransportVehicularAccident.safe_airbag" />
                                            <label for="air" class="ml-2 text-s">AIR</label>
                                        </div>
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch trueValue="Y" falseValue="N" id="Helmet" class="small-switch" v-model="patientStore.details.forTransportVehicularAccident.safe_helmet" />
                                            <label for="helmet" class="ml-2 text-s">HELMET</label>
                                        </div>
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch trueValue="Y" falseValue="N" id="childseat" class="small-switch" v-model="patientStore.details.forTransportVehicularAccident.safe_cseat" />
                                            <label for="childseat" class="ml-2 text-s">CHILD SEAT</label>
                                        </div>
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch trueValue="Y" falseValue="N" id="seatbelt" class="small-switch" v-model="patientStore.details.forTransportVehicularAccident.safe_sbelt" />
                                            <label for="seatbelt" class="ml-2 text-s">SEAT BELT</label>
                                        </div>
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch trueValue="Y" falseValue="N" id="lifevest" class="small-switch" v-model="patientStore.details.forTransportVehicularAccident.safe_vest" />
                                            <label for="lifevest" class="ml-2 text-s">LIFE VEST </label>
                                        </div>
                                        <div class="flex" style="width: 13rem">
                                            <InputSwitch trueValue="Y" falseValue="N" id="others" class="small-switch" v-model="patientStore.details.forTransportVehicularAccident.safe_other" />
                                            <label for="others" class="ml-2 text-s">OTHERS</label>
                                        </div>
                                        <div class="flex column" v-if="patientStore.details.forTransportVehicularAccident.safe_other === 'Y'">
                                            <div class="flex justify-content-start" v-if="patientStore.details.forTransportVehicularAccident.safe_other_sp === ''">
                                                <small :class="'required-error'" class="text-red-800 text-s font-bold">Value is required</small>
                                            </div>
                                            <Textarea
                                                v-model="patientStore.details.forTransportVehicularAccident.safe_other_sp"
                                                id="natureOfInjury.noi_burndtl"
                                                :class="{
                                                    'p-inputtext-filled max-w-full mt-1 w-25rem myCSS-inputtext-required text-s font-bold': true,
                                                    'bg-white-100': patientStore.details.forTransportVehicularAccident.safe_other === 'Y'
                                                }"
                                                autoresize
                                                style="text-transform: uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition> -->
                    </div>
                    <div class="flex justify-content-center absolute top-0">
                        <InputSwitch v-model="patientStore.details.natureOfInjury.noi_no_physical" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="font-bold ml-2 mt-1"> NO EXTERNAL SIGN OF PHYSICAL INJURY </label>
                    </div>
                    <div v-if="noPhysical" class="bg-red-200 p-2 absolute bottom-0 text-center text-gray-700 font-semibold italic" style="border-radius: 0 0 1rem 1rem; width: 100%; font-size: 1rem; margin: 0 !important">Value is Required</div>
                </div>
            </div>
        </div>
        <div style="height: 100%">
            <div>
                <InputTextCheckBoxDoctor
                    v-model:modelValue="patientStore.details.natureOfInjury.noi_abrasion"
                    v-model:desc="patientStore.details.natureOfInjury.noi_abradtl"
                    v-model:isMultiple="patientStore.details.multipleFields.multiple_abrasion"
                    hint="Site and Laterality"
                    label="Abrasion"
                    :binary="true"
                    :required="getRequiredValidation('noi_abradtl')"
                />
            </div>

            <Transition name="slide-fade" mode="out-in">
                <div class="burns rainbow-border bg-white-100" v-if="patientStore.details.natureOfInjury.noi_burn_r === 'Y'" style="border: 2px dashed #808080">
                    <div v-if="!burnDegreeValue" class="flex justify-content-end mb-2" style="width: 10rem">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div class="flex jsutify-content-between">
                        <InputSwitch v-model="patientStore.details.natureOfInjury.noi_burn_r" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 font-bold">Burn</label>
                    </div>
                    <div v-if="patientStore.details.natureOfInjury.noi_burn_r == 'Y'" class="mt-1 ml-4">
                        <div class="flex column">
                            <div class="flex justify-content-between" style="width: 100%">
                                <label style="color: #000080" for="natureOfInjury.burnDegrees" class="text-s mt-1"><i>Burn Degree</i></label>
                            </div>
                        </div>
                        <Dropdown
                            id="natureOfInjury.burnDegrees"
                            :class="{ 'text-black': isDisabled, 'bg-green-100': !burnDegreeValue }"
                            v-model="burnDegreeValue"
                            placeholder="Select Burn Type"
                            :options="burnDegrees"
                            optionLabel="degree_burn_desc"
                            optionValue="degree_burn"
                            style="width: 100%"
                        />
                        <div v-if="burnDegreeValue">
                            <div>
                                <div class="flex justify-content-start mt-2" style="width: 100%">
                                    <div class="flex justify-content-start" v-if="patientStore.details.natureOfInjury.noi_burndtl === ''"><i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 8rem" /></div>
                                </div>
                                <label style="color: #000080" for="natureOfInjury.noi_burndtl" class="text-s mt-1"><i>Specify</i></label>
                            </div>
                            <Transition name="slide-fade" mode="out-in">
                                <TextAreaPreAdmissionDoctor v-model:desc="patientStore.details.natureOfInjury.noi_burndtl" v-model:isMultiple="patientStore.details.multipleFields.multiple_burn" style="width: 100%" />
                            </Transition>
                        </div>
                    </div>
                </div>
            </Transition>
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_avulsion"
                v-model:desc="patientStore.details.natureOfInjury.noi_avuldtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_avulsion"
                hint="Site and Laterality"
                label="Avulsion"
                :binary="true"
                :required="getRequiredValidation('noi_avuldtl')"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_owound"
                v-model:desc="patientStore.details.natureOfInjury.noi_owoudtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_laceration"
                hint="Site and Laterality"
                label="Laceration"
                :binary="true"
                :required="getRequiredValidation('noi_owoudtl')"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_incision"
                v-model:desc="patientStore.details.natureOfInjury.noi_incision_sp"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_incision"
                hint="Site and Laterality"
                label="Incision"
                :binary="true"
                :required="getRequiredValidation('noi_incision_sp')"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_amp"
                v-model:desc="patientStore.details.natureOfInjury.noi_ampdtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_traumatic_amputation"
                hint="Site and Laterality"
                label="Traumatic Amputation"
                :binary="true"
                :required="getRequiredValidation('noi_ampdtl')"
            />
            <Transition name="slide-fade" mode="out-in">
                <div class="brain bg-white-100 rainbow-border" v-if="patientStore.details.natureOfInjury.noi_brain === 'Y'" style="border: 2px dashed #808080">
                    <div class="flex align-content-center align-items-center mt-1">
                        <InputSwitch v-model="patientStore.details.natureOfInjury.noi_brain" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 font-bold">Traumatic Brain Injury</label>
                    </div>
                    <div v-if="patientStore.details.natureOfInjury.noi_brain == 'Y'" class="mt-1 ml-4">
                        <div class="flex column">
                            <div class="flex justify-content-between" style="width: 100%">
                                <label style="color: #000080" for="natureOfInjury.noi_brain_stg" class="text-s mt-1"><i>Severity Level</i></label>
                                <div class="flex mr-5" v-if="patientStore.details.natureOfInjury.noi_brain_stg === ''">
                                    <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 10rem" />
                                </div>
                            </div>
                        </div>
                        <Dropdown
                            id="natureOfInjury.noi_brain_stg"
                            v-model="patientStore.details.natureOfInjury.noi_brain_stg"
                            placeholder="Select Severity Level"
                            :options="libraryService.getBrainInjury()"
                            :class="{ 'text-black': isDisabled, 'bg-green-100': !patientStore.details.natureOfInjury.noi_brain_stg }"
                            optionLabel="level_desc"
                            style="width: 100%"
                            optionValue="level_code"
                        />
                        <div v-if="patientStore.details.natureOfInjury.noi_brain_stg">
                            <div>
                                <div class="flex justify-content-start mr-5" v-if="patientStore.details.natureOfInjury.noi_braindtl === ''"><i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 8rem" /></div>

                                <label style="color: #000080" for="natureOfInjury.noi_braindtl" class="text-s mt-1">Specify</label>
                            </div>

                            <Transition name="slide-fade" mode="out-in">
                                <TextAreaPreAdmissionDoctor v-model:desc="patientStore.details.natureOfInjury.noi_braindtl" v-model:isMultiple="patientStore.details.multipleFields.multiple_traumatic_brain" />
                            </Transition>
                        </div>
                    </div>
                    <h4 style="color: #000080" class="font-bold flex justify-content-center">GCS</h4>
                    <div>
                        <div>
                            <div class="flex flex-wrap justify-content-center">
                                <Dropdown
                                    id="patientStore.details.hospitalFacilityData.gcs_eye"
                                    class="m-1 mt-2"
                                    v-model="patientStore.details.hospitalFacilityData.gcs_eye"
                                    placeholder="Eye Opening Response"
                                    :options="libraryService.getGCS().filter((option) => option.behavior === '1')"
                                    optionLabel="formattedLabel"
                                    :style="{ width: width < 1500 ? '100%' : '30%' }"
                                    optionValue="score"
                                    :class="{
                                        'p-inputtext-filled font-bold  myCSS-inputtext-required text-s': true,
                                        'bg-white-100': !patientStore.details.hospitalFacilityData.gcs_eye
                                    }"
                                />
                                <Dropdown
                                    id="patientStore.details.hospitalFacilityData.gcs_verbal"
                                    class="m-1"
                                    v-model="patientStore.details.hospitalFacilityData.gcs_verbal"
                                    placeholder="Best Verbal Response"
                                    :options="libraryService.getGCS().filter((option) => option.behavior === '2')"
                                    optionLabel="formattedLabel"
                                    :style="{ width: width < 1500 ? '100%' : '30%' }"
                                    optionValue="score"
                                    :class="{
                                        'p-inputtext-filled font-bold  myCSS-inputtext-required text-s': true,
                                        'bg-white-100': !patientStore.details.hospitalFacilityData.gcs_verbal
                                    }"
                                />
                                <div :style="{ width: width < 1500 ? '100%' : '30%' }">
                                    <Dropdown
                                        id="patientStore.details.hospitalFacilityData.gcs_motor"
                                        class="m-1"
                                        v-model="patientStore.details.hospitalFacilityData.gcs_motor"
                                        placeholder="Best Motor Response"
                                        :options="libraryService.getGCS().filter((option) => option.behavior === '3')"
                                        optionLabel="formattedLabel"
                                        style="width: 100%"
                                        optionValue="score"
                                        :class="{
                                            'p-inputtext-filled font-bold  myCSS-inputtext-required text-s': true,
                                            'bg-white-100': !patientStore.details.hospitalFacilityData.gcs_motor
                                        }"
                                    />
                                    <div class="flex justify-content-center" v-if="patientStore.details.hospitalFacilityData.gcs_code === 'GLASGOW COMA SCALE' && !patientStore.details.hospitalFacilityData.gcs_score">
                                        <small class="text-red-800 text-s font-bold">Value is required</small>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Message class="flex justify-content-center" severity="success" v-if="gcsCodeScore > 12" :closable="false">{{ gcsCodeScore }}:Mild </Message>
                                <Message class="flex justify-content-center" v-if="gcsCodeScore > 8 && gcsCodeScore < 13" :closable="false">{{ gcsCodeScore }}: Moderate Client</Message>
                                <Message class="flex justify-content-center" severity="warn" v-if="gcsCodeScore < 9" :closable="false">{{ gcsCodeScore }}: Severe </Message>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_gunshot"
                v-model:desc="patientStore.details.natureOfInjury.noi_gunshotdtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_gunshot"
                hint="Site and Laterality"
                label="Gunshot Wound"
                :binary="true"
                :required="getRequiredValidation('noi_concussiondtl')"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_stab_wound"
                v-model:desc="patientStore.details.natureOfInjury.noi_stab_wounddtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_stab"
                hint="Site and Laterality"
                label="Stab Wound"
                :binary="true"
                :required="getRequiredValidation('noi_concussiondtl')"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_concussion"
                v-model:desc="patientStore.details.natureOfInjury.noi_concussiondtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_concussion"
                hint="Site and Laterality"
                label="Concussion"
                :binary="true"
                :required="getRequiredValidation('noi_concussiondtl')"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_contusion"
                v-model:desc="patientStore.details.natureOfInjury.noi_contudtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_contusion"
                hint="Site and Laterality"
                label="Contusion"
                :binary="true"
                :required="getRequiredValidation('noi_contudtl')"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_ope"
                v-model:desc="patientStore.details.natureOfInjury.noi_fropdtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_open"
                hint="Site and Laterality"
                label="Fracture (Closed)"
                :binary="true"
                :required="getRequiredValidation('noi_fropdtl')"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_frac_clo"
                v-model:desc="patientStore.details.natureOfInjury.noi_frcldtl"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_fracture_closed"
                hint="Site and Laterality"
                label="Fracture (Open)"
                :binary="true"
                :required="getRequiredValidation('noi_frcldtl')"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_disl_open"
                v-model:desc="patientStore.details.natureOfInjury.noi_disl_open_sp"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_dislocation_open"
                hint="Site and Laterality"
                label="Dislocation (Open)"
                :binary="true"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_disl_close"
                v-model:desc="patientStore.details.natureOfInjury.noi_disl_close_sp"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_dislocation_closed"
                hint="Site and Laterality"
                label="Dislocation (Close)"
                :binary="true"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_punc"
                v-model:desc="patientStore.details.natureOfInjury.noi_punc_sp"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_puncture"
                hint="Site and Laterality"
                label="Puncture"
                :binary="true"
            />
            <InputTextCheckBoxDoctor
                v-model:modelValue="patientStore.details.natureOfInjury.noi_others"
                v-model:desc="patientStore.details.natureOfInjury.noi_otherinj"
                v-model:isMultiple="patientStore.details.multipleFields.multiple_other"
                hint="Site and Laterality"
                label="Others"
                :binary="true"
                :required="getRequiredValidation('noi_otherinj')"
            />
            <Transition name="slide-fade" mode="out-in">
                <div style="border: 2px dashed #808080" class="mauling flex flex-column mt-3 rainbow-border bg-white-100" v-if="patientStore.details.ExternalCauseOfInjury.vawc === 'Y'">
                    <div class="flex justify-content-end"></div>
                    <div class="flex justify-content-betweeen">
                        <div class="mauling flex align-content-center">
                            <InputSwitch v-model="patientStore.details.ExternalCauseOfInjury.vawc" trueValue="Y" falseValue="N" @click="focusElement('VAWCDropdown')" id="inputswitch" />
                            <label for="inputswitch" class="mx-2 align-self-center font-bold"> VAWC </label>
                        </div>
                        <!-- <i class="badge-button">
                            <div class="details-container" @click="openVAWCDialog">
                                <strong>WCPU</strong>
                            </div>
                        </i> -->
                    </div>
                </div>
            </Transition>
            <!-- {{ patientStore.details.generalData.perpetrator_sp }} -->
            <!-- <Transition name="slide-fade" mode="out-in">
                <div class="perpetrator rainbow-border bg-white-100" v-if="patientStore.details.generalData.perpetrator === 'Y'" style="border: 2px dashed #808080">
                    <div v-if="!patientStore.details.generalData.perpetrator_sp" class="flex justify-content-end mb-2" style="width: 10rem">
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div class="flex jsutify-content-between">
                        <InputSwitch v-model="patientStore.details.generalData.perpetrator" trueValue="Y" falseValue="N" id="inputswitch" />
                        <label for="inputswitch" class="mx-2 font-bold">Perpetrator</label>
                    </div>
                    <div v-if="patientStore.details.generalData.perpetrator === 'Y'" class="mt-1 ml-4">
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
                            placeholder="Relationship to Victim"
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
                <div style="border: 2px dashed #808080" class="flex flex-column rainbow-border bg-white-100" v-if="patientStore.details.forTransportVehicularAccident.risk_none === 'Y'">
                    <div
                        v-if="
                            (patientStore.details.forTransportVehicularAccident.risk_alcliq === '' || patientStore.details.forTransportVehicularAccident.risk_alcliq !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.risk_sleep === '' || patientStore.details.forTransportVehicularAccident.risk_sleep !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.risk_smoke === '' || patientStore.details.forTransportVehicularAccident.risk_smoke !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.risk_mobpho === '' || patientStore.details.forTransportVehicularAccident.risk_mobpho !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.risk_other === '' || patientStore.details.forTransportVehicularAccident.risk_other !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.risk_not_applicable === '' || patientStore.details.forTransportVehicularAccident.risk_not_applicable !== 'Y')
                        "
                        class="flex justify-content-end"
                        style="width: 10rem"
                    >
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>
                    <div class="flex justify-content-between">
                        <div class="bite flex align-content-center mt-1">
                            <InputSwitch v-model="patientStore.details.forTransportVehicularAccident.risk_none" trueValue="Y" falseValue="N" id="inputswitch" />
                            <label for="inputswitch" class="mx-2 align-self-center font-bold"> Contributing Factor </label>
                        </div>
                        <i style="color: blue; font-style: italic">Reasons that may have led to the incident</i>
                    </div>
                    <div class="flex justify-content-center card">
                        <div class="grid grid-cols-4 gap-4">
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_alcliq" label="ALCOHOL/LIQUOR" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_smoke" label="SMOKING" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_sleep" label="SLEEPY" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_mobpho" label="USING MOBILE" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_not_applicable" label="NONE" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.risk_other" label="OTHER" />
                            <div style="width: 100%" v-if="patientStore.details.forTransportVehicularAccident.risk_other === 'Y'">
                                <Textarea v-model="patientStore.details.forTransportVehicularAccident.risk_etc_spec" placeholder="Please specify..." rows="1" resizable autoResize style="width: 100%" class="font-bold p-2 border rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>

            <!-- <Transition name="slide-fade" mode="out-in">
                <div style="border: 2px dashed #808080" class="flex flex-column rainbow-border bg-white-100" v-if="patientStore.details.forTransportVehicularAccident.safe_none === 'Y'">
                    <div
                        v-if="
                            (patientStore.details.forTransportVehicularAccident.safe_unkn === '' || patientStore.details.forTransportVehicularAccident.safe_unkn !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.safe_airbag === '' || patientStore.details.forTransportVehicularAccident.safe_airbag !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.safe_helmet === '' || patientStore.details.forTransportVehicularAccident.safe_helmet !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.safe_cseat === '' || patientStore.details.forTransportVehicularAccident.safe_cseat !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.safe_sbelt === '' || patientStore.details.forTransportVehicularAccident.safe_sbelt !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.safe_vest === '' || patientStore.details.forTransportVehicularAccident.safe_vest !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.safe_other === '' || patientStore.details.forTransportVehicularAccident.safe_other !== 'Y') &&
                            (patientStore.details.forTransportVehicularAccident.safe_not_applicable === '' || patientStore.details.forTransportVehicularAccident.safe_not_applicable !== 'Y')
                        "
                        class="flex justify-content-end"
                        style="width: 10rem"
                    >
                        <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 100%" />
                    </div>

                    <div class="flex justify-content-between">
                        <div class="bite flex align-content-center mt-1">
                            <InputSwitch v-model="patientStore.details.forTransportVehicularAccident.safe_none" trueValue="Y" falseValue="N" id="inputswitch" />
                            <label for="inputswitch" class="mx-2 align-self-center font-bold"> Safety Gear and Measures </label>
                        </div>
                        ><i style="color: blue; font-style: italic"> Safety equipment that was <strong>NOT</strong> used during the incident, depending on the vehicle type </i>
                    </div>
                    <div class="flex justify-content-center card">
                        <div class="grid grid-cols-4 gap-4">
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_unkn" label="UNKNOWN" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_helmet" label="HELMET" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_sbelt" label="SEAT BELT" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_airbag" label="AIRBAG" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_cseat" label="CHILD SEAT" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_vest" label="LIFE VEST" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_not_applicable" label="NONE" />
                            <CheckBoxMultiple v-model="patientStore.details.forTransportVehicularAccident.safe_other" label="OTHER" />
                            <div style="width: 100%" v-if="patientStore.details.forTransportVehicularAccident.safe_other === 'Y'">
                                <Textarea v-model="patientStore.details.forTransportVehicularAccident.safe_other_sp" placeholder="Please specify..." rows="1" resizable autoResize style="width: 100%" class="p-2 border rounded font-bold" />
                            </div>
                        </div>
                    </div>
                </div>
            </Transition> -->
        </div>
        <!-- <Dialog v-model:visible="vawcDialog" maximizable @hide="isInputNull()" header="Findings and Impressions" :style="{ width: '99%', height: '90%' }">
            <VawcForm />
        </Dialog> -->
    </div>
</template>

<style scoped>
.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.textarea-container {
    grid-column: span 2;
}

.textarea {
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: none;
}
.custom-shadow {
    box-shadow: 0 2px 7px rgba(255, 0, 0, 0.5);
    transition: box-shadow 0.3s ease;
}

.custom-shadow:hover {
    box-shadow: 0 6px 20px rgba(255, 0, 0, 0.75);
}

.rainbow-border {
    border: 3px solid transparent;
    border-radius: 3px;
    padding: 3px;
    background-color: #f9f9f9;
}

.bg-white-100 {
    background-color: #ffffff;
}

.small-switch {
    width: 50px;
    height: 20px;
}

.sticky {
    position: sticky;
    top: 0;
    border-bottom: 2px solid #475d74;
    background-color: white;
    z-index: 10;
}

.line {
    height: 1px;
    background-color: rgb(139, 134, 134);
    width: 100%;
    margin: 20px 0;
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
