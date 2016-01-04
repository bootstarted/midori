import compose from 'lodash/function/compose';

import assets from './middleware/assets';

export default function(options = { }) {
  return compose(
    assets(options.assets)
  );
}
