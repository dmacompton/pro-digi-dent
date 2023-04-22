import { mainAPI } from "../helpers/api";

function getSchedule() {
    return mainAPI.get(`/api/schedule/`).then(({ data }) => data);
}

function getScheduleOptions() {
    return mainAPI.get(`/api/schedule/options/`).then(({ data }) => data);
}

function createEvent(data: any) {
    return mainAPI.post(`/api/schedule`, data).then(({ data }) => data);
}

function editEvent({ data, id }: { data: any; id: string }) {
    return mainAPI.patch(`/api/schedule/${id}`, data).then(({ data }) => data);
}

function deleteEvent(id: string) {
    return mainAPI.delete(`/api/schedule/${id}`).then(({ data }) => data);
}

export const scheduleService = {
    getSchedule,
    getScheduleOptions,
    createEvent,
    editEvent,
    deleteEvent
};
