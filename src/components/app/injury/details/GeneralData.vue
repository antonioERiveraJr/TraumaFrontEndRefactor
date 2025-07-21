<script setup>
// Import necessary modules and components
import { usePatientStore } from '@/store/injury/patientStore';
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import LibraryService from '@/service/LibraryService';
import Textarea from 'primevue/textarea';

// Dynamically import the NOIPOIDOITOI component
const NOIPOIDOITOI = defineAsyncComponent(() => import('@/components/app/injury/details/NOIPOIDOITOI.vue'));

// Initialize the library service and patient store
const libraryService = new LibraryService();
const patientStore = usePatientStore();
const loading = ref(true);

// Compute the subjective field from the patient store
const subjective = computed(() => patientStore.header.subjective || '');

// Lifecycle hook to set loading to false once component is mounted
onMounted(async () => {
    loading.value = false;
});
</script>

<template>
    <div class="card shadow-4 max-h-full h-full opacity-90 w-27">
        <!-- Display loading message if data is still being fetched -->
        <div v-if="loading" class="w-27rem">
            <h4>LOADING...</h4>
        </div>
        <div v-else>
            <!-- Header for general data section -->
            <div class="flex align-content-center justify-content-between">
                <h4 class="my-auto font-bold" style="color: #000080">GENERAL DATA</h4>
            </div>
            <Divider class="my-2" />

            <!-- Hospital Number input -->
            <label for="hpercode" class="p-float-label text-black text-xs" style="color: #3366ff"><i> Hospital Number </i></label>
            <InputText id="hpercode" type="text" :value="patientStore.header.hpercode" class="font-bold mb-2 w-27rem border border-black-500" readonly />

            <!-- Patient Name input -->
            <label for="patname" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Patient Name</i></label>
            <Textarea id="patname" type="text" :value="patientStore.header.patname" autoResize class="font-bold mb-2 w-27rem" cols="21" readonly />

            <Divider class="my-2" />

            <!-- NOIPOIDOITOI component to display subjective data -->
            <NOIPOIDOITOI :text="subjective" class="flex w-27rem" />

            <!-- Objective input field -->
            <label for="objective" class="p-float-label mb-1 font-sans text-black-500 text-xs" style="color: #3366ff"><i>Objective</i></label>
            <Textarea id="objective" type="text" v-model="patientStore.header.objective" autoResize readOnly class="font-bold mb-2 w-27rem text-xs" style="text-transform: uppercase" />

            <Divider class="my-2" />

            <!-- Patient information section -->
            <div class="flex justify-content-between w-27rem">
                <div class="">
                    <label for="patbdate" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Birth Date</i></label>
                    <InputText id="patbdate" type="text" :value="patientStore.header.patbdate" class="font-bold mb-2 w-8rem" readonly />
                </div>
                <div>
                    <label for="patage" class="p-float-label mx-1 font-sans text-black-500 text-xs" style="color: #3366ff"><i>Age</i></label>
                    <InputText id="patage" type="text" :value="patientStore.header.patage" class="font-bold w-auto mb-2 w-9rem mx-1" readonly />
                </div>
                <div>
                    <label for="patsex" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Sex</i></label>
                    <InputText id="patsex" type="text" :value="patientStore.header.patsex" class="font-bold w-auto mb-2 w-9rem" readonly />
                </div>
            </div>

            <!-- Address fields -->
            <label for="bgyname" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Barangay</i></label>
            <InputText id="bgyname" type="text" :value="patientStore.header.bgyname" class="font-bold mb-2 w-27rem" readonly />

            <label for="ctyname" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>City/Municipality</i></label>
            <InputText id="ctyname" type="text" :value="patientStore.header.ctyname" class="font-bold mb-2 w-27rem" readonly />

            <label for="provname" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Province</i></label>
            <InputText id="provname" type="text" :value="patientStore.header.provname" class="font-bold mb-2 w-27rem" readonly />

            <label for="rgname" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Region</i></label>
            <InputText id="rgname" type="text" :value="patientStore.header.regname" class="font-bold mb-2 w-27rem" readonly />

            <!-- Disposition and outcome codes -->
            <div>
                <InputText id="disposition_code" type="text" :value="libraryService.getDispositionCode(patientStore.header.dispcode)" class="font-bold mb-2 w-13rem" readonly />
                <InputText id="outcome_code" type="text" :value="libraryService.getOutcomeCode(patientStore.header.condcode)" class="font-bold mb-2 w-13rem ml-2" readonly />
            </div>

            <!-- Comment input field -->
            <label for="comment" class="p-float-label font-sans text-black-500 text-xs" style="color: #3366ff"><i>Comment</i></label>
            <Textarea style="text-transform: uppercase" id="inPatient.comments" type="text" v-model="patientStore.details.inPatient.comments" placeholder="Comment" autoResize class="font-bold w-27rem" />
        </div>
    </div>
</template>

