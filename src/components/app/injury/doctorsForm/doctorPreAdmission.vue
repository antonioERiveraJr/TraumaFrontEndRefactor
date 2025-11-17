<script setup>
import { usePatientStore } from '../../../../store/injury/patientStore';
import createValidationRules from '../../../../validation/injuryValidations';
import useVuelidate from '@vuelidate/core';
import { ref, computed, watch, defineEmits, onUnmounted, onBeforeMount } from 'vue';
import LibraryService from '@/service/LibraryService';
import Swal from 'sweetalert2';
import TickedPreAdmissionSwitch from './formInterfaces/tickedSwitches/tickedPreAdmissionSwitch.vue';
import UntickedPreAdmissionSwitch from './formInterfaces/untickedSwitches/untickedPreAdmissionSwitch.vue';
const patientStore = usePatientStore();
const loading = ref(true);
const libraryService = new LibraryService();
const isCrashIncident = ref(false);
const gcsCodeScore = ref();
const dataIsLoaded = ref(false);
const v$ = useVuelidate(createValidationRules(), patientStore.details);
const diagnosisLocation = ref('dx');
const noPhysical = ref(true);
const validate = async () => {
    const natureOfInjury = await v$.value.natureOfInjury.$validate();
    return { natureOfInjury };
};
const emit = defineEmits(['update:requiredCountPreAdmission']);

// Counts the number of required fields that need to be displayed
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
    dataIsLoaded.value = true;
    const hasInjury = [
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
    ].includes('Y');

    // Update noPhysical.value based on the presence of injuries
    if (hasInjury) {
        noPhysical.value = false; // or some logic based on your needs
    } else {
        noPhysical.value = true; // or some logic based on your needs
    }
    // Check if any nature of injury is marked as 'Y'
};

// Lifecycle hook before the component is mounted
onBeforeMount(() => {
    // Check the initial state of patientStore.dataIsLoaded
    if (patientStore.dataIsLoaded) {
        patientDataIsLoaded(); // Handle already loaded data
        // console.log('Doctor pre data is loaded on mount using before mounted: ', patientStore.dataIsLoaded);
        dataIsLoaded.value = true;
    }
});
watch(
    () => patientStore.dataIsLoaded,
    (newValue) => {
        if (newValue === true) {
            patientDataIsLoaded();
            // console.log('docto pre data is loaded: ', patientStore.dataIsLoaded);
            dataIsLoaded.value = true;
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
                                <!-- {{ 'occs:' + patientStore.details.preAdmissionData.place_occ_code }}
                                {{ '\ninjs:' + patientStore.details.preAdmissionData.inj_intent_code }} -->
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

                        <div v-if="patientStore.progressionDay === ''" class="flex flex-column">
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
            <UntickedPreAdmissionSwitch v-if="dataIsLoaded === true" :width="width" :height="height" :noPhysical="noPhysical" />
        </div>
        <div style="height: 100%">
            <TickedPreAdmissionSwitch v-if="dataIsLoaded === true" :dataIsLoaded="dataIsLoaded" />
        </div>
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
