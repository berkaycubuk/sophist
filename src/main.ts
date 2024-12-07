import * as fs from 'node:fs';
import * as path from 'node:path';
import { Token, Node, Atom, Title, Title2, Title3, Title4, Title5, Title6, Image, Date } from './atom';

const atoms: Atom[] = [
    new Title('title'),
    new Title2('title2'),
    new Title3('title3'),
    new Title4('title4'),
    new Title5('title5'),
    new Title6('title6'),
    new Image('image'),
    new Date('date'),
];

function tokenizer(input: string): Token[] {
    const tokens: Token[] = [];
    const lines = input.split('\n');
    let currentIndex = 0;

    while (currentIndex < lines.length) {
        const line = lines[currentIndex].trim();

        if (line === 'html5') {
            tokens.push({ type: 'html5', value: 'true' });
            currentIndex++;
            continue;
        }

        if (line === 'metatags') {
            tokens.push({ type: 'metatags', value: 'true' });
            currentIndex++;
            continue;
        }

        if (line === 'importable') {
            tokens.push({ type: 'importable', value: 'true' });
            currentIndex++;
            continue;
        }

        if (line.startsWith('import ')) {
            tokens.push({ type: 'import', value: line.slice(7).trim() });
            currentIndex++;
            continue;
        }

        for (const atom of atoms) {
            const result = atom.tokenize(line, lines, currentIndex);
            currentIndex += result.jumpedLineCount;
            if (result.tokens.length != 0) {
                result.tokens.forEach(token => tokens.push(token));
                break;
            }
        }

        let textValue = '';
        while (currentIndex < lines.length && lines[currentIndex].trim() !== '' && !lines[currentIndex].startsWith('title') && !lines[currentIndex].startsWith('subtitle')) {
            textValue += lines[currentIndex].trim() + ' ';
            currentIndex++;
        }

        if (textValue) {
            tokens.push({ type: 'text', value: textValue.trim() });
        } else {
            currentIndex++;
        }
    }

    return tokens;
}

function parse(tokens: Token[]): Node[] {
    const nodes: Node[] = [];
    let currentIndex = 0;

    function parseText(): string {
        return tokens[currentIndex].value;
    }

    function parseValue(index: number): string {
        return tokens[currentIndex + index].value;
    }

    while (currentIndex < tokens.length) {
        const token = tokens[currentIndex];

        if (token.type === 'html5') {
            nodes.push({ type: 'html5', content: 'true' });
            currentIndex++;
            continue;
        }

        if (token.type === 'importable') {
            nodes.push({ type: 'importable', content: 'true' });
            currentIndex++;
            continue;
        }

        if (token.type === 'metatags') {
            nodes.push({ type: 'metatags', content: 'true' });
            currentIndex++;
            continue;
        }

        if (token.type === 'import') {
            nodes.push({ type: 'import', content: parseText() });
            currentIndex++;
            continue;
        }

        for (const atom of atoms) {
            const result = atom.parse(token, parseValue, tokens, currentIndex);
            if (result.node != null) {
                nodes.push(result.node);
                currentIndex += result.jumpedLineCount;
                break;
            }
        }

        if (token.type === 'text') {
            nodes.push({ type: 'text', content: parseText() });
            currentIndex++;
        }
    }

    return nodes;
}

async function loadImport(filename: string): Promise<string> {
    try {
        const data = await fs.readFileSync(__dirname + '/../' + filename, 'utf8');
        return data;
    } catch {
        return '';
    }
}

async function render(nodes: Node[]): Promise<string> {
    let output = '';
    let headOutput = '';
    const finalNodes: Node[] = [];

    let containsHTML5 = false;
    let containsMetaTags = false;
    let title = '';

    // load imports first
    for (const node of nodes) {
        if (node.type === 'import') {
            // TODO: what if Node[] is given?

            const filename = node.content.toString();

            const importedString = await loadImport(filename);
            if (filename.endsWith('.sphst')) {
                const tokens = tokenizer(importedString);
                const parsedNodes = parse(tokens);

                for (const importedNode of parsedNodes) {
                    finalNodes.push(importedNode);
                }
            }
        } else {
            if (node.type !== 'importable') {
                finalNodes.push(node);
            }
        }
    }

    for (const node of finalNodes) {
        if (node.type === 'html5') {
            containsHTML5 = true;
        } else if (node.type === 'metatags') {
            containsMetaTags = true;
        } else if (node.type === 'import') {
            if (!Array.isArray(node.content)) {
                if (node.content.endsWith('.css')) {
                    headOutput += `<link rel="stylesheet" href="${node.content}" />\n`;
                }
            }
        } else if (node.type === 'importable') {
            continue;
        } else {
            let foundSomething = false;
            for (const atom of atoms) {
                if (title === '' && node.type === 'title') {
                    title = node.content.toString();
                }
                const out = atom.renderHTML(node);
                if (out != null) {
                    output += out;
                    foundSomething = true;
                }
            }
            
            if (!foundSomething && !Array.isArray(node.content)) {
                if (node.content.startsWith('<')) {
                    output += `${node.content}\n`;
                } else {
                    output += `<p>${node.content}</p>\n`;
                }
            }
        }
    }

    if (containsHTML5) {
        const metaTags = `<title>${title}</title>`;
        output = `<!DOCTYPE html>
    <head>
        ${containsMetaTags ? metaTags : ''}
        ${headOutput}
    </head>
    <body>
        ${output}
    </body>
</html>`;
    }

    return output;
}

async function main() {
    const args = process.argv;
    const sophistFiles: string[] = [];
    const workingDirectory = process.cwd();

    if (args.length >= 3) {
        sophistFiles.push(path.join(workingDirectory, args[2]));
    } else {
        // detect .sphst files in the directory
        const items = await fs.readdirSync(workingDirectory);

        await items.forEach(async (item) => {
            const fullPath = path.join(workingDirectory, item);
            const stats = await fs.statSync(fullPath);

            if (!stats.isDirectory()) {
                if (fullPath.endsWith('.sphst')) {
                    sophistFiles.push(fullPath);
                }
            }
        });
    }

    if (sophistFiles.length === 0) {
        console.log("No Sophist file found.");
        return;
    }

    await sophistFiles.forEach(async (file) => {
        const pathElements = file.split('/');
        const filename = pathElements[pathElements.length - 1];
        pathElements.pop();
        pathElements.push('out');
        pathElements.push(filename.split('.')[0] + '.html');

        const outputPath = pathElements.join('/');

        const data = await fs.readFileSync(file, 'utf8');

        const tokens = tokenizer(data);
        const parsedNodes = parse(tokens);
        const html = await render(parsedNodes);

        let includesImportable = false;
        for (const node of parsedNodes) {
            if (node.type === 'importable') {
                includesImportable = true;
                break;
            }
        }
        
        if (includesImportable) {
            return;
        }

        if (!(await fs.existsSync(workingDirectory + '/out'))) {
            await fs.mkdirSync(workingDirectory + '/out');
        }

        console.log(parsedNodes);
        console.log(html);

        if (args.length === 4 && args[3] === '-o') {
            await fs.writeFileSync(outputPath, html);
        } else if (args.length === 2) {
            await fs.writeFileSync(outputPath, html);
        }
    });
}

main().then();