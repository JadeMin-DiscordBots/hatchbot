import { build } from 'esbuild';
import env from "../secrets.json" assert {type: 'json'};
const isDeployMode =  process.argv.slice(2)[0] === 'deploy';


const define = {
	"globalThis.MINIFLARE": "false",

	"env.IS_DEPLOY_MODE": JSON.stringify(isDeployMode),

	"env.APPLICATION_ID": JSON.stringify(env["APPLICATION_ID"]),
	"env.PUBLIC_KEY": JSON.stringify(env["PUBLIC_KEY"]),
	"env.SECRET_KEY": isDeployMode?
		JSON.stringify(env["SECRET_KEY"])
		:
		"undefined",
	
	"env.LOGHOOK_ID": JSON.stringify(env["LOGHOOK_ID"]),
	"env.LOGHOOK_TOKEN": JSON.stringify(env["LOGHOOK_TOKEN"]),

	"env.ALS_TOKEN": JSON.stringify(env["ALS_TOKEN"]),
	"env.NEIS_TOKEN": JSON.stringify(env["NEIS_TOKEN"]),
};
await build({
	entryPoints: ["src/server.js"],
	outdir: "dist/",
	outExtension: {".js": ".mjs"},

	format: "esm",
	target: "esnext",
	
	bundle: true,
	treeShaking: true,
	minifyWhitespace: true,
	sourcemap: true, // 'inline' also not works

	jsxFactory: "createElement",
	jsxFragment: "Fragment",

	define
});

console.log(`✅ - ${isDeployMode? "명령어 배포용 로컬서버":"프로덕션용 서버"}의 빌드 작업이 완료되었습니다!`);