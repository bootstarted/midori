// @flow
import styled, {css} from 'styled-components';

const calc = (colSpan, columns) => colSpan * 100 / columns;

const Col = styled.div`
  position: relative;
  ${({span, columns}) => {
    return css`
      display: inline-block;
      width: ${calc(span, columns)}%;
    `;
  }};
  vertical-align: top;
  padding: ${({gutters, theme}) => theme.spacings[gutters] || 0}rem;
  zoom: 1;
`;

export default Col;
