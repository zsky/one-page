const koa = require('koa');
const { getJournals } = require('./journals');
const template = require('./themes/template').template;
const fs = require('fs');
const promisify = require('./util').promisify;
const readFilePromise = promisify(fs.readFile, fs);

let result = '';

// server
const app = koa();

app.use(function *(){

    switch (this.path) {
        case '/':
        case '/index':
        case '/index.html':
            this.body = template(result);
            break;
        case '/style.css':
            this.type = 'text/css';
            this.body = yield readFilePromise('./themes/markdown.css');
            break;
        default:
            break;
    }
});


getJournals(rootNode => {
    createContent(rootNode);

    app.listen(3000, () => {
        console.log('listen 3000');
    })
    console.log('Finish', result);
});

function createContent(currNode) {

    if(currNode.contents) {
        let titles = [];
        let pNode = currNode;
        while(pNode) {
            titles.push(pNode.title);
            pNode = pNode.parent;
        }
        result += '<h1>' + titles.reverse().join(' || ') + '</h1>';

        result += currNode.contents.map(obj => obj.time + '\n' + obj.content).join('');
    }

    currNode.childs.forEach(childNode => {
        createContent(childNode);
    })
}
