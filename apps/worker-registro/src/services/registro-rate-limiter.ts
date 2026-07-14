type QueueTask<T> = () => Promise<T>;

let chain = Promise.resolve();
let pending = 0;
let nextAvailableAt = 0;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getMinIntervalMs() {
  return Number(process.env.REGISTRO_MIN_INTERVAL_SECONDS ?? 30) * 1000;
}

export function getRegistroFilaInfo() {
  const now = Date.now();

  return {
    pending,
    minIntervalSeconds: Math.round(getMinIntervalMs() / 1000),
    nextAvailableAt:
      nextAvailableAt > now ? new Date(nextAvailableAt).toISOString() : null,
    waitMs: Math.max(nextAvailableAt - now, 0),
  };
}

export async function executarComControleRegistro<T>(task: QueueTask<T>) {
  pending += 1;

  const run = async () => {
    const minIntervalMs = getMinIntervalMs();
    const now = Date.now();
    const waitMs = Math.max(nextAvailableAt - now, 0);

    if (waitMs > 0) {
      console.log(
        `[worker-registro] Aguardando ${Math.ceil(
          waitMs / 1000
        )}s antes da próxima consulta ao 1RIBH`
      );

      await sleep(waitMs);
    }

    try {
      return await task();
    } finally {
      nextAvailableAt = Date.now() + minIntervalMs;

      console.log(
        `[worker-registro] Próxima consulta liberada em ${Math.round(
          minIntervalMs / 1000
        )}s`
      );
    }
  };

  const result = chain.then(run, run);

  chain = result.then(
    () => undefined,
    () => undefined
  );

  try {
    return await result;
  } finally {
    pending = Math.max(pending - 1, 0);
  }
}
