const fs = require('fs');
const xml2js = require('xml2js');
const promisify = require('./util').promisify;
const parser = new xml2js.Parser();
const md = require('markdown-it')();
const TextNode = require('./textNode').TextNode;

const readDirPromise = promisify(fs.readdir, fs);
const readFilePromise = promisify(fs.readFile, fs);
const parserPromise = promisify(parser.parseString);


const rootNode = new TextNode(0, '');

exports.getJournals = function (callback) {

    fs.readdir('./docs', (err, files) => {

        let count = files.length;

        files.forEach(filename => {

            readFilePromise('./docs/' + filename).then(parserPromise).then(journal => {

                let content = md.render(journal.note.body[0]);

                let headerRe = /<h(\d)>(.*)<\/h\d>/;

                let currentNode = rootNode;
                let textCache = '';

                function dealTextCache() {
                    if(textCache) {
                        if(!currentNode.contents) currentNode.contents = [];
                        currentNode.contents.push({
                            to: journal.note.to[0],
                            content: textCache
                        })
                        textCache = '';
                    }
                }

                content.split('\n').forEach(line => {
                    let result = headerRe.exec(line);
                    if(result) {

                        let rank = Number(result[1]);
                        let title = result[2];

                        while(currentNode && rank <= currentNode.rank) {
                            dealTextCache();
                            currentNode = currentNode.parent;
                        }

                        if(currentNode) {
                            currentNode = currentNode.findOrInsert(rank, title);
                        } else {
                            currentNode = rootNode;
                        }
                    } else {

                        textCache += line;
                    }
                })

                dealTextCache();
                dealCount();

            }).catch(err => {
                console.log('err:', err);
                dealCount();
            })
        })

        function dealCount() {
            count--;
            if(count <= 0) {
                callback(rootNode);
            }
        }
    })
}
