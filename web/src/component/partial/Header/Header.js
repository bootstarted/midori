import * as React from 'react';

import Container from '/component/base/Container';
import Link from '/component/base/Link';

class Header extends React.PureComponent {
  render() {
    return (
      <Container>
        <nav>
          <Link to="/">midori</Link>
          <Link to="/getting-started">Getting Started</Link>
          <Link to="/examples">Examples</Link>
          <Link to="/api-reference">API Reference</Link>
        </nav>
      </Container>
    );
  }
}

export default Header;
