import {
	WebLogger,
	escape,
	MDN_API
} from "../../.modules/tweak_functions";
import {
	createElement,
	useDescription,
	useString, useNumber, useInteger, useBoolean,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
	useButton, useModal, useInput
} from 'slshx';
const Logger = new WebLogger(env.LOGHOOK_ID, env.LOGHOOK_TOKEN);

export default {
	"docs": {
		"mdn_web": () => {
			useDescription("MDN 웹 문서에서 JavaScript 문법을 검색합니다.");
			const argv_query = useString("검색어", "검색할 문법을 입력해주세요.", {
				required: true
			});


			return async function*() {
				yield;
				const api = await MDN_API.search(argv_query);
				
				if(api.data?.documents?.length) {
					const targetDocument = api.data.documents[0];
					return (
						<Message>
							{`[${targetDocument.title}](<${MDN_API.baseUrl}${targetDocument.mdn_url}>)`}
							{`\`\`\`js\n${targetDocument.summary}\`\`\``}
						</Message>
					);
				} else {
					return <Message>`{escape.all(api.query)}`에 대한 검색 결과가 없습니다.</Message>;
				}
			};
		},
		/*"c언어": () => {
			useDescription("C언어 문법을 검색합니다.");

			return <Message>개발 중</Message>;
		}*/
	}
};