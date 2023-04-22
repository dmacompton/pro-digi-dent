import { Moment } from "moment";
import { ORDER_TYPE } from "../../../components/OrderLabel/OrderLabel";
import { PAYOR_TYPE } from "./Step1";

export type ImplantData = {
    site: number;
    diameter: number;
    length: number;
    raised_flap: boolean;
    immediate_placement: boolean;
    sinus_lift: boolean;
    bone_graft: boolean;
};

export type PayorData = {
    type: PAYOR_TYPE | undefined;
    hospital_name?: string;
    insurance_provider?: string;
    insurance_number?: string;
};
export type BillingData = {
    practice_name: string;
    abn: string;
    address: string;
    phone: string;
    email: string;
};

export type ShippingData = {
    practice_name: string;
    address: string;
    phone: string;
    abn: string;
    email: string;
};

export type ContentGuideState = {
    required_for: string[];
    type: number | undefined;
    system_type: number | undefined;
    restoration_type: number | undefined;
    implant: string;
    surgical_kit?: string;
    immediate_temporization: boolean;
    bone_reduction: boolean;
    stabilization_pins: boolean;
    supply_stabilization_pins: boolean;
    supply_drill_stabilization_pins: string;
};

export type ContentState = {
    type: ORDER_TYPE | undefined;
    doctor_name: string;
    contact_email: string;
    contact_number: string;
    practice_name: string;
    patient_name: string;
    patient_dob: string | undefined; // date "2014-01-01"
    required_date: string | undefined; // date
    surgery_date: string | undefined; // date
    comment: string;
    shipping: ShippingData;
    billing: BillingData;
    payor: PayorData;
    guide: ContentGuideState | undefined;
    impression_delivery_type: number | undefined;
    files_delivery: { type: number | undefined; link: string | null };
    implants: ImplantData[];
    supply_hard_copy: boolean;
};

export type FormState = Omit<
    ContentState,
    "guide" | "patient_dob" | "required_date" | "surgery_date" | "supply_hard_copy"
> & {
    requiredDateNA: boolean;
    surgeryDateNA: boolean;
    patient_dob: Moment | string;
    required_date: Moment | string;
    surgery_date: Moment | string;
    guide: Omit<
        ContentGuideState,
        | "immediate_temporization"
        | "bone_reduction"
        | "stabilization_pins"
        | "supply_stabilization_pins"
        | "supply_drill_stabilization_pins"
    > & {
        immediate_temporization: string[];
        bone_reduction: string[];
        stabilization_pins: string[];
        supply_stabilization_pins: string[];
        supply_drill_stabilization_pins: string[];
    };
    supply_hard_copy: string[];
};

export type ContentProps = {
    showPrev: boolean;
    hideNext: boolean;
    onClickNext: () => void;
    onClickPrev: () => void;
    state: FormState;
    setState: (state: FormState) => void;
    disabled: boolean;
};
