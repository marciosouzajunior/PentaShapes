// Download only the recorded sounds used by the shared practice-band sampler.
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const target=new URL('../src/static/audio/',import.meta.url);
const sources=[
  ['finger-bass','E1.flac','electric-bass-YR','samples/finger/E.flac'],
  ['finger-bass','A1.flac','electric-bass-YR','samples/finger/A.flac'],
  ['finger-bass','C2.flac','electric-bass-YR','samples/finger/C.flac'],
  ['finger-bass','D2.flac','electric-bass-YR','samples/finger/D.flac'],
  ['drum-kit','kick.flac','muldjordkit','samples/KdrumL/1-KdrumL.flac'],
  ['drum-kit','snare-soft.flac','muldjordkit','samples/SnareRest1/1-SnareRest.flac'],
  ['drum-kit','hat-1.flac','muldjordkit','samples/HihatClosed/1-HihatClosed.flac'],
  ['drum-kit','hat-2.flac','muldjordkit','samples/HihatClosed/2-HihatClosed.flac'],
  ['drum-kit','ride.flac','muldjordkit','samples/RideL/1-RideL.flac'],
  ['drum-kit','ride-bell.flac','muldjordkit','samples/RideRBell/1-RideRBell.flac'],
  ['finger-bass','LICENSE.txt','electric-bass-YR','LICENSE.txt'],
  ['drum-kit','LICENSE.txt','muldjordkit','LICENSE.txt'],
];
for(const [bank,file,repo,path] of sources){
  const url=`https://raw.githubusercontent.com/freepats/${repo}/main/${path}`;
  const response=await fetch(url);
  if(!response.ok)throw new Error(`${response.status}: ${url}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  await mkdir(new URL(`${bank}/`,target),{recursive:true});
  await writeFile(new URL(`${bank}/${file}`,target),bytes);
  console.log(`${bank}/${file} ${bytes.length} ${createHash('sha256').update(bytes).digest('hex')}`);
}
