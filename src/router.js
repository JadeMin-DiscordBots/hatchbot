import { Router as IttyRouter } from 'itty-router';
import {
	createHandler,
	deployCommands
} from 'slshx';
import commands from "./interactions/slash/callback";
import userCommands from "./interactions/ctxm/users/callback";
import messageCommands from "./interactions/ctxm/messages/callback";
import exceptionsHandler from "./router-exceptions";
const Router = IttyRouter();

const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	applicationSecret: env.SECRET_KEY,
	commands,
	userCommands,
	messageCommands,
	permission: 8
};
const handler = {
	interactions: createHandler(options),
	exceptions: exceptionsHandler,
	deployCommands: deployCommands
};



if(env.IS_DEPLOY_MODE) {
	Router.post('/deploy', async (request) => {
		if(request.query['secret'] === options.applicationSecret) {
			try {
				await handler.deployCommands(options);
				return new Response("Successfully Deployed", {status: 200});
			} catch(error){
				return new Response("Deploy Error", {status: 500});
			}
		} else {
			return new Response("Unauthorized", {status: 401});
		}
	});
} else {
	Router.post('/interaction', async (request, workerSecret, workerContext) => {
		try {
			return await handler.interactions(request, workerSecret, workerContext);
		} catch(error) {
			return handler.exceptions(error);
		}
	});
	Router.get('/invite', () => {
		const inviteUrl = new URL("https://discord.com/api/oauth2/authorize");
		inviteUrl.searchParams.set('client_id', options.applicationId);
		inviteUrl.searchParams.set('scope', "bot applications.commands");
		inviteUrl.searchParams.set('permissions', options.permission);
		
		return Response.redirect(inviteUrl.toString(), 302);
	});
}
Router.all('*', () => {
	return new Response("No bitches lol", {status: 404});
});

export default Router;