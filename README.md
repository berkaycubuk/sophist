# Sophist

What if JavaScript eats Markdown?

## Documentation

Sophist is basically JavaScript that comes with additional features to primarily build websites. .sphst files are evaulated as JavaScript code.

### Usage

`sophist <path>` will compile the .sphst files into out/(path).html in the current working directory.

`sophist serve <path>` will compile the .sphst files into out/(path).html in the current working directory and serve it on port 8080.

### _

`_` is a special builtin object that comes with functions.

#### h1(text: string)

`_.h1()` function takes a string input and prints `<h1>your-text</h1>` to the page.

#### h2(text: string)

`_.h2()` function takes a string input and prints `<h2>your-text</h2>` to the page.

#### h3(text: string)

`_.h3()` function takes a string input and prints `<h3>your-text</h3>` to the page.

#### h4(text: string)

`_.h4()` function takes a string input and prints `<h2>your-text</h4>` to the page.

#### h5(text: string)

`_.h5()` function takes a string input and prints `<h5>your-text</h5>` to the page.

#### h6(text: string)

`_.h6()` function takes a string input and prints `<h6>your-text</h6>` to the page.

#### head(code: string)

`_.head()` function takes a html string input and prints the input into the head.

#### headLinkCSS(href: string)

`_.headLinkCSS()` function takes a href string input and prints `<link rel="stylesheet" href="<href-input>" />` into the head.

#### html(code: string)

`_.html()` function takes a html string input and prints the input into the body.

#### markdown(text: string)

`_.markdown()` function takes a string input and prints the input into the body as HTML compiled Markdown.

#### frontmatter(frontmatter: object)

`_.frontmatter()` function takes an object input and accepts it as frontmatter.

Systemwide accepted frontmatter properties:
- title: string

#### getFiles(path: string)

`_.getFiles()` function takes a path string input and returns found files.

#### import(path: string)

`_.import()` function takes a path string input and does an import. If it's js file it can be used on the page just like normal import. If it's css file, it will printed into the head.