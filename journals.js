const fs = require('fs');
const xml2js = require('xml2js');
const promisify = require('./util').promisify;
const parser = new xml2js.Parser();

const readDirPromise = promisify(fs.readdir, fs);
const readFilePromise = promisify(fs.readFile, fs);
const parserPromise = promisify(parser.parseString);

exports.getJournals = function () {

    readDirPromise('./docs').then(function (files) {

        Promise.all(files.map( filename => {
            return readFilePromise('./docs/' + filename).then( data => {
                return parserPromise(data);
            })
        })).then(datas => {
            console.log('datas', datas, datas[0]);
        })

    })
}

// exports.getJournals = function (callback) {
//     let journals = [];

//     fs.readdir('./docs', (err, files) => {

//         let count = files.length;

//         files.forEach(filename => {
//             fs.readFile('./docs/' + filename, (err, data) => {

//                 parser.parseString(data, (err, result) => {
//                     journals.push(result);
//                 });

//                 count--;
//                 if(count <= 0) {
//                     callback(journals);
//                 }
//             })
//         })
//     })
// }
