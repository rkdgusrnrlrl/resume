#!/usr/bin/node
//
// This script will run a local development server. This is useful when
// developing the theme.
//
// Usage:
// `serve.js` to use the default JSONResume example
// `serve.js <filename>` to open a particular resume file 

var theme = require("./index.js");
var fs = require('fs');
var args = require('optimist').argv;

function toHtml() {
    try {
        var resume = args._.length? JSON.parse(fs.readFileSync(args._[0], 'utf8')) : require("resume-schema").resumeJson;
        const html =  theme.render(resume);
        fs.writeFile(`${__dirname}/index.html`, html, (err) => {
            if (err) {
                return console.log(err);
            }
        });
    } catch (e) {
        console.log(e.message);
        return "";
    }
}

toHtml();
