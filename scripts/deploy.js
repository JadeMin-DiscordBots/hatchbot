import readline from "readline";
import { Miniflare, Log, LogLevel } from 'miniflare';
import env from "../env.json" assert {type: 'json'};
const applicationId = env.APPLICATION_ID;

// Confirm deployment with prompt
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const question = `⚠️ 정말 글로벌 배포를 진행하시겠습니까?
이 작업은 봇이 참여한 모든 서버에 적용되며
참여한 서버 수에 따라 업데이트까지 최대 1시간까지 소요될 수 있습니다.

(y/n) `;
const answer = await new Promise((resolve) => {
	rl.question(question, resolve);
});
rl.close();
if (!answer.toLowerCase().startsWith("y")) process.exit(0);


// Start Miniflare to run Worker
const mf = new Miniflare({
	log: new Log(LogLevel.DEBUG),
	// Autoload configuration from the wrangler.toml file
	wranglerConfigPath: true,
	packagePath: true,
	envPath: true,
	// Manually define script as Miniflare doesn't currently respect top-level
	// `main` in `wrangler.toml`
	scriptPath: "dist/index.mjs",
	modules: true,
	// Build the worker in "deploy" mode, which includes Miniflare-specific
	// deployment code, but uses the production configuration.
	buildCommand: "node scripts/build.js",
});
// Deploy commands globally
await mf.dispatchFetch("http://localhost:8787/?slshx_action=deploy", {
	method: "POST",
});

// Build the authorize URL
const url = new URL("https://discord.com/api/oauth2/authorize");
url.searchParams.set("client_id", applicationId);
url.searchParams.set("scope", "applications.commands");

// Log success
const green = (s) => `\x1b[32m${s}\x1b[39m`;
console.log(
	green("[slshx] 명령어가 지정되었습니다! ✅  (적용하는데 최대 1시간이 걸릴 수 있습니다)")
);
console.log(
	green(`[slshx] Add the application to your server here: ${url.toString()}`)
);
  