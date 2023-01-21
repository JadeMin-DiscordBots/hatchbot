import { DateTime, Settings } from 'luxon';
import {
	WebLogger,
	luxonSetup
} from "../../.modules/tweak_functions";
import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,

	getOriginalInteractionResponse
} from 'slshx';
luxonSetup(Settings);
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);

export default () => {
	useDescription("Discord 엔드포인트의 딜레이를 확인합니다.");
	const respondDate = Date.now();


	return async function*(interaction) {
		yield;
		const originalMsg = await getOriginalInteractionResponse(interaction.application_id, interaction.token);
		const timestamp = DateTime.fromISO(originalMsg.timestamp).toMillis();

		return <Message>Latency `{timestamp - respondDate}ms`</Message>;
	};
};