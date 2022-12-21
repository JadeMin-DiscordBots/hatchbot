import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';


export default function 테스트() {
	useDescription("테스트 명령어입니다.");
	const msg = useString("메시지", "메시지 내용을 입력해주세요.", {required: false});

	return () => (
		<Message ephemeral>
			{msg}
		</Message>
	);
};