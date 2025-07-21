<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig, contextPath } = useLayout();

const logoUrl = computed(() => {
    return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <!-- <img src="../assets/images/DOH.png" alt="Logo" height="20" class="mr-2" /> -->
        <img src="@/assets/images/DOH.png" alt="Logo" height="20" width="20" class="mr-2" />
        <!-- <img src="../assets/images/BGHMC.png" alt="Logo" height="20" class="mr-2" /> -->
        <img src="@/assets/images/BGHMC.png" alt="Logo" height="20" width="20" class="mr-2" />
        <!-- <img :src="logoUrl" alt="Logo" height="20" class="mr-2" /> -->
        <span class="font-medium ml-2">Powered by IHOMS BGHMC DOH</span>
    </div>
</template>
<style lang="scss" scoped></style>
