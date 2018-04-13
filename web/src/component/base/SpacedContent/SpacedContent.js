// Import modules ==============================================================
import styled, {css} from 'styled-components';

const defaultProps = {
  size: 'normal',
};

const getHeader = ({size, horizontal, header, theme}) => {
  if (!header) {
    return '';
  }
  const amount = `${theme.spacings[size]}rem`;
  if (horizontal) {
    return css`
      padding-left: ${amount};
    `;
  }
  return css`
    padding-top: ${amount};
  `;
};

const getTrailer = ({size, horizontal, trailer, theme}) => {
  if (!trailer) {
    return '';
  }
  const amount = `${theme.spacings[size]}rem`;
  if (horizontal) {
    return css`
      padding-right: ${amount};
    `;
  }
  return css`
    padding-bottom: ${amount};
  `;
};

const getSpacing = (props) => {
  const {size, horizontal, theme} = props;
  const amount = `${theme.spacings[size]}rem`;
  if (horizontal) {
    return css`
      ${getHeader(props)};
      ${getTrailer(props)};
      > * {
        margin-left: ${amount};
        margin-right: ${amount};
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    `;
  }
  return css`
    ${getHeader(props)};
    ${getTrailer(props)};
    > * {
      margin-top: ${amount};
      margin-bottom: ${amount};
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  `;
};

const SpacedContent = styled.div`
  ${(props) => getSpacing(props)};
`;

SpacedContent.defaultProps = defaultProps;

export default SpacedContent;
