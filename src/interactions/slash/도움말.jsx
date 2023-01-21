import { random } from 'lodash-es';
import {
	WebLogger,
	formatMinutes
} from "../../.modules/tweak_functions";
import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';

export default {
	"도움말": () => {
		useDescription("사용 가능한 모든 명령어와 사용법을 확인합니다.");
		const cmdName = useString("명령어", "원하는 명령어의 이름을 입력합니다.", {
			required: false,
			choices: [{
				name: "응 원이야",
				value: "fighting"
			}]
		});
		

		return () => (
			<Message>
				<Embed title="도움말 목록을 불러오는 중입니다...">
					{`예상 완료 시간 : \`${formatMinutes(random(96854851, 6857485141))}\``}
				</Embed>
			</Message>
		);
	}
};