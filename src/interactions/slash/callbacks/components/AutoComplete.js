import _ from 'lodash';


export default {
	week: (dateTime) => {
		const autocompleted = _.range(1, 8).map(day => {
			const thisDate = dateTime.plus({days: day});

			return {
				name: thisDate.toFormat(`+${day}일 (MM-dd EEEE)`),
				value: thisDate.toISO()
			};
		});

		return autocompleted;
	}
};