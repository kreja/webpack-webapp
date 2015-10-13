# webpack-webapp

### Features
* webpack(support amd/CommonJS)
* jade
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

open http://localhost:8080/list.html

build:

```bash
npm run build
```



### todo
* hot module replacement doesn't work
