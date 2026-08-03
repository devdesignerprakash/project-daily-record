// Lets admins record an entry against a past date (e.g. filling in data
// that was missed). Non-admins always get "now" — the `date` field is
// stripped for them so they can't spoof createdAt via a raw API call.
const applyBackdate = (req, data) => {
    if (req.user?.role === 'admin' && data?.date) {
        const parsed = new Date(data.date);
        if (!isNaN(parsed.getTime())) {
            data.createdAt = parsed;
        }
    }
    delete data.date;
    return data;
};

export default applyBackdate;
