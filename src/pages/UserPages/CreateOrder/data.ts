import { FormState } from "./types";
import { UserData } from "../../../services/admin.service";
import { OrderState } from "../../../services/orders.service";
import moment from "moment";

const INIT_STATE: FormState = {
    doctor_name: "",
    contact_email: "",
    contact_number: "",
    practice_name: "",
    patient_name: "",
    patient_dob: "",
    required_date: "",
    requiredDateNA: false,
    surgeryDateNA: false,
    surgery_date: "",
    type: undefined,
    shipping: {
        practice_name: "",
        address: "",
        phone: "",
        abn: "",
        email: ""
    },
    billing: {
        practice_name: "",
        abn: "",
        address: "",
        phone: "",
        email: ""
    },
    payor: {
        type: undefined,
        hospital_name: "",
        insurance_provider: "",
        insurance_number: ""
    },
    guide: {
        required_for: [],
        type: undefined,
        system_type: undefined,
        restoration_type: undefined,
        implant: "",
        surgical_kit: "",
        immediate_temporization: [],
        bone_reduction: [],
        stabilization_pins: [],
        supply_stabilization_pins: [],
        supply_drill_stabilization_pins: []
    },
    impression_delivery_type: undefined,
    files_delivery: {
        type: undefined,
        link: ""
    },
    implants: [],
    comment: "",
    supply_hard_copy: []
};

// const TEST_STATE: FormState = {
//     doctor_name: "dasda",
//     contact_email: "dmitry.mikhailov@beetroot.com.ua",
//     contact_number: "dasdasd",
//     practice_name: "dsdadjk",
//     patient_name: "John Doe",
//     patient_dob: moment("2022-09-30"),
//     required_date: moment("2022-09-30"),
//     requiredDateNA: false,
//     surgery_date: moment("2022-09-30"),
//     type: ORDER_TYPE.DESIGN,
//     shipping: {
//         practice_name: "d",
//         address: "d",
//         phone: "d",
//         abn: "d",
//         email: "dmitry.mikhailov@beetroot.com.ua"
//     },
//     billing: {
//         practice_name: "d",
//         abn: "d",
//         address: "d",
//         phone: "d",
//         email: "dmacompton@gmail.com"
//     },
//     payor: {
//         type: PAYOR_TYPE.PATIENT,
//         hospital_name: "hospital_name_____string",
//         insurance_provider: "insurance_provider_____string",
//         insurance_number: "insurance_number_____string"
//     },
//     guide: {
//         required_for: ["Maxilla"],
//         type: "1",
//         system_type: "1",
//         restoration_type: "1",
//         implant: "d",
//         surgical_kit: "d",
//         immediate_temporization: ["immediate_temporization"],
//         bone_reduction: ["bone_reduction"]
//     },
//     impression_delivery_type: "1",
//     files_delivery: {
//         type: "1",
//         link: ""
//     },
//     implants: [],
//     comment: ""
// };

export const prepareFormState = (user: UserData | undefined): FormState => {
    if (user === undefined) {
        return INIT_STATE;
    }

    return {
        ...INIT_STATE,
        guide: {
            ...INIT_STATE.guide,
            implant: user.implant_types || "",
            surgical_kit: user.drilling_systems || ""
        },
        doctor_name: user.name || "",
        contact_email: user.email || "",
        contact_number: user.phone || "",
        practice_name: user.practice.name || "",
        shipping: {
            practice_name: user.practice.name || "",
            abn: user.practice.abn || "",
            address: user.practice.address || "",
            phone: user.practice.phone || "",
            email: user.practice.email || ""
        },
        billing: {
            practice_name: user.practice.name || "",
            abn: user.practice.abn || "",
            address: user.practice.address || "",
            phone: user.practice.phone || "",
            email: user.practice.email || ""
        }
    };
};

export const convertDateToMoment = (state: FormState): FormState => {
    return {
        ...state,
        patient_dob: state.patient_dob ? moment(state.patient_dob) : "",
        required_date: state.required_date ? moment(state.required_date) : "",
        surgery_date: state.surgery_date ? moment(state.surgery_date) : ""
    };
};

export const prepareFormStateFromOrderState = (order: OrderState): FormState => {
    return {
        ...order,
        type: order.type,
        payor: {
            ...order.payor,
            type: order.payor.type
        },
        supply_hard_copy: order?.supply_hard_copy ? ["supply_hard_copy"] : [],
        guide: {
            required_for: order.guide?.required_for || [],
            type: order.guide?.type || undefined,
            system_type: order.guide?.system_type || undefined,
            restoration_type: order.guide?.restoration_type || undefined,
            implant: order.guide?.implant || "",
            surgical_kit: order.guide?.surgical_kit || undefined,
            immediate_temporization: order.guide?.immediate_temporization ? ["immediate_temporization"] : [],
            bone_reduction: order.guide?.bone_reduction ? ["bone_reduction"] : [],
            stabilization_pins: order.guide?.stabilization_pins ? ["stabilization_pins"] : [],
            supply_stabilization_pins: order.guide?.supply_stabilization_pins ? ["supply_stabilization_pins"] : [],
            supply_drill_stabilization_pins: order.guide?.supply_drill_stabilization_pins
                ? ["supply_drill_stabilization_pins"]
                : []
        },
        surgeryDateNA: order.surgery_date !== undefined,
        requiredDateNA: order.required_date !== undefined,
        patient_dob: order.patient_dob ? moment(order.patient_dob) : "",
        required_date: order.required_date ? moment(order.required_date) : "",
        surgery_date: order.surgery_date ? moment(order.surgery_date) : "",
        impression_delivery_type: order.impression_delivery_type || undefined,
        files_delivery: {
            ...order.files_delivery,
            type: order.files_delivery.type || undefined
        }
    };
};
