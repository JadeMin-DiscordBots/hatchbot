import { build } from 'esbuild';
import env from "../env.json" assert {type: 'json'};

const define = {
	"APPLICATION_ID": JSON.stringify(env["APPLICATION_ID"]),
	"PUBLIC_KEY": JSON.stringify(env["PUBLIC_KEY"]),
	"BOT_TOKEN": JSON.stringify(env["BOT_TOKEN"]),
	"globalThis.MINIFLARE": "false"
};
await build({
	entryPoints: ["src/index.jsx"],
	outExtension: {".js": ".mjs"},
	outdir: "dist",
	target: "esnext",
	format: "esm",
	bundle: true,
	sourcemap: true,
	minifySyntax: true,
	jsxFactory: "createElement",
	jsxFragment: "Fragment",
	define
});
console.log("✅ - 빌드 작업이 완료되었습니다!");