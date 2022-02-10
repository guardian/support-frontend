// Alternate error exclamation mark, used on Direct Debit pop up and Payment Failure messages

export default function SvgExclamationAlternate() {
	return (
		<svg
			className="svg-exclamation-alternate"
			width="22"
			height="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g transform="translate(1 1)">
				<circle
					cx="10"
					cy="10"
					r="10"
					className="svg-exclamation-alternate__circle"
				/>
				<path
					d="M8.786 4.832l.518 6.674h1.428l.536-6.674-.518-.546H9.304l-.518.546zm2.643 9.491c0-.775-.643-1.409-1.447-1.409a1.42 1.42 0 0 0-1.41 1.41c0 .756.642 1.39 1.41 1.39.786 0 1.447-.634 1.447-1.39z"
					className="svg-exclamation-alternate__exclamation-mark"
				/>
			</g>
		</svg>
	);
}
