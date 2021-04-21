import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { layerStyles, typography } from '../designTokens';
import { fontProps } from '../utilities';

export type ButtonProps = {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Button = styled.button<ButtonProps>`
  appearance: none;
  border: 1px solid ${layerStyles.borderWfGrey1.borderColor};
  border-radius: 4px;
  padding: 6px 15px;
  
  ${fontProps(typography.body.body)};

  ${({ primary }) => css`
    background-color: ${primary ? layerStyles.wfGrey1.fillColor : layerStyles.borderWfGrey1.fillColor};
  `}
`;
