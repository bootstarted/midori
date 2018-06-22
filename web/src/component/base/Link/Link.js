// @flow

// Import modules ==============================================================
import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import type {Node} from 'react';

export const isAbsoluteRegExp = /^(([a-z]+[-+\.a-z0-9]*:)|(\/\/))/i;

export type Props = {
  to: string,
  replace?: boolean,
  children?: Node,
  external?: boolean,
  onClick?: (SyntheticEvent<HTMLAnchorElement>) => void,
};

export const Link = (props: Props) => {
  if (
    props.external === true ||
    (typeof props.to === 'string' && isAbsoluteRegExp.test(props.to))
  ) {
    const {
      to,
      replace: _replace,
      external: _external,
      children,
      ...rest
    } = props;
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  const {external: _external, ...rest} = props;
  return <RouterLink {...rest} />;
};

export default Link;
