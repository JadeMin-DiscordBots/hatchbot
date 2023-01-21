import {
	WebLogger
} from "../.modules/tweak_functions";
import { call } from 'slshx';
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const botAuth = {bot: env.BOT_TOKEN};


export default async (request) => {
	const message = await request.json();

	if(message.content === "!tq중이야") {
		await call('POST', `/channels/${message.channel_id}/messages`, {
			content: `<@${message.author.id}>, 아주 ㅅㅂ하다`
		}, botAuth);
	}
};