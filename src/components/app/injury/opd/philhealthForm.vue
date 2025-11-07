<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router'; // Import useRoute

import CheckBoxMultiple from '../../../custom/checkBoxMultiple.vue';

const route = useRoute(); // Use the route object
const allowDownload = ref(false);
const formData = ref({});
const hpercode = ref(route.query.hpercode);
let blobUrl = null;

// Create a computed property for the iframe source
const iframeSrc = computed(() => {
    if (bladeContent.value) {
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
        }
        const blob = new Blob([bladeContent.value], { type: 'text/html' });
        blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    }
    return null;
});

const membershipStatusOptions = ['Membership', 'Dependent'];
// const pdfUrl = ref(null);
// Options for dropdowns
const bodyPartOptions = ['Head and/or Neck', 'Other Parts of the Body', 'NA (if by Ingestion Mode)'];
const animalTypeOptions = ['Dog', 'Cat', 'Others'];
const historyOptions = ['No', 'Yes'];
const immunizationOptions = ['Yes', 'No'];
const formFields = ref({
    membershipStatus: '',
    unCoveredSkin: '',
    woundedSkin: '',
    abrasion: '',
    transdermalBite: '',
    handlingIngestion: '',
    anyCombination: '',
    exposedBody: '',
    animalType: '',
    animalType_other: '',
    biteHistory: '',
    biteHistory_specify: '',
    completeImmunization: ''
});

async function fetchFormData(hpercode) {
    try {
        const response = await axios.get('/getABTCPhilhealthForm', {
            params: { Hpercode: hpercode },
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        });

        formData.value = response.data[0];
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('401 Unauthorized');
            localStorage.removeItem('authToken');

            const fullUrl = window.location.href;
            const matchEmpID = fullUrl.match(/[?&]employeeid=([^&#]*)/);
            const empID = matchEmpID ? matchEmpID[1] : null;

            if (empID && hpercode) {
                // console.log('empID: ',empID, 'hpercode: ', );

                window.location.href = `http://192.168.6.58:8010/#/loginABTCPhilhealth?hpercode=${hpercode}&employeeid=${empID}`;
            } else {
                console.error('empID or hpercode is missing in the URL');
            }
        } else {
            console.error('Error fetching form data:', error);
        }
    }
}

async function generatePDF() {
    const hpercode = formData.value.hpercode;
    const clonedFormFields = { ...formFields.value };
    try {
        const response = await axios.post(
            '/generate-pdf',
            {
                Hpercode: hpercode,
                formFields: clonedFormFields
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken'),
                    'Content-Type': 'application/json'
                },
                responseType: 'blob'
            }
        );
        console.log('response: ', response);

        const url = window.URL.createObjectURL(new Blob([response.data]));
        // console.log('pdfUrl: ', url);
        // pdfUrl.value = '192.168.6.58:8010/api/generate-pdf';
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ABTC_Philhealth_Form.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        fetchBladeContent();
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}
const bladeContent = ref('');

// const fetchBladeContent = async () => {
//     try {
//         const response = await axios.post(
//             `/previewPDF`,
//             { hpercode: hpercode.value },
//             {
//                 headers: {
//                     Authorization: 'Bearer ' + localStorage.getItem('authToken'),
//                     'Content-Type': 'application/json'
//                 },
//                 responseType: 'text'
//             }
//         );
//         bladeContent.value = response.data; // Store the HTML content

//         // Trigger download of the preview as PDF
//         await downloadPreviewAsPDF(response.data);
//     } catch (error) {
//         console.error('Error fetching blade view:', error);
//     }
// };

// Function to download the preview as PDF
// const downloadPreviewAsPDF = async (htmlContent) => {
//     try {
//         const response = await axios.post(
//             '/generatePreviewPDF', // This should match your backend route
//             { html: htmlContent },
//             {
//                 headers: {
//                     Authorization: 'Bearer ' + localStorage.getItem('authToken'),
//                     'Content-Type': 'application/json'
//                 },
//                 responseType: 'blob' // Expecting a PDF file
//             }
//         );

//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'Preview_ABTC_Philhealth_Form.pdf');
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//     } catch (error) {
//         console.error('Error downloading preview as PDF:', error);
//     }
// };
const fetchBladeContent = async () => {
    const clonedFormFields = { ...formFields.value };
    try {
        const response = await axios.post(
            `/previewPDF`,
            {
                hpercode: hpercode.value,
                formFields: clonedFormFields
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken'),
                    'Content-Type': 'application/json'
                },
                responseType: 'text'
            }
        );
        bladeContent.value = response.data; // Store the HTML content

        // Trigger download of the preview as PDF
    } catch (error) {
        console.error('Error fetching blade view:', error);
    }
};
// Clean up the blob URL when the component is unmounted
onBeforeUnmount(() => {
    if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
    }
});

// Fetch data when the component is mounted
onMounted(() => {
    const fullUrl = window.location.href;
    const match3 = fullUrl.match(/[?&]access_token=([^&#]*)/);
    const match2 = fullUrl.match(/[?&]employeeid=([^&#]*)/);
    const empID = match2 ? match2[1] : null;
    const getToken = match3 ? match3[1] : null;

    if (localStorage.getItem('hpercode') === hpercode.value) {
        if (!localStorage.getItem('hpercode')) {
            localStorage.setItem('authToken', getToken);
            localStorage.setItem('employeeid', empID);
            localStorage.setItem('hpercode', hpercode.value);
        } else if (!localStorage.getItem('authToken')) {
            localStorage.setItem('authToken', getToken);
        } else {
            localStorage.setItem('authToken', getToken);
            localStorage.setItem('employeeid', empID);
            localStorage.setItem('hpercode', hpercode.value);
        }
    } else {
        localStorage.setItem('authToken', getToken);
        localStorage.setItem('employeeid', empID);
        localStorage.setItem('hpercode', hpercode.value);
    }

    console.log('hpercode: ', hpercode.value);

    fetchFormData(hpercode.value);
});
</script>
<template>
    <Splitter layout="horizontal" style="height: 99vh" class="flex">
        <SplitterPanel :size="20">
            <!-- <iframeSrc v-if="iframeSrc" :src="iframeSrc" style="width: 100%; height: 100%" frameborder="5" /> -->

            <h4 class="flex justify-content-center font-bold">Animal Bite Treatment Record</h4>

            <label class="p-float-label text-black text-s mt-5" style="color: black"><i> Membership Status </i></label>
            <Dropdown style="width: 90%" class="ml-5" v-model="formFields.membershipStatus" placeholder="Membership Status" :options="membershipStatusOptions" />

            <label class="p-float-label text-black text-s mt-3" style="color: black"><i> Mode of Animal Exposure </i></label>

            <div class="ml-5">
                <CheckBoxMultiple v-model="formFields.unCoveredSkin" label="Nibbling/Licking of Uncovered Skin" />
                <CheckBoxMultiple v-model="formFields.woundedSkin" label="Nibbling/Licking of Wounded/Broken Skin" />
                <CheckBoxMultiple v-model="formFields.abrasion" label="Scratch/Abrasion" />
                <CheckBoxMultiple v-model="formFields.transdermalBite" label="Transdermal Bite" />
                <CheckBoxMultiple v-model="formFields.handlingIngestion" label="Handling/Ingestion of Raw Infected Meat" />
                <CheckBoxMultiple v-model="formFields.anyCombination" label="Any Combination of the Above" />
            </div>

            <label class="p-float-label text-black text-s mt-3" style="color: black"><i> Body Part Affected/Exposed to Animal </i></label>
            <Dropdown style="width: 90%" class="ml-5" v-model="formFields.exposedBody" placeholder="Select Body Part" :options="bodyPartOptions" multiple />

            <label class="p-float-label text-black text-s mt-3" style="color: black"><i> Type of Animal </i></label>
            <Dropdown style="width: 90%" class="ml-5" v-model="formFields.animalType" placeholder="Select Type of Animal" :options="animalTypeOptions" multiple />
            <Textarea v-if="formFields.animalType === 'Others'" style="width: 90%" class="mt-1 ml-5" v-model="formFields.animalType_other" placeholder="Specify" />

            <label class="p-float-label text-black text-s mt-3" style="color: black"><i> Past History of Animal Bite </i></label>
            <Dropdown style="width: 90%" class="ml-5" v-model="formFields.biteHistory" placeholder="Select History" :options="historyOptions" multiple />
            <Textarea v-if="formFields.biteHistory === 'Yes'" style="width: 90%" class="mt-1 ml-5" v-model="formFields.biteHistory_specify" placeholder="Specify" />

            <label class="p-float-label text-black text-s mt-3" style="color: black"><i> Was the PEP Primary Immunization Schedule Complete? </i></label>
            <Dropdown style="width: 90%" class="ml-5" v-model="formFields.completeImmunization" placeholder="Select Answer" :options="immunizationOptions" multiple />

            <Button style="width: 90%" class="ml-5 mt-5" :disable="allowDownload" severity="info" icon="pi pi-download" label="Generate PDF" @click="generatePDF" />
        </SplitterPanel>
        <SplitterPanel :size="80">
            <!-- <iframe v-if="pdfUrl" :src="pdfUrl" style="width: 100%; height: 100%" frameborder="0" /> -->
            <!-- <p v-else>No PDF generated yet. Please generate a PDF.</p> -->
            <iframe v-if="iframeSrc" :src="iframeSrc" style="width: 100%; height: 100%" frameborder="5" />
        </SplitterPanel>
    </Splitter>
</template>
<style scoped></style>
