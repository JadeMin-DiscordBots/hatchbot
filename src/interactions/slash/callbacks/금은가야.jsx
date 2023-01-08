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


export default function() {
	useDescription("금은가야 기술을 사용하여 텍스트를 암호화합니다.");
	const argv_type = useString("기법", "암호화 기법을 선택하세요", {
		required: true,
		choices: [{
			name: "계단가야_계단가야",
			value: "stair_per_words"
		}, {
			name: "계_단_가_야",
			value: "stair_per_chars"
		}, {
			name: "은금가야",
			value: "shuffle"
		}, {
			name: "야가은금",
			value: "reverse"
		}]
	});
	const argv_msg = useString("메시지", "암호화할 메시지를 입력하세요", {
		required: true
	});
	const argv_repeat = useInteger("반복", "반복 횟수를 입력하세요", {
		required: false,
		min:2, max:100
	}) ?? 1;

	const msg = argv_msg.repeat(argv_repeat);
	switch(argv_type){
		case "stair_per_words": {
			const result = (() => {
				let upstair = [], downstair = [];
				_.times(argv_repeat, i=> upstair.push(argv_msg.repeat(i + 1)));
				_.times(argv_repeat, i=> downstair.push(argv_msg.repeat(i)));
				return [...upstair, ...downstair.reverse()].join('\n');
			})();


			return (interaction) => {
				if(argv_repeat <= 1) {
					return (
						<Message ephemeral>
							{`<@${interaction.member.user.id}>`}, 이 암호화 기법은 반복 횟수를 지정해야 합니다.
						</Message>
					);
				}
				return (
					<Message>
						{escape.all(result).substr(0, 2000)}
					</Message>
				);
			};
		};
		case "stair_per_chars": {
			const result = (() => {
				let upstair = [], downstair = [];
				_.times(msg.length, i=> upstair.push(msg.slice(0, i+1)));
				_.times(msg.length, i=> downstair.push(msg.slice(0, i)));
				return [...upstair, ...downstair.reverse()].join('\n');
			})();


			return () => (
				<Message>
					{escape.all(result).substr(0, 2000)}
				</Message>
			);
		};
		case "shuffle": {
			return () => {
				const result = _.shuffle(msg.split('')).join('');

				return (
					<Message>
						{escape.all(result).substr(0, 2000)}
					</Message>
				);
			};
		};
		case "reverse": {
			return () => {
				const result = msg.split('').reverse().join('');

				return (
					<Message>
						{escape.all(result).substr(0, 2000)}
					</Message>
				);
			};
		};
		default: {
			throw new TypeError(`${argv_type}은(는) 존재하지 않는 타입입니다.`);
		};
	};
};