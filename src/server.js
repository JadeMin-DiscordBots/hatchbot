import { Router as IttyRouter } from 'itty-router';
import {
	createHandler,
	deployCommands
} from 'slshx';
import { commands, userCommands, messageCommands, onExceptions } from "./interaction";
const Router = IttyRouter();
const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	applicationSecret: env.SECRET_KEY,
	commands,
	userCommands,
	messageCommands,
	auth: {
		scopes: ["bot", "applications.commands"],
		permissions: 8
	}
};
const handler = {
	interactions: createHandler(options),
	onExceptions: onExceptions,
	deployCommands: deployCommands
};



if(env.IS_DEPLOY_MODE) {
	Router.post('/deploy', async (request) => {
		if(request.query['secret'] === options.applicationSecret) {
			try {
				await handler.deployCommands(options);
				return new Response("Successfully Deployed", {status: 200});
			} catch(error){
				console.error(error);
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
			return await handler.onExceptions(error);
		}
	});
	Router.get('/invite', () => {
		const inviteUrl = new URL("https://discord.com/api/oauth2/authorize");
		inviteUrl.searchParams.set('client_id', options.applicationId);
		inviteUrl.searchParams.set('scope', options.auth.scopes.join(' '));
		inviteUrl.searchParams.set('permissions', options.auth.permissions);
		
		return Response.redirect(inviteUrl.toString(), 302);
	});
}
Router.all('*', () => {
	return new Response("No bitches lol", {status: 404});
});

export default {
	async fetch(request, workerSecret, workerContext) {
		return Router.handle(request, workerSecret, workerContext);
	}
};