import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	NEIS_API,
	setTweaks
} from "../../../.modules/tweak_functions";
setTweaks(self);
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const NEIS = new NEIS_API(env.NEIS_TOKEN);



export default function() {
	useDescription("시간표를 확인합니다.");
	const GRADE = useInteger("학년", "학년을 입력해주세요.", {
		required: true,
		min: 1, max: 3
	});
	const CLASS_NM = useInteger("반", "반을 입력해주세요.", {
		required: true,
		min: 1, max: 20
	});
	const days = useString("날짜", "날짜를 입력해주세요.", {
		required: false,
		choices: [{
			name: "내일",
			value: "1"
		}, {
			name: "모레",
			value: "2"
		}, {
			name: "3일",
			value: "3"
		}, {
			name: "4일",
			value: "4"
		}, {
			name: "5일",
			value: "5"
		}, {
			name: "6일",
			value: "6"
		}, {
			name: "7일",
			value: "7"
		}]
	}) ?? "0";


	const nowDate = Intl.DateTimeFormat('ko-KR', {
		dateStyle: 'long',
		timeZone: "Asia/Seoul",
	}).format(new Date().addDays(+days));
	const options = {
		"ATPT_OFCDC_SC_CODE": "J10" /*useString("지역코드")*/,
		"SD_SCHUL_CODE": "7530474" /*useInteger("학교코드")*/,
		"GRADE": GRADE,
		"CLASS_NM": CLASS_NM,
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
				{
					isError?
						<Embed
							title={
								api.error.CODE == "INFO-200"?
									"오늘자 시간표가 없습니다."
									:
									"데이터를 불러오는 중 오류가 발생했습니다."
							}
							footer={api.error.MESSAGE}
						></Embed>
						:
						<Embed
							title={`:calendar_spiral: ${api.data[0].GRADE}학년 ${api.data[0].CLASS_NM}반 시간표`}
							footer={`${nowDate}자`}
						>
							{api.data.map((time, index) => (
								<Field name={`${index+1}교시`}>
									{time.ITRT_CNTNT}
								</Field>
							))}
						</Embed>
				}
			</Message>
		);
	};
};