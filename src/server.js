import {
	createHandler, authorizeResponse,
	deployCommands
} from 'slshx';
import commands from "./interactions/slash/callback";
const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	applicationSecret: env.BOT_TOKEN,
	commands,
};


const Handler = {
	interactions: createHandler(options),
	authorize: authorizeResponse,
	deployCommands: ()=> deployCommands(options)
};
//export default {fetch: Handler.interaction};
export default {
	async fetch(request, env, ctx) {
		const { pathname } = new URL(request.url);

		switch(pathname) {
			case "/interactions": {
				return Handler.interactions(request, env, ctx);
			};
			case "/deploy": {
				Handler.deployCommands();
			}
			/*case "/invite": {
				return Handler.authorize(env.APPLICATION_ID);
			};*/
			default: {
				return new Response("No Bitches lol", {status: 404});
			};
		};
	}
};