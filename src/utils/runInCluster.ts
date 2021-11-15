const cluster = require('cluster')
import * as os from 'os';

export function runInCluster(
  bootstrap: () => Promise<void>
) {
  const numberOfCores = process.env.NODE_ENV === 'production' ? os.cpus().length : 4;

  if (cluster.isMaster) {
    for (let i = 0; i < numberOfCores; ++i) {
      cluster.fork();
    }
  } else {
    bootstrap();
  }
}
