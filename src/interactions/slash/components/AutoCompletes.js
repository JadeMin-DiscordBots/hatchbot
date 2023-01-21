import { range } from 'lodash-es';


export default {
	getWeek: (dateTime) => {
		return range(1, 8).map(day => {
			const thisDate = dateTime.plus({days: day});

			return {
				name: thisDate.toFormat(`+${day}일 (EEE MM-dd)`),
				value: thisDate.toISO()
			};
		});
	}
};