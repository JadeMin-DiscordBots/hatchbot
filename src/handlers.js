import {
	WebLogger
} from "./.modules/tweak_functions";
import slash_commands from "./interactions/slash/callback";
import users_contextMenu from "./interactions/context_menu/user/callback";
import messages_contextMenu from "./interactions/context_menu/message/callback";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);


export const commands = slash_commands;
export const userCommands = users_contextMenu;
export const messageCommands = messages_contextMenu;
export const exceptions = (error) => {
	Logger.send({
		content: "<@840594543291269120>",
		embeds: [{
			title: `:rotating_light: ${error?.name ?? "Error"}`,
			description: `${error?.message ?? error}${error?.stack? `\`\`\`${error.stack}\`\`\``:''}`,
			color: 0xff0000,
			timestamp: new Date()
		}]
	});
	console.error(error);

	return new Response("ERROR", {status: 500});
};