import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';


export default {
	"테스트 메시지메뉴": function() {
		return (interaction, cfg, ctx, message) => (
			<Message ephemeral>
				테스트 메시지 메뉴를 누르셨네요.
			</Message>
		);
	}
}