import cloneDeep from 'lodash.clonedeep';

export default function resetStore({ store }) {
    // console.log('reset store' + store);
    const initialState = cloneDeep(store.$state);
    store.$reset = () => store.$patch(cloneDeep(initialState));
}

// store.js

// import { defineStore } from 'pinia';
// import cloneDeep from 'lodash.clonedeep';

// export const useMyStore = defineStore({
//     id: 'mystore',
//     state: () => ({
//         count: 0
//         // other state properties...
//     }),
//     actions: {
//         // your actions...
//     }
// });

// // Create an instance of the store and capture the initial state.
// const store = useMyStore();
// const initialState = cloneDeep(store.$state);

// // Add the $reset method.
// store.$reset = () => store.$patch(cloneDeep(initialState));

// // Export the store.
// export default store;
