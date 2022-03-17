import Text from 'components/text/text';

export const cancellationCopy = {
	title: 'You can cancel any time',
	body: 'There is no set time on your agreement with us so you can end your subscription whenever you wish',
};

function CancellationPolicy() {
	return (
		<Text>
			<p>
				<strong>{cancellationCopy.title}</strong> {cancellationCopy.body}
			</p>
		</Text>
	);
}

CancellationPolicy.defaultProps = {
	orderIsAGift: false,
};
export default CancellationPolicy;
