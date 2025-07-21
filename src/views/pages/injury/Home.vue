<script> 
import { ref, watch } from 'vue';
import Calendar from 'primevue/calendar';
import HomeGraph from '../../../components/graphs/homeGraph.vue';

export default {
    components: { 
        HomeGraph,
        Calendar,
    },
    setup() {
        const position = ref('topright');
        const visible = ref(false);

        const toDate = ref(new Date());
        const fromDate = ref(new Date(new Date().setDate(new Date().getDate() - 7)));

        const openPosition = (pos) => {
            position.value = pos;
            visible.value = true;
        }

        const submitDates = () => { 
            visible.value = false;
        }

        return {
            openPosition,
            visible,
            position,
            fromDate,
            toDate,
            Calendar,
            submitDates,
        }
    },
}
</script>

<template>
    <div>
        <div class="flex bord mx-3 justify-content-center">
            <div class="m-3" style="height: 50%; width:100%;">
                <HomeGraph :fromDate="fromDate" :toDate="toDate" />
            </div>
            <div class="calendar-icon-wrapper" label="TopRight" @click="openPosition('topright')">
                <i class="pi pi-calendar"></i>
            </div> 
        </div>

        <Dialog v-model:visible="visible" header="Choose Date" :style="{ width: '25rem' }" :position="position"
            :modal="true" :draggable="false">
            <div class="flex bord flex-column align-items-start">
                <label class="flex justify-content-start" for="from-calendar"><strong>From:</strong></label>
                <Calendar v-model="fromDate" id="from-calendar" placeholder="Select a date" />

                <label class="flex justify-content-start" for="to-calendar"><strong>To:</strong></label>
                <Calendar v-model="toDate" id="to-calendar" placeholder="Select a date" />

                <div class="flex justify-end gap-2 mt-4">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button type="button" label="Submit" @click="submitDates">Submit</Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.bord {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
}

.calendar-icon-wrapper {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #99e6fb;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: background-color 0.3s;
    top: 30px;
    right: 10px;
}

.calendar-icon-wrapper:hover {
    background-color: #e0e0e0;
}
</style>