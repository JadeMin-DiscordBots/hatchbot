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
const params = new URLSearchParams({"secret": env.SECRET_KEY});
const response = await localWorker.dispatchFetch(`http://localhost:8787/deploy?${params}`, {
	method: 'POST'
});

if(response.status === 200) console.log("✅ - 성공적으로 명령어가 배포되었습니다!");
else {
	const error = await response.text();
	console.error(`❌ - 명령어 배포용 서버 빌드가 ErrorResponse를 반환했습니다: ${error}`);
}