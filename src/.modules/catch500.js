import { DateTime, Settings } from 'luxon';
import {
	WebLogger,
	luxonSetup,
	escape
} from "./tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
luxonSetup(Settings);


export default async (error) => {
	await Logger.send({
		content: "<@840594543291269120>",
		embeds: [{
			title: `:rotating_light: ${error?.name ?? "Error"}`,
			description: `${error?.message ?? error}${error?.stack? `\`\`\`${escape.backtick(error.stack)}\`\`\``:''}`,
			timestamp: new DateTime(Date.now())
		}]
	});
};