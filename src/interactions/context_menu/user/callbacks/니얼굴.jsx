import {
	createElement,
	useDescription,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	escape
} from "../../../../.modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);


export default {
	"니얼굴": () =>{
		return async (interaction, cfg, ctx, targetUser) => {
			if(targetUser.id === "840594543291269120") {
				return (
					<Message>
						{`<@${interaction.member.user.id}> ㅗㅗ`}
					</Message>
				);
			} else {
				return (
					<Message>
						{`<@${targetUser.id}>님, <@${interaction.member.user.id}>님이 니얼굴이래요`}
					</Message>
				);
			}
		};
	}
};