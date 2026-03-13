import { TskvLogger } from './tskvLogger.service';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  it('should format log messages as TSKV', () => {
    const message = 'test';
    logger.log(message, { user: '123' });

    const callArg = (console.log as jest.Mock).mock.calls[0][0];
    expect(callArg).toContain('level=log');
    expect(callArg).toContain('message=test');
    expect(callArg).toContain('user=123');
    expect(callArg).toMatch(/time=\d{4}-\d{2}-\d{2}T/);
  });
});
