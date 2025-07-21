<script setup>
import { computed, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const props = defineProps({
    // modelValue: { type: [Array, Boolean] },
    showValue: { type: String },
    // value: { type: [Boolean, Object] },
    value: { type: String },
    label: { type: String },
    desc: { type: String },
    id: { type: String },
    updateDescValue: Function
});
const emit = defineEmits(['update:showValue', 'update:desc']);

const state = reactive({
    desc: props.desc
});

const rules = {
    desc: {
        required: {
            $validator: required,
            $message: 'Description is required',
            $watch: () => show.value
        }
    }
};

const $v = useVuelidate(rules, state);

const show = computed({
    get() {
        return props.showValue;
    },
    set(value) {
        emit('update:showValue', value);
    }
});
const desc = computed({
    get() {
        return props.desc.toUpperCase();
    },
    set(value) {
        emit('update:desc', value);
    }
});
</script>

<template> 
    <div class="mainCard w-max">
        <div class="flex align-content-center mt-1">
            <InputSwitch v-model="show" trueValue="Y" falseValue="N" id="inputswitch" />
            <label for="inputswitch" class="mx-2 align-self-center font-bold"> {{ label }} </label>
        </div>

        <span class="p-float-label ml-4" v-if="show == 'Y'">
            <Textarea id="inputtext" type="text" v-model="desc" class="font-bold max-w-full mt-1 text-xl w-17rem" autoresize :class="{ 'p-invalid': $v.desc.$error }" />
        </span>
    </div> 
</template>

