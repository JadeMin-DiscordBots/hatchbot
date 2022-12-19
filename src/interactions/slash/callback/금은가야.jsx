import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput,
} from 'slshx';
import {
	WebLogger,
	setTweaks, escapers,
} from ".../modules/tweak_functions";
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);
setTweaks(self);


export default function 금은가야() {
	const type = useString("기법");
	const msg = useString("메시지");
	const repeat = useNumber("반복") ?? 1;

	
	switch(type){
		case "shuffle": {
			return () => <Message>{escapers.all(msg.repeat(repeat).shuffle().slice(0, 1999))}</Message>;
		};
		case "reverse": {
			return () => <Message>{escapers.all(msg.repeat(repeat).reverse().slice(0, 1999))}</Message>;
		};
		default: {
			return () => <Message>{type}은(는) 존재하지 않는 타입입니다.</Message>;
		};
	};
};