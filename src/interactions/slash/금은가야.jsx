import { shuffle, reverse } from 'lodash-es';
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

export default {
	"금은가야": () => {
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


		const [input_id, input_value] = useInput();
		const [repeat_id, repeat_value] = useInput();
		const shuffleModal_id = useModal(() => {
			const msg = input_value.repeat(+repeat_value.replace(/[^0-9]*/g, '') || 1);
			const result = shuffle(msg.split('')).join('');
			return <Message>{escape.all(result).substring(0, 1999)}</Message>;
		});
		const reverseModal_id = useModal(() => {
			const msg = input_value.repeat(+repeat_value.replace(/[^0-9]*/g, '') || 1);
			const result = reverse(msg.split('')).join('');
			return <Message>{escape.all(result).substring(0, 1999)}</Message>;
		});

		return async () => {
			switch(argv_type){
				case "shuffle": {
					return (
						<Modal id={shuffleModal_id} title="은끔까야_윈또우_뻐뜬">
							<Input
								id={input_id}
								label="몌씨찌 냬용"
								required
								paragraph
								minLength={2}
								maxLength={50}
							/>
							<Input
								id={repeat_id}
								label="반복 횟수"
								minLength={2}
								maxLength={2}
							/>
						</Modal>
					);
				};
				case "reverse": {
					return (
						<Modal id={reverseModal_id} title="야까은끔_윈또우_뻐뜬">
							<Input
								id={input_id}
								label="몌씨찌 냬용"
								required
								paragraph
								minLength={2}
								maxLength={50}
							/>
							<Input
								id={repeat_id}
								label="반복 횟수"
								minLength={2}
								maxLength={2}
							/>
						</Modal>
					);
				};
				default: {
					throw new TypeError(`${argv_type}은(는) 존재하지 않는 타입입니다.`);
				};
			};
		};
	}
};