import { css } from '@emotion/core';

export const yellowChoiceCard = css`
  &:checked + label {
    background-color: #FFE500;
    box-shadow: inset 0 0 0 4px #F3C100;
    color: #121212;
  };
  &:hover + label {
    box-shadow: inset 0 0 0 4px #F3C100;
    color: #121212;
  }
`;
