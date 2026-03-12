import { JsonLogger } from './jsonLogger.service';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  it('should format log messages as JSON', () => {
    const message = 'test message';
    logger.log(message, 'extra1', 'extra2');
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'log',
        message,
        optionalParams: ['extra1', 'extra2'],
      }),
    );
  });

  it('should format warn messages as JSON', () => {
    const message = 'warning!';
    logger.warn(message);
    expect(console.warn).toHaveBeenCalledWith(
      JSON.stringify({ level: 'warn', message, optionalParams: [] }),
    );
  });

  it('should format error messages as JSON', () => {
    const message = 'error!';
    logger.error(message);
    expect(console.error).toHaveBeenCalledWith(
      JSON.stringify({ level: 'error', message, optionalParams: [] }),
    );
  });
});
