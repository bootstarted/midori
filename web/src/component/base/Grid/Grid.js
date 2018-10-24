// @flow
import * as React from 'react';
import styled from 'styled-components';

import Col from './Col';

const GridContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0 auto;
  position: relative;
  ${({align}) => (align ? `align-items: ${align};` : '')}
  margin: -${({gutters, theme}) => theme.spacings[gutters]}rem;
`;

type Props = {
  children: React.Node,
  columns: number,
  gutters: string,
  align: string,
};

class Grid extends React.PureComponent<Props> {
  static Col = Col;
  render() {
    const {
      children,
      columns = 12,
      gutters = 'small',
      align,
      ...rest
    } = this.props;
    return (
      <GridContainer gutters={gutters} align={align}>
        {React.Children.map(children, (child) => {
          if (child !== null) {
            return React.cloneElement(child, {
              columns,
              gutters,
            });
          }
          return null;
        })}
      </GridContainer>
    );
  }
}

export default Grid;
