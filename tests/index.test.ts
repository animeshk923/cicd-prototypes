import { greet } from '../src/index';

test('greet returns correct string', () => {
  expect(greet('from CI/CD repo')).toBe('Hello, from CI/CD repo!');
});
