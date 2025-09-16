<script setup>
import { usePatientStore } from '../../../../store/injury/PatientStore';
import { ref, watch } from 'vue';

const PatientStore = usePatientStore();
const followUp = PatientStore.details.followUp;

// Create refs for all necessary fields
const complaints = ref(followUp?.complaints);
const adverseReaction = ref(followUp?.adverse_reaction);
const biting = ref(followUp?.biting);
const others = ref(followUp?.others);
const woundDescription = ref(followUp?.wound_description);
const woundDescriptionOthers = ref(followUp?.wound_description_others);
const erythema = ref(followUp?.erythema);
const dischare = ref(followUp?.dischare);
const tenderness = ref(followUp?.tenderness);
const hematoma = ref(followUp?.hematoma);

// Watchers to update the refs when the store changes
watch(
    () => followUp?.complaints,
    (newValue) => {
        complaints.value = newValue;
    }
);
watch(
    () => followUp?.adverse_reaction,
    (newValue) => {
        adverseReaction.value = newValue;
    }
);
watch(
    () => followUp?.biting,
    (newValue) => {
        biting.value = newValue;
    }
);
watch(
    () => followUp?.others,
    (newValue) => {
        others.value = newValue;
    }
);
watch(
    () => followUp?.wound_description,
    (newValue) => {
        woundDescription.value = newValue;
    }
);
watch(
    () => followUp?.wound_description_others,
    (newValue) => {
        woundDescriptionOthers.value = newValue;
    }
);
watch(
    () => followUp?.erythema,
    (newValue) => {
        erythema.value = newValue;
    }
);
watch(
    () => followUp?.dischare,
    (newValue) => {
        dischare.value = newValue;
    }
);
watch(
    () => followUp?.tenderness,
    (newValue) => {
        tenderness.value = newValue;
    }
);
watch(
    () => followUp?.hematoma,
    (newValue) => {
        hematoma.value = newValue;
    }
);

const bitingOptions = ['ALIVE', 'DIED', 'UNKNOWN'];
const woundDescriptionOptions = ['HEALED', 'DRY', 'OTHERS'];
const erythDischOption = ['WITH', 'NO'];
const tendHeptOption = ['+', '-'];
</script>
<template>
    <h5 style="text-align: center; font-weight: bolder; color: #333">FOLLOW-UP FORM DAY {{ PatientStore.progressionDay }}</h5>

    <!-- {{ PatientStore }} -->

    <div style="width: 100%" class="flex justify-content-evenly">
        <Fieldset style="width: 48%" pt:content:class="flex justify-center" :pt="{ legend: { style: { border: 'none', backgroundColor: 'transparent' } }, toggler: { style: { padding: '0rem' } } }">
            <template #legend>
                <span style="color: #000080" class="font-bold white-space-nowrap">Subjective</span>
            </template>

            <div>
                <label for="complaints" class="text-black text-xs" style="color: #000080"><i>complaints </i></label>
                <div>
                    <Textarea style="width: 100%" v-model="complaints" rows="1" class="justify-content-center font-bold" autoResize />
                </div>
            </div>

            <div>
                <label for="Adverse" class="text-black text-xs" style="color: #000080"><i>Adverse reaction from previous vaccination </i></label>
                <div>
                    <Textarea style="width: 100%" v-model="adverseReaction" rows="1" class="justify-content-center font-bold" autoResize />
                </div>
            </div>

            <div style="width: 100%">
                <label for="Biting" class="text-black text-xs" style="color: #000080"><i>Biting </i></label>
                <SelectButton
                    v-model="biting"
                    :options="bitingOptions"
                    aria-labelledby="basic"
                    :pt="{
                        root: {
                            style: { width: '100%' }
                        },
                        button: {
                            style: {
                                width: '33%'
                            }
                        }
                    }"
                />
            </div>

            <div>
                <label for="others" class="text-black text-xs" style="color: #000080"><i>Others</i></label>
                <div>
                    <Textarea style="width: 100%" v-model="others" rows="1" class="justify-content-center font-bold" autoResize />
                </div>
            </div>
        </Fieldset>

        <Fieldset style="width: 48%" pt:content:class="flex justify-center" :pt="{ legend: { style: { border: 'none', backgroundColor: 'transparent' } }, toggler: { style: { padding: '1rem' } } }">
            <template #legend>
                <span style="color: #000080" class="font-bold white-space-nowrap">Objective</span>
            </template>

            <div style="width: 100%">
                <label for="woundDesc" class="text-black text-xs" style="color: #000080"><i>Wound Description</i></label>
                <Dropdown style="width: 98%" id="woundDescription" class="font-bold" v-model="woundDescription" :options="woundDescriptionOptions" />
                <div v-if="woundDescription === 'OTHERS'">
                    <label for="woundOthDescription" class="text-black text-xs" style="color: #000080"><i>Others</i></label>
                    <Textarea style="width: 98%" id="woundOthDescription" v-model="woundDescriptionOthers" rows="1" class="mt-2 justify-content-center font-bold" autoResize />
                </div>
            </div>

            <div style="width: 100%">
                <label for="Erythema" class="text-black text-xs" style="color: #000080"><i>Erythema </i></label>
                <SelectButton
                    v-model="erythema"
                    :options="erythDischOption"
                    aria-labelledby="basic"
                    :pt="{
                        root: {
                            style: { width: '100%' }
                        },
                        button: {
                            style: {
                                width: '49%'
                            }
                        }
                    }"
                />
            </div>

            <div style="width: 100%">
                <label for="Dischare" class="text-black text-xs" style="color: #000080"><i>Discharge </i></label>
                <SelectButton
                    v-model="dischare"
                    :options="erythDischOption"
                    aria-labelledby="basic"
                    :pt="{
                        root: {
                            style: { width: '100%' }
                        },
                        button: {
                            style: {
                                width: '49%'
                            }
                        }
                    }"
                />
            </div>

            <div style="width: 100%">
                <label for="Tenderness" class="text-black text-xs" style="color: #000080"><i>Tenderness </i></label>
                <SelectButton
                    v-model="tenderness"
                    :options="tendHeptOption"
                    aria-labelledby="basic"
                    :pt="{
                        root: {
                            style: { width: '100%' }
                        },
                        button: {
                            style: {
                                width: '49%'
                            }
                        }
                    }"
                />
            </div>

            <div style="width: 100%">
                <label for="Hematoma" class="text-black text-xs" style="color: #000080"><i>Hematoma </i></label>
                <SelectButton
                    v-model="hematoma"
                    :options="tendHeptOption"
                    aria-labelledby="basic"
                    :pt="{
                        root: {
                            style: { width: '100%' }
                        },
                        button: {
                            style: {
                                width: '49%'
                            }
                        }
                    }"
                />
            </div>
        </Fieldset>
    </div>

    <div class="flex justify-content-center mt-3">
        <Fieldset
            style="width: 96%"
            :toggleable="true"
            :collapsed="collapsObjective"
            :pt="{
                root: { style: { backgroundColor: 'transparent', border: 'none', padding: 'none' } },
                legend: { style: { border: 'none', backgroundColor: 'transparent', textAlign: 'center' } },
                toggler: { style: { padding: '1rem' } }
            }"
        >
            <template #legend>
                <span style="color: #000080" class="font-bold white-space-nowrap">Customize Diagnosis</span>
            </template>
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
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }
                    }
                }"
                style="width: 100%"
                v-model="PatientStore.header.doctor_diagnosis"
                class="mt-1 justify-content-center"
                autoResize
            />
        </Fieldset>
    </div>
</template>

<style scoped></style>
