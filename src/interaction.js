import { DateTime, Settings } from 'luxon';
import {
	WebLogger,
	luxonSetup,
	escape
} from "./.modules/tweak_functions";
import slash_commands from "./interactions/slash/callback";
import user_contextMenus from "./interactions/context_menu/user/callback";
import message_contextMenus from "./interactions/context_menu/message/callback";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
luxonSetup(Settings);



export const commands = slash_commands;
export const userCommands = user_contextMenus;
export const messageCommands = message_contextMenus;

export const onExceptions = async (error) => {
	await Logger.send({
		content: "<@840594543291269120>",
		embeds: [{
			title: `:rotating_light: ${error?.name ?? "Error"}`,
			description: `${error?.message ?? error}${error?.stack? `\`\`\`${escape.backtick(error.stack)}\`\`\``:''}`,
			timestamp: new DateTime(Date.now())
		}]
	});
	
	throw error;
};