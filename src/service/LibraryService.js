// const contextPath = import.meta.env.BASE_URL;
// import libraries from '@/demo/data/libraries.json';
// import { usePatientStore } from '@/store/patientStore';

import axios from 'axios';
export default class LibraryService {

    getStatuses() {
        const statuses = [
            { id: '0', name: 'new' },
            { id: '1', name: 'saved' },
            { id: 'I', name: 'invalid' }
        ];
        return statuses;
    }

    getInjuryIntents() {
        const injuryIntents = [
            {
                inj_intent_code: '01',
                inj_intent_desc: 'Unintentional/Accidental'
            },
            {
                inj_intent_code: '02',
                inj_intent_desc: 'Intentional (Violence)'
            },
            {
                inj_intent_code: '03',
                inj_intent_desc: 'Intentional (Self-inflicted)'
            },
            // {
            //     inj_intent_code: '04',
            //     inj_intent_desc: 'VAWC'
            // },
            {
                inj_intent_code: '99',
                inj_intent_desc: 'Undetermined'
            }
        ];
        // console.log('injuryIntents', injuryIntents);
        return injuryIntents;
    }

    getFirstAidGivens() {
        const firstAidGivens = [
            {
                first_aid_code: 'N',
                first_aid_desc: 'No'
            },
            {
                first_aid_code: 'Y',
                first_aid_desc: 'Yes, Specify'
            },
            {
                first_aid_code: 'U',
                first_aid_desc: 'Unknown'
            }
        ];
        return firstAidGivens;
    }

    getModesOfTransport() {
        const modesOfTransport = [
            {
                mode_code: '',
                mode_desc: ''
            },
            {
                mode_code: '01',
                mode_desc: 'Ambulance'
            },
            {
                mode_code: '03',
                mode_desc: 'Private Vehicle'
            },
            {
                mode_code: '02',
                mode_desc: 'Police Vehicle'
            },
            {
                mode_code: '04',
                mode_desc: 'Others'
            }
        ];
        return modesOfTransport;
    }

    getStatusReaching() {
        const statusReaching = [
            {
                status_code: '',
                status_desc: ''
            },
            {
                status_code: '01',
                status_desc: 'Dead on Arrival'
            },
            {
                status_code: '02',
                status_desc: 'Alive - Unconscious'
            },
            {
                status_code: '03',
                status_desc: 'Alive - Conscious'
            }
        ];
        return statusReaching;
    }

    getPlaces() {
        const place = [
            {
                place_occ_code: '10',
                place_occ_desc: 'Home'
            },
            {
                place_occ_code: '50',
                place_occ_desc: 'Road/Highway'
            },
            {
                place_occ_code: '30',
                place_occ_desc: 'School'
            },
            {
                place_occ_code: '60',
                place_occ_desc: 'Videoke Bars'
            },
            {
                place_occ_code: '70',
                place_occ_desc: 'Workplace'
            },
            {
                place_occ_code: '99',
                place_occ_desc: 'Unknown'
            },
            {
                place_occ_code: '88',
                place_occ_desc: 'Others'
            }
        ];
        return place;
    }

    getActivities() {
        const activities = [
            {
                activity_code: '',
                activity_desc: ''
            },
            {
                activity_code: '30',
                activity_desc: 'Work Related'
            },
            {
                activity_code: '20',
                activity_desc: 'Leisure'
            },
            {
                activity_code: '10',
                activity_desc: 'Sports'
            },
            {
                activity_code: '99',
                activity_desc: 'Unknown'
            },
            {
                activity_code: '88',
                activity_desc: 'Others'
            }
        ];
        return activities;
    }

    getBurnDegreeDetails() {
        const burnDegreeDetails = [
            {
                degree_burn: '1',
                degree_burn_desc: '1st Degree'
            },
            {
                degree_burn: '2',
                degree_burn_desc: '2nd Degree'
            },
            {
                degree_burn: '3',
                degree_burn_desc: '3rd Degree'
            },
            {
                degree_burn: '4',
                degree_burn_desc: '4th Degree'
            }
        ];
        return burnDegreeDetails;
    }
    getBurnDetails() {
        const burnDetails = [
            {
                ref_burn_code: '01',
                ref_burn_desc: 'Heat'
            },
            {
                ref_burn_code: '02',
                ref_burn_desc: 'Fire'
            },
            {
                ref_burn_code: '03',
                ref_burn_desc: 'Electricity'
            },
            {
                ref_burn_code: '04',
                ref_burn_desc: 'Oil'
            },
            {
                ref_burn_code: '05',
                ref_burn_desc: 'Friction'
            },
            {
                ref_burn_code: '06',
                ref_burn_desc: 'Others, specify'
            }
        ];
        return burnDetails;
    }
    getBurnDetailsDoctor() {
        const burnDetailsDoctor = [
            {
                ref_burn_code: '99',
                ref_burn_desc: 'Flame Burn'
            },
            {
                ref_burn_code: '98',
                ref_burn_desc: 'Scald burn'
            },
            {
                ref_burn_code: '97',
                ref_burn_desc: 'Electrical Burn'
            },
            {
                ref_burn_code: '96',
                ref_burn_desc: 'Flash Burn'
            },
            {
                ref_burn_code: '95',
                ref_burn_desc: 'Chemical Burn'
            },
            {
                ref_burn_code: '94',
                ref_burn_desc: 'Blast Injury'
            },
            {
                ref_burn_code: '93',
                ref_burn_desc: 'Contact Burn'
            },
            {
                ref_burn_code: '92',
                ref_burn_desc: 'Others, Specigy'
            },
        ];
        return burnDetailsDoctor;
    }

    getDrowningDetails() {
        const drowningDetails = [
            {
                ref_drowning_cope: '01',
                ref_drowning_desc: 'Sea'
            },
            {
                ref_drowning_cope: '02',
                ref_drowning_desc: 'River'
            },
            {
                ref_drowning_cope: '03',
                ref_drowning_desc: 'Lake'
            },
            {
                ref_drowning_cope: '04',
                ref_drowning_desc: 'Pool'
            },
            {
                ref_drowning_cope: '05',
                ref_drowning_desc: 'Bathtub'
            },
            {
                ref_drowning_cope: '06',
                ref_drowning_desc: 'Others, specify'
            }
        ];
        return drowningDetails;
    }

    getExposureDetails() {
        const exposureDetails = [
            {
                ref_expnature_code: '01',
                ref_expnature_desc: 'Earthquake'
            },
            {
                ref_expnature_code: '02',
                ref_expnature_desc: 'Volcanic eruption'
            },
            {
                ref_expnature_code: '03',
                ref_expnature_desc: 'Typhoon'
            },
            {
                ref_expnature_code: '04',
                ref_expnature_desc: 'Land slide'
            },
            {
                ref_expnature_code: '05',
                ref_expnature_desc: 'Tidle wave'
            },
            {
                ref_expnature_code: '06',
                ref_expnature_desc: 'Flood'
            },
            {
                ref_expnature_code: '07',
                ref_expnature_desc: 'Others, specify'
            }
        ];
        return exposureDetails;
    }

    getFireCrackerDetails() {
        const firecrackerDetails = [
            {
                firecracker_code: '01',
                firecracker_desc: 'Piccolo'
            },
            {
                firecracker_code: '02',
                firecracker_desc: 'Kwitis'
            },
            {
                firecracker_code: '03',
                firecracker_desc: '5-Star'
            },
            {
                firecracker_code: '04',
                firecracker_desc: 'Home-made firecackers'
            },
            {
                firecracker_code: '88',
                firecracker_desc: 'Others, specify'
            }
        ];
        return firecrackerDetails;
    }

    getVehicleTypes() {
        const vehicleTypes = [
            {
                vehicle_type_id: '01',
                vehicle_type_desc: 'Land'
            },
            {
                vehicle_type_id: '02',
                vehicle_type_desc: 'Water'
            },
            {
                vehicle_type_id: '03',
                vehicle_type_desc: 'Air'
            }
        ];
        return vehicleTypes;
    }

    getCollisionTypes() {
        const collisionTypes = [
            {
                ref_veh_acctype_code: '10',
                ref_veh_acctype_desc: 'Collision'
            },
            {
                ref_veh_acctype_code: '20',
                ref_veh_acctype_desc: 'Non-collision'
            }
        ];
        return collisionTypes;
    }

    getPositions() {
        const positions = [
            {
                position_code: '50',
                position_desc: 'Captain'
            },
            {
                position_code: '60',
                position_desc: 'Crew'
            },
            {
                position_code: '20',
                position_desc: 'Driver'
            },
            {
                position_code: '30',
                position_desc: 'Front Passenger'
            },
            {
                position_code: '10',
                position_desc: 'Pedestrian'
            },
            {
                position_code: '40',
                position_desc: 'Pilot'
            },
            {
                position_code: '35',
                position_desc: 'Rear Passenger'
            },
            {
                position_code: '99',
                position_desc: 'Unknown'
            },
            {
                position_code: '88',
                position_desc: 'Others'
            }
        ];
        return positions;
    }

    getLandVehicles() {
        const landVehicles = [
            {
                vehicle_code: '',
                vehicle_desc: ''
            },
            {
                vehicle_code: '50',
                vehicle_desc: 'Bicycle'
            },
            {
                vehicle_code: '30',
                vehicle_desc: 'Bus'
            },
            {
                vehicle_code: '10',
                vehicle_desc: 'Car'
            },
            {
                vehicle_code: '71',
                vehicle_desc: 'Jeepney'
            },
            {
                vehicle_code: '40',
                vehicle_desc: 'Motorcycle'
            },
            {
                vehicle_code: '60',
                vehicle_desc: 'Tricycle'
            },
            {
                vehicle_code: '72',
                vehicle_desc: 'Truck'
            },
            {
                vehicle_code: '73',
                vehicle_desc: 'Van'
            },
            {
                vehicle_code: '99',
                vehicle_desc: 'Unknown'
            },
            {
                vehicle_code: '88',
                vehicle_desc: 'Others'
            },
            {
                vehicle_code: '00',
                vehicle_desc: 'None'
            }
        ];
        return landVehicles;
    }

    getVAWCCases() {
        const vawcCases = [
            {
                findings: "Injuries are non-specific (no obvious pattern or mechanism of injury) but may be consistent with a child's disclosure",
                impression: "Findings noted may be consistent with the child's disclosure",
                inputValue: '0',
            },
            {
                findings: "No injuries found",
                impression: "No evident injury at the time of examination",
                inputValue: '0',
            },
            {
                findings: "Bite marks, fingertips, petechiae, tram line pattern",
                impression: "Findings noted are consistent with (suction marks, fingertip bruises, bite marks etc.)",
                inputValue: '2',
            },
            {
                findings: "Injuries seen on non-accidental areas",
                impression: "Medical evaluation is consistent with physical injuries that are inflicted by non-accidental means",
                inputValue: '0',
            },
            {
                findings: "With pattern or imprint",
                impression: "Injuries sustained are consistent with the imprint of an implement",
                inputValue: '0',
            },
            {
                findings: "Injuries over non-accidental areas, with child disclosure",
                impression: "Findings restricted on (site of the body) may be consistent with the child's disclosure",
                inputValue: '1',
            },
            {
                findings: "Finding sperm/seminal fluid on the child's body; pregnancy",
                impression: "Medical evaluation is diagnostic of sexual contact or sexual abuse",
                inputValue: '0',
            },
            {
                findings: "Acute lacerations/extensive bruising of labia, perihymenal tissues, penis or scrotum",
                impression: "Anogenital findings are indicative of acute trauma to the (specific site) and is highly suggestive of sexual contact or sexual abuse",
                inputValue: '4',
            },
            {
                findings: "Acute lacerations or extensive bruising of the perineum/external genitalia with or without disclosure",
                impression: "Anogenital findings are indicative of acute trauma to the perineum and is highly suggestive of sexual contact or sexual abuse",
                inputValue: '0',
            },
            {
                findings: "Acute. Cleft/notch, contusion, hymenal transection, missing segment of the hymenal tissue",
                impression: "Anogenital findings are indicative of blunt force or penetrating trauma",
                inputValue: '0',
            },
            {
                findings: "Non-acute, cleft/notch between 3 o'clock and 9 o'clock positions",
                impression: "Anogenital findings suggest previous trauma to the hymen",
                inputValue: '0',
            },
            {
                findings: "Fondling with clothes on, oral sex, intracrural intercourse",
                impression: "No evident injury at the time of examination but medical evaluation cannot exclude sexual abuse",
                inputValue: '0',
            },
            {
                findings: "With disclosure but without injuries",
                impression: "No evident injury at the time of examination but medical evaluation cannot exclude sexual abuse",
                inputValue: '0',
            },
            {
                findings: "No injuries/Normal variant",
                impression: "No evident injury at the time of examination",
                inputValue: '0',
            },
            {
                findings: "No injuries but with clear disclosure of sexual abuse",
                impression: "Medical evaluation is diagnostic of sexual contact or sexual abuse",
                inputValue: '0',
            },
            {
                findings: "Perianal lacerations",
                impression: "Anogenital findings are indicative of acute trauma to the anus",
                inputValue: '0',
            },
            {
                findings: "Complete anal dilation with relaxation of both internal and external sphincters in the absence of predisposing factors such as constipation, anesthesia or neuromuscular conditions",
                impression: "Anogenital findings may suggest previous anal penetration",
                inputValue: '0',
            },
            {
                findings: "Finding sperm or seminal fluid pregnancy",
                impression: "The presence of (cite the infection) confirms mucosal contact with infected and infective bodily secretions, due to sexual contact or sexual abuse",
                inputValue: '3',
            },
            {
                findings: "Positive confirmed culture for gonorrhea, syphilis, Trichomonas vaginalis (if the child is older than 1 year old), chlamydia (if child is older than 3 years old), HIV",
                impression: "Medical evaluation is diagnostic of sexual contact or sexual abuse",
                inputValue: '0',
            },
            {
                findings: "Acute trauma to the external genital tissues.",
                impression: "Anogenital findings are indicative of acute trauma to the (specific site) and is highly suggestive of sexual contact or sexual abuse",
                inputValue: '4',
            },
            {
                findings: "Bruising of the labia, perihymenal tissues, penis or scrotum, fresh laceration to the posterior fourchette not involving the hymen.",
                impression: "Anogenital findings are indicative of acute trauma to the external genital tissues.",
                inputValue: '0',
            },
            {
                findings: "Injuries to the labia majora, labia minora, mons pubis, posterior fourchette, clitoris and vestibule",
                impression: "Medical evaluation is diagnostic of sexual contact or sexual abuse",
                inputValue: '0',
            },
        ];
        return vawcCases;

    }

    getBrainInjury() {

        const brainInjury = [
            {
                level_code: '1',
                level_desc: 'Mild'
            },
            {
                level_code: '2',
                level_desc: 'Moderate'
            },
            {
                level_code: '3',
                level_desc: 'Severe'
            },

        ];
        // console.log('brains: ', brainInjury);

        return brainInjury;


    }

    getGCS() {
        const gcs = [
            {
                behavior: '1',
                behavior_desc: 'Eye Opening Response',
                response: 'Spontaneously',
                score: '4',
            },
            {
                behavior: '1',
                behavior_desc: 'Eye Opening Response',
                response: 'To Speech',
                score: '3',
            },
            {
                behavior: '1',
                behavior_desc: 'Eye Opening Response',
                response: 'To Pain',
                score: '2',
            },
            {
                behavior: '1',
                behavior_desc: 'Eye Opening Response',
                response: 'No Response',
                score: '1',
            },
            {
                behavior: '2',
                behavior_desc: 'Best Verbal Response',
                response: 'Oriented to Time, Place, and Person',
                score: '5',
            },
            {
                behavior: '2',
                behavior_desc: 'Best Verbal Response',
                response: 'Confused',
                score: '4',
            },
            {
                behavior: '2',
                behavior_desc: 'Best Verbal Response',
                response: 'Inappropriate Words',
                score: '3',
            },
            {
                behavior: '2',
                behavior_desc: 'Best Verbal Response',
                response: 'Incomprehensible Sounds',
                score: '2',
            },
            {
                behavior: '2',
                behavior_desc: 'Best Verbal Response',
                response: 'No Response',
                score: '1',
            },
            {
                behavior: '3',
                behavior_desc: 'Best Motor Response',
                response: 'Obeys commands',
                score: '6',
            },
            {
                behavior: '3',
                behavior_desc: 'Best Motor Response',
                response: 'Moves to Localized Pain',
                score: '5',
            },
            {
                behavior: '3',
                behavior_desc: 'Best Motor Response',
                response: 'Flexion Withdrawal from Pain',
                score: '4',
            },
            {
                behavior: '3',
                behavior_desc: 'Best Motor Response',
                response: 'Abnormal Flexion (Decorticate)',
                score: '3',
            },
            {
                behavior: '3',
                behavior_desc: 'Best Motor Response',
                response: 'Abnormal Extension (Decerebrate)',
                score: '2',
            },
            {
                behavior: '3',
                behavior_desc: 'Best Motor Response',
                response: 'No Response',
                score: '1',
            },
        ];
        return gcs.map(option => ({
            ...option,
            formattedLabel: `${option.score}: ${option.response}`
        }));
    }

    getPerpetratorRelationships() {
        return [
            { value: '1', label: 'Husband' },
            { value: '2', label: 'Wife' },
            { value: '3', label: 'Brother' },
            { value: '4', label: 'Sister' },
            { value: '5', label: 'Common Law Husband' },
            { value: '6', label: 'Common Law Wife' },
            { value: '7', label: 'Uncle' },
            { value: '8', label: 'Auntie' },
            { value: '9', label: 'Grandfather' },
            { value: '10', label: 'Grandmother' },
            { value: '12', label: 'Boyfriend' },
            { value: '13', label: 'Girlfriend' },
            { value: '14', label: 'Ex-Boyfriend' },
            { value: '15', label: 'Ex-Girlfriend' },
            { value: '16', label: 'Stranger' },
            { value: '17', label: 'Friend' },
            { value: '18', label: 'Ex-Husband' },
            { value: '19', label: 'Ex-Live in Partner' },
            { value: '11', label: 'Others' }, 
        ]; 
    } 
    getAirVehicles() {
        const airVehicles = [
            {
                vehicle_code: '',
                vehicle_desc: ''
            },
            {
                vehicle_code: '11',
                vehicle_desc: 'Airplane'
            },
            {
                vehicle_code: '15',
                vehicle_desc: 'Glider'
            },
            {
                vehicle_code: '12',
                vehicle_desc: 'Helicopter'
            },
            {
                vehicle_code: '14',
                vehicle_desc: 'Hot Air Balloon'
            },
            {
                vehicle_code: '13',
                vehicle_desc: 'Parachute'
            },
            {
                vehicle_code: '00',
                vehicle_desc: 'Unknown'
            },
            {
                vehicle_code: '88',
                vehicle_desc: 'Others'
            }
        ];
        return airVehicles;
    }

    getWaterVehicles() {
        const waterVehicles = [
            {
                vehicle_code: '',
                vehicle_desc: ''
            },
            {
                vehicle_code: '05',
                vehicle_desc: 'Banana Boat'
            },
            {
                vehicle_code: '01',
                vehicle_desc: 'Boat'
            },
            {
                vehicle_code: '04',
                vehicle_desc: 'Ferry'
            },
            {
                vehicle_code: '06',
                vehicle_desc: 'Inflatable Boat'
            },
            {
                vehicle_code: '02',
                vehicle_desc: 'Jetski'
            },
            {
                vehicle_code: '03',
                vehicle_desc: 'Ship'
            },
            {
                vehicle_code: '88',
                vehicle_desc: 'Others'
            },
            {
                vehicle_code: '99',
                vehicle_desc: 'Unknown'
            }
        ];
        return waterVehicles;
    }
    getDispositionCode(code) {
        if (code === 'ABSCN') return 'Absconded';
        if (code === 'ADMIT') return 'Admitted';
        if (code === 'DIEDD') return 'Died';
        if (code === 'HAMAA') return 'HAMAA';
        if (code === 'oth') return 'Others';
        if (code === 'REFAD') return 'Refused Admission';
        if (code === 'TRASH') return 'Sent Home';
        // if (code === 'REFER') return 'Referred';
        if (code === 'REFER') return 'Transferred to other Facility';
        if (code === 'OWC') return 'Out When Called';
        if (code === 'DISCH') return 'Discharged';
        if (code === 'TRANS') return 'Transferred';
        if (code === 'HAMA') return 'Home Against Medical Advise';
        if (code === 'RTAM') return 'Refused Treatment and Management';
        if (code === 'TTOF') return 'Transferred to other Facility';
    }

    getStatusReachings(code) {
        if (code === '01') return 'Dead on Arrival';
        if (code === '02') return 'Alive - Unconscious';
        if (code === '03') return 'Alive - Conscious';
    }
    getOutcomeCode(code) {
        if (code === '10') return 'Improved';
        if (code === '20') return 'Unimproved';
        if (code === '30') return 'Died';
    }

    getActivityCode(code) {
        if (code === '30') return 'Work Related';
        if (code === '20') return 'Leisure';
        if (code === '10') return 'Sports';
        if (code === '99') return 'Unknown';
        if (code === '88') return 'Others';
    }
    getPlaceCode(code) {
        if (code === '10') return 'Home';
        if (code === '50') return 'Road/Highway';
        if (code === '30') return 'School';
        if (code === '60') return 'Videoke Bars';
        if (code === '70') return 'WorkPlace';
        if (code === '99') return 'Unknown';
        if (code === '88') return 'Others';
    }

    getInjuryIntentsCode(code) {
        if (code === '01') return 'Unintentional/Accidental';
        if (code === '02') return 'Intentional (Violence)';
        if (code === '03') return 'Intentional (Self-inflicted';
        if (code === '99') return 'Undetermined';
    }

    getConditionCode(code) {
        if (code === 'IMPRO') return 'Improved';
        if (code === 'ADMIT') return 'Admitted';
        if (code === 'UNIMP') return 'Un-Improved';
        if (code === 'RECOV') return 'Recovered';
        if (code === 'DIEDD') return 'Died';
        if (code === 'DIEMI') return 'Died < 48 hours Autopsied';
        if (code === 'DIEPO') return 'Died > 48 hours Autopsied';
        if (code === 'DIENA') return 'Died < 48 hours Not Autopsied';
        if (code === 'DILNA') return 'Died > 48 hours Not Autopsied';
    }

    // Get nature of injuries
    // Get nature of injuries
    getNatureOfInjuries() {
        return [
            { value: '10', label: 'Fireworks - related' },
            { value: '30', label: 'Fireworks - Ingestion' },
            { value: '40', label: 'GSW - Stray Bullet' },
            { value: '50', label: 'Tetanus' }
        ];
    }

    // Get types of involvement
    getTypesOfInvolvement() {
        return [
            { value: '10', label: 'Active' },
            { value: '20', label: 'Passive' },
            { value: '30', label: 'N/A' }
        ];
    }

    // Get firecracker types
    // Get firecracker types
    getFirecrackerTypes() {
        return [
            { value: '35', label: '15 Balls' },
            { value: '03', label: '5-Star' },
            { value: '28', label: 'Air Bomb' },
            { value: '26', label: 'Atomic Bomb' },
            { value: '90', label: 'Atomic Triangle' },
            { value: '21', label: 'Baby Dynamite' },
            { value: '12', label: 'Baby Rocket' },
            { value: '39', label: 'Bamboo Canon' },
            { value: '22', label: 'Bawang' },
            { value: '43', label: 'Bilong Bilong' },
            { value: '38', label: 'Binladen' },
            { value: '09', label: 'Boga' },
            { value: '54', label: 'Butterfly' },
            { value: '15', label: 'Camara' },
            { value: '33', label: 'Candle Bomb' },
            { value: '94', label: 'Coke-in-can' },
            { value: '24', label: 'Dragon Firecracker' },
            { value: '50', label: 'El Diablo' },
            { value: '20', label: 'Flash Bomb' },
            { value: '08', label: 'Fountain' },
            { value: '96', label: 'Giant Whistle Bomb' },
            { value: '101', label: 'Goodbye Bading' },
            { value: '100', label: 'Goodbye Delima' },
            { value: '102', label: 'Goodbye Napoles' },
            { value: '29', label: 'GoodBye Philippines' },
            { value: '103', label: 'Hello Columbia' },
            { value: '04', label: 'Home-Made Firecrackers' },
            { value: '25', label: 'Judas Belt' },
            { value: '55', label: 'Jumbo Regular and Special' },
            { value: '97', label: 'Kabasi' },
            { value: '27', label: 'Kingkong' },
            { value: '41', label: 'Kome' },
            { value: '02', label: 'Kwitis' },
            { value: '95', label: 'Kwitom' },
            { value: '45', label: 'Kwitom Bomb' },
            { value: '92', label: 'Large Bawang' },
            { value: '105', label: 'Large-Size Judas Belt' },
            { value: '30', label: 'Lolo Thunder' },
            { value: '05', label: 'Luces' },
            { value: '56', label: 'Mabuhay' },
            { value: '34', label: 'Mother Rocker' },
            { value: '89', label: 'Not Applicable' },
            { value: '98', label: 'Other unlabeled or imported firecrackers' },
            { value: '51', label: 'Paper Caps' },
            { value: '01', label: 'Piccolo' },
            { value: '44', label: 'Pill Box' },
            { value: '11', label: 'Piston' },
            { value: '07', label: 'Pla-Pla' },
            { value: '17', label: 'Pop-pop' },
            { value: '52', label: 'Pulling of String' },
            { value: '14', label: 'Rebentador' },
            { value: '19', label: 'Roman Candle' },
            { value: '36', label: 'Sawa' },
            { value: '40', label: 'Sky Rocket' },
            { value: '53', label: 'Small Triangulo' },
            { value: '16', label: 'Sparkler' },
            { value: '31', label: 'Super Bawang' },
            { value: '23', label: 'Super Lolo' },
            { value: '104', label: 'Super Yolanda' },
            { value: '18', label: 'Toy Gun Powder' },
            { value: '10', label: 'Triangle' },
            { value: '57', label: 'Trompilo' },
            { value: '32', label: 'Tuna' },
            { value: '99', label: 'Unknown' },
            { value: '13', label: 'Watusi' },
            { value: '06', label: 'Whistle Bomb' },
            { value: '58', label: 'Whistle Device' }
        ];
    }
    // Get legality of firecracker
    // Get legality of firecracker
    getLegalityOptions() {
        return [
            { value: '1', label: 'Legal' },
            { value: '2', label: 'Illegal' },
            { value: '3', label: 'Not Applicable' } // Added based on context
        ];
    }

    // Get treatment options
    // Get treatment options
    // el_tbl_kontra_paputok_treatment_code{{value}}
    getTreatmentOptions() {
        return [
            { value: '', label: 'ATS/TIG' },
            { value: '2', label: 'Toxoid' },
            { value: '3', label: 'Others, Specify' }
        ];
    }

    // Get disposition options
    // Get disposition options
    getDispositionOptions() {
        return [
            { value: '0', label: 'No' },
            { value: '1', label: 'Yes' }
        ];
    }

    // Get educational material options
    getEducationalMaterialOptions() {
        return [
            { value: '1', label: 'TV' },
            { value: '2', label: 'Newspaper/ Print' }, // Correctly assigned value
            { value: '3', label: 'Radio' },
            { value: '4', label: 'Poster/ Tarpaulin' },
            { value: '5', label: 'Internet/ Social Media' },
            { value: '6', label: 'Health Worker' }
        ];
    }

    // Get outcome options
    // Link it
    getOutcomeOptions() {
        return [
            { value: 'Improved', label: 'Improved' },
            { value: 'Unimproved', label: 'Unimproved' },
            { value: 'Died', label: 'Died' }
        ];
    }

    // Get anatomical locations
    //analoc_{{value}}
    getAnatomicalLocations() {
        return [
            { value: 'Eye', label: 'Eye' },
            { value: 'Head', label: 'Head' },
            { value: 'Neck', label: 'Neck' },
            { value: 'Chest', label: 'Chest' },
            { value: 'Back', label: 'Back' },
            { value: 'Abdomen', label: 'Abdomen' },
            { value: 'Buttocks', label: 'Buttocks' },
            { value: 'Hand', label: 'Hand' },
            { value: 'Forearm/Arm', label: 'Forearm/Arm' },
            { value: 'Pelvic', label: 'Pelvic' },
            { value: 'Thigh', label: 'Thigh' },
            { value: 'Knee', label: 'Knee' },
            { value: 'Legs', label: 'Legs' },
            { value: 'Foot', label: 'Foot' }
        ];
    }
    get;
}

