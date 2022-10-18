import { getThankYouModuleData } from './thankYouModuleData';

export type ThankYouModuleType = 'downloadTheApp' | 'feedback' | 'shareSupport';

export interface ThankYouModuleProps {
	moduleType: ThankYouModuleType;
	isSignedIn: boolean;
}

function ThankYouModule({
	moduleType,
	isSignedIn,
}: ThankYouModuleProps): JSX.Element {
	const { icon, heading, bodyCopy, ctas, img, qrCodes } =
		getThankYouModuleData(moduleType);

	return (
		<div>
			<div>
				<div>
					<i>{icon}</i>
					<p>{heading}</p>
				</div>
				<p>{bodyCopy}</p>
				<div>{ctas}</div>
			</div>

			{moduleType === 'downloadTheApp' && img ? img : null}

			{moduleType === 'downloadTheApp' && isSignedIn && qrCodes
				? qrCodes
				: null}
		</div>
	);
}

export default ThankYouModule;
