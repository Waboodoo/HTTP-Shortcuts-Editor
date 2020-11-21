# HTTP Shortcuts Editor

This editor allows editing shortcuts from the [HTTP Shortcuts](https://github.com/Waboodoo/HTTP-Shortcuts) app remotely, from the comfort of a desktop browser.

## Project Setup

### Web App

If you want to host your own version of it, you can run the following commands and host the contents of the `dist` directory.

```
yarn install
yarn build
```

You might want to remove [this line](src/router/index.ts#L22) from the router config file if you want to host the web app at the domain root instead of a `/editor` subpath.

### API Server

The API server is currently just a single PHP file which accepts incoming `GET` and `POST` requests at `/api/files`.
It uses HTTP Basic Auth where the username is the device ID (as shown inside the HTTP Shortcuts app).

## Acknowledgements

This project uses [https://github.com/SortableJS/Vue.Draggable](Vue.Draggable) and [https://github.com/koca/vue-prism-editor](Vue Prism Editor), both licensed under an MIT License.
