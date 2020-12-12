# HTTP Shortcuts Editor

This editor allows editing shortcuts from the [HTTP Shortcuts](https://github.com/Waboodoo/HTTP-Shortcuts) app remotely, from the comfort of a desktop browser.

It is deployed here: [http-shortcuts.rmy.ch/editor](https://http-shortcuts.rmy.ch/editor)

## Project Setup

### Web App

If you want to host your own version of it, you can run the following commands and host the contents of the `dist` directory.

```
yarn install
yarn build
```

or for local development

```
yarn serve
```

You might want to remove [this line](src/router/index.ts#L22) from the router config file if you want to host the web app at the domain root instead of the `/editor` subpath.

### API Server

The API server is currently just [a single PHP](public/api/files/index.php) file which accepts incoming `GET` and `POST` requests at `/api/files`.
It uses HTTP Basic Auth where the username is the device ID (as shown inside the HTTP Shortcuts app).

If PHP is not your cup of tea, I understand. I went with it because it was easier for me to host. Feel free to rewrite it in Node or Flask or whatever suits you, there's no magic in it.

## Acknowledgements

This project uses
- [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable) (MIT License)
- [Vue Prism Editor](https://github.com/koca/vue-prism-editor) (MIT License)
- [Vuejs Dialog Plugin](https://github.com/Godofbrowser/vuejs-dialog) (MIT License)
