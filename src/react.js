import compose from 'lodash/function/compose';

import react from './middleware/react';

export default function(options = { }) {
  return compose(
    react(options)
  );
}
