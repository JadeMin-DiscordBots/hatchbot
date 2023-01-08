import {
	Miniflare,
	Log, LogLevel
} from 'miniflare';
import env from "../secrets.json" assert {type: 'json'};


const localWorker = new Miniflare({
	log: new Log(LogLevel.DEBUG),
	error: new Log(LogLevel.ERROR),

	wranglerConfigPath: true,
	packagePath: true,
	envPath: true,

	modules: true,
	buildCommand: "npm run build:deploy",
	scriptPath: "./dist/server.mjs",
});
const params = new URLSearchParams({
	"secret": env.SECRET_KEY
});
const response = await localWorker.dispatchFetch(`http://localhost:8787/deploy?${params}`, {
	method: 'POST'
});

if(response.status === 200) console.log("✅ - 명령어 배포용 로컬서버가 모든 명령어를 배포했습니다!");
else {
	console.error(`❌ - 명령어 배포용 로컬서버가 ErrorResponse를 반환했습니다:`);
	throw await response.text();
}