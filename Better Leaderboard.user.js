// ==UserScript==
// @name         Better Leaderboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add new features to the Leaderboard
// @author       Brittle Dread
// @match        https://*.undercards.net/leaderboard.jsp
// @source       https://github.com/Liryax/Undercards-Better-Leaderboard/blob/master/Better%20Leaderboard.user.js
// @updateURL    https://github.com/Liryax/Undercards-Better-Leaderboard/raw/master/Better%20Leaderboard.user.js
// @downloadURL  https://github.com/Liryax/Undercards-Better-Leaderboard/raw/master/Better%20Leaderboard.user.js
// @grant        none
// ==/UserScript==

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}



//<input id="searchInput" style="width: 400px;" type="text" class="form-control" data-i18n-placeholder="leaderboard-search" />

function newOption(optionTitle){

    var opt = document.createElement("option")
    opt.value = optionTitle
    opt.innerHTML = optionTitle
    return opt

}

sortSelector = document.createElement("select")
//sortSelector.style = "width: 400px"
sortSelector.class = "form-control"
sortSelector.add(newOption("Elo Rating"))
sortSelector.add(newOption("Level"))
sortSelector.add(newOption("Total Games"))
sortSelector.add(newOption("Wins"))
sortSelector.add(newOption("Losses"))
sortSelector.add(newOption("Win/Loss Ratio (>= 50 games only)"))
sortSelector.add(newOption("Win Streak"))
sortSelector.addEventListener("change",function(){
initLeaderboard()
})

document.getElementById("searchInput").parentElement.insertBefore(sortSelector,document.getElementById("searchInput"))

//textElem = document.createElement("p")
//textElem.innerHTML = "Sort By : "

textElem = document.createTextNode("Sort By : ")

document.getElementById("searchInput").parentElement.insertBefore(textElem,sortSelector)

function customSort(){

    function winpercent(win,loss){
        if(win+loss < 50) return 0;
        return win/(win+loss)
    }

    if(window.sortSelector.value == "Elo Rating"){
        leaderboard.sort(function(a,b){return b.eloRanked - a.eloRanked})
    }else if(window.sortSelector.value == "Level"){
        leaderboard.sort(function(a,b){return b.level - a.level})
    }else if(window.sortSelector.value == "Total Games"){
        leaderboard.sort(function(a,b){return b.winsRanked+b.lossesRanked-a.winsRanked-a.lossesRanked})
    }else if(window.sortSelector.value == "Win Streak"){
        leaderboard.sort(function(a,b){return b.winStreak - a.winStreak})
    }else if(window.sortSelector.value == "Win/Loss Ratio (>= 50 games only)"){
        leaderboard.sort(function(a,b){return winpercent(b.winsRanked,b.lossesRanked)-winpercent(a.winsRanked,a.lossesRanked)})
    }else if(window.sortSelector.value == "Wins"){
        leaderboard.sort(function(a,b){return b.winsRanked-a.winsRanked})
    }else if(window.sortSelector.value == "Losses"){
        leaderboard.sort(function(a,b){return b.lossesRanked-a.lossesRanked})
    }


}

addJS_Node(customSort);



function initLeaderboard() {
    customSort()
    $('#maxPage').html(getMaxPage() + 1);
    $('#navButtons .btn').prop('disabled', false);
    $('#btnNext').prop('disabled', getMaxPage() <= 0);
    $('#btnPrevious').prop('disabled', true);
    $('#btnFirst').prop('disabled', true);
    $('#btnSelf').prop('disabled', !existUser);
    var isUserPage = localStorage.getItem("leaderboardPage") !== null;
    if (isUserPage && existUser) {
        userPage();
    } else {
        showPage(0);
        currentPage = 0
    }
}

addJS_Node(initLeaderboard);
