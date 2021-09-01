import moment from "moment";

export function convertUnixTimestamp(ts, toTime = false) {
	if (toTime) {
		return moment(ts).format("HH:mm A");
	}

	return moment(ts).format("dddd, DD MMMM, YYYY");
}
