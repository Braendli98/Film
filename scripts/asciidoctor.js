// https://github.com/asciidoctor/asciidoctor.js
// https://asciidoctor-docs.netlify.com
// https://asciidoctor.org

import asciidoctor from '@asciidoctor/core'
// https://github.com/eshepelyuk/asciidoctor-plantuml.js ist deprecated
import kroki from 'asciidoctor-kroki';
import { join } from 'node:path';
import url from 'node:url';

const adoc = asciidoctor();
console.log(`Asciidoctor.js ${adoc.getVersion()}`);

kroki.register(adoc.Extensions);

const options = {
    safe: 'safe',
    attributes: { linkcss: true },
    base_dir: '.extras/doc/projekthandfilm',
    to_dir: 'html',
    mkdirs: true,
};
adoc.convertFile(
    join('.extras', 'doc', 'projekthandfilm', 'projekthandfilm.adoc'),
    options,
);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
console.log(
    `HTML-Datei ${join(
        __dirname,
        '..',
        '.extras',
        'doc',
        'projekthandfilm',
        'html',
        'projekthandfilm.html',
    )}`,
);

// https://asciidoctor.github.io/asciidoctor.js/master
// const htmlString = asciidoctor.convert(
//     fs.readFileSync(join('extras', 'doc', 'projekthandfilm.adoc')),
//     { safe: 'safe', attributes: { linkcss: true }, base_dir: 'doc' },
// );
// const htmlFile = join('extras', 'doc', 'projekthandfilm.html');
// fs.writeFileSync(htmlFile, htmlString);

// console.log(`HTML-Datei ${join(__dirname, '..', htmlFile)}`);
