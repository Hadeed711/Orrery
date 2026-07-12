/** CLI runner: `npm run sync:ll2` (or `tsx packages/connectors/src/run.ts <connector>`). */
import { syncLaunchLibrary } from "./ll2";

const connectors: Record<string, () => Promise<unknown>> = {
  ll2: () => syncLaunchLibrary(),
};

const name = process.argv[2] ?? "";
const run = connectors[name];
if (!run) {
  console.error(`Unknown connector "${name}". Available: ${Object.keys(connectors).join(", ")}`);
  process.exit(2);
}
run()
  .then((result) => {
    console.log(JSON.stringify({ connector: name, ok: true, result }));
    process.exit(0);
  })
  .catch((err) => {
    console.error(JSON.stringify({ connector: name, ok: false, error: String(err) }));
    process.exit(1);
  });
