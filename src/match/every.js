// @flow
import type {Match, MatchCreator, App} from '../types';

const every = (
  ...matches: Array<MatchCreator>
): MatchCreator => (app: App): Match => {
  let nextApp = app;
  const allMatches = [];
  matches.forEach((createMatch) => {
    const {app, matches} = createMatch(nextApp);
    nextApp = app;
    allMatches.push(matches);
  });
  return {
    app: nextApp,
    matches: (...args) => {
      return allMatches.every((match) => {
        return match(...args);
      });
    },
  };
};

export default every;
