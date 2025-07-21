<script setup>
import { computed } from 'vue';
const props = defineProps({
    modelValue: { type: String },
    value: { type: String },
    label: { type: String },
    desc: { type: String },
    id: { type: String },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }, // new prop
    isMultiple: { type: Boolean, default: false, required: false },
    placeholder: { type: String, default: 'Site and Laterality', required: false }
});

const emit = defineEmits(['update:modelValue', 'update:desc', 'update:isMultiple']);
const badgeText = computed(() => (props.isMultiple ? 'multiple.injuries' : 'single.injury'));

const toggleBadge = () => { 
    emit('update:isMultiple', !props.isMultiple); 
};

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
        emit('update:desc', value.toUpperCase());
    }
});

const isDisabled = computed(() => props.disabled);
</script>

<template>
    <div
        :class="{
            'bg-black-100 rounded-sm': model === 'Y'
        }"
    >
        <div class="flex align-content-center mt-1">
            <InputSwitch v-model="model" trueValue="Y" falseValue="N" id="inputswitch" :disabled="isDisabled" />
            <label for="inputswitch" :class="{ 'text-black': isDisabled }" class="mx-2 align-self-center font-bold"> {{ label }} </label>
            <div v-if="desc === '' && model == 'Y'">
                <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
            </div>
        </div> 
        <i v-if="model === 'Y' && !props.isMultiple" v-badge="badgeText" class="flex justify-content-end badge-button" style="font-size: 2rem" @click="toggleBadge" />
        <i v-if="model === 'Y' && props.isMultiple" v-badge.warning="badgeText" class="flex justify-content-end badge-button" style="font-size: 2rem" @click="toggleBadge" />
        <span class="ml-4" v-if="model == 'Y'">
            <Textarea
                id="inputtext"
                :placeholder="props.placeholder"
                type="text"
                v-model="desc"
                :class="{ 'text-black': isDisabled }"
                class="font-bold max-w-full text-xl w-24rem myCSS-inputtext-required mt-2"
                autoResize
                rows="1"
                :duration="{ enter: 5000, leave: 800 }"
                :required="model == 'Y'"
                :disabled="isDisabled"
            />
        </span>
    </div>
</template>

<style>
.badge-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.badge-button:focus {
    outline: none;
    /* Remove focus outline */
}
</style>

