import { ALS_KO } from "./tweak_functions.json";



export const setTweaks = w => {
	w.Array.prototype.random = function(){
		return this[Math.floor(Math.random() * this.length)];
	};
	w.String.prototype.shuffle = function(){
		return this.split('').sort(() => Math.random() - 0.5).join('');
	};
	w.String.prototype.reverse = function(){
		return this.split('').reverse().join('');
	};

	w.Array.prototype.getOption = function(name){
		return this.find(o => o.name===name);
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
    }
	

    let result = {};
    for (const [key, value] of Object.entries(timeUnits)) {
        result[key] = Math.floor(minutes / value);
        minutes %= value;
    }
    result.mins = minutes;
	
    return format(result);
};




export const escapers = {
	backtick: msg => msg.replace(/(`)/g, "\\$1"),
	all: msg => msg.replace(/([`*_~<>@|])/g, "\\$1")
};