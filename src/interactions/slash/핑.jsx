import {
	WebLogger
} from "../../.modules/tweak_functions";
import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,

	editOriginalInteractionResponse,
} from 'slshx';
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);

export default () => {
	useDescription("Cloudflare Workers 딜레이를 확인합니다.");
	const firstTime = Date.now();

	return (interaction, workerConfig, workerContext) => {
		workerContext.waitUntil((async () => {
			await editOriginalInteractionResponse(interaction.application_id, interaction.token, (
				<Message>핑을 확인하는 중입니다...</Message>
			));
			await editOriginalInteractionResponse(interaction.application_id, interaction.token, (
				<Message>핑: `{Date.now() - firstTime}ms`</Message>
			));
		})());

		return <Message>핑을 확인하는 중입니다...</Message>;
	};
};