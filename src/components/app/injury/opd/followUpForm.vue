<script setup>
// import { usePatientStore } from '../../../../store/injury/PatientStore';
import { ref } from 'vue';

// const PatientStore = usePatientStore();
const diagnosis = ref();
const bitingOptions = ['alive', 'died'];
const woundDescriptionOptions = ['Healed', 'Dry', 'Others'];
const erythDischOption = ['With', 'No'];
const tendHeptOption = ['+', '-'];
</script>
<template>
    <h5 style="text-align: center; font-weight: bolder; color: #333">FOLLOW-UP FORM</h5>
    <div style="width: 100%" class="flex justify-content-evenly">
        <Fieldset style="width: 48%" pt:content:class="flex justify-center" :pt="{ legend: { style: { border: 'none', backgroundColor: 'transparent' } }, toggler: { style: { padding: '0rem' } } }">
            <template #legend>
                <span style="color: #000080" class="font-bold white-space-nowrap">Subjective</span>
            </template>
            <div>
                <label for="complaints" class="text-black text-xs" style="color: #000080"><i>complaints </i></label>
                <div>
                    <Textarea style="width: 100%" v-model="diagnosis" rows="1" class="justify-content-center" autoResize />
                </div>
            </div>
            <div>
                <label for="Adverse" class="text-black text-xs" style="color: #000080"><i>Adverse reaction from previous vaccination </i></label>
                <div>
                    <Textarea style="width: 100%" v-model="diagnosis" rows="1" class="justify-content-center" autoResize />
                </div>
            </div>
            <div style="width: 100%">
                <label for="Adverse" class="text-black text-xs" style="color: #000080"><i>Biting </i></label>

                <SelectButton
                    v-model="diagnosis"
                    :options="bitingOptions"
                    aria-labelledby="basic"
                    :pt="{
                        root: {
                            style: { width: '100%' }
                        },
                        button: {
                            style: {
                                width: '50%'
                            }
                        }
                    }"
                />
            </div>
            <div>
                <label for="others" class="text-black text-xs" style="color: #000080"><i>Others</i></label>
                <div>
                    <Textarea style="width: 100%" v-model="diagnosis" rows="1" class="justify-content-center" autoResize />
                </div>
            </div>
        </Fieldset>

        <Fieldset style="width: 48%" pt:content:class="flex justify-center" :pt="{ legend: { style: { border: 'none', backgroundColor: 'transparent' } }, toggler: { style: { padding: '1rem' } } }">
            <template #legend>
                <span style="color: #000080" class="font-bold white-space-nowrap">Objective</span>
            </template>
            <div style="width: 100%">
                <label for="woundDesc" class="text-black text-xs" style="color: #000080"><i>Wound Description</i></label>
                <Dropdown style="width: 98%" id="woundDescription" v-model="diagnosis" :options="woundDescriptionOptions" />
                <div v-if="diagnosis === 'Others'">
                    <label for="woundOthDescription" class="text-black text-xs" style="color: #000080"><i>Others</i></label>
                    <Textarea style="width: 98%" id="woundOthDescription" v-model="diagnosis" rows="1" class="mt-2 justify-content-center" auto-resize="" />
                </div>
            </div>
            <div style="width: 100%">
                <label for="Erythema" class="text-black text-xs" style="color: #000080"><i>Erythema </i></label>

                <SelectButton
                    v-model="diagnosis"
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
                <label for="Dischare" class="text-black text-xs" style="color: #000080"><i>Dischare </i></label>

                <SelectButton
                    v-model="diagnosis"
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
                <label for="Tenderazzo" class="text-black text-xs" style="color: #000080"><i>Tenderazzo </i></label>

                <SelectButton
                    v-model="diagnosis"
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
                <label for="Hepatoma" class="text-black text-xs" style="color: #000080"><i>Hepatoma </i></label>

                <SelectButton
                    v-model="diagnosis"
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
                v-model="diagnosis"
                class="mt-1 justify-content-center"
                autoResize
            />
        </Fieldset>
    </div>
</template>

<style scoped></style>
