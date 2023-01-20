import {
	createElement,
	useDescription,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,

	deleteFollowupMessage,
} from 'slshx';
import {
	WebLogger
} from "../../../.modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);

export default {
	"봇 메시지 삭제 (베타)": () => {
		return (interaction, cfg, ctx, targetMessage) => {
			// 만약 메시지가 상호작용 메시지라면
			if(!targetMessage.hasOwnProperty('interaction')) return (
				<Message ephemeral>
					해당 메시지는 명령어 메시지가 아닙니다.
				</Message>
			);
			if(interaction.member.user.id !== targetMessage.interaction.user.id) return (
				<Message ephemeral>
					해당 명령어를 사용한 사용자만 삭제할 수 있습니다.
				</Message>
			);
			
			deleteFollowupMessage(interaction.application_id, interaction.token, targetMessage.id);
			return (
				<Message ephemeral>
					메시지 삭제 요청을 전송했습니다.
				</Message>
			);
		};
	}
};