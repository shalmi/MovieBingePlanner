
// console.log("Hello");
// console.log(theMovieDb);
var vids;
var vidsChosen = [];
var startTime = 9 * 60;
var breakTime = 5;
var editModeEnabled = false;

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    // return arr; // for testing
};

function addButton(i) {
    return '<button type="button" class="btn btn-primary" onclick="addClicked(' + i + ')" >Add Movie</button>   '
}
function removeMovieButton(i) {
    if(editModeEnabled){
        return '<button type="button" class="btn btn-warning" onclick="removeMovie(' + i + ')" ><i class="far fa-trash-alt"></i></button>   '
    }
    else{
        return ""
    }
}
function swapMovieUpButton(i) {
    if(editModeEnabled){

        var disabled = ""
        if (i == 0 ){
            disabled = "disabled";
        }
        return '<button type="button" '+disabled+' class="btn btn-primary" onclick="swapUp(' + i + ')" ><i class="fas fa-level-up-alt"></i></button>   '
    }
    else{
        return ""
    }

}
function swapMovieDownButton(i) {
    if(editModeEnabled){
        var disabled = ""
        if (i == vidsChosen.length-1){
            disabled = "disabled";
        }
        return '<button type="button" '+disabled+' class="btn btn-primary" onclick="swapDown(' + i + ')" ><i class="fas fa-level-down-alt"></i></i></button>   '
    }
    else{
        return ""
    }
}
$(function() {
    $('#toggle-edit').change(function() {
        editModeEnabled = $(this).prop('checked');
        updateChosenList();
        if (editModeEnabled){
            $("#stuffUnderSettings")[0].style.display = "block";
        }
        else{
            $("#stuffUnderSettings")[0].style.display = "none";
        }
    //   $('#console-event').html('Toggle: ' + $(this).prop('checked'))
    })
  })

function swapUp(i){
    array_move(vidsChosen,i,i-1);
    updateChosenList();
}
function swapDown(i){
    array_move(vidsChosen,i,i+1);
    updateChosenList();
}
function removeMovie(i){
    vidsChosen.splice(i,1);
    updateChosenList();
}

function startTimePlus(){
    startTime+=15;
    updateStartTime();
    updateChosenList();

}
function startTimeMinus(){
    startTime-=15;
    updateStartTime();
    updateChosenList();
}
function breakTimePlus(){
    breakTime+=1;
    updateBreakTime();
    updateChosenList();

}
function breakTimeMinus(){
    breakTime-=1;
    updateBreakTime();
    updateChosenList();
}
function submitCustom(x){
    console.log(x)
    alert("HELLO")
}

function padToTwo(number) {
    if (number <= 10) { number = ("0" + number).slice(-2); }
    return number;
}

function time_convert(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    return hours + ":" + padToTwo(minutes);
}
function time_convert_AM_PM(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    var AM_PM = "AM"
    if (hours >= 12){
        AM_PM = "PM"
    }
    if (hours > 12){
        hours-=12
    }
    return hours + ":" + padToTwo(minutes) + AM_PM;
}

function updateChosenList() {
    $("#movieTable tbody tr").remove();
    table = document.getElementById("movieTableBody"); //$("#movieTable");

    var index = 0;
    var runningStartTime = startTime;
    vidsChosen.forEach(e => {

        var row = table.insertRow(index);
        var NUM = row.insertCell(0);
        var TITLE = row.insertCell(1);
        var RUNTIME = row.insertCell(2);
        var STARTTIME = row.insertCell(3);
        var STOPTIME = row.insertCell(4);
        NUM.innerHTML = index,
        TITLE.innerHTML = e.title+ "  " + removeMovieButton(index)+swapMovieUpButton(index)+swapMovieDownButton(index),
        RUNTIME.innerHTML = time_convert(e.runtime);
        STARTTIME.innerHTML = time_convert(runningStartTime)
        STOPTIME.innerHTML = time_convert(runningStartTime+e.runtime);
        runningStartTime += e.runtime+breakTime;
        // console.log(index,e)
        index++;

    });

}



function addClicked(i) {
    // alert(vids[i].title);
    // $("#chosenMovies")[0].innerHTML += vids[i].title;
    function successCB_details(response) {

        newVid = JSON.parse(response)
        vidsChosen.push(newVid);
        updateChosenList();
    }

    theMovieDb.movies.getById({ "id": vids[i].id }, successCB_details, errorCB)

}
var successCB = function (response) {
    vids = JSON.parse(response).results;
    // console.log(response);
    // $("#myList li")[0].innerHTML = typeof response;
    if (vids.length >= 5) {
        for (let index = 0; index < 5; index++) {
            $("#myList li")[index].innerHTML = addButton(index) + vids[index].title
            // $("#myList li")[index].style.visibility = "visible";
            $("#myList li")[index].style.display = "block";
        }
    }
    else if (vids.length > 0) {
        for (let index = 0; index < vids.length; index++) {
            $("#myList li")[index].innerHTML = vids[index].title
            // $("#myList li")[index].style.visibility = "visible";
            $("#myList li")[index].style.display = "block";
        }
        for (let index = vids.length; index < 5; index++) {
            $("#myList li")[index].innerHTML = "";
            $("#myList li")[index].style.display = "none";

        }
    }
    else {
        for (let index = 0; index < 5; index++) {
            $("#myList li")[index].innerHTML = "";
            $("#myList li")[index].style.display = "none";
        }
    }
}

var errorCB = function (error) {
    console.log(error);
    for (let index = 0; index < 5; index++) {
        $("#myList li")[index].innerHTML = "";
        $("#myList li")[index].style.display = "none";
    }
}

function updateStartTime(){
    $("#startTimeHtml")[0].innerHTML = time_convert_AM_PM(startTime);
}
function updateBreakTime(){
    $("#breakTimeHtml")[0].innerHTML = time_convert(breakTime);
}
function init(){
    updateStartTime();
    updateBreakTime();
}

//Filter list
$(document).ready(function () {
    init()
    $("#listSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        theMovieDb.search.getMovie({ "query": value }, successCB, errorCB)
        // $("#myList li").filter(function() {
        //   $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        // });
        // $("#myList li")[0].innerHTML = "";
    });
});


// x = theMovieDb.search.getMovie({"query":"Harry P"}, successCB, errorCB)
// console.log(x)

