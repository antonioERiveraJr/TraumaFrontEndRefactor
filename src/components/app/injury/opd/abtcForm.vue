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
import { useUserStore } from '../../../../../src/store/general/UserStore';
import ABTCloading from '../../../../assets/images/ABTCloading.json';

const isFollowUpForm = ref(false);
const user = useUserStore();
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
// const savingDialog = ref(false);
const loader = ref(true);
const injuryService = new InjuryService();
const patientStore = usePatientStore();
const requiredCountPreAdmission = ref(0);
const requiredCountFollowUp = ref(8);
const requiredCountABTCForm = ref(0);
const requiredCountGeneralData = ref(2);
const fullUrl = window.location.href;
const match = fullUrl.match(/[?&]enccode=([^&#]*)/);
const paramEnccode = match ? match[1] : null;
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
const caseLogDialog = ref(false);
const hideSaveButton = ref(false);
const groupedCases = ref([]);
// const isUpdateForm = ref(false);

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

const requestPhilhealthForm = () => {
    window.location.href = `http://192.168.6.58:8010/api/loginABTCPhilhealth?hpercode=${patientStore.header.hpercode}&employeeid=${user.value.employeeid}`;
};
const openCaseDialogLog = async () => {
    caseLogDialog.value = true;
    // console.log('hpercode; ', patientStore.header.hpercode);
    const patientsABTCLog = await injuryService.getPatientABTCLog(patientStore.header.hpercode);
    // console.log('patientsABTCLog: ', patientsABTCLog);
    groupPatientData(patientsABTCLog);
};
// Date formatting function
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options).replace(/\//g, '-'); // Replace '/' with '-' for MM-DD-YYYY format
};
// const groupPatientData = (patientsABTCLog) => {
//     const grouped = patientsABTCLog.reduce((acc, curr) => {
//         const lockCase = curr.lockCase.trim();
//         const caseData = {
//             vaccineday: curr.vaccineday,
//             prophylaxis: curr.prophylaxis,
//             tStamp: curr.tStamp,
//             status: curr.status // Capture the status
//         };

//         if (!acc[lockCase]) {
//             acc[lockCase] = { lockCase, items: [caseData] }; // Store case data
//         } else {
//             acc[lockCase].items.push(caseData); // Add to existing lockCase
//         }
//         return acc;
//     }, {});

//     // Update the status based on the conditions
//     for (const key in grouped) {
//         const caseGroup = grouped[key];
//         const itemCount = caseGroup.items.length;
//         const latestProphylaxis = caseGroup.items[itemCount - 1].prophylaxis;

//         if (latestProphylaxis === 'POST-EXPOSURE' && itemCount >= 3) {
//             caseGroup.status = 'Finished';
//         } else if (latestProphylaxis === 'PRE-EXPOSURE' && itemCount >= 2) {
//             caseGroup.status = 'Finished';
//         } else {
//             caseGroup.status = 'Unfinished';
//         }
//     }

//     groupedCases.value = Object.values(grouped); // Set the grouped cases
// };

const groupPatientData = (patientsABTCLog) => {
    const grouped = patientsABTCLog.reduce((acc, curr) => {
        const lockCase = curr.lockCase.trim();
        const caseData = {
            vaccineday: curr.vaccineday,
            prophylaxis: curr.prophylaxis,
            tStamp: curr.tStamp,
            status: curr.status // Capture the status
        };

        if (!acc[lockCase]) {
            acc[lockCase] = { lockCase, items: [caseData] }; // Store case data
        } else {
            acc[lockCase].items.push(caseData); // Add to existing lockCase
        }
        return acc;
    }, {});

    // Update the status based on the conditions
    for (const key in grouped) {
        const caseGroup = grouped[key];
        const hasDay7 = caseGroup.items.some((item) => item.vaccineday === '7');

        // Set the status based on the presence of day 7
        if (hasDay7) {
            caseGroup.status = 'Finished';
        } else {
            caseGroup.status = 'Unfinished';
        }
    }

    groupedCases.value = Object.values(grouped); // Set the grouped cases
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
    const missingFields = [];
    // console.log('test');

    // Check if the bite injury is marked as 'Y'
    if (patientStore.type_prophylaxis === 'PRE-EXPOSURE') {
        // console.log('1');
        requiredCountABTCForm.value = 4;
        if (patientStore.details.ExternalCauseOfInjury.previousARV) requiredCountABTCForm.value--;
        if (patientStore.details.ExternalCauseOfInjury.tetanusVaccination) requiredCountABTCForm.value--;
        if (patientStore.details.followUp.finding) requiredCountABTCForm.value--;
        if (patientStore.details.ABTC.immunization_schedule) requiredCountABTCForm.value--;
    } else if (patientStore.details.ExternalCauseOfInjury.ext_bite === 'Y') {
        // Increment the count for each missing field
        // console.log('2');
        const fieldsToCheck = ['ext_bite_sp', 'dogbiteDegree', 'bleeding', 'bitingAnimal', 'observation', 'first_aid_code', 'washingDone', 'previousARV', 'tetanusVaccination', 'preAdmissionData.first_aid_code'];

        fieldsToCheck.forEach((field) => {
            const value = field.includes('.') ? eval(`patientStore.details.${field}`) : patientStore.details.ExternalCauseOfInjury[field];

            if (value === '') {
                requiredCountABTCForm.value++;
                missingFields.push(field);
            }
        });

        // Check vaccinations
        if (patientStore.details.ExternalCauseOfInjury.hrig === 'Y' && patientStore.details.ExternalCauseOfInjury.hrig_num === '') {
            requiredCountABTCForm.value++;
            missingFields.push('hrig_num');
        }
        if (patientStore.details.ExternalCauseOfInjury.erig === 'Y' && patientStore.details.ExternalCauseOfInjury.erig_num === '') {
            requiredCountABTCForm.value++;
            missingFields.push('erig_num');
        }
        if (patientStore.details.ExternalCauseOfInjury.ats === 'Y' && patientStore.details.ExternalCauseOfInjury.ats_num === '') {
            requiredCountABTCForm.value++;
            missingFields.push('ats_num');
        }

        // Check sites for vaccinations
        if (patientStore.details.ExternalCauseOfInjury.pvrv === 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pvrv_site_4 !== 'Y') {
            requiredCountABTCForm.value++;
            missingFields.push('pvrv_site');
        }
        if (patientStore.details.ExternalCauseOfInjury.pcec === 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_2 !== 'Y' && patientStore.details.ExternalCauseOfInjury.pcec_site_4 !== 'Y') {
            requiredCountABTCForm.value++;
            missingFields.push('pcec_site');
        }

        //check finding and schedule
        if (patientStore.details.followUp.finding === '') {
            requiredCountABTCForm.value++;
            missingFields.push('finding');
        }
        if (patientStore.details.ABTC.immunization_schedule === '') {
            requiredCountABTCForm.value++;
            missingFields.push('immunization schedule');
        }
    }

    // Log missing fields
    // if (missingFields.length > 0) {
    //     console.log('Missing fields:', missingFields);
    // }
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
    if (patientStore.patientTSSRecord?.data?.[0]) {
        const primeRecords = patientStore.patientTSSRecord.data.filter(
            (record) => (record.vaccineday === patientStore.progressionDay || (record.primeTSS === 'I' && patientStore.type_prophylaxis === 'POST-EXPOSURE')) && (record.primeTSS === 'Y' || record.primeTSS === 'I')
        );

        const followUpRecord = patientStore.patientTSSRecord.data.filter(
            (record) =>
                (patientStore.type_prophylaxis === 'PRE-EXPOSURE' && record.primeTSS === 'I' && patientStore.progressionDay === record.vaccineday) ||
                (patientStore.type_prophylaxis === 'POST-EXPOSURE' && record.primeTSS === 'Y' && patientStore.progressionDay === record.vaccineday)
        );
        // console.log('followUpRecord: ', followUpRecord);
        // console.log('Prime Records: ', primeRecords);

        const hasPrimeRecord = followUpRecord.length > 0;
        // console.log('Has Prime Record: ', hasPrimeRecord);
        if (!hasPrimeRecord) {
            // console.log('1');
            isFollowUpForm.value = true;
        } else {
            // console.log('2');
            isFollowUpForm.value = false;
        }

        // if (isFormPrime.find((record) => record === true)) {
        //     console.log('isFormPrime: ', isFormPrime);
        //     isFollowUpForm.value = true;
        // } else {
        //     false;
        // }
    }
    // console.log('progression Day: ', patientStore.progressionDay);
    // patientStore.dataIsLoaded = false;
    // patientStore.dataIsLoaded = true;
    // console.log('data is loaded: ', patientStore.dataIsLoaded);

    patientStore.latestEntryAvailable = false;
    try {
        latestEntry.value = await injuryService.isOPDABTCFormUpdatable(patientStore.header.hpercode, patientStore.enccode);
        console.log('latestEntry: ', latestEntry.value);
        latestEntryDoc.value = latestEntry;
        // console.log('latestEntryDocs: ', latestEntryDoc.value.value);
        // if (latestEntryDoc.value.value !== undefined) {
        //     isUpdateForm.value = true;
        // } else {
        //     isUpdateForm.value = false;
        // }
        // console.log('latestEntryDocs: ', latestEntryDoc.value.value);
        // patientStore.latestEntry = latestEntry;
        patientStore.latestEntryAvailable = true;
    } catch (error) {
        // console.log('No recent entry of doctors');
    } finally {
        loader.value = false;
    }
    // console.log('latestEnccode: ', latestEntry.value);
    // console.log(patientStore.patientTSSRecord);
    // console.log('OPDPatientData: ', patientStore.OPDPatientData);
    // const checkDayRecord = patientStore.patientTSSRecord.data.filter((record) => record.data.enccode.toLowerCase() !== paramEnccode.toLowerCase() && record.vaccineday === patientStore.progressionDay);
    // hideSaveButton.value = checkDayRecord.length > 0 ;
    // console.log('checkDayRecord:', checkDayRecord);

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
    () => [patientStore.details.ExternalCauseOfInjury, patientStore.details.followUp, patientStore.details.ABTC.immunization_schedule],
    () => {
        updateRequiredFieldCountForBite();
    },
    { deep: true }
);

// watch(
//     () => [patientStore.details.ABTC, patientStore.details.followUp],
//     () => {
//         const requiredFields = [
//             { value: patientStore.details.followUp.immunization_schedule, required: true },
//             { value: patientStore.details.followUp.finding, required: true },
//             { value: patientStore.details.followUp.tenderness, required: true },
//             { value: patientStore.details.followUp.discharge, required: true },
//             { value: patientStore.details.followUp.erythema, required: true },
//             { value: patientStore.details.followUp.complaints, required: true },
//             { value: patientStore.details.followUp.adverse_reaction, required: true },
//             { value: patientStore.details.followUp.biting, required: true },
//             { value: patientStore.details.followUp.wound_description, required: true },
//             { value: patientStore.details.followUp.wound_descriptionOthers, required: patientStore.details.followUp.wound_description === 'OTHERS' },
//             { value: patientStore.details.followUp.discharge_sp, required: patientStore.details.followUp.discharge === 'OTHERS' }
//             // { value: patientStore.details.followUp.wound_description, required: patientStore.type_prophylaxis === 'POST-EXPOSURE' },
//             // { value: patientStore.details.followUp.finding, required: patientStore.type_prophylaxis !== 'POST-EXPOSURE' }
//         ];

//         requiredCountFollowUp.value = requiredFields.filter((field) => field.required && !field.value).length;
//     },
//     { deep: true }
// );

watch(
    () => [patientStore.details.ABTC, patientStore.details.followUp],
    () => {
        if (patientStore.progressionDay !== '0') {
            if (patientStore.type_prophylaxis === 'PRE-EXPOSURE') {
                requiredCountFollowUp.value = 3;
                const requiredFields = [
                    { key: 'complaints', value: patientStore.details.followUp.complaints, required: true },
                    { key: 'adverse_reaction', value: patientStore.details.followUp.adverse_reaction, required: true },
                    { key: 'findings', value: patientStore.details.followUp.finding, required: true },
                    { key: 'immunization schedule', value: patientStore.details.ABTC.immunization_schedule, required: true }
                ];

                const missingFields = requiredFields.filter((field) => field.required && !field.value).map((field) => field.key);

                requiredCountFollowUp.value = missingFields.length;

                // console.log('Missing required follow-up fields:', missingFields);
            } else {
                const requiredFields = [
                    // { key: 'immunization_schedule', value: patientStore.details.followUp.immunization_schedule, required: true },
                    // { key: 'finding', value: patientStore.details.followUp.finding, required: true },
                    { key: 'tenderness', value: patientStore.details.followUp.tenderness, required: true },
                    { key: 'discharge', value: patientStore.details.followUp.discharge, required: true },
                    { key: 'erythema', value: patientStore.details.followUp.erythema, required: true },
                    { key: 'hematoma', value: patientStore.details.followUp.hematoma, required: true },
                    { key: 'complaints', value: patientStore.details.followUp.complaints, required: true },
                    { key: 'adverse_reaction', value: patientStore.details.followUp.adverse_reaction, required: true },
                    { key: 'biting', value: patientStore.details.followUp.biting, required: true },
                    { key: 'wound_description', value: patientStore.details.followUp.wound_description, required: true },
                    { key: 'wound_descriptionOthers', value: patientStore.details.followUp.wound_descriptionOthers, required: patientStore.details.followUp.wound_description === 'OTHERS' },
                    { key: 'discharge_sp', value: patientStore.details.followUp.discharge_sp, required: patientStore.details.followUp.discharge === 'OTHERS' }
                ];

                const missingFields = requiredFields.filter((field) => field.required && !field.value).map((field) => field.key);

                requiredCountFollowUp.value = missingFields.length;

                // console.log('Missing required follow-up fields:', missingFields);
            }
        }
    },
    { deep: true }
);

watch(
    () => [patientStore.details.preAdmissionData, patientStore.details.generalData, patientStore.details.hospitalFacilityData],
    () => {
        const requiredFields = [
            { value: patientStore.details.preAdmissionData.inj_intent_code, required: true },
            { value: patientStore.details.generalData.doctor_injtme, required: true },
            // { value: patientStore.details.generalData.plc_regcode, required: true },
            // { value: patientStore.details.generalData.plc_provcode, required: true },
            { value: patientStore.details.generalData.plc_ctycode, required: true },
            { value: patientStore.details.hospitalFacilityData.status_code, required: true },
            { value: patientStore.details.hospitalFacilityData.mode_transport_code, required: true },
            { value: patientStore.details.hospitalFacilityData.coord_uncoord, required: true },
            { value: patientStore.details.hospitalFacilityData.trans_ref || patientStore.details.hospitalFacilityData.trans_ref, required: patientStore.details.hospitalFacilityData.coord_uncoord === 'COORDINATED' },
            { value: patientStore.details.hospitalFacilityData.ref_physician, required: patientStore.details.hospitalFacilityData.trans_ref || patientStore.details.hospitalFacilityData.trans_ref !== '' },
            { value: patientStore.details.hospitalFacilityData.ref_hosp_code_sp, required: patientStore.details.hospitalFacilityData.trans_ref || patientStore.details.hospitalFacilityData.trans_ref !== '' }
        ];
        requiredCountGeneralData.value = requiredFields.filter((field) => field.required && !field.value).length;
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

    if (patientStore.type_prophylaxis === 'PRE-EXPOSURE') {
        requiredCountFollowUp.value = 3;
    }
    // console.log('mountedhit');
    // console.log(patientStore.progressionDay);
    patientStore.details.ExternalCauseOfInjury.ext_bite = 'Y';
    if (patientStore.details.ExternalCauseOfInjury.adverseReaction === '') {
        patientStore.details.ExternalCauseOfInjury.adverseReaction = 'None';
    }

    updateRequiredFieldCountForBite();
    window.addEventListener('resize', onResize);
    size.value = width.value < 1250 ? 0 : 35;
    // console.log('paramEnccode: ', paramEnccode);
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
        <!-- <img src="../../../../assets/images/ABTCloader.gif" alt="Loading..." style="height: 10rem; width: 10rem" /> -->
        <Vue3Lottie :animationData="ABTCloading" :height="200" :width="200" />
    </div>
    <div id="form" style="height: 95%; width: 100%; overflow-y: auto">
        <Splitter style="height: 100%">
            <SplitterPanel style="height: 100%" :size="100">
                <Splitter layout="vertical" style="height: 100%">
                    <SplitterPanel :size="5" class="flex sticky">
                        <div class="flex justify-content-center" style="width: 95%">
                            <h1 class="font-bold">{{ patientStore.header.patname }}</h1>
                            <h5 class="text-blue-800">
                                <strong>{{ patientStore.header.hpercode }}</strong>
                            </h5>
                        </div>

                        <i class="flex justify-content-center mt-4 pi pi-bars" @click="openCaseDialogLog()" style="width: 5%; cursor: pointer"></i>
                    </SplitterPanel>
                    <SplitterPanel :size="95">
                        <!-- <div v-if="patientStore.patientTSSRecord?.data?.[0] && patientStore.progressionDay !== '0'"> -->
                        <!-- <div v-if="patientStore.patientTSSRecord?.data?.[0] && patientStore.progressionDay !== '0'"> -->
                        <div v-if="isFollowUpForm">
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
                                    <NewGeneralData />
                                </AccordionTab>
                                <AccordionTab v-if="patientStore.type_prophylaxis === 'POST-EXPOSURE'" :pt="{ headerAction: { style: { backgroundColor: '', padding: '1rem' } } }">
                                    <template #header>
                                        <span class="flex align-items-center gap-2 w-full">
                                            <span style="color: #000080" class="font-bold white-space-nowrap">PREADMISSION DATA</span>
                                            <i v-if="requiredCountPreAdmission" v-badge.danger="requiredCountPreAdmission" class="pi pi-file-edit" style="font-size: 2rem" v-tooltip.bottom="`${requiredCountPreAdmission} Required Fields`" />
                                            <i v-else class="pi pi-file-edit" style="font-size: 2rem" />
                                        </span>
                                    </template>
                                    <NewPreAdmission @update:requiredCountPreAdmission="updateRequiredCountPreAdmission" />
                                </AccordionTab>
                                <AccordionTab v-if="!isFollowUpForm" :pt="{ headerAction: { style: { backgroundColor: '', padding: '1rem' } } }">
                                    <template #header>
                                        <span class="flex align-items-center gap-2 w-full">
                                            <span style="color: #000080" class="font-bold white-space-nowrap">ABTC FORM</span>
                                            <i v-if="requiredCountABTCForm" v-badge.danger="requiredCountABTCForm" class="pi pi-file-edit" style="font-size: 2rem" v-tooltip.bottom="`${requiredCountABTCForm} Required Fields`" />
                                            <i v-else class="pi pi-file-edit" style="font-size: 2rem" />
                                        </span>
                                    </template>
                                    <BiteForm />
                                </AccordionTab>

                                <!-- <AccordionTab v-if="patientStore.progressionDay !== '0'" :pt="{ headerAction: { style: { backgroundColor: '', padding: '1rem' } } }">
                                    <template #header>
                                        <span class="flex align-items-center gap-2 w-full">
                                            <span style="color: #000080" class="font-bold white-space-nowrap">FOLLOW-UP FORM</span>
                                            <i v-if="requiredCountFollowUp > 0" v-badge.danger="requiredCountFollowUp" class="pi pi-file-edit" style="font-size: 2rem" v-tooltip.bottom="`${requiredCountFollowUp} Required Fields`" />
                                            <i v-else class="pi pi-file-edit" style="font-size: 2rem" />
                                        </span>
                                    </template>
                                    <FollowUpForm />
                                    
                                </AccordionTab> -->
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
    <!-- <div style="height: 5%; width: 100%"  class="flex" v-if="(hideSaveButton && latestEntry) || (latestEntry && latestEntry.enccode.toLowerCase() === paramEnccode.toLowerCase())"> -->
    <div style="height: 5%; width: 100%" class="flex">
        <!-- <div
        style="height: 5%; width: 100%"
        class="flex"
        v-if="
            (patientStore.sameDay === false || isUpdateForm) &&
            ((patientStore.details.enccode.toLowerCase() === paramEnccode.toLowerCase() && !patientStore.dayNoRecord && hideSaveButton) || (patientStore.dayNoRecord && patientStore.details.enccode.toLowerCase() !== paramEnccode.toLowerCase()))
        "
    > -->
        <!-- <SaveOPDButton
            style="height: 100%"
            @update:customizedObjectives="updateCustomizedObjective"
            @update:customizedDiagnosis="updateCustomizedDiagnosis"
            @update:customizedDetails="updateCustomizedDetails"
            :objective="customizedObjective"
            :details="customizedDetails"
            :diagnosis="customizedDiagnosis"
            :latestEntry="latestEntryDoc"
            @update:saving="updateSaving"
        /> -->
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
    <Dialog v-model:visible="caseLogDialog" header="PATIENT's ABTC LOG" :style="{ width: '25rem' }" position="topright" :modal="true" :draggable="false">
        <Accordion :activeIndex="0">
            <AccordionTab v-for="(caseGroup, index) in groupedCases" :key="index" :header="`${formatDate(caseGroup.lockCase)} - ${caseGroup.status}`">
                <div v-for="(caseItem, itemIndex) in caseGroup.items" :key="itemIndex">
                    <p class="m-0">
                        <strong>Vaccination Day:</strong> {{ caseItem.vaccineday }}<br />
                        <strong>Prophylaxis:</strong> {{ caseItem.prophylaxis }}<br />
                        <strong>Date:</strong> {{ formatDate(caseItem.tStamp) }}<br />
                    </p>
                    <!-- Add separator -->
                    <hr v-if="itemIndex < caseGroup.items.length - 1" style="margin: 10px 0; border: 1px solid #ccc" />
                </div>
            </AccordionTab>
        </Accordion>
        <Button style="width: 100%; margin-top: 5%" label="Request Philhealth Form" @click="requestPhilhealthForm()" />
    </Dialog>
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
    display: flex;
    /* Use flexbox for horizontal alignment */
    justify-content: center;
    /* Center the button container */
}

.button-container {
    display: flex;
    /* Ensure buttons are inline */
    gap: 20px;
    /* Adjusted space between buttons (increase as needed) */
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
    bottom: 0;
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
