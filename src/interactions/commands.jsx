import {
	createElement,
	useString, useNumber,
	Message, Embed, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	ALS_API, WebLogger,
	setTweaks, formatMinutes, escapers
} from "./modules/tweak_functions.js";
setTweaks(self);



export function 맵() {
	const gamemode = useString("게임모드");

	return async function*(interaction, env) {
		yield;
		const ALS = new ALS_API(env.ALS_TOKEN);
		const als = await ALS.send("maprotation", {version: 2});
		const data = als[gamemode ?? "battle_royale"];
		return (
			<Message>
				<Embed
					title={`:map: 현재 맵: \`${data.current.map}\``}
					image={data.current.asset}
					footer={`이 맵은 ${formatMinutes(data.current.DurationInMinutes)} 동안 유지됩니다`}
				>
					{`<t:${data.current.start}:R>에 시작되었습니다.`}
				</Embed>
				<Embed
					title={`:map: 다음 맵: \`${data.next.map}\``}
					image={data.next.asset}
					footer={`이 맵은 ${formatMinutes(data.next.DurationInMinutes)}동안 유지됩니다`}
				>
					{`> <t:${data.next.start}:R>에 시작됩니다.`}
				</Embed>
			</Message>
		);
	};
};
export function 금은가야() {
	const type = useString("기법");
	const msg = useString("메시지");
	const repeat = useNumber("횟수") ?? 1;

	switch(type){
		case "shuffle": {
			return () => <Message>{escapers.all(msg.repeat(repeat).shuffle().slice(0, 1999))}</Message>
		};
		case "reverse": {
			return () => <Message>{escapers.all(msg.repeat(repeat).reverse().slice(0, 1999))}</Message>
		};
		default: {
			return () => <Message>{type}은(는) 존재하지 않는 타입입니다.</Message>
		};
	};
};
export function 빠빱윈또우뻐뜬() {
	const [inputId, inputValue] = useInput();
	const modalId = useModal((interaction, env) => {
		const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
		Logger.log(`<@${interaction.member.user.id}> | 빠빱\\_윈또우\\_뻐뜬 > \`\`${escapers.backtick(inputValue)}\`\``);
		
		return (
			<Message ephemeral>{`<@${interaction.member.user.id}>`}, 매우 즐거운 귀하의 계정! 당국이 계정을 안전하게 보호할 것이다 입니다.</Message>
		);
	});
	const popup_window_button = useButton(() => {
		return (
			<Modal id={modalId} title='이것은 빠빱_윈또우 이다'>
				<Input
					id={inputId}
					label="Discord 계정 비밀번호를 입력해주세요"
					minLength={1}
					required
				>
				</Input>
			</Modal>
		);
	});


	return () => (
		<Message>
			빠빱\_윈또우\_뻐뜬
			<Row>
				<Button id={popup_window_button} primary>popup_window_button</Button>
			</Row>
		</Message>
	);
};