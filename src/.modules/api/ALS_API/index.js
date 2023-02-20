export class ALS_API {
	/**
	 * @param {String} token Apex Legends Status의 API 인증 키
	 * @returns {undefined}
	 */
	constructor(token) {
		this.token = token;
		this._DICTS = DICTS;
	};

	/**
	 * Apex Legends 내의 영어 문장과 단어를 언어를 번역합니다.
	 * 
	 * @param {String} type 번역할 장르?부문
	 * @param {Object} message 번역할 메시지
	 * @returns {String|Object} 번역된 메시지
	 */
	lang(type, message) {
		switch(type) {
			case 'maprotation': {
				const ko = name=> DICTS[name] || name;

				for(const i in message) {
					const gamemode = message[i];
					gamemode.current.map = ko(gamemode.current.map);
					gamemode.next.map = ko(gamemode.next.map);
				};
				return message;
			};
			case 'gamemode': {
				return DICTS[message] || message;
			};
		};
	};

	/**
	 * Apex Legends Status API에 데이터를 요청합니다.
	 * 
	 * @param {String} type 엔드포인트 타입
	 * @param {Object} query 원하는 데이터 영역 (쿼리 형태로 요청)
	 * @returns {Promise<{type: String, }>} - 데이터
	 * @async
	 */
	async send(type, query={}){
		const url = `https://api.mozambiquehe.re/${type}?${new URLSearchParams(query)}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {'Authorization': this.token}
		});

		return this.lang(type, await response.json(), query);
	};
};