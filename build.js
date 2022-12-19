import { build } from 'esbuild';
import env from "./secrets.json" assert {type: 'json'};

const define = {
	"globalThis.MINIFLARE": "false",

	"env.APPLICATION_ID": JSON.stringify(env["APPLICATION_ID"]),
	"env.PUBLIC_KEY": JSON.stringify(env["PUBLIC_KEY"]),
	"env.BOT_TOKEN": JSON.stringify(env["BOT_TOKEN"]),
	
	"env.LOGHOOK_ID": JSON.stringify(env["LOGHOOK_ID"]),
	"env.LOGHOOK_TOKEN": JSON.stringify(env["LOGHOOK_TOKEN"]),

	"env.ALS_TOKEN": JSON.stringify(env["ALS_TOKEN"]),
	"env.NEIS_TOKEN": JSON.stringify(env["NEIS_TOKEN"]),
};
await build({
	entryPoints: ["src/index.jsx"],
	outdir: "dist/",
	outExtension: {".js": ".mjs"},

	target: "esnext",
	format: "esm",
	
	bundle: true,
	minifySyntax: true,
	sourcemap: true,

	jsxFactory: "createElement",
	jsxFragment: "Fragment",

	define
});
console.log("✅ - 빌드 작업이 완료되었습니다!");