<script setup>
import { ref } from 'vue';

const isUnderMaintenance = ref(true);
</script>
<template>
    <div>
        <div v-if="isUnderMaintenance" class="maintenance-message">
            <h2>Under Maintenance</h2>
            <p>The LOG section is currently undergoing maintenance. Please check back later.</p>
        </div> 
    </div>
</template>

<style>
.maintenance-message {
    text-align: center;
    padding: 20px;
    background-color: #f9c2c2;
    color: #d9534f;
}
</style>
