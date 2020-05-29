import Bee from 'bee-queue';

import redisConfig from '../configs/redis';

import CancellationMail from '../jobs/CancellationMail';

const jobs = [CancellationMail];

class Queue {
  queues;

  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', () => console.log('Quee Error')).process(handle);
    });
  }
}

export default new Queue();
