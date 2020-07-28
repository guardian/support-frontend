import styled from '@emotion/styled';
import { from } from '@guardian/src-foundations/mq';
import { brand } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';

export const WithMargins = styled.div`
  display: flex;
  ${from.tablet} {
    &:before, &:after {
      display: block;
      content: "";
      flex-basis: 0;
      flex-grow: 1;
    }
  }
`;

export const Content = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-basis: ${space[24] * 10}px;
  padding: 0 ${space[5]}px;
  padding-bottom: ${space[4]}px;
  ${props => props.paddingTop && `padding-top: ${space[4]}px;`}
  border-bottom: 1px solid ${brand[600]};

  ${from.leftCol} {
    ${props => props.border && `border-left: 1px solid ${brand[600]}; border-right: 1px solid ${brand[600]};`}
  }
`;
