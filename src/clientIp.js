// @flow
import {getClientIp} from 'request-ip';

import createSelector from './createSelector';
import request from './request';

const clientIp = createSelector(request, (req): string => getClientIp(req));
export default clientIp;
