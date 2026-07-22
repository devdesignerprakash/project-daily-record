const convertToDate = (timeString) => {
    if (typeof timeString !== 'string') {
        throw new Error("Time must be a string");
    }
    
    // Remove any surrounding single or double quotes
    const cleaned = timeString.trim().replace(/^["']|["']$/g, '');
    const parts = cleaned.split(":").map(Number);

    if (parts.length < 2 || parts.length > 3) {
        throw new Error("Invalid time format. Expected HH:mm or HH:mm:ss");
    }

    const [hours, minutes, seconds = 0] = parts;

    if (
        isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59 ||
        seconds < 0 || seconds > 59
    ) {
        throw new Error("Invalid time values.");
    }

    const date = new Date(); 
    date.setHours(hours, minutes, seconds, 0);

    return date;
};
export default convertToDate;