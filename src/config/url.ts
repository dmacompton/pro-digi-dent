import development from "./development.json";
import production from "./production.json";

type Config = {
    baseURL: string;
    echo: {
        host: string;
        key: string;
    };
    calendly: {
        orderConsultationExtended: string;
        orderConsultationShort: string;
        consultationShort: string;
        consultationExtended: string;
        trainingSession: string;
        trainingAdvanced: string;
    };
};

export const CONFIG: Config = process.env.NODE_ENV === "production" ? production : development;
