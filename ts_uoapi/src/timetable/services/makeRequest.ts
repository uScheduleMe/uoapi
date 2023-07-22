import { sleep } from '@src/common/util/parseUtil';
import { HttpStatusCode } from 'axios';

const DEFAULT_SLEEP_TIME = 0.5;
const DEFAULT_RETRIES = 2;

export const makeRequest = async (
  func: any,
  messenger: any,
  func_args: any[],
  func_kwargs: any,
  retries: number = DEFAULT_RETRIES,
  sleep_time: number = DEFAULT_SLEEP_TIME,
): Promise<[boolean, any]> => {
  let r;
  for (let i = 0; i < retries; i++) {
    r = func(...func_args, ...func_kwargs);

    if (r.status_code === HttpStatusCode.Ok) {
      messenger('success', `${r.request.method} success`);
      return [true, r]; // TODO
    }
    messenger('error', `${r.request.method} error: ${r.status_code}`);
    // TODO figure out how to sleep
    await sleep(sleep_time);
  }
  return [false, r];
};
