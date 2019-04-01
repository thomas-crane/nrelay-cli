const nrelay = require('nrelay');
const argv = require('yargs').argv;

const env = new nrelay.Environment(process.cwd());
const runtime = new nrelay.Runtime(env);

runtime.run(argv).catch((err) => {
  console.log();
  console.log(`nrelay runtime error: ${err.message}`);
});
