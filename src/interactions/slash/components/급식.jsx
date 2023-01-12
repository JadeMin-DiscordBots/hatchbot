import {
	createElement,
	Fragment, Message, Embed, Field, Modal, Button, Input, Row,
} from 'slshx';



export const MenuEmbed = (props) => (
	<Embed
		title={props.title}
		footer={props.footer}
	>
		{props.data.DDISH_NM.replace(/(\.|\s{2})|\([0-9가-힣/.]+\)/g, '').replace(/\<br\/?\>/g, '\n')}
	</Embed>
);
export const NutritionEmbed = (props) => (
	<Embed
		title={props.title}
		footer={`총 ${props.data.CAL_INFO.toLowerCase()}`}
	>
		{props.data.NTR_INFO.split(/\<br\/?\>/).map(ntr=> {
			const [key, value] = ntr.split(" : ");
			return (
				<Field name={key} inline>
					{value}
				</Field>
			);
		})}
	</Embed>
);

export default {
	MenuEmbed,
	NutritionEmbed
};