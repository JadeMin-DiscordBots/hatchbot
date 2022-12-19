import { createHandler, authorizeResponse } from 'slshx';
import * as commands from "./interactions/commands";
const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	commands,
};
options["applicationSecret"] &&= env.BOT_TOKEN;


const Handler = {
	interaction: createHandler(options),
	authorizeResponse: authorizeResponse
};
//export default {fetch: Handler.interaction};
export default {
	async fetch(request, env, ctx) {
		const { pathname } = new URL(request.url);

		switch(pathname) {
			case "/interactions": {
				return Handler.interaction(request, env, ctx);
			};
			case "/invite": {
				return Handler.authorizeResponse(request, env, ctx);
			};
			default: {
				return new Response("No Bitches lol", {status: 404});
			};
		};
	}
};