import { ExecutionQueue } from '../queue/ExecutionQueue';

describe('ExecutionQueue', () => {
  let queue: ExecutionQueue;

  beforeEach(() => {
    queue = new ExecutionQueue();
  });

  it('should enqueue and dequeue jobs', () => {
    const job = { executionId: '1', projectId: 'p1' };
    queue.enqueue(job);
    expect(queue.getLength()).toBe(1);
    
    const dequeued = queue.dequeue();
    expect(dequeued).toEqual(job);
    expect(queue.getLength()).toBe(0);
  });

  it('should emit job_added event', (done) => {
    const job = { executionId: '2', projectId: 'p2' };
    queue.on('job_added', (addedJob) => {
      expect(addedJob).toEqual(job);
      done();
    });
    queue.enqueue(job);
  });
});
