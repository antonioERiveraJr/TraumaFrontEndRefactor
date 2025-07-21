<script setup>
import { onMounted, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import InjuryService from '@/service/InjuryService';
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();

const injuryService = new InjuryService();
const productService = new ProductService();

const products = ref(null);
const injuryList = ref(null);
const lineOptions = ref(null);

onMounted(async () => {
    const response = await getInjuryList();
    productService.getProductsSmall().then((data) => (products.value = data));
    injuryList.value = response.data;
});

async function getInjuryList() {
    const response = await injuryService.injuryList();
    return response;
}

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
    <h1>INJURY REGISTRY</h1>
    <router-link to="">LIST</router-link>

    <div class="grid">
        <InjuryList />
    </div>
</template>