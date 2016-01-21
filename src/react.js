import compose from 'lodash/flowRight';

import react from './middleware/react';

export default function(options = { }) {
  return compose(
    react(options)
  );
}
