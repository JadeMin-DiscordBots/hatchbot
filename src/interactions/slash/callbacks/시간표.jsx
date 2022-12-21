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
} from "./modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const NEIS = new NEIS_API(env.NEIS_TOKEN);


export default function 시간표() {
	useDescription("시간표를 확인합니다.");
	const GRADE = useInteger("학년", "학년을 입력해주세요.", {
		required: true
	});
	const CLASS_NM = useInteger("반", "반을 입력해주세요.", {
		required: true
	});


	const nowDate = Intl.DateTimeFormat('ko-KR', {
		dateStyle: 'long',
		timeZone: "Asia/Seoul",
	}).format(new Date());
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
					footer={`${nowDate}자`}
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