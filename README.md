# webpack-webapp(with-html)
No jade used, just html.
Use ejs as template engine

### Features
* webpack(support amd/CommonJS)
* ejs
* sass (css extracted from js)
* uglify when build
* auto refresh(but not hot module replacement, it's a problem to be solved..)
* bundle third-party packages into vendor.js and vendor.css, so you needn't require them in your file. Third-party packages included:
    * jquery
    * bootstrap([darkly-ui](http://bootswatch.com/darkly/))



### Usage

development:

```bash
npm run dev
```

open [http://localhost:8080](http://localhost:8080), the pages are listed as links

build:

```bash
npm run build
```
