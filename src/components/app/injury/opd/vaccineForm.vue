<script setup>
import { usePatientStore } from '../../../../store/injury/PatientStore';

import CheckBoxMultiple from '../../../custom/checkBoxMultiple.vue';
const PatientStore = usePatientStore();

const immunizationOption = ['PRIMARY REGIMEN', 'BOOSTER'];
const boosterRegimenOption = ['1-DAY REGIMEN', '2-DAY REGIMEN'];
const findingOption = ['ESSENTIALLY NORMAL PE FINDING', 'WITH FINDINGS'];
const hovering = '';

function handleClick() {
    PatientStore.details.ABTC.immunization_schedule = '';
    PatientStore.details.ABTC.booster_regimen = '';
}
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
        <label for="Tenderness" v-if="PatientStore.details.followUp.finding === 'WITH FINDINGS'" class="text-black text-xs" style="color: #000080; width: 100%"><i>Finding </i></label>
        <Textarea v-if="PatientStore.details.followUp.finding === 'WITH FINDINGS'" v-model="PatientStore.details.followUp.finding_sp" style="width: 100%; font-weight: bold" />
    </div>
    <div class="flex justify-content-center">
        <Fieldset style="width: 98%" pt:content:class="flex" :pt="{ legend: { style: { border: 'none', backgroundColor: 'transparent' } }, toggler: { style: { padding: '1rem' } } }">
            <template #legend>
                <span style="color: #000080" class="flex justify-content-center font-bold white-space-nowrap">Vaccine to be Given ( {{ PatientStore.type_prophylaxis }} ) </span>
                <span style="color: blue; font-size: x-small; cursor: pointer; transition: color 0.3s" @click="handleClick" @mouseover="hovering = true" @mouseleave="hovering = false" :style="{ color: hovering ? 'darkblue' : 'blue' }">
                    {{ PatientStore.details.ABTC.immunization_schedule }}
                </span>
            </template>
            <div v-if="PatientStore.details.ABTC.immunization_schedule === '' && PatientStore.progressionDay !== ('' && null && undefined)">
                <div style="width: 100%">
                    <label for="Finding" class="text-black text-xs" style="color: #000080"><i>Immunization Schedule </i></label>
                    <SelectButton
                        v-model="PatientStore.details.ABTC.immunization_schedule"
                        :options="immunizationOption"
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
            <div v-else>
                <div v-if="PatientStore.details.ABTC.booster_regimen === '' && PatientStore.details.ABTC.immunization_schedule === 'BOOSTER'">
                    <div style="width: 100%">
                        <label for="Finding" class="text-black text-xs" style="color: #000080"><i>Booster Regimen </i></label>
                        <SelectButton
                            v-model="PatientStore.details.ABTC.booster_regimen"
                            :options="boosterRegimenOption"
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
                <div v-else>
                    <div class="grid grid-cols-4 gap-4 flex justify-content-evenly">
                        <CheckBoxMultiple class="justify-content-center" style="width: 13%" v-model="PatientStore.details.ABTC.pvrv" label="PVRV" />
                        <CheckBoxMultiple class="justify-content-center" style="width: 13%" v-model="PatientStore.details.ABTC.pcec" label="PCEC" />
                        <CheckBoxMultiple v-if="PatientStore.type_prophylaxis === 'POST-EXPOSURE'" class="justify-content-center" style="width: 10%" v-model="PatientStore.details.ABTC.hrig" label="HRIG" />
                        <CheckBoxMultiple v-if="PatientStore.type_prophylaxis === 'POST-EXPOSURE'" class="justify-content-center" style="width: 10%" v-model="PatientStore.details.ABTC.erig" label="ERIG" />
                        <CheckBoxMultiple v-if="PatientStore.type_prophylaxis === 'POST-EXPOSURE'" class="justify-content-center" style="width: 10%" v-model="PatientStore.details.ABTC.ats" label="ATS" />
                        <CheckBoxMultiple class="justify-content-center" style="width: 8%" v-model="PatientStore.details.ABTC.tt" label="TT" />
                        <CheckBoxMultiple class="justify-content-center" style="width: 8%" v-model="PatientStore.details.ABTC.vaccine_none" label="NONE" />
                    </div>
                    <div class="grid grid-cols-4 gap-4 justify-content-evenly mt-3">
                        <div style="width: 13%">
                            <Transition name="slide-fade" mode="out-in">
                                <div v-if="PatientStore.details.ABTC.pvrv === 'Y'" style="width: 100%" class="flex justify-content-evenly mb-2">
                                    <CheckBoxMultiple class="flex justify-content-center" style="width: 35%" v-model="PatientStore.details.ABTC.pvrv_site_2" label="2-sites" />
                                    <CheckBoxMultiple class="flex justify-content-center" style="width: 35%" v-model="PatientStore.details.ABTC.pvrv_site_4" label="4-sites" />
                                </div>
                            </Transition>
                        </div>
                        <div style="width: 13%">
                            <Transition name="slide-fade" mode="out-in">
                                <div v-if="PatientStore.details.ABTC.pcec === 'Y'" style="width: 100%" class="flex justify-content-evenly mb-2">
                                    <CheckBoxMultiple class="flex justify-content-center" style="width: 35%" v-model="PatientStore.details.ABTC.pcec_site_2" label="2-sites" />
                                    <CheckBoxMultiple class="flex justify-content-center" style="width: 35%" v-model="PatientStore.details.ABTC.pcec_site_4" label="4-sites" />
                                </div>
                            </Transition>
                        </div>
                        <div style="width: 10%">
                            <Transition name="slide-fade" mode="out-in">
                                <div v-if="PatientStore.details.ABTC.hrig === 'Y'" style="width: 100%" class="flex justify-content-evenly">
                                    <div class="field">
                                        <span class="p-float-label">
                                            <InputNumber type="number" suffix=" mL" :min="0" :max="25" id="hrig" v-model="PatientStore.details.ABTC.hrig_num" />
                                            <label for="hrig">Amount to be Given</label>
                                        </span>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                        <div style="width: 10%">
                            <Transition name="slide-fade" mode="out-in">
                                <div v-if="PatientStore.details.ABTC.erig === 'Y'" style="width: 100%" class="flex justify-content-evenly">
                                    <div class="field">
                                        <span class="p-float-label">
                                            <InputNumber type="number" suffix=" mL" :min="0" :max="25" id="erig" v-model="PatientStore.details.ABTC.erig_num" />
                                            <label for="erig">Amount to be Given</label>
                                        </span>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                        <div style="width: 10%">
                            <Transition name="slide-fade" mode="out-in">
                                <div v-if="PatientStore.details.ABTC.ats === 'Y'" style="width: 100%" class="flex justify-content-evenly">
                                    <div class="field" style="width: 100%">
                                        <span class="p-float-label">
                                            <Dropdown
                                                style="width: 80%"
                                                v-model="PatientStore.details.ABTC.ats_num"
                                                :options="[
                                                    { label: '1500 ui', value: '1500' },
                                                    { label: '3000 ui', value: '3000' },
                                                    { label: '4500 ui', value: '4500' },
                                                    { label: '6000 ui', value: '6000' }
                                                ]"
                                                optionLabel="label"
                                                optionValue="value"
                                            />
                                            <label for="ats">Amount to be Given</label>
                                        </span>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                        <div style="width: 8%"></div>
                        <div style="width: 8%"></div>
                    </div>
                </div>
            </div>
        </Fieldset>
    </div>
</template>
