const MenuEmbed = (props) => (
	<Embed
		title="오늘의 급식표"
		footer={props.data.MMEAL_SC_NM}
	>
		{
			props.data.DDISH_NM.replace(/(\.|\s{2})|\([0-9가-힣/.]+\)/g, '').split(/\<br\/?\>/).join('\n')
		}
	</Embed>
);
const NutritionEmbed = (props) => (
	<Embed title="영양 정보">
		{`> 총 ${props.data.CAL_INFO}`}
		{
			props.data.NTR_INFO.split(/\<br\/?\>/).map(ntr=> {
				const [key, value] = ntr.split(" : ");
				return (
					<Field name={key} inline>
						{value}
					</Field>
				);
			})
		}
	</Embed>
);

export default {
	MenuEmbed, NutritionEmbed
};