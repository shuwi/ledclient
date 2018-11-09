# Backlog

> Simple multiplatform desktop app for storing TODOs, ideas or backlog items.
> You can organize them with boards as a plaintext or markdown. No dependencies, no internet connection required,
> no external accounts. Sleek flow.

## Features
- Organize your thoughts with items & boards. Use Markdown or plaintext for adding new items
- Move items to other board or drag&drop for reordering within current one
- Filter board items by text
- Light/dark theme
- Simple progress bar
- Keyboard shortcuts [full list available here](http://www.backlog.cloud/help)

## Update
When new version is available just download it, unzip and enjoy. No additional action is required. All your boards and items will be available.

## Change log
### 1.8.0
> This is another huge update with number of significant improvements/features added.
> Hopefully it will stay for a longer.

### Features & improvements
- dark theme
- `search items` feature
- backup to file feature
- new top bar unified acroos OS
- modals can be closed by pressing ESC or click outside modal area
- scroolbar ui improved
- number of keyboard shortcuts added
- check for updates on app startup
- other minor ui improvements...

### Bug fixes
- fixed issue which makes impossible to move some item to newly created board
- fix bug when specific items can't be edited nor deleted
- fixed issue when items list was not fully visible (last item was truncated)

## License
It's free and opensource application under **MIT** license. You can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source

# Technical
#### How ?
This application is built with [Electron](https://electron.atom.io) and web technologies (javascript, css, html) more specifically: [Vue.js](https://vuejs.org). UI toolkit is [iView](https://www.iviewui.com/)

#### Build Setup
You can build it yourself instead of downloading executable:

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[ef811ba](https://github.com/SimulatedGREG/electron-vue/tree/ef811ba974d696ee965da747315f20a034ebc590) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
