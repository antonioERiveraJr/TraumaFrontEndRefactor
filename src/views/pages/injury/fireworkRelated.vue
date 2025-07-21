<script setup>
import { ref } from 'vue';
// import { useToast } from 'primevue/usetoast';
import LibraryService from '@/services/LibraryService';


const form = ref({
    lastName: '',
    firstName: '',
    middleName: '',
    suffix: '',
    address: '',
    region: null,
    province: null,
    city: null,
    barangay: null,
    telephone: '',
    sex: null,
    dateOfBirth: '',
    ageYears: null,
    ageMonths: null,
    ageDays: null,
    fourPsMember: null,
    injuryDate: '',
    injuryTime: '',
    consultationDate: '',
    consultationTime: '',
    placeOfOccurrence: '',
    placeOfInjury: '',
    sameLocation: null,
    refRegion: null,
    refProvince: null,
    refCity: null,
    refBarangay: null,
    referral: null,
    refHospital: '',
    natureOfInjury: null,
    typeOfInvolvement: null,
    diagnosis: '',
    anatomicalLocationEye: null,
    anatomicalLocationHead: null,
    anatomicalLocationNeck: null,
    anatomicalLocationChest: null,
    anatomicalLocationBack: null,
    anatomicalLocationAbdomen: null,
    anatomicalLocationButtocks: null,
    anatomicalLocationHand: null,
    anatomicalLocationForearm: null,
    anatomicalLocationPelvic: null,
    anatomicalLocationThigh: null,
    anatomicalLocationKnee: null,
    anatomicalLocationLegs: null,
    anatomicalLocationFoot: null,
    typeOfFirecracker: null,
    legalityOfFirecracker: null,
    liquorIntoxication: null,
    treatmentATS: '',
    treatmentToxoid: '',
    treatmentOthers: '',
    disposition: null,
    educationalMaterial: [],
    outcome: null
});

const libraryService = new LibraryService();
// const toast = useToast();
const toastVisible = ref(false);
const toastSeverity = ref('');
const toastSummary = ref('');
const toastDetail = ref('');
// const natureOfInjuries = ref(libraryService.getNatureOfInjuries());
const typesOfInvolvement = ref(libraryService.getTypesOfInvolvement());
const firecrackerTypes = ref(libraryService.getFirecrackerTypes());
const legalityOptions = ref(libraryService.getLegalityOptions());
// const treatmentOptions = ref(libraryService.getTreatmentOptions());
const dispositionOptions = ref(libraryService.getDispositionOptions());
const educationalMaterialOptions = ref(libraryService.getEducationalMaterialOptions());
const outcomeOptions = ref(libraryService.getOutcomeOptions());
// const anatomicalLocations = ref(libraryService.getAnatomicalLocations());

// const regionOptions = []; // Populate with actual data
// const provinceOptions = []; // Populate with actual data
// const cityOptions = []; // Populate with actual data
// const barangayOptions = []; // Populate with actual data
const sexOptions = [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }];
const fourPsOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
const placeOfOccurrenceOptions = [
    { label: 'Designated Area', value: 'Designated Area' },
    { label: 'Home', value: 'Home' },
    { label: 'Street', value: 'Street' },
    { label: 'Others', value: 'Others' }
];
const sameLocationOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
];
const referralOptions = [
    { label: 'No', value: 'No' },
    { label: 'Yes', value: 'Yes' }
];
const natureOfInjuryOptions = [
    { label: 'Fireworks - related', value: 'Fireworks - related' },
    { label: 'Fireworks - Ingestion', value: 'Fireworks - Ingestion' },
    { label: 'GSW - Stray Bullet', value: 'GSW - Stray Bullet' },
    { label: 'Tetanus', value: 'Tetanus' }
];
const anatomicalLocationOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
];
const liquorIntoxicationOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
];

const submitForm = () => {
    // Perform form validation and submission logic here
    // For example, you can send the form data to an API

    // Show success toast
    toastVisible.value = true;
    toastSeverity.value = 'success';
    toastSummary.value = 'Success';
    toastDetail.value = 'Form submitted successfully!';
};
</script>
<template>
    <div class="bg">
        <h4>Add to Fireworks-Related Injury Surveillance Registry</h4>

        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="lastName">Last Name <span class="text-danger">*</span></label>
                <InputText id="lastName" v-model="form.lastName" required />
            </div>

            <div class="form-group">
                <label for="firstName">First Name <span class="text-danger">*</span></label>
                <InputText id="firstName" v-model="form.firstName" required />
            </div>

            <div class="form-group">
                <label for="middleName">Middle Name <span class="text-danger">*</span></label>
                <InputText id="middleName" v-model="form.middleName" required />
            </div>

            <div class="form-group">
                <label for="suffix">Suffix</label>
                <InputText id="suffix" v-model="form.suffix" />
            </div>

            <div class="form-group">
                <label for="address">House & Street Name <span class="text-danger">*</span></label>
                <InputText id="address" v-model="form.address" required />
            </div>

            <div class="form-group">
                <label for="region">Region <span class="text-danger">*</span></label>
                <Dropdown id="region" v-model="form.region" :options="regions" optionLabel="name" optionValue="code"required />
            </div>

            <div class="form-group">
                <label for="province">Province <span class="text-danger">*</span></label>
                <Dropdown id="province" v-model="form.province" :options="provinces" optionLabel="name"
                    optionValue="code" required />
            </div>

            <div class="form-group">
                <label for="city">City/Municipality <span class="text-danger">*</span></label>
                <Dropdown id="city" v-model="form.city" :options="cities" optionLabel="name" optionValue="code"
                    required />
            </div>

            <div class="form-group">
                <label for="barangay">Barangay <span class="text-danger">*</span></label>
                <Dropdown id="barangay" v-model="form.barangay" :options="barangays" optionLabel="name"
                    optionValue="code" required />
            </div>

            <div class="form-group">
                <label for="telephone">Telephone No</label>
                <InputText id="telephone" v-model="form.telephone" />
            </div>

            <div class="form-group">
                <label for="sex">Sex <span class="text-danger">*</span></label>
                <RadioButton id="sex" v-model="form.sex" :options="sexOptions" required />
            </div>

            <div class="form-group">
                <label for="dateOfBirth">Date of Birth (mm/dd/yyyy) <span class="text-danger">*</span></label>
                <InputText id="dateOfBirth" v-model="form.dateOfBirth" required />
            </div>

            <div class="form-group">
                <label for="ageYears">Current Age in Years</label>
                <InputText id="ageYears" v-model="form.ageYears" type="number" />
            </div>

            <div class="form-group">
                <label for="ageMonths">Current Age in Months</label>
                <InputText id="ageMonths" v-model="form.ageMonths" type="number" />
            </div>

            <div class="form-group">
                <label for="ageDays">Current Age in Days</label>
                <InputText id="ageDays" v-model="form.ageDays" type="number" />
            </div>

            <div class="form-group">
                <label for="fourPsMember">4P's Member</label>
                <RadioButton id="fourPsMember" v-model="form.fourPsMember" :options="fourPsOptions" />
            </div>

            <div class="form-group">
                <label for="injuryDate">Date of Injury (mm/dd/yyyy) <span class="text-danger">*</span></label>
                <InputText id="injuryDate" v-model="form.injuryDate" required />
            </div>

            ```vue
            <div class="form-group">
                <label for="injuryTime">Time of Injury (24 Hour Format) <span class="text-danger">*</span></label>
                <InputText id="injuryTime" v-model="form.injuryTime" required />
            </div>

            <div class="form-group">
                <label for="consultationDate">Date of Consultation (mm/dd/yyyy) <span
                        class="text-danger">*</span></label>
                <InputText id="consultationDate" v-model="form.consultationDate" required />
            </div>

            <div class="form-group">
                <label for="consultationTime">Time of Consultation (24 Hour Format) <span
                        class="text-danger">*</span></label>
                <InputText id="consultationTime" v-model="form.consultationTime" required />
            </div>

            <div class="form-group">
                <label for="placeOfOccurrence">Place of Occurrence <span class="text-danger">*</span></label>
                <Dropdown id="placeOfOccurrence" v-model="form.placeOfOccurrence" :options="placeOfOccurrenceOptions"
                    required />
            </div>

            <div class="form-group">
                <label for="placeOfInjury">Place of Injury - Street Name <span class="text-danger">*</span></label>
                <InputText id="placeOfInjury" v-model="form.placeOfInjury" required />
            </div>
<p></p>
            <div class="form-group">
                <label>If same Region, Province, City/Municipality and Barangay? <span
                        class="text-danger">*</span></label>
                <RadioButton v-model="form.sameLocation" :options="sameLocationOptions" required />
            </div>

            <div class="form-group" v-if="form.sameLocation === 'No'">
                <label for="refRegion">Region <span class="text-danger">*</span></label>
                <Dropdown id="refRegion" v-model="form.refRegion" :options="regions" required />
            </div>

            <div class="form-group" v-if="form.sameLocation === 'No'">
                <label for="refProvince">Province <span class="text-danger">*</span></label>
                <Dropdown id="refProvince" v-model="form.refProvince" :options="provinces" required />
            </div>

            <div class="form-group" v-if="form.sameLocation === 'No'">
                <label for="refCity">City/Municipality <span class="text-danger">*</span></label>
                <Dropdown id="refCity" v-model="form.refCity" :options="cities" required />
            </div>

            <div class="form-group" v-if="form.sameLocation === 'No'">
                <label for="refBarangay">Barangay <span class="text-danger">*</span></label>
                <Dropdown id="refBarangay" v-model="form.refBarangay" :options="barangays" required />
            </div>

            <div class="form-group">
                <label for="referral">Referral from another Hospital</label>
                <RadioButton v-model="form.referral" :options="referralOptions" />
            </div>

            <div class="form-group" v-if="form.referral === 'Yes'">
                <label for="refHospital">Name of Hospital</label>
                <InputText id="refHospital" v-model="form.refHospital" />
            </div>

            <div class="form-group">
                <label for="natureOfInjury">Nature of Injury <span class="text-danger">*</span></label>
                <Dropdown id="natureOfInjury" v-model="form.natureOfInjury" :options="natureOfInjuryOptions" required />
            </div>

            <div class="form-group">
                <label for="typeOfInvolvement">Type of Involvement <span class="text-danger">*</span></label>
                <Dropdown id="typeOfInvolvement" v-model="form.typeOfInvolvement" :options="typesOfInvolvement"
                    required />
            </div>

            <div class="form-group">
                <label for="diagnosis">Diagnosis - Nature/Site/Laterality</label>
                <InputText id="diagnosis" v-model="form.diagnosis" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Eye</label>
                <RadioButton v-model="form.anatomicalLocationEye" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Head</label>
                <RadioButton v-model="form.anatomicalLocationHead" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Neck</label>
                <RadioButton v-model="form.anatomicalLocationNeck" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Chest</label>
                <RadioButton v-model="form.anatomicalLocationChest" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Back</label>
                <RadioButton v-model="form.anatomicalLocationBack" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Abdomen</label>
                <RadioButton v-model="form.anatomicalLocationAbdomen" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Buttocks</label>
                <RadioButton v-model="form.anatomicalLocationButtocks" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Hand</label>
                <RadioButton v-model="form.anatomicalLocationHand" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Forearm/Arm</label>
                <RadioButton v-model="form.anatomicalLocationForearm" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Pelvic</label>
                <RadioButton v-model="form.anatomicalLocationPelvic" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Thigh</label>
                <RadioButton v-model="form.anatomicalLocationThigh" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Knee</label>
                <RadioButton v-model="form.anatomicalLocationKnee" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Legs</label>
                <RadioButton v-model="form.anatomicalLocationLegs" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label>Anatomical Location - Foot</label>
                <RadioButton v-model="form.anatomicalLocationFoot" :options="anatomicalLocationOptions" />
            </div>

            <div class="form-group">
                <label for="typeOfFirecracker">Type of Firecracker</label>
                <Dropdown id="typeOfFirecracker" v-model="form.typeOfFirecracker" :options="firecrackerTypes" />
            </div>

            <div class="form-group">
                <label for="legalityOfFirecracker">Legality of Firecracker</label>
                <Dropdown id="legalityOfFirecracker" v-model="form.legalityOfFirecracker" :options="legalityOptions" />
            </div>

            <div class="form-group">
                <label for="liquorIntoxication">Liquor Intoxication</label>
                <RadioButton v-model="form.liquorIntoxication" :options="liquorIntoxicationOptions" />
            </div>

            <div class="form-group">
                <label for="treatmentATS">Treatment Given: ATS/TIG</label>
                <InputText id="treatmentATS" v-model="form.treatmentATS" />
            </div>

            <div class="form-group">
                <label for="treatmentToxoid">Treatment Given: Toxoid</label>
                <InputText id="treatmentToxoid" v-model="form.treatmentToxoid" />
            </div>

            <div class="form-group">
                <label for="treatmentOthers">Treatment Given: Others, Specify</label>
                <InputText id="treatmentOthers" v-model="form.treatmentOthers" />
            </div>

            <div class="form-group">
                <label for="disposition">Disposition</label>
                <RadioButton v-model="form.disposition" :options="dispositionOptions" />
            </div>

            <div class="form-group" v-if="form.disposition === 'Yes'">
                <label for="educationalMaterial">Educational Material Regarding Fireworks</label>
                <CheckboxGroup v-model="form.educationalMaterial" :options="educationalMaterialOptions" />
            </div>

            <div class="form-group">
                <label for="outcome">Is the Patient aware of any health education materials regarding fireworks?</label>
                <RadioButton v-model="form.outcome" :options="outcomeOptions" />
            </div>

            <Button label="Submit" type="submit" icon="pi pi-check" />
        </form>

        <Toast v-if="toastVisible" :severity="toastSeverity" :summary="toastSummary" :detail="toastDetail" />
    </div>
</template>

<style scoped>
/* Add your styles here */
</style>