type Props = {
	colour: string;
	opacity?: number;
};

export function SecurePadlock({ colour, opacity = 1 }: Props): JSX.Element {
	return (
		<svg
			width="10"
			height="15"
			viewBox="0 0 10 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
		>
			<title>Padlock</title>
			<desc>Padlock indicating this is a secure transaction</desc>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M1.99992 4.99999C1.99992 3.34313 3.34307 1.99999 4.99992 1.99999C6.65678 1.99999 7.99993 3.34313 7.99993 4.99999H9.19992C9.19992 2.68039 7.31952 0.799988 4.99992 0.799988C2.68033 0.799988 0.799922 2.68039 0.799922 4.99999H1.99992ZM0.799922 4.99999V6.50002L0.199951 7.09999V14.3L0.799949 14.9H9.19993L9.79992 14.3V7.09999L9.19993 6.49999L9.19992 4.99999H7.99993V6.49999H1.99992V4.99999H0.799922ZM5.89991 9.79999C5.89991 10.1919 5.64947 10.5252 5.29992 10.6488V11.9H4.69991V10.6488C4.35036 10.5252 4.09991 10.1919 4.09991 9.79999C4.09991 9.30293 4.50286 8.89999 4.99991 8.89999C5.49697 8.89999 5.89991 9.30293 5.89991 9.79999Z"
				fill={colour}
				fill-opacity={opacity}
			/>
		</svg>
	);
}
