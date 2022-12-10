import { ALS_KO } from "./tweak_functions.json";



export class JsonResponse extends Response {
	constructor(body, init) {
		super(JSON.stringify(body), init ?? {
			headers: {"Content-Type": "application/json;charset=UTF-8"}
		});
	};
};




export class ALS_API {
	constructor(token) {
		this.token = token;
		this._CONFIG = ALS_KO;
	};
	lang(type, data) {
		switch(type) {
			case 'maprotation': {
				const ko = name=> ALS_KO[name] || name;

				for(const i in data) {
					const gamemode = data[i];
					gamemode.current.map = ko(gamemode.current.map);
					gamemode.next.map = ko(gamemode.next.map);
				};
				return data;
			};
			case 'gamemode': {
				return ALS_KO[data] || data;
			};
		};
	};
	async send(type, query={}){
		const url = `https://api.mozambiquehe.re/${type}?${new URLSearchParams(query)}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {"Authorization": this.token}
		});

		return this.lang(type, await response.json(), query);
		//return response.json();
	};
};




export class WebLogger {
	constructor(id, token) {
		this.id = id;
		this.token = token;
	};
	async log(message) {
		console.log(message.replace(/```([a-zA-Z]*)?/gi, '\n$1').trim());
		const response = await fetch(`https://discord.com/api/webhooks/${this.id}/${this.token}`, {
			method: 'POST',
			headers: {"Content-Type": "application/json;charset=UTF-8"},
			body: JSON.stringify({
				content: message
			})
		});
		
		return response.json();
	};
};




export const kIntl = minutes => {
	const years = 525600,
		months = 43800,
		days = 1440,
		hours = 60;
	let result = {
		mins: 0,
		hrs: 0,
		dys: 0,
		ths: 0,
		yrs: 0
	};
	const format = r => {
		let str = '';
		if(r.yrs > 0) str += `${r.yrs}년 `;
		if(r.ths > 0) str += `${r.ths}달 `;
		if(r.dys > 0) str += `${r.dys}일 `;
		if(r.hrs > 0) str += `${r.hrs}시간 `;
		if(r.mins > 0) str += `${r.mins}분 `;

		return str.trim();
	}
	
	
	(function $(){
		if(minutes-years >= 0) {
			minutes -= years;
			result.yrs += 1;
			$();
		} else (function $(){
			if(minutes-months >= 0) {
				minutes -= 43800;
				result.ths += 1;
				$();
			} else (function $(){
				if(minutes-days >= 0) {
					minutes -= 1440;
					result.dys += 1;
					$();
				} else (function $(){
					if(minutes-hours >= 0) {
						minutes -= 60;
						result.hrs += 1;
						$();
					} else {
						result.mins += minutes;
					}
				})();
			})();
		})();
	})();
	return format(result);
};




export const escapeMarkdown = msg => msg.replace(/(`)/g, "\\$1");