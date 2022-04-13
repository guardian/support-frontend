import GridImage from 'components/gridImage/gridImage';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { AUDCountries } from 'helpers/internationalisation/countryGroup';

type PropTypes = {
	countryGroupId: CountryGroupId;
};

function DigitalPackshotHero(props: PropTypes) {
	return (
		<div className="subscriptions-feature-packshot">
			<GridImage
				classModifiers={['']}
				gridId={
					props.countryGroupId === AUDCountries
						? 'editionsPackshotAusShort'
						: 'editionsPackshotShort'
				}
				srcSizes={[1000, 500]}
				sizes="(max-width: 480px) 100px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            800px"
				imgType="png"
			/>
		</div>
	);
}

export default DigitalPackshotHero;
