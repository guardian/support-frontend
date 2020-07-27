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
  display: flex;
  flex-grow: 1;
  flex-basis: ${space[24] * 10}px;
  padding-left: ${space[5]}px;
  padding-bottom: ${space[5]}px;
  ${props => props.leftBorder && `border-left: 1px solid ${brand[600]}; border-right: 1px solid ${brand[600]};`}
  border-bottom: 1px solid ${brand[600]};
`;
