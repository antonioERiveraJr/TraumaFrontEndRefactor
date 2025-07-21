import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

export default function useToastWaitingForFetch(
    { waitingSeverity = 'info', waitingSummary = 'Waiting for response', waitingMessage = 'Please wait...', waitingLife = 0 },
    { successSeverity = 'success', successSummary = 'Success', successMessage = 'Data loaded successfully', successLife = 5000 },
    { errorSeverity = 'error', errorSummary = 'Error', errorMessage = 'Something went wrong', errorLife = 2000 },
    { asyncFunction = null, asyncFunctionParams = [] } = [],
    { willAwait = true } = []
) {
    const toast = useToast();
    const isWaitingForFetch = ref(false);

    const showWaitingToast = () => {
        toast.add({
            severity: waitingSeverity,
            summary: waitingSummary,
            detail: waitingMessage,
            life: waitingLife,
            closable: false
        });
    };

    const showSuccessToast = () => {
        toast.add({
            severity: successSeverity,
            summary: successSummary,
            detail: successMessage,
            life: successLife,
            closable: false
        });
    };

    const showErrorToast = () => {
        toast.add({
            severity: errorSeverity,
            summary: errorSummary,
            detail: errorMessage,
            life: errorLife,
            closable: false
        });
    };

    const hideToast = () => {
        toast.removeAllGroups();
    };

    const fetchData = async () => {
        isWaitingForFetch.value = true;
        showWaitingToast();
        try {
            let response;
            if (willAwait) {
                response = await asyncFunction(...asyncFunctionParams);
            } else {
                response = asyncFunction(...asyncFunctionParams);
            }
            hideToast();
            showSuccessToast();
            return response;
        } catch (error) {
            hideToast();
            showErrorToast();
            throw error; // Re-throw the error to handle it in the calling function if needed
        } finally {
            isWaitingForFetch.value = false;
        }
    };

    return {
        fetchData,
        isWaitingForFetch
    };
}
