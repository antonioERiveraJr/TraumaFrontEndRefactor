<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { usePatientStore } from '../../../../store/injury/patientStore';

const patientStore = usePatientStore();

const formData = ref({});

async function fetchFormData(hpercode) {
    try {
        const response = await axios.get('/getABTCPhilhealthForm', {
            params: { Hpercode: hpercode },
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        }); 
        formData.value = response.data[0]; // Assuming the data structure matches your needs
    } catch (error) {
        console.error('Error fetching form data:', error);
    }
}

async function generatePDF() {
    const hpercode = formData.value.hpercode; // Replace with actual logic to get the hpercode
    try {
        const response = await axios.post(
            '/generate-pdf',
            {
                Hpercode: hpercode
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken'),
                    'Content-Type': 'application/json'
                },
                responseType: 'blob' // Important to handle binary data
            }
        );

        // Create a blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ABTC_Philhealth_Form.pdf'); // Specify the file name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

// Fetch data when the component is mounted
onMounted(() => {
    const hpercode = patientStore.header.hpercode; // Replace with actual logic to get the hpercode
    console.log('hpercode: ', hpercode);
    fetchFormData(hpercode);
});
</script>

<template>
    <div>
        <button @click="generatePDF">Generate PDF</button>
        <!-- <div id="pdf-content">
            <h1>PhilHealth ABTC Form</h1>
            <p>Date: {{ formData.DateToday }}</p>
            <h2>Patient Information</h2>
            <p><strong>Name:</strong> {{ formData.PatientName }}</p>
            <p><strong>Date of Birth:</strong> {{ formData.DateOfBirth }}</p>
            <p><strong>Age:</strong> {{ formData.Age }}</p>
            <p><strong>Address:</strong> {{ formData.Address }}</p>

            <h2>Treatment Details</h2>
            <p><strong>Date Treatment Started:</strong> {{ formData.DateTreatmentStarted }}</p>
            <p><strong>Date of Exposure:</strong> {{ formData.DateOfExposure }}</p>
            <p><strong>Past History:</strong> {{ formData.PastHistory }}</p>
            <p><strong>Type of Animal:</strong> {{ formData.TypeOfAnimal }}</p>
            <p><strong>Bite Category:</strong> {{ formData.BiteCategory }}</p>
            <p><strong>Vaccineday:</strong> {{ formData.vaccineday }}</p>
        </div> -->
    </div>
</template>

<style scoped>
/* Add any additional styles for your PDF here */
</style>
