import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	ALS_API,
	setTweaks,
	formatMinutes, escapers,
} from "./modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const ALS = new ALS_API(env.ALS_TOKEN);
setTweaks(self);


export default function 맵() {
	useDescription("에이펙스 레전드의 맵 로테이션 정보를 확인합니다.");
	const gamemode = useString("게임모드", "특정 게임모드의 맵 정보를 확인합니다.", {
		required: false,
		choices: [{
			name: "배틀로얄 (기본값)",
			value: "battle_royale"
		}, {
			name: "랭크",
			value: "ranked"
		}, {
			name: "아레나",
			value: "arenas"
		}, {
			name: "아레나 랭크",
			value: "arenasRanked"
		}]
	});


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