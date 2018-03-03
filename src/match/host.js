// @flow
import header from './header';
import type {Predicate} from './util';

export default (hosts: Predicate<string>) => header('Host', hosts);
