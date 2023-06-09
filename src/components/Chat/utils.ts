export function timeDifference(t: string | number | Date): string {
    const time = new Date(t);
    const milliseconds = new Date().getTime() - time.getTime();
    const numberEnding = (number: number) => (number > 1 ? "s" : "");
    const number = (num: number) => (num > 9 ? "" + num : "0" + num);
    const getTime = () => {
        let temp = Math.floor(milliseconds / 1000);

        const years = Math.floor(temp / 31536000);
        if (years) {
            const month = number(time.getUTCMonth() + 1);
            const day = number(time.getUTCDate());
            const year = time.getUTCFullYear();
            return `${day}/${month}/${year}`;
        }

        const days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            if (days < 28) {
                return days + " day" + numberEnding(days);
            } else {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const month = months[time.getUTCMonth()];
                const day = number(time.getUTCDate());
                return `${day} ${month}`;
            }
        }

        const hours = Math.floor((temp %= 86400) / 3600);
        if (hours) {
            return `${hours} hour${numberEnding(hours)} ago`;
        }

        const minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            return `${minutes} minute${numberEnding(minutes)} ago`;
        }

        return "a few seconds ago";
    };
    return getTime();
}
