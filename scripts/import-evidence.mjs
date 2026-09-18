import { readdir, mkdir, readFile, copyFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

const source = resolve(process.argv[2] || '../assets/evidencias');
const destination = resolve('public/images/evidencias');
await mkdir(destination, { recursive: true });
const files = (await readdir(source, { withFileTypes: true })).filter(entry => entry.isFile() && /\.(jpe?g|png|webp|avif)$/i.test(entry.name));
const digest = data => createHash('sha256').update(data).digest('hex');
let copied = 0;
for (const file of files) {
  const input = join(source, file.name);
  const output = join(destination, file.name);
  let existing;
  try { existing = await readFile(output); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (existing) {
    if (digest(existing) !== digest(await readFile(input))) throw new Error(`Ya existe una imagen diferente llamada ${file.name}. Renombra la nueva imagen antes de importarla.`);
    continue;
  }
  await copyFile(input, output);
  copied++;
}
console.log(`${copied} imágenes incorporadas; ${files.length - copied} ya estaban importadas. Originales sin modificar.`);
console.log('Recompila con npm run build para incluirlas en la web publicada.');
