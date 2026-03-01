# Feats

Feats is a Nuxt 4 app for tracking completed bicycle rides and planned routes.

It is a personal project to have a simple tool to keep track of my rides and routes. It is not intended to be a full-featured application, but rather a simple and easy-to-use tool for myself and anyone else who might find it useful. I used multiple bicycle platforms over the years and thought it would be handy to have a centralized place to have an overview of all my rides and routes.

## Quick start
1. Clone (or download) the repository and install dependencies:

```bash
cd feats
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open http://localhost:3000 in your browser.

### Run the latest build
If you don't want to keep the dev files, you can also build the application and afterwards delete the whole repository.

1. Clone (or download) the repository and build the app:

```bash
cd feats
npm install
npm run build
cd feats_vx.y.z/server
npm install
```
Now you have an independed build in folder 'feats_vx.y.z'. You can copy the folder to a destination of your choice and delete the repository.

2. Start the server: (from within folder 'feats_vx.y.z'):

```bash
node ./server/index.mjs
```

1. Open http://localhost:3000 in your browser.

<br><br>
>And don’t forget to get out and ride. The more you ride, the more data you collect.