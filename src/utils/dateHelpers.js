import { ApiError } from "./ApiError.js";

const getMidnightTime = (x) => {
    if(!x) {
        return null
    }
    const date = new Date(x);
    date.setHours(0, 0, 0, 0);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localMidnight = new Date(date.getTime() - timezoneOffset);
    return localMidnight
}

const getDateRanges = (timeline) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let start, end
    if (timeline === 'week') {
        const dayOfWeek = now.getDay();

        start = new Date(now);
        const daysToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek); 
        start.setDate(now.getDate() + daysToMonday);

        end = new Date(start);
        end.setDate(start.getDate() + 7); 
    }
    else if (timeline === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 1); 
    }
    else if (timeline === 'today') {
        start = now;
        end = new Date(now);
        end.setDate(now.getDate() + 1);
    }
    else {
        throw new ApiError(400, "invalid timeline param")
    }
    start.setHours(0,0,0,0)
    end.setHours(0,0,0,0)

    const timezoneOffset = now.getTimezoneOffset() * 60000;
    start = new Date(start.getTime() - timezoneOffset)
    end = new Date(end.getTime() - timezoneOffset)

    return {start, end}
}

export {
    getDateRanges,
    getMidnightTime
}