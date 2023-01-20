import { Settings } from 'luxon';
import DICTS from "./tweak_functions.json";

/**
 * Response의 body 데이터(text와 json)를 동시에 구하는 함수입니다.
 * 
 * @param {Response} response 데이터를 받을 Response 객체
 * @returns {Promise<{text: String, json: Object}>} json과 body 데이터를 가진 객체
 */
Response.prototype.waitForBody = async function(){
	let result = {text: await this.clone().text()};
	try {
		result['json'] = await this.clone().json();
	} catch(error){
		if(error?.constructor === SyntaxError) {
			result['json'] = null;
		} else {
			throw new error.constructor(error);
		}
	}

	return result;
};




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
export class NEIS_API {
	/**
	 * @param {String} token 나이스(NEIS) API 인증 키
	 * @returns {undefined}
	 */
	constructor(token){
		this.token = token;
	};
	
	/**
	 * NEIS API에 데이터를 요청합니다.
	 * 
	 * @param {String} type 엔드포인트 타입
	 * @param {Object} query 원하는 데이터 영역 (쿼리 형태로 요청)
	 * @returns {Promise<{url: String, error: Object, data: String}>} 데이터
	 * @async
	 */
	async send(type, query={}){
		const url = `https://open.neis.go.kr/hub/${type}?KEY=${this.token}&${new URLSearchParams(query)}&Type=json`;
		const response = await fetch(url);
		const data = await response.json();

		if(data?.RESULT) console.error(data?.RESULT);
		return {
			url,
			error: { ...data?.RESULT },
			data: Object.values(data)?.[0]?.[1]?.row
		};
	};
};
export class SSHOT_API {
	/**
	 * @param {String} token Screenshot API 인증 키
	 * @returns {undefined}
	 */
	constructor(token){
		this.token = token;
	};
	
	/**
	 * NEIS API에 데이터를 요청합니다.
	 * 
	 * @param {String} url 스크린샷을 찍을 웹사이트 주소
	 * @returns {Promise<{file: File}>} 데이터
	 * @async
	 */
	async screenshot(url){
		const response = await fetch(`https://kmemsnefy547lttm5vwbqem7ga0vimgu.lambda-url.ap-northeast-2.on.aws/`, {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				auth: this.token,
				url: url
			})
		});
		const data = await response.json();
		const buffer = new ArrayBuffer(data.data.length);
		const view = new Uint8Array(buffer);
		for(let i=0; i<data.data.length; ++i) view[i] = data.data[i];

		if(response.status === 200) {
			return {
				error: false,
				data: new File([buffer], "screenshot.png", {type: 'image/png'})
			};
		} else {
			return {
				error: true,
				data: data
			};
		}
	};
};




export class WebLogger {
	/**
	 * @param {String} id 웹훅 아이디
	 * @param {String} token 웹훅 토큰
	 */
	constructor(id, token) {
		this.id = id;
		this.token = token;
	};

	/**
	 * Object를 융통성 있게? String으로 변환합니다.
	 * 
	 * @param {any} text 변환할 값
	 * @returns {String} 변환된 값
	 * @private 클래스 내부에서만 사용됩니다.
	 */
	#toString(text) {
		const stringify = text=> JSON.stringify(text, null, '\t');
		if(typeof text === String) return text;
		return stringify(text);
	};

	/**
	 * 웹훅으로 메시지 전송을 요청합니다.
	 * 
	 * @param {Object} body 전송할 데이터
	 * @param {Object} options fetch 옵션
	 * @returns {Promise<Response>} 응답 데이터
	 * @async
	 */
	async send(body, options) {
		const response = await fetch(`https://discord.com/api/webhooks/${this.id}/${this.token}`, {
			method: 'POST',
			headers: {'Content-Type': "application/json;charset=UTF-8"},
			body: JSON.stringify(body),
			...options
		});
		const responseBody = await response.waitForBody();
		console.debug(responseBody);

		return responseBody;
	};

	/**
	 * 웹훅으로 로그를 남깁니다.
	 * 
	 * @param {String|Object} message 로그 메시지
	 * @param {Object} options 로그 옵션
	 * @async
	 */
	async log(message, options) {
		console.log(message);

		if(message.constructor === Object) {
			const stringifiedMsg = this.#toString(message);

			if(stringifiedMsg.length > 2000) {
				const warnMsg = "\n로그 메시지가 2000자를 초과하여 일부 내용이 누락되었습니다.\n[CloudFlare Workers](https://dash.cloudflare.com/?to=/:account/workers/overview)에서 전체 로그를 확인하세요.";
				await this.send({
					content: `\`\`\`${stringifiedMsg.substring(0, 1994-warnMsg.length)}\`\`\`${warnMsg}`,
				});
			} else {
				await this.send({
					content: `\`\`\`json\n${stringifiedMsg.substring(0, 1994)}\`\`\``
				});
			}
		} else {
			if(options?.constructor === Object) {
				await this.send({
					content: message.toString().replace(/\$code/i, `\`\`\`${options.language}\n${options.code}\`\`\``).replace(/\\\\/g, '\\')
				});
			} else {
				await this.send({
					content: message.toString().substring(0, 1999)
				});
			}
		}
	};
};




/**
 * 분을 유동적으로 년/개월/일/시간/분처럼 변환합니다.
 * 
 * @param {Number|String} text
 * @returns {String} 변환된 단위 표시
 * @example
 * formatMinutes(1000); // 1년 3개월 5일 20시간
 * formatMinutes(100); // 1시간 40분
 * formatMinutes(1); // 1분
 */
export const formatMinutes = minutes => {
    const timeUnits = {
        years: 525600,
        months: 43800,
        days: 1440,
        hours: 60
    };
    const format = r => {
        let str = '';
        if(r.years > 0) str += `${r.years}년 `;
        if(r.months > 0) str += `${r.months}개월 `;
        if(r.days > 0) str += `${r.days}일 `;
        if(r.hours > 0) str += `${r.hours}시간 `;
        if(r.mins > 0) str += `${r.mins}분 `;

        return str.trim();
    };
	

    let result = {};
    for(const [key, value] of Object.entries(timeUnits)) {
        result[key] = Math.floor(minutes / value);
        minutes %= value;
    };
    result.mins = minutes;
	
    return format(result);
};




/**
 * 디스코드로 메시지를 전송할 때 문제가 될 수 있는 마크다운 문자를 이스케이핑합니다.
 */
export const escape = {
	/**
	 * 디스코드의 백틱 마크다운을 이스케이핑합니다.
	 * 
	 * @param {String} msg 이스케이핑할 문자열
	 * @returns {String} 이스케이핑된 문자열
	 */
	backtick: msg => msg.replace(/(`)/g, "\\$1"),

	/**
	 * 디스코드의 모든 마크다운을 이스케이핑합니다.
	 * 
	 * @param {String} msg
	 * @returns {String} 이스케이핑된 문자열
	 */
	all: msg => msg.replace(/([()\[\]`*_~<>@|])/g, "\\$1")
};




/**
 * Luxon의 설정을 기본값으로 지정합니다.
 * 
 * @param {Settings} LuxonSettings 이스케이핑할 문자열
 * @returns {Settings} 기본값으로 변환된 Luxon.Setttings
 */
export const luxonSetup = (LuxonSettings) => {
	LuxonSettings.defaultLocale = 'ko';
	LuxonSettings.defaultZone = 'Asia/Seoul';

	return LuxonSettings;
};