import { argv, exit } from 'node:process';
import { join, basename } from "https://deno.land/std@0.224.0/path/mod.ts";
import * as marked from 'npm:marked@15.0.6';
import { serveDir } from "jsr:@std/http/file-server";

const cwd = Deno.cwd();

const isProd = true;

const args = argv.slice(isProd ? 4 : 2);

if (args.length === 0) {
  console.log('Usage: sophist <file_name or folder_name>');
  console.log('Sophist v1.0.0');
  exit(1);
}

async function buildFile(filePath: string) {
  const pathSplit = filePath.split('.');
  if (pathSplit.length === 1) {
    return;
  }

  const ext = pathSplit.pop();
  if (ext != 'sphst') {
    return;
  }

  const basenameStr = basename(filePath);
  const folderPath = filePath.replace(basenameStr, '');
  const filename = join('./out', (pathSplit.join('.') + '.html').replace(cwd, ''));

  let frontmatter: any = {};
  const head: string[] = [];
  const body: string[] = [];

  const _ = {
    h1: function (value: string) {
      body.push(`<h1>${value}</h1>`);
    },
    h2: function (value: string) {
      body.push(`<h2>${value}</h2>`);
    },
    h3: function (value: string) {
      body.push(`<h3>${value}</h3>`);
    },
    h4: function (value: string) {
      body.push(`<h4>${value}</h4>`);
    },
    h5: function (value: string) {
      body.push(`<h5>${value}</h5>`);
    },
    h6: function (value: string) {
      body.push(`<h6>${value}</h6>`);
    },
    head: function (code: string) {
      head.push(code);
    },
    headLinkCSS: function (path: string) {
      head.push(`<link rel="stylesheet" href="${path}">`);
    },
    html: function (code: string) {
      body.push(code);
    },
    import: async function (path: string) {
      const fullPath = join(folderPath, path);

      if (fullPath.endsWith('.js')) {
        return import(fullPath);
      } else if (fullPath.endsWith('.css')) {
        const cssContent = Deno.readTextFileSync(fullPath);
        head.push(`<style>${cssContent.trim()}</style>`);
        return;
      }
    },
    markdown: function(markdownContent: string) {
      const content = marked.parse(markdownContent) as string;
      body.push(content);
    },
    frontmatter: function (obj: object) {
      frontmatter = obj;
      return obj;
    },
    getFiles: async function (pathString: string) {
      const fullPath = join(folderPath, pathString);
      const stats = await Deno.stat(fullPath);
      if (stats.isDirectory) {
        const files = Deno.readDirSync(fullPath);
        const formattedFiles: any[] = [];
        files.forEach(file => {
          if (file.isFile && file.name.endsWith('.sphst')) {
            const regex = /_.frontmatter\(\{[^}]*\}\)/g;
            const content = Deno.readTextFileSync(join(folderPath, join(pathString, file.name)));
            const matches = regex.exec(content);
            if (matches && matches.length > 0) {
              const match = matches[0].trim().replace('_.frontmatter(', '').replace('_.frontmatter(', '').slice(0, -1);
              const fm = Function(`return JSON.stringify(${match})`)();
              const url = basename(file.name).replace('.sphst', '')

              formattedFiles.push({...file, frontmatter: JSON.parse(fm), url});
            } else {
              formattedFiles.push({...file, frontmatter: {}});
            }
          } else {
            formattedFiles.push({...file});
          }
        });
        return formattedFiles;
      } else {
        return [];
      }
    }
  };

  function renderHtml(): string {
    return `<html>
    <head>
      ${frontmatter['title'] ? '<title>' + frontmatter['title'] + '</title>' : ''}
      ${head.join('\n')}
    </head>
    <body>
      ${body.join('\n')}
    </body>
  </html>`;
  }

  const content = await Deno.readTextFile(filePath) as string;

  await eval(`(async () => {
    ${content}
  })()`);

  const renderedHtml = renderHtml();

  const dir = filename.substring(0, filename.lastIndexOf('/'));

  // Create the directory and its parents if they don't exist
  await Deno.mkdir(dir, { recursive: true });

  await Deno.writeTextFile(filename, renderedHtml);

  console.log(filename + ' file created');
}

async function listFilesRecursive(dirPath: string): Promise<string[]> {
  const files: string[] = [];

  try {
    // Read the contents of the directory
    for await (const entry of Deno.readDir(dirPath)) {
      const fullPath = `${dirPath}/${entry.name}`;

      // If the entry is a directory, recurse into it
      if (entry.isDirectory) {
        if (!['.git', 'node_modules'].includes(entry.name)) {
          files.push(...(await listFilesRecursive(fullPath))); // Recurse into the directory
        }
      } else if (entry.isFile) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return files;
}

async function buildSite(pathString: string) {
  try {
    const stats = await Deno.stat(pathString);

    if (stats.isDirectory) {
      console.log('Directory found.');
      const files = await listFilesRecursive(pathString);

      for (let i = 0; i < files.length; i++) {
        await buildFile(files[i]);
      }
    } else if (stats.isFile) {
      console.log('File found.');

      await buildFile(pathString);
    }
  } catch (error) {
    console.error(error);
  }
}

async function watchFiles(pathString: string) {
  const watcher = Deno.watchFs(pathString);

  for await (const event of watcher) {
    for (const path of event.paths) {
      if (path.endsWith('.sphst') || path.endsWith('.js') || path.endsWith('.css')) {
        console.log(event);
        //await buildFile(path);
        await buildSite(pathString);
      }
    }
  }
}

async function startServer() {
  console.log('Starting server...')
  Deno.serve((req: Request) => {
    return serveDir(req, {
      fsRoot: "out",
    });
  });
}

async function main() {
  if (args[0] == 'serve') {
    if (args.length == 1) {
      console.log('Usage: sophist server <path>');
      return;
    }

    const pathString = join(cwd, args[1]);
    await buildSite(pathString);

    await Promise.all([
      watchFiles(pathString),
      startServer(),
    ]);
  } else {
    const pathString = join(cwd, args[0]);
    await buildSite(pathString);
  }
}

await main();