import {
	createHandler, authorizeResponse,
	deployCommands
} from 'slshx';
import commands from "./interactions/slash/callback";
import userCommands from "./interactions/ctxm/messages/callback";
import messageCommands from "./interactions/ctxm/users/callback";
const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	commands,
	userCommands,
	messageCommands
};


const Handler = {
	interactions: createHandler(options),
	authorize: authorizeResponse,
	deployCommands: deployCommands
};
//export default {fetch: Handler.interaction};
export default {
	async fetch(request, cfg, ctx) {
		const { pathname, searchParams } = new URL(request.url);

		switch(pathname) {
			case "/interactions": {
				return Handler.interactions(request, cfg, ctx);
			};
			case "/deploy": {
				if(env.IS_DEPLOY_MODE) {
					if(request.method !== 'POST') return new Response("The method not allowed", {status: 405});
					if(searchParams.get('secret') !== env.SECRET_KEY) return new Response("Unauthorized", {status: 401});
					
					options["applicationSecret"] = env.SECRET_KEY;
					try {
						await Handler.deployCommands(options);
						return new Response("SUCCESS", {status: 200});
					} catch(error){
						console.error(error);
						return new Response("ERROR", {status: 500});
					}
				}
			};
			case "/invite": {
				return Handler.authorize(cfg.APPLICATION_ID);
			};
			default: {
				return new Response("No Bitches lol", {status: 404});
			};
		};
	}
};