import { Router as IttyRouter } from 'itty-router';
import { deployCommands } from 'slshx';
import onError from "./.modules/catch500";
import interactions from "./interactions/all";

const Router = IttyRouter();
const options = {
	applicationId: env.APPLICATION_ID,
	applicationPublicKey: env.PUBLIC_KEY,
	applicationSecret: env.SECRET_KEY,
	...interactions
};


Router.post('/deploy', async (request) => {
	await deployCommands(options);
	return new Response("Successfully Deployed", {status: 200});
});
Router.post('*', async (request) => {
	return new Response("Did you mean to send a request to \"/deploy\"?", {status: 404});
});

export default {
	async fetch(request, workerSecret, workerContext) {
		return Router.handle(request, workerSecret, workerContext);
	}
};