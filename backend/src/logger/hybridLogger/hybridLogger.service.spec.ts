import { HybridLogger } from './hybridLogger.service';
import { DevLogger } from '../devLogger/devLogger.service';
import { JsonLogger } from '../jsonLogger/jsonLogger.service';
import { TskvLogger } from '../tskvLogger/tskvLogger.service';

describe('HybridLogger', () => {
  let hybrid: HybridLogger;
  let devLogger: DevLogger;
  let jsonLogger: JsonLogger;
  let tskvLogger: TskvLogger;

  beforeEach(() => {
    devLogger = new DevLogger();
    jsonLogger = new JsonLogger();
    tskvLogger = new TskvLogger();

    jest.spyOn(devLogger, 'log').mockImplementation(() => {});
    jest.spyOn(jsonLogger, 'log').mockImplementation(() => {});
    jest.spyOn(tskvLogger, 'log').mockImplementation(() => {});

    hybrid = new HybridLogger(devLogger, jsonLogger, tskvLogger);
  });

  it('should call all loggers on log', () => {
    hybrid.log('hello', 'extra');

    expect(devLogger.log).toHaveBeenCalledWith('hello', 'extra');
    expect(jsonLogger.log).toHaveBeenCalledWith('hello', 'extra');
    expect(tskvLogger.log).toHaveBeenCalledWith('hello', 'extra');
  });
});
