<script>
import { ref, computed, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import InjuryService from '../../service/InjuryService';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

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
        const reportData = ref([]);
        const loading = ref(false);
        const router = useRouter();
        let chartInstance = null;

        const externalCauseCounts = computed(() => {
            const counts = {
                bites: 0,
                burns: 0,
                chemicals: 0,
                sharpObjects: 0,
                drownings: 0,
                exposures: 0,
                fall: 0,
                firecrackers: 0,
                vape: 0,
                gunshot: 0,
                hanging: 0,
                mauling: 0,
                transportAccidents: 0,
                sexualAssaults: 0,
                others: 0
            };

            reportData.value.forEach((item) => {
                const injuryDetails = item.details && item.details.ExternalCauseOfInjury;

                if (injuryDetails) {
                    if (injuryDetails.ext_bite === 'Y') counts.bites++;
                    if (injuryDetails.ext_burn_r === 'Y') counts.burns++;
                    if (injuryDetails.ext_chem === 'Y') counts.chemicals++;
                    if (injuryDetails.ext_sharp === 'Y') counts.sharpObjects++;
                    if (injuryDetails.ext_drown_r === 'Y') counts.drownings++;
                    if (injuryDetails.ext_expo_nature_r === 'Y') counts.exposures++;
                    if (injuryDetails.ext_fall === 'Y') counts.fall++;
                    if (injuryDetails.ext_firecracker_r === 'Y') counts.firecrackers++;
                    if (injuryDetails.ext_vape === 'Y') counts.vape++;
                    if (injuryDetails.ext_gun === 'Y') counts.gunshot++;
                    if (injuryDetails.ext_hang === 'Y') counts.hanging++;
                    if (injuryDetails.ext_maul === 'Y') counts.mauling++;
                    if (injuryDetails.ext_transport === 'Y') counts.transportAccidents++;
                    if (injuryDetails.ext_sexual === 'Y') counts.sexualAssaults++;
                    if (injuryDetails.ext_other === 'Y') counts.others++;
                }
            });

            return counts;
        });

        const generateReport = async () => {
            loading.value = true;
            try {
                const injuryService = new InjuryService();
                const response = await injuryService.reportList(true, props.fromDate.toLocaleDateString('en-US'), props.toDate.toLocaleDateString('en-US'), null);
                if (response && response.status === 401) {
                    loading.value = false;
                    console.log('401 Unauthorized');
                    localStorage.removeItem('authToken');

                    await Swal.fire({
                        icon: 'warning',
                        title: 'Session Expired',
                        text: 'Please Login Again',
                        confirmButtonText: 'OK'
                    });

                    router.push('/auth/login').then(() => {
                        window.location.reload();
                    });
                    return;
                }

                reportData.value = response.data;
            } catch (error) {
                console.error('Error fetching report data:', error);
            } finally {
                loading.value = false;
            }
        };

        const createChart = (counts) => {
            const ctx = document.getElementById('externalCauseChart').getContext('2d');

            if (chartInstance) {
                chartInstance.destroy();
            }

            const backgroundColors = ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'];

            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(counts),
                    datasets: [
                        {
                            label: 'Count of External Causes of Injury (Female) ',
                            data: Object.values(counts).map((count, index) => {
                                let injuryType = Object.keys(counts)[index];
                                if (injuryType === 'bites') {
                                    injuryType = ' bite';
                                } else if (injuryType === 'burns') {
                                    injuryType = 'burn_r';
                                } else if (injuryType === 'chemicals') {
                                    injuryType = 'chem';
                                } else if (injuryType === 'sharpObjects') {
                                    injuryType = 'sharp';
                                } else if (injuryType === 'drownings') {
                                    injuryType = 'drown_r';
                                } else if (injuryType === 'exposures') {
                                    injuryType = 'expo_nature_r';
                                } else if (injuryType === 'firecrackers') {
                                    injuryType = 'firecracker_r';
                                } else if (injuryType === 'gunshot') {
                                    injuryType = 'gun';
                                } else if (injuryType === 'hanging') {
                                    injuryType = 'hang';
                                } else if (injuryType === 'mauling') {
                                    injuryType = 'maul';
                                } else if (injuryType === 'transportAccidents') {
                                    injuryType = 'transport';
                                } else if (injuryType === 'sexualAssaults') {
                                    injuryType = 'sexual';
                                } else if (injuryType === 'others') {
                                    injuryType = 'other';
                                }

                                const countForFemale = reportData.value.filter((item) => item.header.patsex === 'F' && item.details && item.details.ExternalCauseOfInjury[`ext_${injuryType}`] === 'Y').length;

                                // console.log(`Injury Type: ${injuryType}, Female Count: ${countForFemale}`);

                                return countForFemale;
                            }),
                            backgroundColor: backgroundColors[0],
                            borderColor: backgroundColors[0].replace('0.5', '1'),
                            borderWidth: 1
                        },
                        {
                            label: 'Count of External Causes of Injury (Male)',
                            data: Object.values(counts).map((count, index) => {
                                let injuryType = Object.keys(counts)[index];
                                if (injuryType === 'bites') {
                                    injuryType = 'bite';
                                } else if (injuryType === 'burns') {
                                    injuryType = 'burn_r';
                                } else if (injuryType === 'chemicals') {
                                    injuryType = 'chem';
                                } else if (injuryType === 'sharpObjects') {
                                    injuryType = 'sharp';
                                } else if (injuryType === 'drownings') {
                                    injuryType = 'drown_r';
                                } else if (injuryType === 'exposures') {
                                    injuryType = 'expo_nature_r';
                                } else if (injuryType === 'firecrackers') {
                                    injuryType = 'firecracker_r';
                                } else if (injuryType === 'gunshot') {
                                    injuryType = 'gun';
                                } else if (injuryType === 'hanging') {
                                    injuryType = 'hang';
                                } else if (injuryType === 'mauling') {
                                    injuryType = 'maul';
                                } else if (injuryType === 'transportAccidents') {
                                    injuryType = 'transport';
                                } else if (injuryType === 'sexualAssaults') {
                                    injuryType = 'sexual';
                                } else if (injuryType === 'others') {
                                    injuryType = 'other';
                                }
                                const countForMale = reportData.value.filter((item) => item.header.patsex === 'M' && item.details && item.details.ExternalCauseOfInjury[`ext_${injuryType}`] === 'Y').length;

                                // console.log(`Injury Type: ${injuryType}, Male Count: ${countForMale}`);

                                return countForMale;
                            }),
                            backgroundColor: backgroundColors[1],
                            borderColor: backgroundColors[0].replace('0.5', '1'),
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            stacked: true
                        },
                        y: {
                            beginAtZero: true,
                            stacked: true
                        }
                    }
                }
            });
        };

        onMounted(() => {
            generateReport();
            createChart(externalCauseCounts.value);
        });

        watch(externalCauseCounts, (newCounts) => {
            createChart(newCounts);
        });
        watch(
            () => [props.fromDate, props.toDate],
            (newValues) => {
                console.log('From Date changed to:', newValues[0]);
                console.log('To Date changed to:', newValues[1]);
                generateReport();
                createChart(externalCauseCounts.value);
            }
        );
        return {
            reportData,
            externalCauseCounts,
            loading,
            generateReport
        };
    }
};
</script>

<template>
    <div style="position: relative">
        <canvas id="externalCauseChart"></canvas>
        <div v-if="loading" class="spinner" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
            <div class="loader"></div>
        </div>
    </div>
</template>

<style>
.loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
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
