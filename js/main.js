
console.log("Hello");
// console.log(theMovieDb);
var vids;
var vidsChosen = [];

function addButton(i) {
    return '<button type="button" class="btn btn-primary" onclick="addClicked('+i+')" >Add Movie</button>   '
}

function padToTwo(number) {
    if (number<=10) { number = ("0"+number).slice(-2); }
    return number;
  }

function time_convert(num)
 { 
    var hours = Math.floor(num / 60);  
    var minutes = num % 60;
return hours + ":" + padToTwo(minutes);         
}

function updateChosenList() {
    $("#movieTable tbody tr").remove();
    table = document.getElementById("movieTableBody"); //$("#movieTable");
    index = vidsChosen.length;

    var overalltime = 0
    vidsChosen.forEach(element => {
        overalltime+=element.runtime
    });
    
    vidsChosen.slice().reverse().forEach(e => {
        
        var row = table.insertRow(0);
        var NUM = row.insertCell(0);
        var TITLE = row.insertCell(1);
        var RUNTIME = row.insertCell(2);
        var TOTALRUNTIME = row.insertCell(3);
        NUM.innerHTML = index,
        TITLE.innerHTML = e.title,
        RUNTIME.innerHTML = time_convert(e.runtime);
        TOTALRUNTIME.innerHTML = time_convert(overalltime);
        overalltime-=e.runtime;
        // console.log(index,e)
        index--;

    });
}



function addClicked(i) {
    // alert(vids[i].title);
    // $("#chosenMovies")[0].innerHTML += vids[i].title;
    function successCB_details(response){
        
        newVid = JSON.parse(response)
        vidsChosen.push(newVid);
        updateChosenList();
    }
    
    theMovieDb.movies.getById({"id":vids[i].id }, successCB_details, errorCB)
    
}
var successCB = function(response) {
    vids = JSON.parse(response).results;
    console.log(response);
    // $("#myList li")[0].innerHTML = typeof response;
    if(vids.length >= 5)
    {
        for (let index = 0; index < 5; index++) {
            $("#myList li")[index].innerHTML = addButton(index)+ vids[index].title
            // $("#myList li")[index].style.visibility = "visible";
            $("#myList li")[index].style.display = "block";
        }
    }
    else if (vids.length >0 ){
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
    else{
        for (let index = 0; index < 5; index++) {
            $("#myList li")[index].innerHTML = "";
            $("#myList li")[index].style.display = "none";
        }
    }
}

var errorCB = function(error) {
    console.log(error);
    for (let index = 0; index < 5; index++) {
        $("#myList li")[index].innerHTML = "";
        $("#myList li")[index].style.display = "none";
    }
}

//Filter list
$(document).ready(function(){
  $("#listSearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    theMovieDb.search.getMovie({"query":value}, successCB, errorCB)
    // $("#myList li").filter(function() {
    //   $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    // });
    // $("#myList li")[0].innerHTML = "";
  });
});


// x = theMovieDb.search.getMovie({"query":"Harry P"}, successCB, errorCB)
// console.log(x)

