import { take } from 'rxjs/operators';
import { Polling } from '../src';

describe('Polling', () => {
  const serverResponse = {
    ok: true,
    result: [
      {
        update_id: 1,
      },
      {
        update_id: 2,
      },
    ],
  };

  const mockBot = {
    getUpdates: jest.fn().mockResolvedValue(serverResponse),
  };

  const polling = new Polling(mockBot as any);

  test('should start with status === NEW', () => {
    expect(polling.getStatus()).toBe('NEW');
  });

  test('isPolling() should return false', () => {
    expect(polling.isPolling).toBe(false);
  });

  test('should emit received updates one by one', (done) => {
    polling.updates.pipe(take(2)).subscribe({
      complete: () => {
        polling.stopPolling();
        done();
      },
      error: (err) => {
        polling.stopPolling();
        done.fail(err);
      },
      next: (value) => {
        try {
          expect(polling.isPolling).toBe(true);
          expect(value).toEqual(serverResponse.result.shift());
        } catch (err) {
          polling.stopPolling();
          done.fail(err);
        }
      },
    });
  });

  test('should have status === STOPPED when stops', () => {
    expect(polling.isPolling).toBe(false);
    expect(polling.getStatus()).toBe('STOPPED');
  });
});
