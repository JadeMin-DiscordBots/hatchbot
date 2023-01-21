import ESBuild from 'esbuild';
import PluginGlobImport from 'esbuild-plugin-import-glob';
import env from "../secrets.json" assert {type: 'json'};
const argv = process.argv.slice(2)[0];
const isDeployMode = argv === 'deploy';


const define = {
	"globalThis.MINIFLARE": "false",

	"env.APPLICATION_ID": JSON.stringify(env["APPLICATION_ID"]),
	"env.PUBLIC_KEY": JSON.stringify(env["PUBLIC_KEY"]),
	"env.SECRET_KEY": JSON.stringify(env["SECRET_KEY"]),
	"env.SERVER_AUTH": JSON.stringify(env["SERVER_AUTH"]),
	
	"env.LOGHOOK_ID": JSON.stringify(env["LOGHOOK_ID"]),
	"env.LOGHOOK_TOKEN": JSON.stringify(env["LOGHOOK_TOKEN"]),

	"env.ALS_TOKEN": JSON.stringify(env["ALS_TOKEN"]),
	"env.NEIS_TOKEN": JSON.stringify(env["NEIS_TOKEN"]),
	"env.SSHOT_TOKEN": JSON.stringify(env["SSHOT_TOKEN"]),
};
await ESBuild.build({
	entryPoints: [`src/${isDeployMode? 'deploy':'server'}.js`],
	outfile: "dist/server.js",

	format: 'esm',
	target: 'esnext',
	
	bundle: true,
	treeShaking: true,
	minify: true,
	sourcemap: true,
	legalComments: 'none',

	jsxFactory: "createElement",
	jsxFragment: "Fragment",

	plugins: [
		PluginGlobImport.default()
	],

	define
});

console.log(`✅ - ${isDeployMode? "명령어 배포용 로컬서버":"프로덕션용 서버"}의 빌드 작업이 완료되었습니다!`);