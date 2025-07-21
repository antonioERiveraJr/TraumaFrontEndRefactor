<script setup>
// import { PCard } from 'primevue/card';
defineProps({
    label: String,
    checked: String
});
</script>
<template>
    <div class="grid">
        <!-- <div class="field-checkbox col-12">
            <Checkbox class="col-4" id="binary" v-bind="checked" binary trueValue="Y" falseValue="N" label="label" />
            <label class="col-2" for="binary">{{ label }}</label>
            <InputText class="col-6" v-if="checked == 'Y'" />
        </div>

        {{ label }}
        {{ checked }} -->
        <div class="field-checkbox col-12">
            <div class="flex align-items-center">
                <Checkbox :value="checked" id="chkbox" binary class="mr-2" trueValue="Y" falseValue="N"></Checkbox>
                <label for="chkbox">{{ label }}</label>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
