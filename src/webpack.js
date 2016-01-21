import compose from 'lodash/flowRight';

import assets from './middleware/assets';

export default function(options = { }) {
  return compose(
    assets(options.assets)
  );
}
