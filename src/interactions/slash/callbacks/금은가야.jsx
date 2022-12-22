import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	setTweaks, escapers,
} from "../../../.modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
setTweaks(self);



export default function() {
	useDescription("금은가야 암호화 기법을 사용하여 메시지를 변환합니다.");
	const type = useString("기법", "암호화 기법을 선택하세요", {
		required: true,
		choices: [{
			name: "은금가야",
			value: "shuffle"
		}, {
			name: "야가은금",
			value: "reverse"
		}]
	});
	const msg = useString("메시지", "암호화할 메시지를 입력하세요", {
		required: true
	});
	const repeat = useInteger("반복", "반복 횟수를 입력하세요", {
		required: false,
		min: 1, max: 100
	}) ?? 1;

	
	switch(type){
		case "shuffle": {
			return () => <Message>{escapers.all(msg.repeat(repeat).shuffle().substr(0, 2000))}</Message>;
		};
		case "reverse": {
			return () => <Message>{escapers.all(msg.repeat(repeat).reverse().substr(0, 2000))}</Message>;
		};
		default: {
			return () => <Message>{type}은(는) 존재하지 않는 타입입니다.</Message>;
		};
	};
};