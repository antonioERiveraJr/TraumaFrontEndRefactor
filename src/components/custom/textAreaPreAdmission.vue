`
<script setup>
import { computed } from 'vue';
const props = defineProps({
    modelValue: { type: String },
    value: { type: String },
    label: { type: String },
    desc: { type: String },
    id: { type: String },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    isMultiple: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'update:desc', 'update:isMultiple']);

// Access isMultiple from props
const badgeText = computed(() => (props.isMultiple ? 'multiple.injuries' : 'single.injury'));

const toggleBadge = () => {
    // Emit the new state of isMultiple
    emit('update:isMultiple', !props.isMultiple);
    // console.log('multi: ', !props.isMultiple);
};

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
    <div class="mainCard w-max">
        <span>
            <i v-if="!props.isMultiple" v-badge="badgeText" class="flex justify-content-end badge-button" style="font-size: 2rem" @click="toggleBadge" />
            <i v-else v-badge.danger="badgeText" class="flex justify-content-end badge-button" style="font-size: 2rem" @click="toggleBadge" />

            <Textarea
                id="inputtext"
                placeholder="Site and Laterality"
                type="text"
                v-model="desc"
                :class="{ 'text-black': isDisabled, 'p-inputtext-filled max-w-full mt-1 w-24rem myCSS-inputtext-required text-xs font-bold': true, 'bg-green-100': desc === '' }"
                class="font-bold max-w-full mt-1 text-xs w-24rem myCSS-inputtext-required"
                autoResize
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
    outline: none; /* Remove focus outline */
}
</style>
`
