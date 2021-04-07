/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { neutral } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { from, until } from '@guardian/src-foundations/mq';

// import GridImage from 'components/gridImage/gridImage';
import FlexContainer from '../../../../components/containers/flexContainer';

type BenefitsSection = {
    id: string;
    content: React.ReactChild;
};

type PropTypes = {
    sections: BenefitsSection[];
};

const benefits = css`
    justify-content: space-between;
    align-items: flex-start;
    border-top: 1px solid ${neutral[86]};
    border-bottom: 1px solid ${neutral[86]};
    ${from.tablet} {
        border: 1px solid ${neutral[86]};
    }
`;

const benefitsBlocks = css`
    display: flex;
    flex-direction: column;
    ${from.tablet} {
        min-width: 50%;
    }
`;

const benefitsBlock = css`
    padding: ${space[3]}px;
    ${until.tablet} {
        &:not(:first-of-type) {
            border-top: 1px solid ${neutral[86]};
        }
    }
`;

const imageContainer = css`
    align-self: flex-end;
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;

    ${from.tablet} {
        width: 40%;
    }

    & img {
        max-width: 100%;
    }
`;

function BenefitsContainer({ sections }: PropTypes): React.ReactElement {
    return (
        <FlexContainer cssOverrides={benefits}>
            <div css={benefitsBlocks}>
                {sections.map((benefitsSection) => (
                    <section key={benefitsSection.id} id={benefitsSection.id} css={benefitsBlock}>
                        {benefitsSection.content}
                    </section>
                ))}
            </div>
            <div css={imageContainer}>
                {
                    <img
                        className="component-grid-image"
                        sizes="(max-width: 740px) 100%, (max-width: 1067px) 150%, 500px"
                        srcSet="https://media.guim.co.uk/340db3a4561cbd502dc59b764ab8d93433511103/0_255_1972_1183/140.png 140w, https://media.guim.co.uk/340db3a4561cbd502dc59b764ab8d93433511103/0_255_1972_1183/500.png 500w, https://media.guim.co.uk/340db3a4561cbd502dc59b764ab8d93433511103/0_255_1972_1183/1000.png 1000w"
                        src="https://media.guim.co.uk/340db3a4561cbd502dc59b764ab8d93433511103/0_255_1972_1183/500.png"
                        alt="Spread pages of the Guardian Weekly magazine"
                    />
                }
            </div>
        </FlexContainer>
    );
}

export default BenefitsContainer;
