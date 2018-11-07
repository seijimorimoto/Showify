document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });
  $(document).ready(function(){
    $('select').formSelect();
  });

$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null) {
     return null;
  }
  return decodeURI(results[1]) || 0;
}

let jsonToSend = {
  "action": "LOAD_SERIES_DATA",
  "showID": $.urlParam('show')
};

$.ajax({
  url: "./data/applicationLayerIvan.php",
  type: "GET",
  data: jsonToSend,
  dataType: "json",
  success: function (data) {
    $("#showTitle").text(data["responseSeriesData"]["showName"]);
    $("#showStatus").text(data["responseSeriesData"]["showStatus"]);
    $("#showYear").text(data["responseSeriesData"]["showYear"]);
    $("#showEpisodes").text(data["responseSeriesData"]["totalEpisodes"]);
    $("#showSeasons").text(data["responseSeriesData"]["currentSeasons"]);
    $("#showDescription").text(data["responseSeriesData"]["showDescription"]);
    $('#showImage').prepend($('<img>',{id:'image',src:data["responseSeriesData"]["showImage"]}));
    let genres = "";
    $.each(data["responseGenre"], function (i) {
      if(i == 0){
        genres += data["responseGenre"][i]["genre"];
      }else{
        genres += ", " + data["responseGenre"][i]["genre"];
      }
    });
    $("#showGenre").text(genres);
  },
  error: function (err) {
    if(err.responseText == "The series you requested does not exist."){
      swal("Error!", "We couldn't retrieve this serie!", "error");
    }else{
      swal("Error!", "Your session has expired!", "error");
    }
  }
});