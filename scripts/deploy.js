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
	sourceMap: true,

	modules: true,
	buildCommand: "npm run build:deploy",
	scriptPath: "dist/server.js",
});
const response = await localWorker.dispatchFetch(`http://localhost:8787/deploy`, {
	method: 'POST',
	headers: {
		"Authorization": `${env.SECRET_KEY}`
	}
});

if(response.status === 200) console.log("✅ - 명령어 배포용 로컬서버가 모든 명령어를 배포했습니다!");
else {
	console.error(await response.text());
	throw new Error(`❌ - 명령어 배포용 로컬서버가 유효하지 않은 메시지를 반환했습니다:`);
}