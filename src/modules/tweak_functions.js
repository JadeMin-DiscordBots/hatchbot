import { ALS_KO } from "./tweak_functions.json";


export class JsonResponse extends Response {
	constructor(body, init) {
		super(JSON.stringify(body), init ?? {
			headers: {"Content-Type": "application/json;charset=UTF-8"}
		});
	};
};



/*export class DIntl {
	constructor(options) {
		this.intl = new Intl.DateTimeFormat('ko-KR', options ?? {
			timeStyle: 'short',
			timeZone: "Asia/Seoul"
		});
	};

	format(date, flag) {
		return `<t:${this.intl.format(date)}:${flag}>`;
	}
};*/



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



export const escapeMarkdown = msg => msg.replace(/(`)/g, "\\$1");