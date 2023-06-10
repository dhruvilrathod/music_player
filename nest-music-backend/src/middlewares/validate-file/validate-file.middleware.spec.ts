import { ValidateFileMiddleware } from './validate-file.middleware';

describe('ValidateFileMiddleware', () => {
  it('should be defined', () => {
    expect(new ValidateFileMiddleware()).toBeDefined();
  });
});
