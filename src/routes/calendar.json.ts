import childProcess from 'child_process';
import util from 'util';
const exec = util.promisify(childProcess.exec);

export async function get({ params }) {
  const result = await exec("echo 'shortcuts run RecentEvents | cat' | sh");
  return {
    body: result.stdout
  };
}
