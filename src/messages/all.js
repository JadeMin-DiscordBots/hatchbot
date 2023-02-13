import {
	WebLogger
} from "../.modules/tweak_functions";
import { Routes } from "../../node_modules/slshx/node_modules/discord-api-types/v9";
import { call } from 'slshx';
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const botAuth = {bot: env.BOT_TOKEN};

export default async (request) => {
	if(message.content === "!tq중이야") {
		await call('POST', Routes.channelMessages(message.channel_id), {
			content: `<@${message.author.id}>, 아주 ㅅㅂ하다`
		}, botAuth);
	}
};