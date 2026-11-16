// Read-only Git inspection. Reports stay in the ignored local documentation folder.
// This tool does not certify rights, remove objects, create archives or contact a server.
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync, readdirSync, lstatSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const git = (...args) => execFileSync('git', ['-c', `safe.directory=${root.replaceAll('\\', '/')}`, ...args], { cwd: root, maxBuffer: 128 * 1024 * 1024 });
const lines = bytes => bytes.toString('utf8').trim().split('\n').filter(Boolean);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const destination = resolve(root, '.local-docs/content-offer');

export function classify(path) {
  if (/track-purple-haze\.webp$/.test(path)) return ['imagem IA', 'EXCLUIR', 'Geração integral declarada no prompt; compressão não altera a origem.'];
  if (/track-minor-pentatonic(?:-part-2)?\.webp$/.test(path)) return ['imagem de terceiro + IA', 'EXCLUIR', 'Duotone por ferramenta de edição de imagens declarado; exceção para código não abrange imagem.'];
  if (/track-minor-pentatonic-base\.webp$/.test(path)) return ['fotografia de terceiro', 'PENDENTE', 'Caio Silva / Unsplash; verificar direitos contratuais de sublicença e restrições de uso.'];
  if (/\.(?:jpg|jpeg|png|ico)$/i.test(path)) return ['imagem de terceiro ou origem incerta', 'PENDENTE', 'Confirmar fonte, autoria, permissões e uso; inclui versões históricas.'];
  if (/audio\/(?:clean-guitar|finger-bass)\/.+\.(wav|flac)$/.test(path)) return ['gravação CC0', 'EXCLUIR', 'Domínio público declarado; política rejeita domínio público sem diferença material. Playback não transforma o arquivo incluído.'];
  if (/\.(?:mp3|wav|flac|woff2)$/i.test(path)) return ['asset de terceiro', 'PENDENTE', 'Licença e atribuição existentes não comprovam todos os direitos exigidos pelo acordo.'];
  if (/purple-haze\.json$/.test(path)) return ['sequências musicais / transcrição', 'EXCLUIR', 'Obra de Hendrix; MIDI e partituras de terceiros, sem autorização contratual comprovada. JSON é conteúdo musical.'];
  if (/\.(mid|midi|pdf)$/i.test(path) || /DownSub|referenc.*\.txt/i.test(path)) return ['fonte musical / pesquisa', 'EXCLUIR', 'Não oferecer a fonte sem direitos; conferir também blobs antigos.'];
  if (/jquery/i.test(path)) return ['biblioteca MIT', 'PENDENTE', 'Código de terceiro; manter aviso e confirmar tratamento de dependências na rodada. Não contar como código autoral.'];
  if (/LICENSE|OFL-|ATTRIBUTION|THIRD_PARTY_NOTICES|\.source\.md$|\.prompt\.md$/.test(path)) return ['licença / proveniência', 'MANTER COMO AVISO', 'Necessário para materiais mantidos; não é concessão de direitos adicionais nem prova de elegibilidade.'];
  if (/\.(svg)$/i.test(path)) return ['ilustração / notação', 'PENDENTE', 'SVG continua sendo material visual; confirmar autoria humana e conteúdo musical, mesmo quando escrito como markup.'];
  if (/^(src\/(pentatonic-part-one|minor-pentatonic|lesson-content|song-content|song-chords|study-books|tracks|main|caged-positions|practice-band)\.ts)$/.test(path)) return ['misto: código + texto / música', 'SEPARAR E REVISAR', 'Não aplicar exceção de código à prosa, motivos, acompanhamentos, partituras ou dados musicais; confirmar contribuição humana e direitos por trecho.'];
  if (/^tests\//.test(path)) return ['testes (possíveis fixtures musicais)', 'CANDIDATO', 'Manter testes pertinentes; fixtures com transcrição ou conteúdo IA continuam sujeitas à revisão.'];
  if (/\.md$/.test(path)) return ['documentação / texto', 'PENDENTE', 'Pertinência técnica não prova origem humana. Documentação gerada parcial ou integralmente por IA requer esclarecimento/exclusão.'];
  if (/^\.github\/|^\.firebaserc$|^firebase\.json$/.test(path)) return ['configuração de publicação', 'CANDIDATO', 'Identificadores e referências a secrets não são credenciais; preservar publicação, não distribuir .git/config.'];
  if (/package-lock\.json$/.test(path)) return ['metadados de dependências', 'CANDIDATO', 'Manter lockfile para build reproduzível; não embutir node_modules.'];
  return ['código / configuração (revisar strings)', 'CANDIDATO', 'Funcionamento, tipos, estilos ou build; exceção somente se código parcialmente IA, não projeto integralmente IA.'];
}

// No matched values are ever saved or printed.
const patterns = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ['google-api-key', /AIza[0-9A-Za-z_-]{35}/g],
  ['github-token', /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})/g],
  ['aws-access-key', /(?:AKIA|ASIA)[A-Z0-9]{16}/g],
  ['credential-url', /https?:\/\/[^\s/:@]+:[^\s/@]+@/g],
  ['secret-assignment', /(?:["']?(?:password|client_secret|private_key|access_token|api_key)["']?)\s*[:=]\s*["'][^"'\r\n]{8,}["']/gi],
  ['email-review', /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi],
  ['local-path-review', /[A-Z]:[\\/](?:Users|dev)[\\/][^\s"'<>]+/gi],
];
export function inspect(bytes) {
  const text = bytes.toString('utf8');
  return patterns.flatMap(([kind, regex]) => {
    regex.lastIndex = 0;
    const matches = [...text.matchAll(regex)];
    return matches.length ? [{ kind, count: matches.length }] : [];
  });
}

export function audit() {
const committedPaths = new Set(git('ls-files', '-z').toString('utf8').split('\0').filter(Boolean));
const tracked = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').toString('utf8').split('\0').filter(Boolean);
const current = tracked.map(path => {
  const bytes = readFileSync(resolve(root, path));
  const binary = bytes.includes(0) || /\.(webp|woff2|jpg|png|ico|wav|flac|mp3)$/.test(path);
  const text = binary ? '' : bytes.toString('utf8');
  return { path, tracked: committedPaths.has(path), bytes: bytes.length, sha256: hash(bytes), lines: binary ? null : text.split(/\r?\n/).filter((line, i, all) => i < all.length - 1 || line !== '').length, nonblank: binary ? null : text.split(/\r?\n/).filter(line => line.trim()).length, classification: classify(path), findings: inspect(bytes) };
});
const objectPaths = new Map();
for (const entry of lines(git('rev-list', '--objects', '--all', '--reflog'))) {
  const space = entry.indexOf(' ');
  if (space >= 0) objectPaths.set(entry.slice(0, space), entry.slice(space + 1));
}
// Enumerate all local objects, including unreachable objects, rather than only HEAD.
const objects = lines(git('cat-file', '--batch-all-objects', '--batch-check=%(objectname) %(objecttype) %(objectsize)')).map(line => {
  const [oid, type, size] = line.split(' ');
  return { oid, type, bytes: Number(size), path: objectPaths.get(oid) ?? null };
});
const findings = [];
const inspectable = objects.filter(object => ['blob', 'commit', 'tag'].includes(object.type));
const batch = execFileSync('git', ['-c', `safe.directory=${root.replaceAll('\\', '/')}`, 'cat-file', '--batch'], { cwd: root, input: inspectable.map(object => object.oid).join('\n') + '\n', maxBuffer: 128 * 1024 * 1024 });
let offset = 0;
for (const object of inspectable) {
  const headerEnd = batch.indexOf(10, offset);
  const header = batch.subarray(offset, headerEnd).toString('utf8').split(' ');
  if (header[0] !== object.oid || Number(header[2]) !== object.bytes) throw new Error('Invalid Git batch response');
  const result = inspect(batch.subarray(headerEnd + 1, headerEnd + 1 + object.bytes));
  offset = headerEnd + 1 + object.bytes + 1;
  if (result.length) findings.push({ ...object, findings: result });
}
// Every historic path, including deleted/renamed paths and side branches.
const pathsFor = (...scope) => new Set(git('-c', 'core.quotepath=false', 'log', ...scope, '--format=', '--name-only', '-z').toString('utf8').split('\0').map(s => s.replace(/^\n+|\n+$/g, '')).filter(Boolean));
const mainPaths = pathsFor('main'), refPaths = pathsFor('--all');
const historicPaths = [...pathsFor('--all', '--reflog')].sort();
const history = historicPaths.map(path => ({ path, classification: classify(path), current: tracked.includes(path), scope: mainPaths.has(path) ? 'main-ancestry' : refPaths.has(path) ? 'other-ref' : 'reflog-only' }));
const authors = lines(git('log', '--all', '--format=%an <%ae>%n%cn <%ce>'));
const metadata = {};
for (const name of ['config', 'logs/HEAD']) {
  try { metadata[name] = inspect(readFileSync(resolve(root, '.git', name))); } catch { metadata[name] = ['not-readable-or-worktree']; }
}
const sensitiveNames = historicPaths.filter(path => /(?:^|\/)(?:\.env(?:\.|$)|.*(?:credential|service.account|secret).*|id_rsa)|\.(?:pem|p12|key)$/i.test(path));
function diskBytes(path) {
  const s = lstatSync(path);
  if (s.isSymbolicLink()) return 0;
  return s.isDirectory() ? readdirSync(path).reduce((sum, name) => sum + diskBytes(resolve(path, name)), 0) : s.size;
}
const code = current.filter(file => file.classification[1] === 'CANDIDATO' && /\.(ts|mjs|js)$/.test(file.path) && !file.path.startsWith('tests/') && file.path !== 'scripts/audit-offer.mjs');
const report = {
  generatedAt: new Date().toISOString(), head: git('rev-parse', 'HEAD').toString().trim(),
  branch: git('branch', '--show-current').toString().trim(),
  trackedFiles: committedPaths.size, currentFiles: current.length, commitsAllRefs: Number(git('rev-list', '--all', '--count').toString()),
  shallow: git('rev-parse', '--is-shallow-repository').toString().trim(),
  trackedBytes: current.reduce((sum, file) => sum + file.bytes, 0), gitDirectoryBytes: diskBytes(resolve(root, '.git')),
  conservativeCode: { files: code.map(file => file.path), nonblankLinesIncludingComments: code.reduce((sum, file) => sum + file.nonblank, 0), caveat: 'Excludes mixed files, tests, assets, third-party jQuery, markup and CSS; not a portal LOC certification.' },
  objects: { total: objects.length, blobs: objects.filter(o => o.type === 'blob').length, bytes: objects.reduce((sum, o) => sum + o.bytes, 0) },
  identitiesCount: new Set(authors).size, sensitiveNames, metadata, current, history, findings,
  blobInventory: objects.filter(object => object.type === 'blob').map(object => ({...object, classification: object.path ? classify(object.path) : ['objeto sem caminho em refs/reflogs', 'PENDENTE', 'Não copiar .git original; objeto local sem proveniência resolvida.']})),
  limits: 'Pattern-based inspection; no guarantee of absence of secrets/PII. Binary metadata, Git identities and flagged contexts require human review. No provenance inference from author names or file extensions.',
};
mkdirSync(destination, { recursive: true });
writeFileSync(resolve(destination, 'inventory.json'), JSON.stringify(report, null, 2) + '\n');
const cell = value => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const table = (headers, rows) => [headers, headers.map(() => '---'), ...rows].map(row => '| ' + row.map(cell).join(' | ') + ' |').join('\n');
writeFileSync(resolve(destination, 'files.md'), '# Inventário por arquivo\n\nBase: `' + report.head + '`; classificações são recomendações, não autorizações. CANDIDATO ainda depende de direitos e de revisão do histórico.\n\n' + table(['Arquivo', 'Bytes', 'Categoria', 'Tratamento', 'Motivo'], current.map(f => [f.path, f.bytes, ...f.classification])) + '\n\n## Caminhos históricos\n\nTodos os caminhos encontrados em refs e reflogs locais. main-ancestry acompanha um clone da main; other-ref está em outra ref; reflog-only não acompanha um clone novo com --no-local.\n\n' + table(['Caminho', 'Atual?', 'Escopo', 'Categoria', 'Tratamento', 'Motivo'], history.map(f => [f.path, f.current, f.scope, ...f.classification])) + '\n');
console.log(JSON.stringify({ head: report.head, branch: report.branch, trackedFiles: report.trackedFiles, commits: report.commitsAllRefs, objects: report.objects, trackedBytes: report.trackedBytes, gitDirectoryBytes: report.gitDirectoryBytes, conservativeCodeLines: report.conservativeCode.nonblankLinesIncludingComments, flaggedObjects: findings.length, sensitiveNames, report: '.local-docs/content-offer/inventory.json' }, null, 2));
return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) audit();
