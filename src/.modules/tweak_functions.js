import DICTS from "./tweak_functions.json";

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
	constructor(token) {
		this.token = token;
		this._DICTS = DICTS;
	};
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
	constructor(token){
		this.token = token;
	};
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




export class WebLogger {
	constructor(id, token) {
		this.id = id;
		this.token = token;
	};
	#toStringForce(text) {
		if(text?.constructor === Object) return JSON.stringify(text, null, '\t');
		return text;
	};
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
	async log(message, options) {
		if(message?.constructor !== Object) {
			if(options?.constructor === Object) {
				message = message.replace(/\$code/i, `\`\`\`${options.language}\n${options.code}\`\`\``).replace(/\\\\/g, '\\');
			}
			console.log(message);
			await this.send({
				content: message.substring(0, 1999)
			});
		} else {
			console.log(message);
			const stringifiedMsg = this.#toStringForce(message);
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
		}
	};
};




export const makeStringStairUpAndDown = (str, length) => {
	const strLength = str.length;
	const stairLength = Math.floor((length - strLength) / 2);
	const stair = ' '.repeat(stairLength);
	return `${stair}${str}${stair}`;
};




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




export const escape = {
	backtick: msg => msg.replace(/(`)/g, "\\$1"),
	all: msg => msg.replace(/([()\[\]`*_~<>@|])/g, "\\$1")
};




export const luxonSetup = (Settings) => {
	Settings.defaultLocale = 'ko';
	Settings.defaultZone = 'Asia/Seoul';

	return Settings;
};