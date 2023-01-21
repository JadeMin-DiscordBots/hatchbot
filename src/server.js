import { Router as IttyRouter } from 'itty-router';
import { createHandler } from 'slshx';
import onError from "./.modules/catch500";
import interactions from "./interactions/all";
import messages from "./messages/all";

const Router = IttyRouter();
const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	...interactions,

	auth: {
		scopes: ["bot", "applications.commands"],
		permissions: 3072
	}
};



Router.post('/interaction', async (request, workerSecret, workerContext) => {
	try {
		return await createHandler(options)(request, workerSecret, workerContext);
	} catch(error) {
		return await onError(error);
	}
});
Router.post('/message', async (request, workerSecret, workerContext) => {
	if(request.headers.get('Authorization') !== env.SERVER_AUTH) {
		return new Response("Unauthorized", {status: 401});
	}
	try {
		return await messages(request, workerSecret, workerContext);
	} catch(error) {
		return await onError(error);
	}
});
Router.get('/invite', () => {
	const inviteUrl = new URL("https://discord.com/api/oauth2/authorize");
	inviteUrl.searchParams.set('client_id', options.applicationId);
	inviteUrl.searchParams.set('scope', options.auth.scopes.join(' '));
	inviteUrl.searchParams.set('permissions', options.auth.permissions);
	
	return Response.redirect(inviteUrl.toString(), 302);
});
Router.all('*', () => {
	return new Response("no bitches lol", {status: 404});
});


export default {
	async fetch(request, workerSecret, workerContext) {
		return Router.handle(request, workerSecret, workerContext);
	}
};