import childProcess from 'child_process';
import util from 'util';
const exec = util.promisify(childProcess.exec);
import ansicolor from 'ansicolor';

const command =
  "for i in (icalBuddy -n -f -nc -b '' -ps '| |' -lf ~/Cool-desktop/code/icalBuddyLocalization.plist -ec E4680998-12B7-426E-900E-D88FBCF6D535,9D68E3D5-CDA4-4FCA-9D41-9CC58F4DF5AE,3774770A-7DA7-4231-A51E-9ADC680D79B2,8B6EE0D6-B32B-41F3-ACEE-E42D29D03AEE,5E19E14B-0C03-448B-8089-9887E85DE7A3,5F5DEF01-D078-443A-8021-FD4C548F6948,EBE38E1C-3120-4882-A763-B22B87DA8368 -eed -eep url,notes -sd -ss '' eventsToday+30);echo $i|sed -e 's/At:/At/g' -e's/[0-9]{4}//g' -e (echo 's/'(echo $i|grep zoom|sed -e 's/\\//\\\\//g'|awk '{print '(if echo $i|awk '{print $3}'|grep 'At:'>/dev/null;echo '$4';else;echo '$3';end)'}')'/Zoom/g');end|sed -e '1d'";

export async function get({ params }) {
  const result = await exec(command, { shell: '/opt/homebrew/bin/fish' });
  return {
    body: result.stdout.split('\n').map((line) => ansicolor.parse(line))
  };
}
