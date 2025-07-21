<script>
import { ref, computed, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import InjuryService from '../../service/InjuryService';
import { useRouter } from 'vue-router';

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
        // const router = useRouter();
        let chartInstance = null;

        const injuryByPreAdmission = computed(() => {
            const counts = {
                abrasion: 0,
                burns: 0,
                avulsion: 0,
                concussion: 0,
                contusion: 0,
                fractureOpen: 0,
                fractureClosed: 0,
                openWound: 0,
                amputation: 0,
                others: 0
            };
            reportData.value.forEach((item) => {
                const injuryDetails = item.details && item.details.natureOfInjury;

                if (injuryDetails) {
                    if (injuryDetails.noi_abrasion === 'Y') counts.abrasion++;
                    if (injuryDetails.noi_burn_r === 'Y') counts.burns++;
                    if (injuryDetails.noi_avulsion === 'Y') counts.avulsion++;
                    if (injuryDetails.noi_concussion === 'Y') counts.concussion++;
                    if (injuryDetails.noi_contusion === 'Y') counts.contusion++;
                    if (injuryDetails.noi_frac_ope === 'Y') counts.fractureOpen++;
                    if (injuryDetails.noi_frac_clo === 'Y') counts.fractureClosed++;
                    if (injuryDetails.noi_owound === 'Y') counts.openWound++;
                    if (injuryDetails.noi_amp === 'Y') counts.amputation++;
                    if (injuryDetails.noi_others === 'Y') counts.others++;
                }
            });

            return counts;
        });

        const generateReport = async () => {
            loading.value = true;
            try {
                const injuryService = new InjuryService();
                const response = await injuryService.reportList(true, props.fromDate.toLocaleDateString('en-US'), props.toDate.toLocaleDateString('en-US'), null);

                // if (response && response.status === 401) {
                //     localStorage.removeItem('authToken');
                //     alert('Session Expired \n Please Login Again');
                //     router.push('/auth/login').then(() => {
                //         window.location.reload();
                //     });
                //     return;
                // }

                reportData.value = response.data;
                loading.value = false;
            } catch (error) {
                console.error('Error fetching report data:', error);
                loading.value = false;
            }
        };

        const createChart = (counts) => {
            const ctx = document.getElementById('preAdmissionChart').getContext('2d');

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
                            label: 'Count of Pre-Admission Injury (Female)',
                            data: Object.values(counts).map((count, index) => {
                                let injuryType = Object.keys(counts)[index];
                                if (injuryType === 'burns') {
                                    injuryType = 'burn_r';
                                } else if (injuryType === 'fractureOpen') {
                                    injuryType = 'frac_ope';
                                } else if (injuryType === 'fractureClosed') {
                                    injuryType = 'frac_clo';
                                } else if (injuryType === 'openWound') {
                                    injuryType = 'owound';
                                } else if (injuryType === 'amputation') {
                                    injuryType = 'amp';
                                }

                                const countForFemale = reportData.value.filter((item) => item.header.patsex === 'F' && item.details && item.details.natureOfInjury[`noi_${injuryType}`] === 'Y').length;

                                // console.log(`Injury Type: ${injuryType}, Female Count: ${countForFemale}`);

                                return countForFemale;
                            }),
                            backgroundColor: backgroundColors[0],
                            borderColor: backgroundColors[0].replace('0.5', '1'),
                            borderWidth: 1
                        },
                        {
                            label: 'Count of Pre-Admission Injury (Female)',
                            data: Object.values(counts).map((count, index) => {
                                let injuryType = Object.keys(counts)[index];
                                if (injuryType === 'burns') {
                                    injuryType = 'burn_r';
                                } else if (injuryType === 'fractureOpen') {
                                    injuryType = 'frac_ope';
                                } else if (injuryType === 'fractureClosed') {
                                    injuryType = 'frac_clo';
                                } else if (injuryType === 'openWound') {
                                    injuryType = 'owound';
                                } else if (injuryType === 'amputation') {
                                    injuryType = 'amp';
                                }

                                const countForFemale = reportData.value.filter((item) => item.header.patsex === 'M' && item.details && item.details.natureOfInjury[`noi_${injuryType}`] === 'Y').length;

                                // console.log(`Injury Type: ${injuryType}, Female Count: ${countForFemale}`);

                                return countForFemale;
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
            createChart(injuryByPreAdmission.value);
        });

        watch(injuryByPreAdmission, (newCounts) => {
            createChart(newCounts);
        });

        watch(
            () => [props.fromDate, props.toDate],
            (newValues) => {
                console.log('From Date changed to:', newValues[0]);
                console.log('To Date changed to:', newValues[1]);
                generateReport();
                createChart(injuryByPreAdmission.value);
            }
        );

        return {
            reportData,
            injuryByPreAdmission,
            loading,
            generateReport
        };
    }
};
</script>

<template>
    <div style="position: relative">
        <canvas id="preAdmissionChart"></canvas>
        <div v-if="loading">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </div>
    </div>
</template>

<style>
.loaders {
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
