import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import PatientFromEMR from '../views/pages/injury/PatientFromEMR.vue';
import UnfinishedTSSForm from '../components/app/injury/doctorsForm/unfinishedTSSForm.vue';
const List = () => import('@/views/pages/injury/List.vue');
// const Home = () => import('@/views/pages/injury/Home.vue');
const Logs = () => import('@/views/pages/injury/Logs.vue');
const Repair = () => import('@/views/pages/injury/Repair.vue');
const Stats = () => import('@/views/pages/injury/Stats.vue'); 
const NewList = () => import('@/views/pages/injury/newList.vue');

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        // {
        //     path: '/home',
        //     // redirect: '/',
        //     component: AppLayout,
        //     name: 'AppLayout',
        //     children: [
        //         /* BGHMC ROUTES */

        //         {
        //             path: '/home',
        //             name: 'home',
        //             // component: () => import('@/views/pages/injury/List.vue')
        //             component: Home
        //         }
        //     ]
        // },
        {
            path: '/stats',
            name: 'stats',
            component: AppLayout,
            // component: () => import('@/views/pages/injury/List.vue')
            children: [
                /* BGHMC ROUTES */

                {
                    path: '/stats',
                    name: 'stats',
                    // component: () => import('@/views/pages/injury/List.vue')
                    component: Stats
                }
            ]
        },
        {
            path: '/',
            redirect: '/registry',
            name: 'registry',
            component: AppLayout,
            // component: () => import('@/views/pages/injury/List.vue')
            children: [
                /* BGHMC ROUTES */

                {
                    path: '/registry',
                    name: 'registry',
                    // component: () => import('@/views/pages/injury/List.vue')
                    component: List
                }
            ]
        },
        {
            path: '/',
            redirect: '/newregistry',
            name: 'newregistry',
            component: AppLayout,
            // component: () => import('@/views/pages/injury/List.vue')
            children: [
                /* BGHMC ROUTES */

                {
                    path: '/newregistry',
                    name: 'newregistry',
                    // component: () => import('@/views/pages/injury/List.vue')
                    component: NewList
                }
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/unfinished',
            name: 'UnfinishedTSSForm',
            component: UnfinishedTSSForm
        },
        // {
        //     path: '/injury/:enccode',
        //     name: 'injurypatient',
        //     component: () => import('@/views/pages/injury/Patient.vue')
        //     // component: Patient
        // },
        {
            path: '/logs',
            name: 'logs',
            component: AppLayout,
            // component: () => import('@/views/pages/injury/List.vue')
            children: [
                /* BGHMC ROUTES */

                {
                    path: '/logs',
                    name: 'logs',
                    // component: () => import('@/views/pages/injury/List.vue')
                    component: Logs
                }
            ]
        },
        {
            path: '/repair',
            name: 'repair',
            component: AppLayout,
            // component: () => import('@/views/pages/injury/List.vue')
            children: [
                /* BGHMC ROUTES */

                {
                    path: '/repair',
                    name: 'repair',
                    // component: () => import('@/views/pages/injury/List.vue')
                    component: Repair
                }
            ]
        },
        {
            path: '/injury/patientFromEMR',
            name: 'injuryemr',
            component: PatientFromEMR
            // props: (route) => ({ token: route.query.token })
            // props: (route) => ({ token: route.query.access_token, enccode: route.query.enccode, empID: route.query.empID })
        },
        // {
        //     path: '/developer',
        //     name: 'developer',
        //     component: AppLayout,
        //     // component: () => import('@/views/pages/injury/List.vue')
        //     children: [
        //         /* BGHMC ROUTES */

        //         {
        //             path: '/developer',
        //             name: 'developer',
        //             // component: () => import('@/views/pages/injury/List.vue')
        //             component: Dev
        //         }
        //     ]
        // },
        // {
        //     path: '/injury/:enccode',
        //     name: 'injurypatient',
        //     // component: () => import('@/views/pages/injury/Patient.vue')
        //     component: Patient
        // },
        // {
        //     path: '/injuryNoData/:enccode',
        //     name: 'injurypatientemr',
        //     // component: () => import('@/views/pages/injury/Patient.vue')
        //     component: Patient
        // }
    ]
});

export default router;

// {
//     path: '/injury/emr/:enccode',
//     name: 'injuryemr',
//     component: () => import('@/views/pages/injury/PatientFromEMR.vue'),
//     props: (route) => ({ token: route.query.token })
// }
/* BGHMC ROUTES */
// {
//     path: '/auth/access',
//     name: 'accessDenied',
//     component: () => import('@/views/pages/auth/Access.vue')
// },
// {
//     path: '/auth/error',
//     name: 'error',
//     component: () => import('@/views/pages/auth/Error.vue')
// }
// router.beforeEach((to, from, next) => {
//     const isAuthenticated = localStorage.getItem('authToken');

//     // if (to.name !== 'login' && !isAuthenticated) next({ name: 'login' });
//     if (to.name !== 'login' && !isAuthenticated) next({ name: 'login' });
//     if (!isAuthenticated) next({ name: 'login' });

//     if (to.query.access_token) {
//         // Save the token to local storage
//         // console.log('to.query.access_token', to.query.enccode);
//         localStorage.setItem('authToken', to.query.access_token);

//         // Redirect to the desired route
//         next({ path: '/injury/' + to.query.enccode });
//     } else {
//         // Proceed as normal if no access token is found in the query
//         next();
//     }
// });

/*
vue 3 frontend, laravel backend
1.) i want to paste a link to the browser and it will redirect to a loginByID page
https://192.168.7.66:9050/api/loginbyid?empID=000583&enccode=ER619421Nov242023131944
2.) this will initiate a backend authentication
3.) then redirect the user to the intended page along with the auth token and other details
4.) the link above is a backend link
5.) the backend will then redirect the user to the frontend page along with auth token and other details
frontend link: https://192.168.7.66/#/injury/ER619421Nov242023131944
localhost:5173/#/injury/ER619421Nov242023131944?empID=000583
*/

