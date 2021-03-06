// IMPORTANT NOTE: INCLUDE THIS JAVASCRIPT FILE AFTER THE common.js FILE IN YOUR HTML, OTHERWISE IT
// WON'T WORK APPROPRIATELY, SINCE IT USES FUNCTIONS FROM THAT FILE.

// Initializes the sidenav component when the page loads.
$(document).ready(function(){
  $('.sidenav').sidenav();
});

//Allows the use of select.
$(document).ready(function () {
  $('select').formSelect();
});

//Here all the series information is loaded
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
    $('#showImage').prepend($('<img>', { id: 'image', src: data["responseSeriesData"]["showImage"] }));
    let genres = "";
    $.each(data["responseGenre"], function (i) {
      if (i == 0) {
        genres += data["responseGenre"][i]["genre"];
      } else {
        genres += ", " + data["responseGenre"][i]["genre"];
      }
    });
    $("#showGenre").text(genres);
    getRate();
    getFollowState();
    getShowComments();
  },
  error: function (err) {
    if (err.responseText == "The series you requested does not exist.") {
      swal({
        title: 'Error!',
        text: 'The serie you requested does not exist',
        type: 'error',
        confirmButtonText: 'Ok'
      }).then((_) => {
        $(location).attr('href', './home.html');
      });
    } else if (err.responseText == "The server is down, we couldn't retrieve data from the data base") {
      swal({
        title: 'Error!',
        text: 'The server is down',
        type: 'error',
        confirmButtonText: 'Ok'
      }).then((_) => {
        $(location).attr('href', './index.html');
      });
    } else {
      swal({
        title: 'Error!',
        text: 'Your session has expired',
        type: 'error',
        confirmButtonText: 'Ok'
      }).then((_) => {
        $(location).attr('href', './index.html');
      });
    }
  }
});

//This function obtains the rate of a serie and updates it
function getRate(){
  let jsonToSend2 = {
    "action": "LOAD_SERIES_RATING",
    "showID": $.urlParam('show')
  };
  $.ajax({
    url: "./data/applicationLayerIvan.php",
    type: "GET",
    data: jsonToSend2,
    dataType: "json",
    success: function (data) {
      let temp = Math.round(data.score * 100) / 100;
      $("#showRating").text(temp);
    },
    error: function (err) {
      if (err.responseText == "The server is down, we couldn't retrieve data from the data base") {
        swal({
          title: 'Error!',
          text: 'The server is down',
          type: 'error',
          confirmButtonText: 'Ok'
        }).then((_) => {
          $(location).attr('href', './index.html');
        });
      }else{
          swal({
            title: 'Error!',
            text: 'Your session has expired',
            type: 'error',
            confirmButtonText: 'Ok'
          }).then((_) => {
            $(location).attr('href', './index.html');
          });
      }
    }
  });
}

//This function obtains the follow state of the show
function getFollowState(){
  let jsonToSend3 = {
    "action": "LOAD_FOLLOW_DATA",
    "showID": $.urlParam('show')
  };
  $.ajax({
    url: "./data/applicationLayerIvan.php",
    type: "GET",
    data: jsonToSend3,
    dataType: "json",
    success: function (data) {
      if(data == "Not Following"){
        $("#followbutton").text("Follow");
        $("#followbutton").removeClass();
        $("#followbutton").addClass("waves-effect waves-light btn bold blue accent-2");
      }else{
        $("#followbutton").text("Unfollow");
        $("#followbutton").removeClass();
        $("#followbutton").addClass("waves-effect waves-light btn bold grey");
      }
    },
    error: function (err) {
      if (err.responseText == "The server is down, we couldn't retrieve data from the data base") {
        swal({
          title: 'Error!',
          text: 'The server is down',
          type: 'error',
          confirmButtonText: 'Ok'
        }).then((_) => {
          $(location).attr('href', './index.html');
        });
      }else{
        swal({
          title: 'Error!',
          text: 'Your session has expired',
          type: 'error',
          confirmButtonText: 'Ok'
        }).then((_) => {
          $(location).attr('href', './index.html');
        });
      }
    }
  });
}

//This function allows you to obtain the comments on the show
function getShowComments(){
  let jsonToSend4 = {
    "action": "LOAD_COMMENTS",
    "showID": $.urlParam('show')
  };
  $.ajax({
    url: "./data/applicationLayerIvan.php",
    type: "GET",
    data: jsonToSend4,
    dataType: "json",
    success: function (data) {
      var array = data.response;

      $.each(array, function (i) {
        if(array[i].user == data.currentUser){
          var commenHTML = $(`<li class="collection-item"></li>`).html(`<div class="comment">` + `<b><span id="userNameComment">` + array[i].user  + `</span>` + ": " +`</b><span class="Commentcontent">` + array[i].content + `</span><a class="secondary-content deleteButton"><i class="material-icons icon-blue">close</i></a> </div></div><div class="commentDate">` + array[i].commentDate + `</div>`);
        }else{
          var commenHTML = $(`<li class="collection-item"></li>`).html(`<div class="comment">` + `<b><span id="userNameComment">` + array[i].user + `</span>` + ": " +`</b><span class="Commentcontent">` + array[i].content + `</span></div></div><div class="commentDate">` + array[i].commentDate + `</div>`);
        }
        $("#commentList").prepend(commenHTML);
      });
    },
    error: function (err) {
      if (err.responseText == "The server is down, we couldn't retrieve data from the data base") {
        swal({
          title: 'Error!',
          text: 'The server is down',
          type: 'error',
          confirmButtonText: 'Ok'
        }).then((_) => {
          $(location).attr('href', './index.html');
        });
      }else{
      
        swal({
          title: 'Error!',
          text: 'Your session has expired',
          type: 'error',
          confirmButtonText: 'Ok'
        }).then((_) => {
          $(location).attr('href', './index.html');
        });
      }
    }
  });
}

//This function allows the user to update/make a rating
$('#rateNow').on('click', function () {
  let jsonToSend = {
    "action": "RATE_SERIE",
    "showID": $.urlParam('show'),
    "rate": $("#rateSelect").val()
  };
  if ($("#rateSelect").val() != null) {
    $.ajax({
      url: "./data/applicationLayerIvan.php",
      type: "POST",
      data: jsonToSend,
      dataType: "json",
      success: function (data) {
        swal({
          title: 'Congratulations!',
          text: 'You successfully rated this serie!',
          type: 'success',
          confirmButtonText: 'Ok'
        })
        getRate();
      },
      error: function (err) {
        if (err.responseText == "The server is down, we couldn't retrieve data from the data base") {
          swal({
            title: 'Error!',
            text: 'The server is down',
            type: 'error',
            confirmButtonText: 'Ok'
          }).then((_) => {
            $(location).attr('href', './index.html');
          });
        }else{
          swal({
            title: 'Error!',
            text: 'Your session has expired',
            type: 'error',
            confirmButtonText: 'Ok'
          }).then((_) => {
            $(location).attr('href', './index.html');
          });
        }
      }
    });
  }
});

//This function allows the user to follow/unfollow a show
$('#followbutton').on('click', function(){
  let jsonToSend = {
    "action": "CHANGE_FOLLOW_STATUS",
    "showID": $.urlParam('show')
  };
  $.ajax({
    url: "./data/applicationLayerIvan.php",
    type: "POST",
    data: jsonToSend,
    dataType: "json",
    success: function (data) {
      console.log(data);
      if(data == "NOT_FOLLOWING"){
        swal({
          title: 'OK!',
          text: 'You stopped following this show',
          type: 'success',
          confirmButtonText: 'Ok'
        })
      }else{
        swal({
          title: 'Congratulations!',
          text: 'You are now following this show',
          type: 'success',
          confirmButtonText: 'Ok'
        })
      }
      getFollowState();
    },
    error: function (err) {
      if (err.responseText == "The server is down, we couldn't retrieve data from the data base") {
        swal({
          title: 'Error!',
          text: 'The server is down',
          type: 'error',
          confirmButtonText: 'Ok'
        }).then((_) => {
          $(location).attr('href', './index.html');
        });
      } else {
        swal({
          title: 'Error!',
          text: 'Your session has expired',
          type: 'error',
          confirmButtonText: 'Ok'
        }).then((_) => {
          $(location).attr('href', './index.html');
        });
      }
    }
  });
});

//This function allows the user to post a comment
$('#buttonComment').on('click',function(){
  let jsonToSend = {
    "action": "POST_COMMENT",
    "showID": $.urlParam('show'),
    "content": $('textarea#commentArea').val()
  };
  if ($('textarea#commentArea').val() != '' && $('textarea#commentArea').val().length <= 500) {
    $.ajax({
      url: "./data/applicationLayerIvan.php",
      type: "POST",
      data: jsonToSend,
      dataType: "json",
      success: function (data) {
        datetime = moment().format('YYYY-MM-DD H:mm:ss');
        var commenHTML = $(`<li class="collection-item"></li>`).html(`<div class="comment">` + `<b><span id="userNameComment">` + data  + `</span>` + ": " +`</b><span class="Commentcontent">` + $('textarea#commentArea').val() + `</span><a class="secondary-content deleteButton"><i class="material-icons icon-blue">close</i></a> </div></div><div class="commentDate">` + datetime + `</div>`);
        $("#commentList").prepend(commenHTML);
        $('textarea#commentArea').val(undefined);
        swal({
          title: 'Congratulations!',
          text: 'You successfully reviewed this serie!',
          type: 'success',
          confirmButtonText: 'Ok'
        })
      },
      error: function (err) {
        if (err.responseText == "The server is down, we couldn't retrieve data from the data base") {
          swal({
            title: 'Error!',
            text: 'The server is down',
            type: 'error',
            confirmButtonText: 'Ok'
          }).then((_) => {
            $(location).attr('href', './index.html');
          });
        }else{
          swal({
            title: 'Error!',
            text: 'Your session has expired',
            type: 'error',
            confirmButtonText: 'Ok'
          }).then((_) => {
            $(location).attr('href', './index.html');
          });
        }
      }
    });
  }else{
    swal({
      title: 'Error!',
      text: 'Your review must not be empty or longer than 500 characters',
      type: 'error',
      confirmButtonText: 'Ok'
    })
  }
});

//This function allows you to delete your comments
$("#commentList").on("click",".deleteButton",function(event){
  $li = $(this).parent("div").parent("li");
  let comment = $li.find(".Commentcontent").text();
  let date = $li.find(".commentDate").text();
  let user = $li.find("#userNameComment").text();
  let jsonToSend = {
      "action": "DELETE_COMMENT",
      "comment" : comment,
      "date": date,
      "user": user
  };
  swal({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, erase the review!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url: "./data/applicationLayerIvan.php",
        type: "DELETE",
        data: jsonToSend,
        dataType: "json",
        success: function (data) {
          $("#commentList").empty();
          getShowComments();
        }
       });
      swal(
        'Deleted!',
        'Your review has been deleted.',
        'success'
      )
    }
  })
  
});