let request = require('request')
let cheerio = require('cheerio')
let chalk = require("chalk")
let fs = require("fs")
let path = require("path")
let xlsx = require('xlsx')

/* 
let homePage = "https://www.espncricinfo.com"
let url = homePage + "/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard"
 */

function processSingleMatch(url){
  //  console.log(url)
    request(url,cb)
}

function cb(err,respose,html){
    dataExtractor(html)
}

function dataExtractor(html){
    const $ = cheerio.load(html)
    let bothInningArr = $(".Collapsible")
    for(let i=0;i<bothInningArr.length;i++){
        let teamNameElem = $(bothInningArr[i]).find("h5")
        let teamName = teamNameElem.text()
        teamName = teamName.split("INNINGS")[0]
        teamName = teamName.trim()
        console.log(chalk.blue(teamName));

        let batsmanTableBodyAllRows = $(bothInningArr[i]).find(".table.batsman tbody tr")
        for(let j=0;j<batsmanTableBodyAllRows.length;j++){
            let tdArr = $(batsmanTableBodyAllRows[j]).find("td")
            if(tdArr.length==8){
                let playerName = $(tdArr[0]).text();
                let runs = $(tdArr[2]).text();
                let balls = $(tdArr[3]).text();
                let fours = $(tdArr[5]).text();
                let sixes = $(tdArr[6]).text();
                // myTeamName	name	venue	date opponentTeamName	result	runs	balls	fours	sixes	sr
                console.log(playerName, "played for", teamName, "scored", runs, "in", balls, "with ", fours, "fours and ", sixes, "sixes");
                processPlayer(playerName, teamName, runs, balls, fours, sixes);
            }

        }

        console.log("````````````````````````````````````````");

    }  
}



function processPlayer(playerName, teamName, runs, balls, fours, sixes) {
    let obj = {
        playerName,
        teamName,
        runs,
        balls,
        fours,
        sixes
    }
    let dirPath = path.join(__dirname, teamName);
    //    folder 
    if (fs.existsSync(dirPath) == false) {
        fs.mkdirSync(dirPath)
    }
    // playerfile 
    let playerFilePath = path.join(dirPath, playerName + ".xlsx");
    let playerArray = [];
    if (fs.existsSync(playerFilePath) == false) {
        playerArray.push(obj);
    } else {
        // append
        playerArray = excelReader(playerFilePath, playerName);
        playerArray.push(obj);
    }
    // write in the files
    // writeContent(playerFilePath, playerArray);
    excelWriter(playerFilePath, playerArray, playerName);
}

module.exports = {
    psm : processSingleMatch
}






function excelWriter(filePath, json, sheetName) {
    // workbook create
    let newWB = xlsx.utils.book_new();
    // worksheet
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    // excel file create 
    xlsx.writeFile(newWB, filePath);
}



function excelReader(filePath, sheetName) {
    // player workbook
    let wb = xlsx.readFile(filePath);
    // get data from a particular sheet in that wb
    let excelData = wb.Sheets[sheetName];
    // sheet to json 
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}