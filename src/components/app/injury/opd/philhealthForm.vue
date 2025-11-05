<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router'; // Import useRoute

const route = useRoute(); // Use the route object

const formData = ref({
    PhilhealthStatus: '',
    ModeOfAnimalExposure: '',
    BodyPartAffected: '',
    TypeOfAnimal: '',
    PastHistory: '',
    PrimaryImmunization: ''
});

async function fetchFormData(hpercode) {
    try {
        const response = await axios.get('/getABTCPhilhealthForm', {
            params: { Hpercode: hpercode },
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        });
        Object.assign(formData.value, response.data[0]); // Assuming the data structure matches your needs
    } catch (error) {
        console.error('Error fetching form data:', error);
    }
}

async function generatePDF() {
    const hpercode = formData.value.hpercode; // Ensure this is set correctly in your formData
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
    const hpercode = route.query.hpercode; // Get hpercode from URL parameters
    console.log('hpercode: ', hpercode);
    fetchFormData(hpercode);
});
</script>
<template>
    <div>
        <h1>ABTC PhilHealth Form</h1>

        <div>
            <p><strong>Philhealth Status:</strong> {{ formData.PhilhealthStatus }}</p>
            <p><strong>Mode of Animal Exposure:</strong> {{ formData.ModeOfAnimalExposure }}</p>
            <p><strong>Body Part Affected:</strong> {{ formData.BodyPartAffected }}</p>
            <p><strong>Type of Animal:</strong> {{ formData.TypeOfAnimal }}</p>
            <p><strong>Past History:</strong> {{ formData.PastHistory }}</p>
            <p><strong>Primary Immunization:</strong> {{ formData.PrimaryImmunization }}</p>
        </div>

        <button @click="generatePDF">Generate PDF</button>
    </div>
</template>

<style scoped>
/* Add any additional styles for your PDF here */
h1 {
    font-size: 24px;
    margin-bottom: 20px;
}
p {
    font-size: 16px;
    margin: 5px 0;
}
button {
    margin-top: 20px;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
}
</style>
