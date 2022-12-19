import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	ALS_API, NEIS_API,
	setTweaks,
	formatMinutes, escapers,
} from "../modules/tweak_functions";
import Meal from "./callback/components/Meal";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const NEIS = new NEIS_API(env.NEIS_TOKEN);


export default function 급식표() {
	const isNtrMode = useBoolean("영양정보");


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
							{isNtrMode ??
								<Meal.NutritionEmbed data={api.data[0]}/>
							}
							<Meal.MenuEmbed data={api.data[0]}/>
						</>
				}
			</Message>
		);
	};
};