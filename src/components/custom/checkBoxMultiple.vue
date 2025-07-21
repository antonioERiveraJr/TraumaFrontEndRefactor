<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: 'N'
    },
    label: {
        type: String,
        required: true
    },
    id: {
        type: String,
        default: () => 'checkbox-' + Math.random().toString(36).substr(2, 9) // Generate a unique id
    }
});

const emit = defineEmits(['update:modelValue']);

const onChange = (event) => {
    emit('update:modelValue', event.target.checked ? 'Y' : 'N');
};
</script>

<template>
    <div class="checkbox-container">
        <input type="checkbox" :id="id" :checked="modelValue === 'Y'" @change="onChange" class="custom-checkbox" />
        <label :for="id" class="custom-label font-bold">{{ props.label }}</label>
    </div>
</template>

<style scoped>
.checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.custom-checkbox {
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    border: 2px groove #888;
    border-radius: 4px;
    position: relative;
    outline: none;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.custom-checkbox:checked {
    background-color: #888;
    border-color: #888;
}

.custom-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 0.4rem;
    top: 0.2rem;
    width: 0.4rem;
    height: 0.8rem;
    border: solid white;
    border-width: 0 0.2rem 0.2rem 0;
    transform: rotate(45deg);
}

.custom-label {
    margin-left: 0.5rem;
    font-size: 1rem;
    color: #333;
    transition: color 0.3s ease;
}

.custom-label:hover {
    color: #555; /* Darker gray on hover for the label */
}
</style>
