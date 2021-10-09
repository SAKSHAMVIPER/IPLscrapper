let minimist = require("minimist");
let axios = require("axios");
let jsdom = require("jsdom");
let excel4node = require("excel4node");
let pdf = require("pdf-lib");
let fs = require("fs");
let path = require("path");

//input
// node cricinfoextracter.js --excel=iplcup.csv --dataDir=iplcup --source=https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results

let args = minimist(process.argv);
//console.log(args.dataDir);


//browser => url to html(utl se http -> server  ne html in http responce)
let responcepromise = axios.get(args.source);
responcepromise.then(function(responce){
    let html = responce.data;
    //console.log(html);

let dom = new jsdom.JSDOM(html);
let document = dom.window.document;
//console.log(document.title);

let matchScoreDivs = document.querySelectorAll("div.match-score-block");
// console.log(matchScoreDivs.length);
let matches = [];

    for(let i = 0; i < matchScoreDivs.length; i++){
        let match = {
            t1: "",
            t2: "",
            t1s: "",
            t2s: "",
            result: ""
        };

        let teamParas = matchScoreDivs[i].querySelectorAll("div.name-detail > p.name");
        match.t1 = teamParas[0].textContent;
        match.t2 = teamParas[1].textContent;

        let scoreSpans = matchScoreDivs[i].querySelectorAll("div.score-detail > span.score");
        if(scoreSpans.length == 2){
            match.t1s = scoreSpans[0].textContent;
            match.t2s = scoreSpans[1].textContent;
        } else if(scoreSpans.length == 1){
            match.t1s = scoreSpans[0].textContent;
            match.t2s = "";
        } else {
            match.t1s = "";
            match.t2s = "";
        }

        let resultSpan = matchScoreDivs[i].querySelector("div.status-text > span");
        match.result = resultSpan.textContent;

        matches.push(match);
    }
    console.log(matches);
})