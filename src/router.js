import { Router as IttyRouter } from 'itty-router';
import {
	createHandler,
	authorizeResponse,
	deployCommands
} from 'slshx';
import commands from "./interactions/slash/callback";
import userCommands from "./interactions/ctxm/users/callback";
import messageCommands from "./interactions/ctxm/messages/callback";
const Router = IttyRouter();
const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	applicationSecret: env.SECRET_KEY,
	commands,
	userCommands,
	messageCommands
};
const handler = {
	interactions: createHandler(options),
	authorize: authorizeResponse,
	deployCommands: deployCommands
};



if(env.IS_DEPLOY_MODE) {
	Router.post('/deploy', async (request) => {
		if(request.query['secret'] === options.applicationSecret) {
			try {
				await handler.deployCommands(options);
				return new Response("SUCCESS", {status: 200});
			} catch(error) {
				return new Response("ERROR", {status: 500});
			}
		} else {
			return new Response("Unauthorized", {status: 401});
		}
	});
} else {
	Router.all('/interactions', (request, workerSecret, workerContext) => {
		return handler.interactions(request, workerSecret, workerContext);
	});
	/*Router.get('/invite', () => {
		return handler.authorize(options);
	});*/
}
Router.all('*', () => {
	return new Response("No bitches lol", {status: 404});
});

export default Router;