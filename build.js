import { build } from 'esbuild';
import env from "./env.json" assert {type: 'json'};

const define = {
	"globalThis.MINIFLARE": "false",
	"ESBUILD.APPLICATION_ID": JSON.stringify(env["APPLICATION_ID"]),
	"ESBUILD.PUBLIC_KEY": JSON.stringify(env["PUBLIC_KEY"]),
	// _ Not recommended for production _
	"ESBUILD.BOT_TOKEN": JSON.stringify(env["BOT_TOKEN"])
};
await build({
	entryPoints: ["src/index.jsx"],
	outdir: "dist",
	outExtension: {".js": ".mjs"},

	target: "esnext",
	format: "esm",
	
	bundle: true,
	minify: true,
	sourcemap: true,

	jsxFactory: "createElement",
	jsxFragment: "Fragment",

	define
});
console.log("✅ - 빌드 작업이 완료되었습니다!");