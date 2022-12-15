import { createHandler, authorizeResponse, r } from 'slshx';
import * as commands from "./interactions/commands";


const handler = createHandler({
	applicationId: APPLICATION_ID,
	applicationPublicKey: PUBLIC_KEY,
	applicationSecret: BOT_TOKEN,
	commands,
});
export default {fetch: handler};