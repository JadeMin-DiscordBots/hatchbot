import {
	createHandler, authorizeResponse,
	deployCommands
} from 'slshx';
import commands from "./interactions/slash/callback";
import userCommands from "./interactions/ctxm/users/callback";
import messageCommands from "./interactions/ctxm/messages/callback";
const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	applicationSecret: !env.IS_DEPLOY_MODE || env.SECRET_KEY,
	commands,
	userCommands,
	messageCommands
};


const Handler = {
	interactions: createHandler(options),
	authorize: authorizeResponse,
	deployCommands: ()=> deployCommands(options)
};
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
					if(searchParams.get('secret') !== options.applicationSecret) return new Response("Unauthorized", {status: 401});
					
					try {
						await Handler.deployCommands();
						return new Response("SUCCESS", {status: 200});
					} catch(error){
						console.error(error);
						return new Response("ERROR", {status: 500});
					}
				}
			};
			case "/invite": {
				return Handler.authorize(env.APPLICATION_ID);
			};
			default: {
				return new Response("No Bitches lol", {status: 404});
			};
		};
	}
};