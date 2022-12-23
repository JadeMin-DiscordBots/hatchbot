import {
	WebLogger
} from "./.modules/tweak_functions";
import commands from "./interactions/slash/callback";
import userCommands from "./interactions/ctxm/users/callback";
import messageCommands from "./interactions/ctxm/messages/callback";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);


export default {
	commands,
	userCommands,
	messageCommands,
	exceptions: (error) => {
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
	}
};