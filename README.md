# Sophist

Sophist is a simple markup language to build static websites. Sophist is highly inspired by [Scroll](https://scroll.pub/index.html).

## Usage

`npm run start` to test the .sphst files. The end result should be availabe under the `/out` directory.

## Documentation

### title

Example:

```sphst
title This is my title
```

Generated result:

```html
<h1>This is my title</h1>
```

### title2

Example:

```sphst
title2 This is my second title
```

Generated result:

```html
<h2>This is my second title</h2>
```

### Rest of the commands

- title: `<h1>`
- title2: `<h2>`
- title3: `<h3>`
- title4: `<h4>`
- title5: `<h5>`
- title6: `<h6>`
- image: `<img />`
    - alt: string
- html5: makes the pages html5 ready
- importable: does not create file on the export
- metatags: adds meta tags to the head