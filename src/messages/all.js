import {
	WebLogger
} from "../.modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);

export default async (request) => {
	const message = await request.json();

	await Logger.log(message);
};