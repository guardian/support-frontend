import { headerTitleText } from './headingStyles';

export default function GenericHeading({
	contributorName,
}: {
	contributorName: string;
}) {
	return (
		<h1 css={headerTitleText}>
			Thank you <span data-qm-masking="blocklist">{contributorName}</span> for
			your valuable contribution
		</h1>
	);
}
