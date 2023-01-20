import {
	WebLogger
} from "../.modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);

export default async (request) => {
	if(request.headers.get('Authorization') !== env.SECRET_KEY) return new Response("Unauthorized", {status: 401});
	const message = await request.json();

	if(message.author.id === "840594543291269120") {
		await Logger.log(message);
	}
};