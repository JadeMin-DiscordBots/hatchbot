import { Router as IttyRouter } from 'itty-router';
import { createHandler } from 'slshx';
import onError from "./.modules/catch500";
import interactions from "./interactions/all";
//import messages from "./messages/all";

const Router = IttyRouter();
const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	...interactions
};
const handler = createHandler(options);



Router.post('/interaction', async (request, workerSecret, workerContext) => {
	try {
		//@ts-expect-error
		return await handler(request, workerSecret, workerContext);
	} catch(error) {
		await onError(error);
		throw error;
	}
});
/*Router.post('/message', async (request, workerSecret, workerContext) => {
	if(request.headers.get('Authorization') !== env.BOT_TOKEN) {
		return new Response("Unauthorized", {status: 401});
	}
	try {
		return await messages(await request.json(), workerSecret, workerContext);
	} catch(error) {
		await onError(error);
		throw error;
	}
});*/
Router.all('*', () => {
	return new Response("no bitches lol", {status: 404});
});


export default {
	async fetch(request, workerSecret, workerContext) {
		return Router.handle(request, workerSecret, workerContext);
	}
};