let request = require("request");
let cheerio = require("cheerio");
const { url } = require("inspector");
const fs = require("fs");
//let eachMatchurl = [];
request("https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results",requestCallback);

function requestCallback(err,res,html){
    const $ = cheerio.load(html);
const matchurls = $('a[data-hover="Scorecard"]');

for(let i =0;i<matchurls.length;i++){
    let topicUrl =  "https://www.espncricinfo.com"+$(matchurls[i]).attr("href");
    console.log(topicUrl);

}
}
