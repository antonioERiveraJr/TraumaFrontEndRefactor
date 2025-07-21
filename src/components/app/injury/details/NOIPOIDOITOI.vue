<script setup>
import InjuryService from '@/service/InjuryService';  
import { onMounted, ref, computed } from 'vue'; 
 
const injuryService = new InjuryService(); 
const props = defineProps({
    text: {
        type: String,
        required: true  
    }
});

// Reactive reference to hold extracted data
var extractNOIPOITOIDOI = ref({
    NOI: null,
    POI: null,
    DOI: null,
    TOI: null
});

// Computed property to determine if all fields are empty
const show = computed(() => {
    return extractNOIPOITOIDOI.value.noi === null && extractNOIPOITOIDOI.value.poi === null && extractNOIPOITOIDOI.value.fdoi === null && extractNOIPOITOIDOI.value.ftoi === null;
});

// Fetch data on component mount
onMounted(async () => {
    extractNOIPOITOIDOI.value = await injuryService.extractNOIPOITOIDOI(props.text);
});
</script>

<template>
    <div class="flex flex-wrap">
        <!-- Subjective label -->
        <label for="subjective" class="p-float-label mb-1 font-sans text-black-500 text-xs" style="color: #3366ff"><i>Subjective</i></label>
        <!-- Display textarea if all extracted values are null -->
        <div v-if="show">
            <Textarea id="subjective" type="text" :value="props.text" autoResize readOnly class="font-bold mb-2 w-27rem text-xs" style="text-transform: uppercase" />
        </div>

        <!-- Display extracted values if available -->
        <div v-else>
            <div class="flex align-items-center">
                <label for="NOI" class="p-float-label w-3rem font-sans text-black-300 text-xs" style="color: #3366ff"><i>NOI:</i></label>
                <InputText id="NOI" v-model="extractNOIPOITOIDOI.noi" readonly class="w-24rem mb-1 font-bold text-xs" style="text-transform: uppercase" />
            </div>
            <div class="flex align-items-center">
                <label for="POI" class="p-float-label w-3rem font-sans text-black-300 text-xs" style="color: #3366ff"><i>POI:</i></label>
                <InputText id="POI" v-model="extractNOIPOITOIDOI.poi" readonly class="w-24rem mb-1 font-bold text-xs" style="text-transform: uppercase" />
            </div>
            <div class="flex align-items-center">
                <label for="DOI" class="p-float-label w-3rem font-sans text-black-300 text-xs" style="color: #3366ff"><i>DOI:</i></label>
                <InputText id="DOI" v-model="extractNOIPOITOIDOI.fdoi" readonly class="w-24rem mb-1 font-bold text-xs" style="text-transform: uppercase" />
            </div>
            <div class="flex align-items-center">
                <label for="TOI" class="p-float-label w-3rem font-sans text-black-300 text-xs" style="color: #3366ff"><i>TOI:</i></label>
                <InputText id="TOI" v-model="extractNOIPOITOIDOI.ftoi" readonly class="w-24rem mb-1 font-bold text-xs" style="text-transform: uppercase" />
            </div>
            <label for="details" class="p-float-label w-4rem font-sans text-black-300 text-xs" style="color: #3366ff"><i>Details:</i></label>
            <Textarea id="details" v-model="extractNOIPOITOIDOI.details" readonly autoResize class="w-27rem mb-1 font-bold text-xs" style="text-transform: uppercase" />
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

