<script setup>
import { usePatientStore } from '../../../../store/injury/PatientStore';

// import CheckBoxMultiple from '../../../custom/checkBoxMultiple.vue';
const PatientStore = usePatientStore();

// const immunizationOption = ['PRIMARY REGIMEN', 'BOOSTER'];
// const boosterRegimenOption = ['1-DAY REGIMEN', '2-DAY REGIMEN'];
const findingOption = ['ESSENTIALLY NORMAL PE FINDING', 'WITH FINDINGS'];
const woundDescriptionOptions = ['HEALED', 'DRY', 'OTHERS'];
const positive_negative_option = ['+', '-'];
// const hovering = '';

// function handleClick() {
//     PatientStore.details.ABTC.immunization_schedule = '';
//     PatientStore.details.ABTC.booster_regimen = '';
// }
</script>
<template>
    <div style="width: 98%" class="ml-4">
        <label for="Finding" class="text-black text-xs" style="color: #000080"><i>Finding </i></label>
        <SelectButton
            v-model="PatientStore.details.followUp.finding"
            :options="findingOption"
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
        <Transition>
            <Fieldset
                v-if="PatientStore.details.followUp.finding === 'WITH FINDINGS'"
                style="width: 98%"
                pt:content:class="flex justify-center"
                :pt="{ legend: { style: { border: 'none', backgroundColor: 'transparent' } }, toggler: { style: { padding: '1rem' } } }"
            >
                <template #legend>
                    <span style="color: #000080" class="font-bold white-space-nowrap">Findings Description</span>
                </template>
                <div>
                    <div class="flex justify-content-between" style="width: 100%">
                        <div style="width: 48%">
                            <label for="woundDesc" class="text-black text-xs" style="color: #000080"><i>Wound Description</i></label>
                            <Dropdown style="width: 98%" id="woundDescription" class="font-bold" v-model="PatientStore.details.followUp.wound_description" :options="woundDescriptionOptions" />
                            <div v-if="PatientStore.details.followUp.wound_description === 'OTHERS'">
                                <label for="woundOthDescription" class="text-black text-xs" style="color: #000080"><i>Others</i></label>
                                <Textarea style="width: 98%" id="woundOthDescription" v-model="PatientStore.details.followUp.wound_descriptionOthers" rows="1" class="mt-2 justify-content-center font-bold" autoResize />
                            </div>
                        </div>

                        <div style="width: 48%">
                            <label for="Erythema" class="text-black text-xs" style="color: #000080"><i>Erythema </i></label>
                            <SelectButton
                                v-model="PatientStore.details.followUp.erythema"
                                :options="positive_negative_option"
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
                    </div>

                    <div class="flex justify-content-between" style="width: 100%">
                        <div style="width: 48%">
                            <label for="Tenderness" class="text-black text-xs" style="color: #000080"><i>Tenderness </i></label>
                            <SelectButton
                                v-model="PatientStore.details.followUp.tenderness"
                                :options="positive_negative_option"
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
                        <div style="width: 48%">
                            <label for="Hematoma" class="text-black text-xs" style="color: #000080"><i>Hematoma </i></label>
                            <SelectButton
                                v-model="PatientStore.details.followUp.hematoma"
                                :options="positive_negative_option"
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
                    </div>
                    <div style="width: 100%">
                        <label for="Discharge" class="text-black text-xs" style="color: #000080"><i>Discharge/Bleeding </i></label>
                        <SelectButton
                            v-model="PatientStore.details.followUp.discharge"
                            :options="positive_negative_option"
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
                        <div v-if="PatientStore.details.followUp.discharge === '+'">
                            <label for="Discharge" class="text-black text-xs" style="color: #000080"><i>Discharge/Bleeding Description </i></label>
                            <Textarea v-model="PatientStore.details.followUp.discharge_sp" style="width: 100%; font-weight: bold" />
                        </div>
                    </div>
                    <div style="width: 98%">
                        <label for="Other Pertinent" class="text-black text-xs" style="color: #000080"><i>Other Pertinent </i></label>
                        <Textarea v-model="PatientStore.details.followUp.finding_sp" style="width: 100%; font-weight: bold" />
                    </div>
                </div>
            </Fieldset>
        </Transition>

        <!-- <label for="Tenderness" v-if="PatientStore.details.followUp.finding === 'WITH FINDINGS'" class="text-black text-xs" style="color: #000080; width: 100%"><i>Finding </i></label> -->
        <!-- <Textarea v-if="PatientStore.details.followUp.finding === 'WITH FINDINGS'" v-model="PatientStore.details.followUp.finding_sp" style="width: 100%; font-weight: bold" /> -->
    </div>
    <Fieldset
        style="width: 100%; margin-top: 1%"
        :toggleable="true"
        :collapsed="true"
        :pt="{
            root: { style: { backgroundColor: 'transparent', border: 'none', padding: 'none' } },
            legend: { style: { border: 'none', backgroundColor: 'transparent', textAlign: 'center' } },
            toggler: { style: { padding: '1rem' } }
        }"
    >
        <template #legend>
            <span style="color: #000080" class="font-bold white-space-nowrap">MEDICATION/ANTIBIOTIC</span>
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
            v-model="PatientStore.details.ABTC.medication"
            class="mt-1 justify-content-center"
            autoResize
        />
    </Fieldset>
</template>
