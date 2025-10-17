<script setup>
import { usePatientStore } from '@/store/injury/patientStore';
import { watch, ref, onUnmounted, onMounted } from 'vue';
import NewGeneralData from '../doctorsForm/doctorGeneralDataNOI.vue';
import NewPreAdmission from '../doctorsForm/doctorPreAdmission.vue';
// import NewExternalCauses from '../doctorsForm/doctorExternalCauses.vue';
// import SaveBackRemovePanelButtonDoctor from '../../../custom/SaveBackRemovePanelButtonDoctor.vue';
import InjuryService from '../../../../../src/service/InjuryService';
// import saveTSSOnlyButton from '../../../../../src/components/custom/saveTSSOnlyButton.vue';
import BiteForm from '../doctorsForm/subForm/biteForm.vue';
import SaveOPDTSSOnlyButton from '../../../custom/saveOPDTSSOnlyButton.vue';
import FollowUpForm from './followUpForm.vue';
import SaveOPDButton from '../../../custom/saveOPDButton.vue';

const props = defineProps({
    enccode: {
        type: String,
        required: true
    }
    // day: {
    //     type: String,
    //     required: true
    // }
});
const loader = ref(true);
const injuryService = new InjuryService();
const patientStore = usePatientStore();
const requiredCountPreAdmission = ref(0);
const requiredCountABTCForm = ref(0);
const requiredCountGeneralData = ref(0);
const collapsObjective = ref(true);
const collapsSubjective = ref(true);
const collapsDiagnosis = ref(true);
// const EntryOfDoctors = defineAsyncComponent(() => import('@/components/app/injury/doctorsForm/EntryOfDoctors.vue'));
const detailsValue = ref(patientStore.finalDiagnosis);
const latestEntryDoc = ref();
const saving = ref(false);
const customizedDetails = ref('');
const customizedObjective = ref([]);
const customizedDiagnosis = ref('');
const region = ref();
const province = ref();
const city = ref();
const latestEntry = ref();
const barangay = ref();
ref();
const gcsScoreDetail = () => {
    if (patientStore.details.hospitalFacilityData.gcs_score > 12) {
        return 'Mild';
    }
    if (patientStore.details.hospitalFacilityData.gcs_score > 8 && patientStore.details.hospitalFacilityData.gcs_score < 13) {
        return 'Moderate';
    }
    if (patientStore.details.hospitalFacilityData.gcs_score < 9) {
        return 'Severe';
    }
};
const updateCustomizedDetails = (value) => {
    customizedDetails.value = value;
};
const updateCustomizedObjective = (value) => {
    customizedObjective.value = value;
};
const updateCustomizedDiagnosis = (value) => {
    customizedDiagnosis.value = value;
};
const updateSaving = (value) => {
    saving.value = value;
};
const updateRequiredCountPreAdmission = (value) => {
    requiredCountPreAdmission.value = value;
};
// const updateRequiredCountABTCForm = (value) => {
//     requiredCountABTCForm.value = value;
// };
const updateRequiredCountGeneralData = (value) => {
    requiredCountGeneralData.value = value;
};
const loadLocations = async () => {
    region.value = patientStore?.storeRegions?.find((reg) => reg.regcode === patientStore.details.generalData.plc_regcode)?.regname || 'Unknown Region';
    province.value = patientStore?.storeProvinces?.find((prov) => prov.provcode === patientStore.details.generalData.plc_provcode)?.provname || 'Unknown Province';
    city.value = patientStore?.storeCities?.find((city) => city.ctycode === patientStore.details.generalData.plc_ctycode)?.ctyname || 'Unknown City';
    barangay.value = patientStore?.storeBrgy?.find((bgy) => bgy.bgycode === patientStore.details.generalData.plc_bgycode)?.bgyname || 'Unknown Barangay';
    patientStore.header.doctor_poi = region.value + ', ' + province.value + ', ' + city.value + ', ' + barangay.value;
};
const generateSafetyAndFactorText = () => {
    const safetyText = [];
    const factorText = [];
    if (patientStore.details.forTransportVehicularAccident.safe_none === 'Y') {
        if (patientStore.details.forTransportVehicularAccident.safe_unkn === 'Y') safetyText.push('UNKNOWN');
        if (patientStore.details.forTransportVehicularAccident.safe_airbag === 'Y') safetyText.push('AIRBAG');
        if (patientStore.details.forTransportVehicularAccident.safe_helmet === 'Y') safetyText.push('HELMET');
        if (patientStore.details.forTransportVehicularAccident.safe_cseat === 'Y') safetyText.push('CHILD SEAT');
        if (patientStore.details.forTransportVehicularAccident.safe_sbelt === 'Y') safetyText.push('SEAT BELT');
        if (patientStore.details.forTransportVehicularAccident.safe_vest === 'Y') safetyText.push('LIFE VEST');
        if (patientStore.details.forTransportVehicularAccident.safe_other === 'Y') safetyText.push(`${patientStore.details.forTransportVehicularAccident.safe_other_sp}`);
    }
    if (patientStore.details.forTransportVehicularAccident.risk_none === 'Y') {
        if (patientStore.details.forTransportVehicularAccident.risk_alcliq === 'Y') factorText.push('ALCOHOL/LIQUOR');
        if (patientStore.details.forTransportVehicularAccident.risk_sleep === 'Y') factorText.push('SLEEPY');
        if (patientStore.details.forTransportVehicularAccident.risk_smoke === 'Y') factorText.push('SMOKING');
        if (patientStore.details.forTransportVehicularAccident.risk_mobpho === 'Y') factorText.push('USING MOBILE');
        if (patientStore.details.forTransportVehicularAccident.risk_other === 'Y') factorText.push(`${patientStore.details.forTransportVehicularAccident.risk_etc_spec}`);
    }
    if (patientStore.details.forTransportVehicularAccident.safe_none === 'N' && patientStore.details.forTransportVehicularAccident.risk_none === 'N') {
        detailsValue.value = patientStore.header.doctor_details;
    }

    return {
        safetyText: safetyText.join(', '),
        factorText: factorText.join(', ')
    };
};
const updateRequiredFieldCountForBite = () => {
    requiredCountABTCForm.value = 0;

    // Check if the bite injury is marked as 'Y'
    if (patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y') {
        // Increment the count for each missing field
        if (patientStore.details.ExternalCauseOfInjury.ext_bite_sp === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.dogbiteDegree === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.bleeding === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.bitingAnimal === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.observation === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.first_aid_code === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.washingDone === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.previousARV === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.tetanusVaccination === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.allergies === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.adverseReaction === '') requiredCountABTCForm.value++;

        // Include the additional first aid code check
        if (patientStore.details.preAdmissionData.first_aid_code === '') requiredCountABTCForm.value++;

        // Check vaccinations
        if (patientStore.details.ExternalCauseOfInjury.hrig === 'Y' && patientStore.details.ExternalCauseOfInjury.hrig_num === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.erig === 'Y' && patientStore.details.ExternalCauseOfInjury.erig_num === '') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.ats === 'Y' && patientStore.details.ExternalCauseOfInjury.ats_num === '') requiredCountABTCForm.value++;

        // Check sites for vaccinations
        if (patientStore.details.ExternalCauseOfInjury.pvrv === 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_4 !== 'Y') requiredCountABTCForm.value++;
        if (patientStore.details.ExternalCauseOfInjury.pcec === 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_4 !== 'Y') requiredCountABTCForm.value++;
    }
};

const updateDetailsValue = () => {
    const { safetyText, factorText } = generateSafetyAndFactorText();

    detailsValue.value = patientStore.header.doctor_details;
    if (patientStore.details.hospitalFacilityData.gcs_score && patientStore.details.hospitalFacilityData.gcs_beh_sp) {
        if (patientStore.details.natureOfInjury.noi_brain === 'Y') {
            detailsValue.value += `\nGCS: ${gcsScoreDetail()} ( ${patientStore.details.hospitalFacilityData.gcs_score} ) ${patientStore.details.hospitalFacilityData.gcs_beh_sp} `;
            patientStore.finalDiagnosis = detailsValue;
        }
    }

    if (safetyText && factorText) {
        detailsValue.value = `${patientStore.header.doctor_details}\nSAFETY: ${safetyText}\nFACTOR: ${factorText}`;
        patientStore.textFactorSafety = `SAFETY: ${safetyText}\nFACTOR: ${factorText}`;
        patientStore.finalDiagnosis = detailsValue;
    } else if (safetyText) {
        detailsValue.value = `${patientStore.header.doctor_details}\nSAFETY: ${safetyText}`;
        patientStore.textFactorSafety = `SAFETY: ${safetyText}`;
        patientStore.finalDiagnosis = detailsValue;
    } else if (factorText) {
        detailsValue.value = `${patientStore.header.doctor_details}\nFACTOR: ${factorText}`;
        patientStore.textFactorSafety = `FACTOR: ${factorText}`;
        patientStore.finalDiagnosis = detailsValue;
    }
};
const patientDataIsLoaded = async () => {
    // console.log('progression Day: ', patientStore.progressionDay);
    // patientStore.dataIsLoaded = false;
    // patientStore.dataIsLoaded = true;
    // console.log('data is loaded: ', patientStore.dataIsLoaded);

    try {
        latestEntry.value = await injuryService.getLatestEntryOfDoctors(patientStore.enccode);
        latestEntryDoc.value = latestEntry;
        patientStore.latestEntryAvailable = true;
    } catch (error) {
        console.log('Error fetching latest entry of doctors:', error);
    } finally {
        loader.value = false;
    }

    updateDetailsValue();
    if (patientStore.details?.header?.final_doctor_details) {
        patientStore.header.final_doctor_details = patientStore.details.header.final_doctor_details;
        // customizedDetails.value = patientStore.details.header.final_doctor_details;
    }
    if (patientStore.details?.header?.final_doctor_diagnosis) {
        patientStore.header.final_doctor_diagnosis = patientStore.details?.header?.final_doctor_diagnosis;
        // customizedDiagnosis.value = patientStore.details.header.final_doctor_diagnosis;
    }
    if (patientStore.details?.header?.final_doctor_objective) {
        patientStore.header.final_doctor_objective = patientStore.details?.header?.final_doctor_objective;
        // customizedObjective.value = patientStore.details.header.final_doctor_objective;
    }

    patientStore.enccode = props.enccode;
    await loadLocations();
    if (patientStore.header.doctor_objective) {
        collapsSubjective.value = false;
    }
    if (patientStore.header.doctor_diagnosis) {
        collapsDiagnosis.value = false;
    }
    if (patientStore.details.generalData.doctor_doi || patientStore.details.generalData.doctor_toi) {
        collapsObjective.value = false;
    }
    if (patientStore.details.generalData.plc_bgycode || patientStore.details.generalData.plc_ctycode) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        loadLocations();
    }
    loader.value = false;
};
watch(
    () => [patientStore.details.generalData.plc_regcode, patientStore.details.generalData.plc_regcode, patientStore.details.generalData.plc_regcode, patientStore.details.generalData.plc_regcode, patientStore.details.generalData.plc_regcode],
    () => {
        loadLocations;
    },
    { deep: true }
);
// watch(
//     () => patientStore.progressionDay,
//     () => {
//         // console.log('progression day: ', props.day);
//         console.log('hit');
//         console.log('progression Day: ', patientStore.progressionDay);
//         patientDataIsLoaded();
//     },
//     {
//         deep: true
//     }
// );
watch(
    () => patientStore.locationLoaded,
    (newValue) => {
        if (newValue === true) {
            loadLocations;
        }
    }
);
watch(
    () => [
        patientStore.details.forTransportVehicularAccident.safe_unkn,
        patientStore.details.forTransportVehicularAccident.safe_airbag,
        patientStore.details.forTransportVehicularAccident.safe_helmet,
        patientStore.details.forTransportVehicularAccident.safe_cseat,
        patientStore.details.forTransportVehicularAccident.safe_sbelt,
        patientStore.details.forTransportVehicularAccident.safe_vest,
        patientStore.details.forTransportVehicularAccident.safe_other,
        patientStore.details.forTransportVehicularAccident.safe_other_sp,
        patientStore.details.forTransportVehicularAccident.risk_alcliq,
        patientStore.details.forTransportVehicularAccident.risk_sleep,
        patientStore.details.forTransportVehicularAccident.risk_smoke,
        patientStore.details.forTransportVehicularAccident.risk_mobpho,
        patientStore.details.forTransportVehicularAccident.risk_other,
        patientStore.details.forTransportVehicularAccident.risk_etc_spec,
        patientStore.details.forTransportVehicularAccident.risk_none,
        patientStore.details.forTransportVehicularAccident.safe_none,
        patientStore.details.hospitalFacilityData.gcs_beh_code,
        patientStore.details.hospitalFacilityData.gcs_beh_sp
    ],
    () => {
        generateSafetyAndFactorText();
        updateDetailsValue();
    },
    { deep: true }
);
watch(
    () => [patientStore.details.generalData.plc_bgycode, patientStore.details.generalData.plc_ctycode],
    () => {
        loadLocations();
    },
    {
        deep: true
    }
);
watch(
    () => [patientStore.details.generalData.doctor_doi, patientStore.details.generalData.doctor_toi],
    () => {
        collapsObjective.value = false;
    }
);
watch(
    () => patientStore.header.doctor_objective,
    () => {
        collapsSubjective.value = false;
    }
);
watch(
    () => patientStore.header.doctor_diagnosis,
    () => {
        collapsDiagnosis.value = false;
    }
);
watch(
    () => patientStore.header.doctor_details,
    () => {
        updateDetailsValue();
    }
);
watch(
    () => detailsValue.value,
    (newValue) => {
        patientStore.finalDoctorDetails = `${newValue}`;
    }
);
watch(customizedObjective, (newValue) => {
    patientStore.header.final_doctor_objective = newValue;
});
watch(customizedDiagnosis, (newValue) => {
    patientStore.header.final_doctor_diagnosis = newValue;
});
watch(customizedDetails, (newValue) => {
    patientStore.header.final_doctor_details = newValue;
});
watch(
    () => [patientStore.details.ExternalCauseOfInjury],
    () => {
        updateRequiredFieldCountForBite();
    },
    { deep: true }
);

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const size = ref(35);
watch(width, (newWidth) => {
    size.value = newWidth < 1900 ? 0 : 35;
});
const onResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
};
window.addEventListener('resize', onResize);
onMounted(async () => {
    await patientDataIsLoaded();
    // console.log('mountedhit');
    // console.log(patientStore.progressionDay);
    patientStore.details.ExternalCauseOfInjury.ext_bite = 'Y';
    updateRequiredFieldCountForBite();
    window.addEventListener('resize', onResize);
    size.value = width.value < 1250 ? 0 : 35;
});
onUnmounted(() => {
    window.removeEventListener('resize', onResize);
});
</script>
<template>
    <!-- {{ patientStore.details.followUp }}
    {{ patientStore.progressionDay }}
    {{ patientStore.type_prophylaxis }} -->
    <div v-if="saving" class="flex justify-content-center align-items-center" style="position: fixed; top: 0; left: 0; width: 100%; height: 98%; backdrop-filter: blur(5px); z-index: 9999; background-color: rgba(255, 255, 255, 0.5)">
        <img src="../../../../assets/images/ABTCloader.gif" alt="Loading..." style="height: 10rem; width: 10rem" />
    </div>
    <div id="form" style="height: 95%; width: 100%; overflow-y: auto">
        <Splitter style="height: 100%">
            <SplitterPanel style="height: 100%" :size="100">
                <Splitter layout="vertical" style="height: 100%">
                    <SplitterPanel style="background-color: #e5e5e5" :size="5" class="flex justify-content-center sticky">
                        <h1 class="font-bold">{{ patientStore.header.patname }}</h1>
                        <h5 class="text-blue-800">
                            <strong>{{ patientStore.header.hpercode }}</strong>
                        </h5>
                    </SplitterPanel>
                    <SplitterPanel :size="95">
                        <!-- <div v-if="patientStore.patientTSSRecord?.data?.[0] && patientStore.progressionDay !== '0'"> -->
                        <div v-if="patientStore.patientTSSRecord?.data?.[0] && patientStore.progressionDay !== '0'">
                            <FollowUpForm />
                            <!-- <BiteForm /> -->
                        </div>
                        <div v-else style="height: 90%">
                            <Accordion :activeIndex="0">
                                <AccordionTab v-if="patientStore.type_prophylaxis === 'POST-EXPOSURE'" :pt="{ headerAction: { style: { backgroundColor: '', padding: '1rem' } } }">
                                    <template #header>
                                        <span class="flex align-items-center gap-2 w-full">
                                            <span style="color: #000080" class="font-bold white-space-nowrap">GENERAL DATA</span>
                                            <i v-if="requiredCountGeneralData > 0" v-badge.danger="requiredCountGeneralData" class="pi pi-file-edit" style="font-size: 2rem" v-tooltip.bottom="`${requiredCountGeneralData} Required Fields`" />
                                            <i v-else class="pi pi-file-edit" style="font-size: 2rem" />
                                        </span>
                                    </template>
                                    <NewGeneralData @update:requiredCountGeneralData="updateRequiredCountGeneralData" />
                                </AccordionTab>
                                <AccordionTab v-if="patientStore.type_prophylaxis === 'POST-EXPOSURE'" :pt="{ headerAction: { style: { backgroundColor: '', padding: '1rem' } } }"
                                    ><template #header>
                                        <span class="flex align-items-center gap-2 w-full">
                                            <span style="color: #000080" class="font-bold white-space-nowrap">PREADMISSION DATA</span>
                                            <i v-if="requiredCountPreAdmission" v-badge.danger="requiredCountPreAdmission" class="pi pi-file-edit" style="font-size: 2rem" v-tooltip.bottom="`${requiredCountPreAdmission} Required Fields`" />
                                            <i v-else class="pi pi-file-edit" style="font-size: 2rem" />
                                        </span>
                                    </template>
                                    <NewPreAdmission @update:requiredCountPreAdmission="updateRequiredCountPreAdmission"
                                /></AccordionTab>
                                <AccordionTab v-if="!patientStore.patientTSSRecord?.data?.[0] || patientStore.progressionDay === '0'" :pt="{ headerAction: { style: { backgroundColor: '', padding: '1rem' } } }"
                                    ><template #header>
                                        <span class="flex align-items-center gap-2 w-full">
                                            <span style="color: #000080" class="font-bold white-space-nowrap">ABTC FORM</span>
                                            <i v-if="requiredCountABTCForm" v-badge.danger="requiredCountABTCForm" class="pi pi-file-edit" style="font-size: 2rem" v-tooltip.bottom="`${requiredCountABTCForm} Required Fields`" />
                                            <i v-else class="pi pi-file-edit" style="font-size: 2rem" />
                                        </span>
                                    </template>
                                    <BiteForm />
                                </AccordionTab>

                                <AccordionTab v-if="patientStore.progressionDay !== '0'" :pt="{ headerAction: { style: { backgroundColor: '', padding: '1rem' } } }">
                                    <template #header>
                                        <span class="flex align-items-center gap-2 w-full">
                                            <span style="color: #000080" class="font-bold white-space-nowrap">FOLLOW-UP FORM</span>
                                            <i v-if="requiredCountGeneralData > 0" v-badge.danger="requiredCountGeneralData" class="pi pi-file-edit" style="font-size: 2rem" v-tooltip.bottom="`${requiredCountGeneralData} Required Fields`" />
                                            <i v-else class="pi pi-file-edit" style="font-size: 2rem" />
                                        </span>
                                    </template>
                                    <FollowUpForm />
                                    <!-- <NewGeneralData @update:requiredCountGeneralData="updateRequiredCountGeneralData" /> -->
                                </AccordionTab>
                            </Accordion>
                        </div>

                        <!-- <div class="ml-5">
                            <EntryOfDoctors :enccode="props.enccode" :latestEntry="latestEntry" />
                        </div> -->

                        <!-- <div class="flex justify-content-bottom floating-tag" style="position: fixed; left: 50%; transform: translateX(-50%)">
                            <div>
                                <SaveBackRemovePanelButtonDoctor
                                    @update:customizedObjectives="updateCustomizedObjective"
                                    @update:customizedDiagnosis="updateCustomizedDiagnosis"
                                    @update:customizedDetails="updateCustomizedDetails"
                                    :objective="customizedObjective"
                                    :details="customizedDetails"
                                    :diagnosis="customizedDiagnosis"
                                    :latestEntry="latestEntryDoc"
                                    @update:saving="updateSaving"
                                />
                            </div>
                        </div> -->

                        <!-- <div class="floating-tag">
                            <div class="button-container">
                                <SaveOPDButton
                                    @update:customizedObjectives="updateCustomizedObjective"
                                    @update:customizedDiagnosis="updateCustomizedDiagnosis"
                                    @update:customizedDetails="updateCustomizedDetails"
                                    :objective="customizedObjective"
                                    :details="customizedDetails"
                                    :diagnosis="customizedDiagnosis"
                                    :latestEntry="latestEntryDoc"
                                    @update:saving="updateSaving"
                                />
                                <SaveOPDTSSOnlyButton
                                    @update:customizedObjectives="updateCustomizedObjective"
                                    @update:customizedDiagnosis="updateCustomizedDiagnosis"
                                    @update:customizedDetails="updateCustomizedDetails"
                                    :objective="customizedObjective"
                                    :details="customizedDetails"
                                    :diagnosis="customizedDiagnosis"
                                    :latestEntry="latestEntryDoc"
                                    @update:saving="updateSaving"
                                />
                            </div>
                        </div> -->
                        <!-- <div class="floating-tag" style="position: fixed; width: 50%; right: 20%; transform: translateX(-50%)">
                            <div style="width: 100%">
                                
                            </div>
                        </div> -->
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>

            <SplitterPanel hidden v-if="size === 35" class="justify-content-center rainbow-border" :size="25" :minSize="10" style="min-height: 98%; height: 100%; overflow-y: auto">
                <div class="sticky">
                    <div v-if="loader" class="flex justify-content-center align-items-center" style="top: 0; left: 0; width: 100%; height: 98%; backdrop-filter: blur(5px); z-index: 9999; background-color: rgba(255, 255, 255, 0.5)">
                        <img src="@/assets/images/loader.gif" alt="Loading..." style="height: 10rem; width: 10rem" />
                    </div>
                    <div v-else>
                        <Fieldset style="width: 100%" :toggleable="true" :collapsed="collapsObjective" :pt="{ legend: { style: { border: 'none', backgroundColor: 'transparent' } }, toggler: { style: { padding: '1rem' } } }">
                            <template #legend>
                                <span style="color: #000080" class="font-bold white-space-nowrap">SUBJECTIVE</span>
                            </template>

                            <div class="grid grid-cols-2 gap-2 justify-content-center">
                                <div style="width: 46%">
                                    <label for="noi" class="p-float-label text-black text-s" style="color: #000080"><i>Nature of Injury </i></label>
                                    <Textarea
                                        id="hpercode"
                                        type="text"
                                        :pt="{
                                            root: {
                                                border: '2px dashed green',
                                                padding: '10px',
                                                borderRadius: '4px'
                                            }
                                        }"
                                        v-model="patientStore.header.doctor_noi"
                                        class="font-bold mb-1 border border-black-500"
                                        autoResize
                                        readonly
                                        style="width: 100%"
                                    />
                                </div>
                                <div style="width: 46%">
                                    <label for="noi" class="p-float-label text-black text-s" style="color: #000080"><i>Place of Injury </i></label>
                                    <Textarea id="hpercode" type="text" v-model="patientStore.header.doctor_poi" class="font-bold mb-1 border border-black-500" autoResize readonly style="width: 100%" />
                                </div>
                                <div style="width: 46%">
                                    <label for="noi" class="p-float-label text-black text-s" style="color: #000080"><i>Date of Injury </i></label>
                                    <InputText id="hpercode" type="text" v-model="patientStore.details.generalData.doctor_doi" class="font-bold mb-1 border border-black-500" readonly style="width: 100%" />
                                </div>
                                <div style="width: 46%">
                                    <label for="noi" class="p-float-label text-black text-s" style="color: #000080"><i>Time of Injury </i></label>
                                    <InputText id="hpercode" type="text" v-model="patientStore.details.generalData.doctor_toi" class="font-bold mb-1 border border-black-500" readonly style="width: 100%" />
                                </div>
                            </div>
                            <label for="details" class="p-float-label text-black text-s" style="color: #000080"><i>Details </i></label>
                            <div>
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
                                    v-model="detailsValue"
                                    class="mt-1 justify-content-center"
                                    disabled
                                    autoResize
                                />
                                <!-- <i v-badge="'customize'" size="xlarge" class="flex justify-content-end mr-5 badge-button" style="font-size: 2rem" @click="customizedDetails = detailsValue" /> -->
                            </div>

                            <!-- <div><Textarea v-if="customizedDetails" style="width: 100%" v-model="customizedDetails" class="mt-1 justify-content-center font-bold" autoResize /></div>
                            <div style="width: 100%" class="flex justify-content-center"><i v-if="customizedDetails" v-badge.secondary="'final.Detail'" style="font-size: 2rem" /></div> -->
                        </Fieldset>
                        <Fieldset style="width: 100%" :toggleable="true" :pt="{ legend: { style: { border: 'none', backgroundColor: 'transparent' } }, toggler: { style: { padding: '1rem' } } }" :collapsed="collapsSubjective">
                            <template #legend>
                                <span class="flex align-items-center gap-2 w-full">
                                    <span style="color: #000080" class="font-bold white-space-nowrap">OBJECTIVE</span>
                                </span>
                            </template>
                            <div>
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
                                    disabled
                                    autoResize
                                />
                                <!-- <i v-badge="'customize'" size="xlarge" class="flex justify-content-end mr-5 badge-button" style="font-size: 4rem" @click="customizedObjective = patientStore.header.doctor_objective" /> -->
                            </div>

                            <!-- <div><Textarea v-if="customizedObjective" style="width: 100%" v-model="customizedObjective" autoResize class="font-bold" /></div>
                            <div style="width: 100%" class="flex justify-content-center">
                                <i v-if="customizedObjective" v-badge.secondary="'final.Objective'" style="font-size: 2rem" />
                            </div> -->
                        </Fieldset>
                        <Fieldset style="width: 100%" :toggleable="true" :pt="{ legend: { style: { border: 'none', backgroundColor: 'transparent' } }, toggler: { style: { padding: '1rem' } } }" :collapsed="collapsDiagnosis">
                            <template #legend>
                                <span class="flex align-items-center gap-2 w-full">
                                    <span style="color: #000080" class="font-bold white-space-nowrap">DIAGNOSIS</span>
                                </span>
                            </template>
                            <div>
                                <Textarea
                                    style="width: 100%"
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
                                    v-model="patientStore.header.doctor_diagnosis"
                                    disabled
                                    autoResize
                                />
                                <!-- <i v-badge="'customize'" size="xlarge" class="flex justify-content-end mr-5 badge-button" style="font-size: 4rem" @click="customizedDiagnosis = patientStore.header.doctor_diagnosis" /> -->
                            </div>

                            <!-- <div><Textarea v-if="customizedDiagnosis" style="width: 100%" v-model="customizedDiagnosis" autoResize class="font-bold" /></div>
                            <div style="width: 100%" class="flex justify-content-center"><i v-if="customizedDiagnosis" v-badge.secondary="'final.Diagnosis'" style="font-size: 2rem" /></div> -->
                        </Fieldset>
                    </div>
                </div>
            </SplitterPanel>
        </Splitter>
    </div>
    <div style="height: 5%; width: 100%" class="flex" v-if="patientStore.sameDay === false">
        <SaveOPDButton
            @update:customizedObjectives="updateCustomizedObjective"
            @update:customizedDiagnosis="updateCustomizedDiagnosis"
            @update:customizedDetails="updateCustomizedDetails"
            :objective="customizedObjective"
            :details="customizedDetails"
            :diagnosis="customizedDiagnosis"
            :latestEntry="latestEntryDoc"
            @update:saving="updateSaving"
        />
        <SaveOPDTSSOnlyButton
            @update:customizedObjectives="updateCustomizedObjective"
            @update:customizedDiagnosis="updateCustomizedDiagnosis"
            @update:customizedDetails="updateCustomizedDetails"
            :objective="customizedObjective"
            :details="customizedDetails"
            :diagnosis="customizedDiagnosis"
            :latestEntry="latestEntryDoc"
            @update:saving="updateSaving"
        />
    </div>
</template>
<style>
.bg {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.bg::before {
    content: '';
    background: url('@/assets/images/BGHMC.png') no-repeat center center fixed;
    opacity: 0.1;
}
.floating-tag {
    position: fixed;
    bottom: 20px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    display: flex; /* Use flexbox for horizontal alignment */
    justify-content: center; /* Center the button container */
}

.button-container {
    display: flex; /* Ensure buttons are inline */
    gap: 20px; /* Adjusted space between buttons (increase as needed) */
}
.badge-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.badge-button:focus {
    outline: none;
}

.rainbow-border {
    border: 4px solid transparent;
    border-image: linear-gradient(to right, #d3d3d3, #87ceeb) 1;
    background-color: #ffffff;
    border-radius: 8px;
}
.sticky {
    position: sticky;
    top: 0;
    border-bottom: 2px solid #475d74;
    background-color: white;
    z-index: 10;
}
body {
    font-family: Arial, sans-serif;
    margin: 20px;
}
.broken-textarea {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 2px dashed #ccc;
    border-radius: 4px;
    padding: 5px;
    box-sizing: border-box;
    resize: none;
    background-color: #f9f9f9;
    color: #666;
    font-size: 13px;
}
.broken-textarea:disabled {
    background-color: #e9e9e9;
    color: #999;
}
</style>
