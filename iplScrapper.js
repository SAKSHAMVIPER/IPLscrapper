let request = require('request')
 let cheerio = require('cheerio')
 let scorecardObj = require('./scorecardScrapper')

let homePage = "https://www.espncricinfo.com"
let url = homePage + "/series/ipl-2020-21-1210595"

 request(url,cb)

 function cb(err,respose,html){
     dataExtractor(html)
 }

function dataExtractor(html){
     const searchTool = cheerio.load(html)
     let anchorTags = searchTool(".label.blue-text.blue-on-hover")
     let viewallresults = searchTool(anchorTags[0]).attr('href')
     let resultPageFullLink =   homePage+viewallresults 
    
     request(resultPageFullLink,allResultPageFn)
     //console.log(resultPageFullLink);
}

function allResultPageFn(error,res,html){
    getAllScoreCard(html)
}

function getAllScoreCard(html){
     const selectorTool = cheerio.load(html)
     const allScoreCardAnchorTags   = selectorTool('a[data-hover="Scorecard"]')
     for(let i=0;i<allScoreCardAnchorTags.length;i++){
       let link  = selectorTool(allScoreCardAnchorTags[i]).attr('href')
    //    console.log(homePage+link)
       scorecardObj.psm(homePage+link)
     }
}