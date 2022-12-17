import { createHandler, authorizeResponse } from 'slshx';
import * as commands from "./interactions/commands";


const handler = createHandler({
	applicationId: APPLICATION_ID,
	applicationPublicKey: PUBLIC_KEY,
	applicationSecret: BOT_TOKEN,
	commands,
});
//export default {fetch: handler};
export default {
	async fetch(request, env, ctx) {
		const { pathname } = new URL(request.url);
		if(pathname === "/interactions") {
			return handler(request, env, ctx);
		} else if(pathname === "/invite") {
			return authorizeResponse(request, env, ctx);
		} else {
			return new Response("No Bitches lol", {status: 404});
		}
	}
}
