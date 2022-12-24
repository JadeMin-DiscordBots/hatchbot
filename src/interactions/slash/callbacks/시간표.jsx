import _ from 'lodash';
import { DateTime, Settings } from 'luxon';
import {
	WebLogger,
	NEIS_API,
	luxonSetup
} from "../../../.modules/tweak_functions";
import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import AutoComplete from "./components/AutoComplete";
luxonSetup(Settings);
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
		min: 1, max: 12
	});
	const DAY = useString("날짜", "날짜를 입력해주세요.", {
		required: false,
		autocomplete: ()=> AutoComplete.week(new DateTime(Date.now()))
	}) ?? new DateTime(Date.now()).toISO();

	
	const readableDate = DateTime.fromISO(DAY).toFormat("MM월 dd일(EEE)");
	const options = {
		"ATPT_OFCDC_SC_CODE": "J10",
		"SD_SCHUL_CODE": "7530474",
		"GRADE": GRADE,
		"CLASS_NM": CLASS_NM,
		"ALL_TI_YMD": DateTime.fromISO(DAY).toFormat("yyyyMMdd")
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
				{isError?
					<Embed
						title={
							api.error.CODE == "INFO-200"?
								"시간표가 없습니다."
								:
								"데이터를 불러오는 중 오류가 발생했습니다."
						}
						footer={readableDate}
					>
						{`> ${api.error.MESSAGE}`}
					</Embed>
					:
					<Embed
						title={`:calendar_spiral: ${api.data[0].GRADE}학년 ${api.data[0].CLASS_NM}반 시간표`}
						footer={readableDate}
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