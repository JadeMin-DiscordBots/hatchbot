import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	setTweaks,
	formatMinutes, escapers,
} from "./modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
setTweaks(self);


export default function 도움말() {
	useDescription("사용 가능한 모든 명령어와 사용법을 확인합니다.")
	return () => (
		<Message>
			<Embed title="도움말 목록을 불러오는 중입니다...">
				{`예상 완료 시간 : \`${formatMinutes(randomInt(96854851, 6857485141))}\``}
			</Embed>
		</Message>
	);
};