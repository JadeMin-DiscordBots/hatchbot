import _ from 'lodash';
import {
	WebLogger,
	escape,
} from "../../.modules/tweak_functions";
import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);

export default function() {
	useDescription("텍스트를 아름답게 데코레이션합니다.");
	const argv_type = useString("기법", "데코 기법을 선택하세요", {
		required: true,
		choices: [{
			name: "계단가야_계단가야",
			value: "per_words"
		}, {
			name: "계_단_가_야",
			value: "per_chars"
		}]
	});
	const argv_msg = useString("메시지", "아름답게 내용할 메시지를 도킹하세요", {
		required: true,
		min:2, max:100
	}) ?? 1;
	const argv_repeat = useInteger("반복", "반복 횟수를 입력하세요", {
		required: false,
		min:2, max:100
	}) ?? 1;


	switch(argv_type){
		case "per_words": {
			return (interaction) => {
				const result = (() => {
					const upstair = _.range(argv_repeat).map(i=> argv_msg.repeat(i + 1));
					const downstair = _.range(argv_repeat).map(i=> argv_msg.repeat(i)).reverse();
					return [...upstair, ...downstair].join('\n');
				})();

				if(argv_repeat <= 1) {
					return (
						<Message ephemeral>
							{/*`<@${interaction.member.user.id}>, 해당 기법은 반복 횟수를 지정해야 합니다.`*/}
							해당 기법은 반복 횟수를 지정해야 합니다.
						</Message>
					);
				} else {
					return (
						<Message>
							{escape.all(result).substr(0, 2000)}
						</Message>
					);
				}
			};
		};
		case "per_chars": {
			return () => {
				const result = (() => {
					const repeatedMsg = argv_msg.repeat(argv_repeat);
					const upstair = _.range(repeatedMsg.length).map(i=> repeatedMsg.slice(0, i+1));
					const downstair = _.range(repeatedMsg.length).map(i=> repeatedMsg.slice(0, i)).reverse();
					return [...upstair, ...downstair].join('\n');
				})();

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