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
    isMultiple: { type: Boolean, default: false, required: false }
});

const emit = defineEmits(['update:modelValue', 'update:desc', 'update:isMultiple']);

// Access isMultiple from props
const badgeText = computed(() => (props.isMultiple ? 'multiple.injuries' : 'single.injury'));

const toggleBadge = () => {
    // Emit the new state of isMultiple
    emit('update:isMultiple', !props.isMultiple);
    // console.log('multi: ', !props.isMultiple);
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
    <Transition name="slide-fade" mode="out-in">
        <div
            v-if="model === 'N'"
            :class="{
                'bg-green-100 rounded-sm': model === 'Y'
            }"
        >
            <div class="flex align-content-center mt-1">
                <InputSwitch v-model="model" trueValue="Y" falseValue="N" id="inputswitch" :disabled="isDisabled" />
                <label for="inputswitch" :class="{ 'text-black': isDisabled }" class="mx-2 align-self-center font-bold"> {{ label }} </label>
                <div v-if="desc === '' && model == 'Y'">
                    <small :class="'required-error'" class="text-red-800 text-xs font-bold">Value is required</small>
                </div>
            </div>
            <!-- <div class="flex justify-content-end" v-if="required">
            <small class="text-red-800 text-xs font-bold">Value is required</small>
        </div> -->
            <!-- <i v-if="model === 'Y' && !props.isMultiple" v-badge="badgeText" class="flex justify-content-end badge-button" style="font-size: 2rem" @click="toggleBadge" />
        <i v-if="model === 'Y' && props.isMultiple" v-badge.danger="badgeText" class="flex justify-content-end badge-button" style="font-size: 2rem" @click="toggleBadge" />
        <span class="ml-4" v-if="model == 'Y'">
            <Textarea
                id="inputtext"
                placeholder="Site and Laterality"
                type="text"
                v-model="desc"
                :class="{ 'text-black': isDisabled }"
                class="font-bold max-w-full text-xs myCSS-inputtext-required mt-2"
                autoResize
                style="width: 100%"
                :duration="{ enter: 5000, leave: 800 }"
                :required="model == 'Y'"
                :disabled="isDisabled"
            />
        </span> -->
        </div>
    </Transition>
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
.slide-fade-enter-active {
    transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

.bg::before {
    content: '';
    background: url('@/assets/images/BGHMC.png') no-repeat center center fixed;
    opacity: 0.1;
}
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
