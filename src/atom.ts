export interface Token {
    type: string;
    value: string;
}

export interface Node {
    type: string;
    content: string | Node[];
}

export interface TokenizeResult {
    jumpedLineCount: number;
    tokens: Token[];
}

export interface ParseResult {
    jumpedLineCount: number;
    node: Node | null;
}

export class Atom {
    type: string;

    constructor(type: string) {
        this.type = type;
    }

    tokenize(line: string, lines: string[], currentIndex: number): TokenizeResult {
        return {
            jumpedLineCount: 0,
            tokens: [],
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    parse(token: Token, parseValue: Function, tokens: Token[], currentIndex: number): ParseResult {
        return {
            jumpedLineCount: 0,
            node: null,
        };
    }

    renderHTML(node: Node): string | null {
        return null;
    }

}

export class Title extends Atom {
    tokenize(line: string): TokenizeResult {
        if (line.startsWith(this.type + ' ')) {
            return {
                jumpedLineCount: 1,
                tokens: [{ type: this.type, value: line.slice(6).trim() }],
            };
        }

        return {
            jumpedLineCount: 0,
            tokens: [],
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    parse(token: Token, parseValue: Function): ParseResult {
        if (token.type === this.type) {
            return {
                jumpedLineCount: 1,
                node: {
                    type: this.type,
                    content: parseValue(0),
                },
            };
        }

        return {
            jumpedLineCount: 0,
            node: null,
        };
    }

    renderHTML(node: Node): string | null {
        if (node.type === this.type) {
            return `<h1>${node.content}</h1>\n`;
        }

        return null;
    }
}

export class Title2 extends Atom {
    tokenize(line: string): TokenizeResult {
        if (line.startsWith(this.type + ' ')) {
            return {
                jumpedLineCount: 1,
                tokens: [{ type: this.type, value: line.slice(6).trim() }],
            };
        }

        return {
            jumpedLineCount: 0,
            tokens: [],
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    parse(token: Token, parseValue: Function): ParseResult {
        if (token.type === this.type) {
            return {
                jumpedLineCount: 1,
                node: {
                    type: this.type,
                    content: parseValue(0),
                },
            };
        }

        return {
            jumpedLineCount: 0,
            node: null,
        };
    }

    renderHTML(node: Node): string | null {
        if (node.type === this.type) {
            return `<h2>${node.content}</h2>\n`;
        }

        return null;
    }
}

export class Title3 extends Atom {
    tokenize(line: string): TokenizeResult {
        if (line.startsWith(this.type + ' ')) {
            return {
                jumpedLineCount: 1,
                tokens: [{ type: this.type, value: line.slice(6).trim() }],
            };
        }

        return {
            jumpedLineCount: 0,
            tokens: [],
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    parse(token: Token, parseValue: Function): ParseResult {
        if (token.type === this.type) {
            return {
                jumpedLineCount: 1,
                node: {
                    type: this.type,
                    content: parseValue(0),
                },
            };
        }

        return {
            jumpedLineCount: 0,
            node: null,
        };
    }

    renderHTML(node: Node): string | null {
        if (node.type === this.type) {
            return `<h3>${node.content}</h3>\n`;
        }

        return null;
    }
}

export class Title4 extends Atom {
    tokenize(line: string): TokenizeResult {
        if (line.startsWith(this.type + ' ')) {
            return {
                jumpedLineCount: 1,
                tokens: [{ type: this.type, value: line.slice(6).trim() }],
            };
        }

        return {
            jumpedLineCount: 0,
            tokens: [],
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    parse(token: Token, parseValue: Function): ParseResult {
        if (token.type === this.type) {
            return {
                jumpedLineCount: 1,
                node: {
                    type: this.type,
                    content: parseValue(0),
                },
            };
        }

        return {
            jumpedLineCount: 0,
            node: null,
        };
    }

    renderHTML(node: Node): string | null {
        if (node.type === this.type) {
            return `<h4>${node.content}</h4>\n`;
        }

        return null;
    }
}

export class Title5 extends Atom {
    tokenize(line: string): TokenizeResult {
        if (line.startsWith(this.type + ' ')) {
            return {
                jumpedLineCount: 1,
                tokens: [{ type: this.type, value: line.slice(6).trim() }],
            };
        }

        return {
            jumpedLineCount: 0,
            tokens: [],
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    parse(token: Token, parseValue: Function): ParseResult {
        if (token.type === this.type) {
            return {
                jumpedLineCount: 1,
                node: {
                    type: this.type,
                    content: parseValue(0),
                },
            };
        }

        return {
            jumpedLineCount: 0,
            node: null,
        };
    }

    renderHTML(node: Node): string | null {
        if (node.type === this.type) {
            return `<h5>${node.content}</h5>\n`;
        }

        return null;
    }
}

export class Title6 extends Atom {
    tokenize(line: string): TokenizeResult {
        if (line.startsWith(this.type + ' ')) {
            return {
                jumpedLineCount: 1,
                tokens: [{ type: this.type, value: line.slice(6).trim() }],
            };
        }

        return {
            jumpedLineCount: 0,
            tokens: [],
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    parse(token: Token, parseValue: Function): ParseResult {
        if (token.type === this.type) {
            return {
                jumpedLineCount: 1,
                node: {
                    type: this.type,
                    content: parseValue(0),
                },
            };
        }

        return {
            jumpedLineCount: 0,
            node: null,
        };
    }

    renderHTML(node: Node): string | null {
        if (node.type === this.type) {
            return `<h6>${node.content}</h6>\n`;
        }

        return null;
    }
}

export class Date extends Atom {
    tokenize(line: string): TokenizeResult {
        if (line.startsWith(this.type + ' ')) {
            return {
                jumpedLineCount: 1,
                tokens: [{ type: this.type, value: line.slice(this.type.length + 1).trim() }],
            };
        }

        return {
            jumpedLineCount: 0,
            tokens: [],
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    parse(token: Token, parseValue: Function): ParseResult {
        if (token.type === this.type) {
            return {
                jumpedLineCount: 1,
                node: {
                    type: this.type,
                    content: parseValue(0),
                },
            };
        }

        return {
            jumpedLineCount: 0,
            node: null,
        };
    }

    renderHTML(node: Node): string | null {
        if (node.type === this.type) {
            return `<div class="date">${node.content}</div>\n`;
        }

        return null;
    }
}

export class Image extends Atom {
    tokenize(line: string, lines: string[], currentIndex: number): TokenizeResult {
        const tokens: Token[] = [];
        let jumpedLineCount = 0;
        const tabSize = 4;

        if (line.startsWith(this.type + ' ')) {
            tokens.push({ type: this.type, value: line.slice(6).trim() });
            jumpedLineCount++;

            // Check if the next line is an indented alt text (with tab)
            if (currentIndex + 1 < lines.length && lines[currentIndex + 1].startsWith('\talt ')) {
                const altText = lines[currentIndex + 1].slice(5).trim(); // Capture alt text
                tokens.push({ type: 'alt', value: altText });
                jumpedLineCount++; // Move to next line
            } else if (currentIndex < lines.length && lines[currentIndex + 1].startsWith('    alt ')) {
                const altText = lines[currentIndex + 1].slice(tabSize + 4).trim(); // Capture alt text
                tokens.push({ type: 'alt', value: altText });
                jumpedLineCount++; // Move to next line
            }
        }

        return {
            jumpedLineCount,
            tokens,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    parse(token: Token, parseValue: Function, tokens: Token[], currentIndex: number): ParseResult {
        let jumpedLineCount = 0;
        if (token.type === this.type) {
            const src = parseValue(0);
            let altText = '';
            jumpedLineCount++;
            const content: Node[] = [];
            content.push({ type: 'imageSrc', content: src });

            if (currentIndex + 1 < tokens.length && tokens[currentIndex + 1].type === 'alt') {
                altText = parseValue(1);
                jumpedLineCount++; // Skip alt token
                content.push({ type: 'imageAlt', content: altText });
            }

            return {
                jumpedLineCount,
                node: {
                    type: this.type,
                    content,
                },
            };
        }

        return {
            jumpedLineCount: 0,
            node: null,
        };
    }

    renderHTML(node: Node): string | null {
        if (node.type === this.type) {
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
            return `<img ${args} />\n`;
        }

        return null;
    }
}