import * as fs from 'node:fs';
import * as path from 'node:path';

interface Token {
    type: string;
    value: string;
}

interface Node {
    type: string;
    content: string | Node[];
}

const tabSize = 4;

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

        if (line.startsWith('title ')) {
            tokens.push({ type: 'title', value: line.slice(6).trim() });
            currentIndex++;
            continue;
        }

        if (line.startsWith('title2 ')) {
            tokens.push({ type: 'title2', value: line.slice(6).trim() });
            currentIndex++;
            continue;
        }

        if (line.startsWith('title3 ')) {
            tokens.push({ type: 'title3', value: line.slice(6).trim() });
            currentIndex++;
            continue;
        }

        if (line.startsWith('title4 ')) {
            tokens.push({ type: 'title4', value: line.slice(6).trim() });
            currentIndex++;
            continue;
        }

        if (line.startsWith('title5 ')) {
            tokens.push({ type: 'title5', value: line.slice(6).trim() });
            currentIndex++;
            continue;
        }

        if (line.startsWith('title6 ')) {
            tokens.push({ type: 'title6', value: line.slice(6).trim() });
            currentIndex++;
            continue;
        }

        if (line.startsWith('image ')) {
            tokens.push({ type: 'image', value: line.slice(6).trim() });
            currentIndex++;

            // Check if the next line is an indented alt text (with tab)
            if (currentIndex < lines.length && lines[currentIndex].startsWith('\talt ')) {
                const altText = lines[currentIndex].slice(5).trim(); // Capture alt text
                tokens.push({ type: 'alt', value: altText });
                currentIndex++; // Move to next line
            } else if (currentIndex < lines.length && lines[currentIndex].startsWith('    alt ')) {
                const altText = lines[currentIndex].slice(tabSize + 4).trim(); // Capture alt text
                tokens.push({ type: 'alt', value: altText });
                currentIndex++; // Move to next line
            }

            continue;
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

        if (token.type === 'title') {
            nodes.push({ type: 'title', content: parseText() });
            currentIndex++;
            continue;
        }

        if (token.type === 'title2') {
            nodes.push({ type: 'title2', content: parseText() });
            currentIndex++;
            continue;
        }

        if (token.type === 'title3') {
            nodes.push({ type: 'title3', content: parseText() });
            currentIndex++;
            continue;
        }

        if (token.type === 'title4') {
            nodes.push({ type: 'title4', content: parseText() });
            currentIndex++;
            continue;
        }

        if (token.type === 'title5') {
            nodes.push({ type: 'title5', content: parseText() });
            currentIndex++;
            continue;
        }

        if (token.type === 'title6') {
            nodes.push({ type: 'title6', content: parseText() });
            currentIndex++;
            continue;
        }

        if (token.type === 'image') {
            const src = parseText();
            let altText = '';
            currentIndex++;
            const content: Node[] = [];
            content.push({ type: 'imageSrc', content: src });

            if (currentIndex < tokens.length && tokens[currentIndex].type === 'alt') {
                altText = parseText();
                currentIndex++; // Skip alt token
                content.push({ type: 'imageAlt', content: altText });
            }

            nodes.push({ type: 'image', content });
            continue;
        }

        if (token.type === 'text') {
            nodes.push({ type: 'text', content: parseText() });
            currentIndex++;
        }
    }

    return nodes;
}

async function loadImport(filename: string): Promise<string> {
    const data = await fs.readFileSync(__dirname + '/../' + filename + '.sphst', 'utf8');

    return data;
}

async function render(nodes: Node[]): Promise<string> {
    let output = '';
    const finalNodes: Node[] = [];

    let containsHTML5 = false;
    let containsMetaTags = false;
    let title = '';

    // load imports first
    for (const node of nodes) {
        if (node.type === 'import') {
            // TODO: what if Node[] is given?
            const importedString = await loadImport(node.content.toString());
            const tokens = tokenizer(importedString);
            const parsedNodes = parse(tokens);

            for (const importedNode of parsedNodes) {
                finalNodes.push(importedNode);
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
        } else if (node.type === 'importable') {
            continue;
        } else if (node.type === 'title') {
            if (title === '') {
                title = node.content.toString();
            }
            output += `<h1>${node.content}</h1>\n`;
        } else if (node.type === 'title2') {
            output += `<h2>${node.content}</h2>\n`;
        } else if (node.type === 'title3') {
            output += `<h3>${node.content}</h3>\n`;
        } else if (node.type === 'title4') {
            output += `<h4>${node.content}</h4>\n`;
        } else if (node.type === 'title5') {
            output += `<h5>${node.content}</h5>\n`;
        } else if (node.type === 'title6') {
            output += `<h6>${node.content}</h6>\n`;
        } else if (node.type === 'image') {
            let args = '';
            if (Array.isArray(node.content)) {
                let isEmpty = true;
                for (const subnode of node.content) {
                    if (subnode.type === 'imageSrc') {
                        args += `${!isEmpty ? ' ' : ''}src="${subnode.content}"`;
                        isEmpty = false;
                    } else if (subnode.type === 'imageAlt') {
                        args += `${!isEmpty ? ' ' : ''}alt="${subnode.content}"`;
                        isEmpty = false;
                    }
                }
            }
            output += `<img ${args} />\n`;
        } else {
            output += `<p>${node.content}</p>\n`;
        }
    }

    if (containsHTML5) {
        const metaTags = `<title>${title}</title>`;
        output = `<!DOCTYPE html>
    <head>
        ${containsMetaTags ? metaTags : ''}
    </head>
    <body>
` + output + `</body>
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