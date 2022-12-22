import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	setTweaks
} from "../../../../.modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);



export default {
	"테스트 유저메뉴": function() {
		return (interaction, cfg, ctx, user) => (
			<Message ephemeral>
				{`<@${user.id}>님의 메뉴를 누르셨네요.`}
			</Message>
		);
	}
};