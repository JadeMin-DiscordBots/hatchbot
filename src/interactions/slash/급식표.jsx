import _ from 'lodash';
import { DateTime, Settings } from 'luxon';
import {
	WebLogger,
	NEIS_API,
	luxonSetup
} from "../../.modules/tweak_functions";
import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import AutoComplete from "./components/AutoComplete";
import Meal from "./components/급식";
luxonSetup(Settings)
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const NEIS = new NEIS_API(env.NEIS_TOKEN);

export default function() {
	useDescription("급식표를 확인합니다.");
	const DAY = useString("날짜", "날짜를 입력해주세요.", {
		required: false,
		autocomplete: ()=> AutoComplete.week(new DateTime(Date.now()))
	}) ?? new DateTime(Date.now()).toISO();
	const isNtrMode = useBoolean("영양정보", "영양 정보를 표시할지 선택합니다", {
		required: false
	});


	const readableDate = DateTime.fromISO(DAY).toFormat("MM월 dd일(EEE)");
	const options = {
		"ATPT_OFCDC_SC_CODE": "J10",
		"SD_SCHUL_CODE": "7530474",
		"MLSV_YMD": DateTime.fromISO(DAY).toFormat("yyyyMMdd"),
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
				{isError?
					<Embed
						title={
							api.error.CODE == "INFO-200"?
								`${readableDate} 급식이 없습니다.`
								:
								"데이터를 불러오는 중 오류가 발생했습니다."
						}
						footer={readableDate}
					>
						{`> \`${api.error.CODE}\`: ${api.error.MESSAGE}`}
					</Embed>
					:
					<>
						<Meal.MenuEmbed
							title={`:bento: ${readableDate} 급식표`}
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