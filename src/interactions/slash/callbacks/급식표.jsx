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
} from "./modules/tweak_functions";
import Meal from "./components/Meal";
setTweaks(self);
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const NEIS = new NEIS_API(env.NEIS_TOKEN);


export default function 급식표() {
	useDescription("급식표를 확인합니다.");
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
	const isNtrMode = useBoolean("영양정보", "영양 정보를 표시할지 선택합니다", {
		required: false
	});


	const nowDate = Intl.DateTimeFormat('ko-KR', {
		dateStyle: 'long',
		timeZone: "Asia/Seoul",
	}).format(new Date().addDays(+days));
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
							<Meal.MenuEmbed
								title="오늘의 급식"
								footer={`${nowDate}자`}
								data={api.data[0]}
							/>
							{isNtrMode?
								<Meal.NutritionEmbed
									title="영양 정보"
									data={api.data[0]}
								/> : ''
							}
						</>
				}
			</Message>
		);
	};
};