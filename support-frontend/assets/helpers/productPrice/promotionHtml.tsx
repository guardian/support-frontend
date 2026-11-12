type PromotionHTMLModifiers = {
	css?: string;
	tag?: keyof JSX.IntrinsicElements;
};

export function promotionHTML(
	html?: string,
	{ css = '', tag = 'span' }: PromotionHTMLModifiers = {},
): JSX.Element | null {
	if (!html) {
		return null;
	}

	const TagName = tag;
	return (
		<TagName
			css={css}
			dangerouslySetInnerHTML={{
				__html: html,
			}}
		/>
	);
}
