type Props = {
	colour: string;
	borderColour?: string;
	opacity?: number;
};

export default function SecurePadlockCircle({
	colour,
	borderColour = '#DCDCDC',
	opacity = 1,
}: Props): JSX.Element {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="28"
			height="28"
			viewBox="0 0 28 28"
			fill="none"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M11.1709 10.9221C11.1709 9.35369 12.441 8.08224 14.0078 8.08224C15.5746 8.08224 16.8447 9.35369 16.8447 10.9221H17.9794C17.9794 8.72632 16.2013 6.94629 14.0078 6.94629C11.8143 6.94629 10.0361 8.72632 10.0361 10.9221H11.1709ZM10.0361 10.9221L10.0361 12.342L9.46875 12.91V19.7257L10.0361 20.2937H17.9794L18.5468 19.7257V12.91L17.9794 12.3421V10.9221H16.8447V12.342H11.1709V10.9221H10.0361ZM14.8588 15.4659C14.8588 15.8368 14.622 16.1524 14.2914 16.2694V17.4538H13.7241V16.2694C13.3935 16.1524 13.1567 15.8369 13.1567 15.4659C13.1567 14.9954 13.5377 14.6139 14.0077 14.6139C14.4778 14.6139 14.8588 14.9954 14.8588 15.4659Z"
				fill={colour}
				fill-opacity={opacity}
			/>
			<circle cx="14.0048" cy="14.2865" r="12.8876" stroke={borderColour} />
		</svg>
	);
}
