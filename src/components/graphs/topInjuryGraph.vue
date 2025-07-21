<script>
import { ref, computed, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import InjuryService from '../../service/InjuryService';
import { useToast } from 'primevue/usetoast';

Chart.register(...registerables);
export default {
    props: {
        fromDate: {
            type: Date,
            required: true
        },
        toDate: {
            type: Date,
            required: true
        }
    },
    setup(props) {
        const toast = useToast();
        const injuryService = new InjuryService();
        const reportData = ref([]);
        const loading = ref(false);
        const selectedNOI = ref();

        let barChart = null;
        let pieChart = null;

        // const listOfNOI = ref([
        //     'bite/sting',
        //     'burn/burns',
        //     'Chemical Substance/chemical/chem',
        //     'Contact with sharp objects/sharp',
        //     'Drowning/drown',
        //     'Exposure to Forces of Nature/nature',
        //     'Fall/falls',
        //     'Firecracker/fire',
        //     'Vapor/HTD Product',
        //     'Gunshot/shot/gun',
        //     'Hanging/Strangulation/hang',
        //     'Mauling/Assault/maul/maulin',
        //     'S.A./sexual/SA',
        // 'MVA', 'MVC',
        // 'injury',
        // 'scratch',
        // 'punctured',
        // 'wound',
        // 'needle',
        // 'sharp',
        // 'prick',
        // 'electrocution',
        // 'accident',
        // 'lacerated',
        // 'motorcycle',
        //     'Others/(Specify)/other'
        // ]);

        const listOfNOI = ref(['Bite', 'Burn', 'Chemical Substance', 'Contact with Sharp Objects', 'Drowning', 'Exposure to Forces of Nature', 'Fall', 'Firecracker', 'Vapor', 'Gunshot', 'Hanging', 'Mauling', 'Sexual', 'Others', 'MVA', 'Include']);

        const loadList = async () => {
            loading.value = true;
            try {
                const response = await injuryService.reportList(true, props.fromDate.toLocaleDateString('en-US'), props.toDate.toLocaleDateString('en-US'), null);
                reportData.value = response.data;
                renderBarChart(); // Render charts after data is loaded
                renderPieChart();
            } catch (error) {
                console.error('Error fetching report data:', error);
                toast.value.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Could not fetch report data.',
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
        };
        const totalInjuries = computed(() => {
            return filteredData.value.length; // Count of all filtered injuries
        });
        const countInclude = ref(0);
        const filteredData = computed(() => {
            return reportData.value.map((item) => {
                const injrem = item.header.injrem?.trim().toLowerCase();

                const injuryCategories = {
                    bite: ['bite', 'sting'],
                    burn: ['burn', 'burns'],
                    'chemical substance': ['chemical substance', 'chem', 'chemical'],
                    'contact with sharp objects': ['contact with sharp objects', 'sharp'],
                    drowning: ['drowning', 'drown'],
                    'exposure to forces of nature': ['exposure to forces of nature', 'nature'],
                    fall: ['fall', 'falls'],
                    firecracker: ['firecracker', 'fire'],
                    vapor: ['vapor', 'htd product'],
                    gunshot: ['gunshot', 'shot', 'gun'],
                    hanging: ['hanging', 'strangulation', 'hang'],
                    mauling: ['mauling', 'assault', 'maul', 'maulin', 'mamuling'],
                    sexual: ['s.a.', 'sexual', 'sa'],
                    others: ['other', 'others'],
                    include: [
                        'domestic',
                        'abuse',
                        'fwri',
                        'pa',
                        'va',
                        'laceration',
                        'trauma',
                        'bicycle',
                        'foreign',
                        'bike',
                        'alleged',
                        'motor',
                        'medicolegal',
                        'mva',
                        'mvc',
                        'injury',
                        'scratch',
                        'punctured',
                        'wound',
                        'needle',
                        'sharp',
                        'prick',
                        'electrocution',
                        'accident',
                        'lacerated',
                        'motorcycle'
                    ]
                };
                const isInList = Object.entries(injuryCategories).some(([key, keywords]) => {
                    // console.log('key: ', key);

                    return keywords.some((keyword) => injrem && injrem.includes(keyword));
                });
                // Log the injrem if it falls under the 'include' category
                if (injrem && injuryCategories['include'].some((keyword) => injrem.includes(keyword))) {
                    // console.log('Injury in include category:', injrem);
                    countInclude.value++;
                }
                // console.log('list:', isInList);

                if (!isInList) {
                    console.log('Injury not in list:', item.header.injrem);
                    return {
                        ...item,
                        header: {
                            ...item.header,
                            injrem: 'Others'
                        }
                    };
                }
                return item;
            });
        });
        const renderBarChart = () => {
            const ctx = document.getElementById('topListChart').getContext('2d');
            const labels = listOfNOI.value;
            const dataCounts = labels.map((label) => {
                const count =
                    filteredData.value.filter((item) => {
                        const injrem = item.header.injrem;
                        return injrem && injrem.toLowerCase().includes(label.split('/')[0].toLowerCase());
                    }).length +
                    filteredData.value.filter((item) => {
                        const injrem = item.header.injrem;
                        return injrem && injrem.toLowerCase().includes(label.split('/')[1]?.toLowerCase());
                    }).length;

                console.log(`Count for ${label}:`, count); // Log the count for each label
                return count;
            });

            barChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Number of Reports',
                            data: dataCounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 3
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        y: {
                            beginAtZero: true
                        },
                        x: {
                            beginAtZero: true
                        }
                    }
                }
            });
        };

        const renderPieChart = () => {
            const ctx = document.getElementById('pieChart').getContext('2d');
            const labels = listOfNOI.value;
            const dataCounts = labels.map((label) => {
                const count =
                    filteredData.value.filter((item) => {
                        const injrem = item.header.injrem;
                        return injrem && injrem.toLowerCase().includes(label.split('/')[0].toLowerCase());
                    }).length +
                    filteredData.value.filter((item) => {
                        const injrem = item.header.injrem;
                        return injrem && injrem.toLowerCase().includes(label.split('/')[1]?.toLowerCase());
                    }).length;

                console.log(`Count for ${label}:`, count); // Log the count for each label
                return count;
            });

            pieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Number of Reports',
                            data: dataCounts,
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 99, 132, 0.2)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Pie Chart of Nature of Injury'
                        }
                    }
                }
            });
        };

        onMounted(async () => {
            await loadList();
        });
        watch(
            () => [props.fromDate, props.toDate],
            (newValues) => {
                // Destroy charts only if they exist
                if (pieChart) {
                    pieChart.destroy();
                    pieChart = null; // Reset the reference
                }
                if (barChart) {
                    barChart.destroy();
                    barChart = null; // Reset the reference
                }
                console.log('From Date changed to:', newValues[0]);
                console.log('To Date changed to:', newValues[1]);
                loadList(); // Reload the data
            }
        );

        return {
            selectedNOI,
            listOfNOI,
            loading,
            filteredData,
            pieChart,
            barChart,
            totalInjuries
        };
    }
};
</script>

<template>
    <div class="flex justify-content-center">
        <strong>{{ 'TOTAL INJURIES: ' + totalInjuries }}</strong>
    </div>
    <div class="flex grid-cols-2 justify-content-center">
        <div class="bord mr-1" style="height: 50%; width: 48%">
            <canvas id="pieChart"></canvas>
            <div v-if="loading">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <div class="bord mr-1" style="height: 50%; width: 48%">
            <canvas id="topListChart"></canvas>
        </div>
    </div>
</template>

<style>
.loader {
    border: 8px solid #f3f3f3;
    /* Light grey */
    border-top: 8px solid #3498db;
    /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

.bord {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
