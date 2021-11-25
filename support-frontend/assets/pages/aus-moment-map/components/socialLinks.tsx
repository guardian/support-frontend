import React from 'react';

const twitterCopy =
	'Hear%20from%20supporters%20across%20Australia%3A%20as%20the%20Guardian%20grows%20its%20community%20and%20reaches%20more%20people%2C%20many%20readers%20have%20shared%20their%20reason%20for%20supporting%20them%20financially.%20Read%20their%20messages%20here';
const emailHeadline =
	'Hear%20from%20Guardian%20supporters%20across%20Australia';
const emailBody =
	'Guardian%20Australia%20is%20growing%20its%20community%20and%20reaching%20more%20people%20than%20ever%20before.%20Many%20readers%20have%20shared%20their%20reason%20for%20supporting%20them%20financially%2C%20and%20you%20can%20read%20their%20messages%20here%3A%0A%0Ahttps%3A%2F%2Fsupport.theguardian.com%2Faus-map';
const links = {
	facebook:
		'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsupport.theguardian.com%2Faus-map',
	twitter: `https://twitter.com/intent/tweet?url=https%3A%2F%2Fsupport.theguardian.com%2Faus-map&hashtags=supporttheguardian&text=${twitterCopy}`,
	email: `mailto:?subject=${emailHeadline}&body=${emailBody}?INTCMP=component-social-email`,
};
const iconColour = '#052962';
export const SocialLinks = () => (
	<div className="social-links">
		<a href={links.facebook} target="_blank" rel="noopener noreferrer">
			<svg
				className="social-link"
				width="36"
				height="36"
				viewBox="0 0 36 36"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					cx="18"
					cy="18"
					r="17.5882"
					stroke="#DCDCDC"
					strokeWidth="0.823529"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M16.3469 13.9626V16.2354H14V18.7444H16.3469V26.2354H19.1734V18.7444H21.4861L22 16.2354H19.1734V14.2354C19.1734 13.1263 19.7902 12.7444 20.5953 12.7444H22L21.9143 10.3626C21.212 10.2899 20.6638 10.2354 19.8587 10.2354C17.8544 10.2354 16.3469 11.5626 16.3469 13.9626Z"
					fill={iconColour}
				/>
			</svg>
		</a>

		<a href={links.twitter} target="_blank" rel="noopener noreferrer">
			<svg
				className="social-link"
				width="36"
				height="36"
				viewBox="0 0 36 36"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					cx="18"
					cy="18"
					r="17.5882"
					stroke="#DCDCDC"
					strokeWidth="0.823529"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M26.7059 13.7666C26.0695 14.0401 25.5059 14.2042 24.7968 14.2954C25.5422 13.876 26.0331 13.2561 26.2695 12.4721C25.6331 12.782 24.8877 13.2014 24.1786 13.2561C23.5786 12.6544 22.7786 12.235 21.7604 12.235C19.9786 12.235 18.4877 13.7301 18.4877 15.517C18.4877 15.7175 18.5059 16.0639 18.5786 16.2645C15.7968 16.1186 13.5241 14.8423 11.7968 12.8185C11.5604 13.3108 11.3604 13.8942 11.3604 14.4777C11.3604 15.5717 11.9422 16.6839 12.8331 17.2126C12.5422 17.2673 11.615 16.9756 11.3241 16.8297C11.3241 18.5254 12.5059 19.747 13.9786 20.0934C13.415 20.2393 12.9786 20.2757 12.4877 20.1481C12.9422 21.4609 14.0877 22.409 15.5422 22.409C14.4513 23.3388 13.015 23.8311 11.4877 23.8494C11.215 23.7947 10.9241 23.8494 10.7059 23.7947C12.1059 24.7245 13.9241 25.235 15.7422 25.235C21.7604 25.235 25.0877 20.2393 25.0877 15.8998C25.0877 15.7722 25.0513 15.6081 25.0513 15.4805C25.7059 14.9882 26.2695 14.4048 26.7059 13.7666Z"
					fill={iconColour}
				/>
			</svg>
		</a>

		<a href={links.email} target="_blank" rel="noopener noreferrer">
			<svg
				className="social-link"
				width="36"
				height="36"
				viewBox="0 0 36 36"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					cx="18"
					cy="18"
					r="17.5882"
					stroke="#DCDCDC"
					strokeWidth="0.823529"
				/>
				<path
					d="M25.632 13.4238L18.8533 18.8226H17.6174L10.8388 13.4238L11.5582 12.6461H24.9125L25.632 13.4238Z"
					fill={iconColour}
					stroke={iconColour}
					strokeWidth="0.823529"
				/>
				<path
					d="M10.2354 22.1435V15.2344L17.4735 20.3253H18.9973L26.2354 15.2344V22.1435L25.0925 23.2344H11.3782L10.2354 22.1435Z"
					fill={iconColour}
				/>
			</svg>
		</a>
	</div>
);
