<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: { type: String },
    value: { type: String },
    label: { type: String },
    desc: { type: String },
    id: { type: String },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false } // new prop
});

const emit = defineEmits(['update:modelValue', 'update:desc']);

const model = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

const desc = computed({
    get() {
        return props?.desc?.toUpperCase();
    },
    set(value) {
        emit('update:desc', value);
    }
});

const isDisabled = computed(() => props.disabled);  
</script>

<template>
    <div
        :class="{
            'bg-green-100 rounded-sm': model === 'Y'
        }"
    >
        <div class="flex align-content-center mt-1">
            <InputSwitch v-model="model" trueValue="Y" falseValue="N" id="inputswitch" :disabled="isDisabled" />
            <label for="inputswitch" :class="{ 'text-black': isDisabled }" class="mx-2 align-self-center font-bold">
                {{ label }}
            </label>
            <div v-if="desc === '' && model == 'Y'">
                <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
            </div>
        </div>

        <div class="flex justify-content-end" v-if="required">
            <small class="text-red-800 text-xs font-bold">Value is required</small>
        </div>
        <span class="p-float-label ml-4" v-if="model == 'Y'">
            <Textarea
                id="inputtext"
                placeholder=""
                rows="1"
                type="text"
                v-model="desc"
                :class="{ 'text-black': isDisabled }"
                class="font-bold max-w-full mt-1 text-xs w-24rem myCSS-inputtext-required"
                autoResize
                :required="model == 'Y'"
                :disabled="isDisabled"
            />
        </span>
    </div>
</template>
