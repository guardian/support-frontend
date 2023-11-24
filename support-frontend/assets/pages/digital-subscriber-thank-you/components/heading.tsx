const MAX_DISPLAY_NAME_LENGTH = 10;

interface HeadingProps {
	name: string | null;
}

function Heading({ name }: HeadingProps): JSX.Element {
	const maybeNameCommaAndSpacing: string =
		name && name.length < MAX_DISPLAY_NAME_LENGTH ? `, ${name}, ` : ` `;

	return (
		<div>
			Thank you{maybeNameCommaAndSpacing}for subscribing to the digital edition
		</div>
	);
}

export default Heading;
