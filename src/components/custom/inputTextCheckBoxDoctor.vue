<script setup>
import { computed, ssrContextKey } from 'vue';
const props = defineProps({
    modelValue: { type: String },
    value: { type: String },
    label: { type: String },
    desc: { type: String },
    id: { type: String },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }, // new prop
    isMultiple: { type: Boolean, default: false, required: false },
    isExternal: { type: Boolean, default: false },
    hint: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'update:desc', 'update:isMultiple']);

// Access isMultiple from props
const badgeText = computed(() => (props.isMultiple ? 'multiple.injuries' : 'single.injury'));

const toggleBadge = () => {
    // Emit the new state of isMultiple
    emit('update:isMultiple', !props.isMultiple);
    // console.log('multi: ', !props.isMultiple);
};

const hints = computed(() => {
    return props.hint;
});
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
        <div v-if="model === 'Y'" style="border: 2px dashed #808080">
            <div v-if="desc === '' && model == 'Y'" class="flex justify-content-end" style="width: 10rem">
                <i v-badge.danger="'Value is Required'" style="font-size: 5rem; width: 98%" />
            </div>
            <div class="flex align-content-center mt-1 ml-1">
                <InputSwitch v-model="model" trueValue="Y" falseValue="N" id="inputswitch" :disabled="isDisabled" />
                <label for="inputswitch" :class="{ 'text-black': isDisabled }" class="mx-2 align-self-center font-bold"> {{ label }} </label>
            </div>
            <!-- <div class="flex justify-content-end" v-if="required">
            <small class="text-red-800 text-xs font-bold">Value is required</small>
        </div> -->
            <div v-if="!props.isExternal">
                <div v-tooltip.topright="'Multiple Injuries?'">
                    <i v-if="model === 'Y' && !props.isMultiple" v-badge="badgeText" class="flex justify-content-end badge-button mr-5" style="font-size: 5rem" @click="toggleBadge" />
                </div>
                <div v-tooltip.topright="'Single Injury?'">
                    <i v-if="model === 'Y' && props.isMultiple" v-badge.warning="badgeText" class="flex justify-content-end badge-button mr-5" style="font-size: 5rem" @click="toggleBadge" />
                </div>
            </div>
            <span class="flex ml-5 mr-5" style="width: 100%" v-if="model == 'Y'">
                <Textarea
                    id="inputtext"
                    :placeholder="hints"
                    type="text"
                    v-model="desc"
                    :class="{ 'text-black': isDisabled, 'bg-green-100': !desc }"
                    class="font-bold max-w-full text-l myCSS-inputtext-required mb-2 mt-2 mr-5"
                    autoResize
                    style="width: 100%"
                    :duration="{ enter: 5000, leave: 800 }"
                    :required="model == 'Y'"
                    :disabled="isDisabled"
                    :rows="1"
                    maxlength="200"
                />
            </span>
        </div>
    </Transition>
</template>

<style>
/* .rainbow-border {
    border: 3px solid transparent;
     border-image: linear-gradient(to right, hsl(30, 56%, 89%), #e8e8af, #96d996, #7171df, #bf8ee2, #c99cdc) 1; 
    border-radius: 3px;
    margin: 5px;
    padding: 3px;
    background-color: #f9f9f9;
} */

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
