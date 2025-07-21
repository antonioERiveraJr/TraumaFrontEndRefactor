<script>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import InjuryService from '../../service/InjuryService';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
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
        const router = useRouter();
        let isMounted = true;
        const abortController = new AbortController();

        let barChart = null;
        let pieChart = null;
        let preAdmissionPieChart = null;
        let externalCausePieChart = null;

        const listOfNOI = ref(['Bite', 'Burn', 'Chemical Substance', 'Contact with Sharp Objects', 'Drowning', 'Exposure to Forces of Nature', 'Fall', 'Firecracker', 'Vapor', 'Gunshot', 'Hanging', 'Mauling', 'Sexual', 'Others', 'Include']);

        const loadList = async () => {
            loading.value = true;
            try {
                const response = await injuryService.reportList(true, props.fromDate.toLocaleDateString('en-US'), props.toDate.toLocaleDateString('en-US'), null, { signal: abortController.signal });
                if (response && response.status === 200) {
                    reportData.value = response.data;
                } else {
                    throw new Error('Failed to fetch report data');
                }

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
                await nextTick();
                // renderBarChart();
                // renderPieChart();
                createChart(injuryByPreAdmission.value);
                createChartExport(externalCauseCounts.value);
                renderPreAdmissionPieChart();
                renderExternalCausePieChart();
            } catch (error) {
                // console.log('Fetching data interrupted');
                if (toast.value) {
                    toast.value.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Could not fetch report data.',
                        life: 3000
                    });
                }
            } finally {
                loading.value = false;
            }
        };
        onBeforeUnmount(() => {
            isMounted = false;
            abortController.abort();
        });
        const totalInjuries = computed(() => {
            return filteredData.value.length;
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
                if (injrem && injuryCategories['include'].some((keyword) => injrem.includes(keyword))) {
                    // console.log('Injury in include category:', injrem);
                    countInclude.value++;
                }
                // console.log('list:', isInList);

                if (!isInList) {
                    // console.log('Injury not in list:', item.header.injrem);
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

                console.log(`Count for ${label}:`, count);
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
                            backgroundColor: 'rgba(153, 230, 251, 0.2)',
                            borderColor: 'rgba(153, 230, 251, 1)',
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

                console.log(`Count for ${label}:`, count);
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

        const renderPreAdmissionPieChart = () => {
            const ctx = document.getElementById('preAdmissionPieChart').getContext('2d');
            const counts = injuryByPreAdmission.value; // Using the same computed property
            const labels = Object.keys(counts);
            const dataCounts = Object.values(counts);

            preAdmissionPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Pre-Admission Injury Counts',
                            data: dataCounts,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.8)', // Red
                                'rgba(54, 162, 235, 0.8)', // Blue
                                'rgba(255, 206, 86, 0.8)', // Yellow
                                'rgba(75, 192, 192, 0.8)', // Teal
                                'rgba(153, 102, 255, 0.8)', // Purple
                                'rgba(255, 159, 64, 0.8)', // Orange
                                'rgba(201, 203, 207, 0.8)', // Grey
                                'rgba(255, 99, 71, 0.8)', // Tomato
                                'rgba(0, 255, 127, 0.8)', // Spring Green
                                'rgba(255, 0, 0, 0.8)', // Red
                                'rgba(255, 20, 147, 0.8)', // Deep Pink
                                'rgba(128, 0, 128, 0.8)', // Purple
                                'rgba(255, 140, 0, 0.8)' // Dark Orange
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(201, 203, 207, 1)',
                                'rgba(255, 99, 71, 1)',
                                'rgba(0, 255, 127, 1)',
                                'rgba(255, 0, 0, 0.8)', // Red
                                'rgba(255, 20, 147, 1)',
                                'rgba(128, 0, 128, 1)',
                                'rgba(255, 140, 0, 1)'
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
                            text: 'Pre-Admission Injury Pie Chart'
                        }
                    }
                }
            });
        };

        const renderExternalCausePieChart = () => {
            const ctx = document.getElementById('externalCausePieChart').getContext('2d');
            const counts = externalCauseCounts.value;
            const labels = Object.keys(counts);
            const dataCounts = Object.values(counts);

            externalCausePieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'External Cause Counts',
                            data: dataCounts,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.8)', // Red
                                'rgba(54, 162, 235, 0.8)', // Blue
                                'rgba(255, 206, 86, 0.8)', // Yellow
                                'rgba(75, 192, 192, 0.8)', // Teal
                                'rgba(153, 102, 255, 0.8)', // Purple
                                'rgba(255, 159, 64, 0.8)', // Orange
                                'rgba(201, 203, 207, 0.8)', // Grey
                                'rgba(255, 99, 71, 0.8)', // Tomato
                                'rgba(0, 255, 127, 0.8)', // Spring Green
                                'rgba(255, 0, 0, 0.8)', // Red
                                'rgba(255, 20, 147, 0.8)', // Deep Pink
                                'rgba(128, 0, 128, 0.8)', // Purple
                                'rgba(255, 140, 0, 0.8)' // Dark Orange
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(201, 203, 207, 1)',
                                'rgba(255, 99, 71, 1)',
                                'rgba(0, 255, 127, 1)',
                                'rgba(255, 0, 0, 0.8)', // Red
                                'rgba(255, 20, 147, 1)',
                                'rgba(128, 0, 128, 1)',
                                'rgba(255, 140, 0, 1)'
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
                            text: 'External Cause of Injury Pie Chart'
                        }
                    }
                }
            });
        };

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

        let chartInstance = null;
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
                            label: 'Count of Pre-Admission Injury (Male)',
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

                                const countForMale = reportData.value.filter((item) => item.header.patsex === 'M' && item.details && item.details.natureOfInjury[`noi_${injuryType}`] === 'Y').length;

                                // console.log(`Injury Type: ${injuryType}, Female Count: ${countForFemale}`);

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

        let chartInstanceExport;
        const createChartExport = (counts) => {
            const ctx = document.getElementById('externalCauseChart').getContext('2d');

            if (chartInstanceExport) {
                chartInstanceExport.destroy();
            }

            const backgroundColors = ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'];

            chartInstanceExport = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(counts),
                    datasets: [
                        {
                            label: 'Count of External Causes of Injury (Female) ',
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

                                const countForFemales = reportData.value.filter((item) => item.header.patsex === 'F' && item.details && item.details.ExternalCauseOfInjury[`ext_${injuryType}`] === 'Y').length;

                                // console.log(` Female Count: ${countForFemales}`);

                                return countForFemales;
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
                if (preAdmissionPieChart) {
                    preAdmissionPieChart.destroy();
                    preAdmissionPieChart = null; // Reset the reference
                }
                if (externalCausePieChart) {
                    externalCausePieChart.destroy();
                    externalCausePieChart = null;
                }
                // console.log("From Date changed to:", newValues[0]);
                // console.log("To Date changed to:", newValues[1]);
                loadList(); // Reload the data
            }
        );

        return {
            selectedNOI,
            listOfNOI,
            loading,
            createChartExport,
            filteredData,
            pieChart,
            externalCausePieChart,
            preAdmissionPieChart,
            externalCauseCounts,
            injuryByPreAdmission,
            barChart,
            createChart,
            isMounted,
            totalInjuries
        };
    }
};
</script>

<template>
    <div class="flex justify-content-center">
        <strong>
            TOTAL INJURIES: {{ totalInjuries }}
            <span>&nbsp;&nbsp;&nbsp;</span>
            FROM: {{ fromDate.toLocaleDateString('en-US') }}
            <span>&nbsp;&nbsp;&nbsp;</span>
            TO: {{ toDate.toLocaleDateString('en-US') }}
        </strong>
    </div>
    <!-- <div class="flex grid-cols-2 justify-content-center">
        <div class="bord mr-1" style="height: 50%; width:48%;">
            <canvas id="pieChart"></canvas>
           
        </div>
        <div class="bord mr-1" style="height: 50%; width:48%;">
            <canvas id="topListChart"></canvas>
        </div>


    </div> -->

    <div class="flex grid-cols-2 mt-2 justify-content-center">
        <div class="bord mr-1" style="height: 50%; width: 48%">
            <canvas id="preAdmissionChart"></canvas>
        </div>
        <div class="bord mr-1" style="height: 50%; width: 48%">
            <canvas id="externalCauseChart"></canvas>
        </div>
    </div>
    <div v-if="loading" class="spinner" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
        <div class="loader"></div>
    </div>
    <div class="flex grid-cols-2 mt-2 justify-content-center">
        <div class="bord mr-1" style="height: 50%; width: 48%">
            <canvas id="preAdmissionPieChart"></canvas>
        </div>
        <div class="bord mr-1" style="height: 50%; width: 48%">
            <canvas id="externalCausePieChart"></canvas>
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
