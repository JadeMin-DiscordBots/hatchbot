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
			name: "은금가야",
			value: "shuffle"
		}, {
			name: "야가은금",
			value: "reverse"
		}]
	});
	const argv_repeat = useInteger("반복", "반복 횟수를 입력하세요", {
		required: false,
		min:2, max:100
	}) ?? 1;


	const [input_id, input_value] = useInput();
	const msg = input_value.repeat(argv_repeat);
	const shuffleModal_id = useModal(() => {
		const result = _.shuffle(msg.split('')).join('');
		return (
			<Message>
				{escape.all(result).substr(0, 2000)}
			</Message>
		);
	});
	const reverseModal_id = useModal(() => {
		const result = msg.split('').reverse().join('');
		return (
			<Message>
				{escape.all(result).substr(0, 2000)}
			</Message>
		);
	});
	switch(argv_type){
		case "shuffle": {
			return () => (
				<Modal id={shuffleModal_id} title="은끔까야_윈또우_뻐뜬">
					<Input
						id={input_id}
						label="몌씨찌 냬용"
						required
						paragraph
						minLength={2}
						maxLength={50}
					/>
				</Modal>
			);
		};
		case "reverse": {
			return () => (
				<Modal id={reverseModal_id} title="야까은끔_윈또우_뻐뜬">
					<Input
						id={input_id}
						label="몌씨찌 냬용"
						required
						paragraph
						minLength={2}
						maxLength={50}
					/>
				</Modal>
			);
		};
		default: {
			throw new TypeError(`${argv_type}은(는) 존재하지 않는 타입입니다.`);
		};
	};
};