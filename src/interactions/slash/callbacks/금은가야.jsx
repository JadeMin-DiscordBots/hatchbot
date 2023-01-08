import _ from 'lodash';
import {
	WebLogger,
	escape,
} from "../../../.modules/tweak_functions";
import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
const toStairing = (str) => {
	let result = []; //결과값
	
	[...str].forEach((value, index) => {
		result.push(str.slice(0, index + 1));
	});
	return result;
}



export default function() {
	useDescription("금은가야 암호화 기법을 사용하여 메시지를 변환합니다.");
	const type = useString("기법", "암호화 기법을 선택하세요", {
		required: true,
		choices: [{
			name: "계금가야",
			value: "stair"
		}, {
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
		case "stair": {
			return () => {
				const result = (() => {
					let upstair = [], downstair = [];
					for(let i=0; i < msg.length; i++) {
						upstair.push(msg.slice(0, i));
					}
					for(let i=0; i < msg.length; i++) {
						downstair.push(msg.slice(0, i+1));
					}

					return [...upstair, ...downstair.reverse()].join('\n');
				})();

				return (
					<Message>
						{escape.all(result).substr(0, 2000)}
					</Message>
				);
			};
		};
		case "shuffle": {
			return () => {
				const result = _.shuffle(msg.repeat(repeat).split('')).join('');

				return (
					<Message>
						{escape.all(result).substr(0, 2000)}
					</Message>
				);
			};
		};
		case "reverse": {
			return () => {
				const result = _.msg.repeat(repeat).split('').reverse().join('');

				return (
					<Message>
						{escape.all(result).substr(0, 2000)}
					</Message>
				);
			};
		};
		default: {
			return () => (
				<Message>
					{type}은(는) 존재하지 않는 타입입니다.
				</Message>
			);
		};
	};
};