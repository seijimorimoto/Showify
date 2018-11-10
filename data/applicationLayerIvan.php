<?php

header('Content-type: application/json');
header('Accept: application/json');

require_once __DIR__ . '/dataLayerIvan.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

switch ($requestMethod) {
    case "GET":$action = $_GET["action"];
        getRequests($action);
        break;
    case "POST":$action = $_POST["action"];
        postRequests($action);
        break;
    case "DELETE":
        parse_str(file_get_contents('php://input'), $_DELETE);
        $action = $_DELETE["action"];
        deleteRequests($action,$_DELETE);
        break;
}

function deleteRequests($action,$_DELETE){
    switch ($action) {
        case "DELETE_COMMENT": deleteComment($_DELETE);
        break;
    }
}

function getRequests($action)
{
    switch ($action) {
        case "LOAD_SERIES_DATA":loadSeries();
            break;
        case "LOAD_SERIES_RATING":loadSerieRate();
            break;
        case "LOAD_FOLLOW_DATA":loadFollowStatus();
            break;
        case "LOAD_COMMENTS":loadPosts();
            break;
    }
}

function postRequests($action)
{
    switch ($action) {
        case "RATE_SERIE":rateSeries();
            break;
        case "CHANGE_FOLLOW_STATUS": changeFollowStatus();
            break;
        case "POST_COMMENT": postComment();
            break;
    }
}
//Handles the possible errors in the webpage
function errorHandler($status, $code)
{
    switch ($code) {
        case 406:header("HTTP/1.1 $code User $status");
            die("Wrong credentials provided");
            break;
        case 500:header("HTTP/1.1 $code $status. Bad connection, portal is down");
            die("The server is down, we couldn't retrieve data from the data base");
            break;
        case 404:header("HTTP/1.1 $code. Series not found");
            die("The series you requested does not exist.");
            break;
    }
}
//Loads the main serie data 
function loadSeries()
{
    session_start();
    if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["username"])) {
        $showID = $_GET["showID"];
        $response = loadSeriesData($showID);
        if ($response["status"] == "SUCCESS") {
            echo json_encode($response);
        } else {
            errorHandler($response["status"], $response["code"]);
        }
    } else {
        session_destroy();
        header("HTTP/1.1 406 Session not set yet");
        die("Your session has expired.");
    }
}
//Allows the user to rate the serie
function rateSeries()
{
    session_start();
    if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["username"])) {
        $showID = $_POST["showID"];
        $rate = $_POST["rate"];
        $username = $_SESSION["username"];
        $response = rateSeriesData($showID,$username,$rate);
        if ($response["status"] == "SUCCESS") {
            echo json_encode($response);
        } else {
            errorHandler($response["status"], $response["code"]);
        }
    } else {
        session_destroy();
        header("HTTP/1.1 406 Session not set yet");
        die("Your session has expired.");
    }
}
//Loads the rate a serie has
function loadSerieRate(){
    session_start();
    if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["username"])) {
        $showID = $_GET["showID"];
        $response = loadSerieRateData($showID);
        if ($response["status"] == "SUCCESS") {
            echo json_encode($response["response"]);
        } else {
            errorHandler($response["status"], $response["code"]);
        }
    }else{
        session_destroy();
        header("HTTP/1.1 406 Session not set yet");
        die("Your session has expired.");
    }
}
//Loads the follow status of a user to a serie
function loadFollowStatus(){
    session_start();
    if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["username"])) {
        $showID = $_GET["showID"];
        $username = $_SESSION["username"];
        $response = loadFollowStatusData($showID,$username);
        if ($response["status"] == "SUCCESS") {
            echo json_encode($response["response"]);
        } else {
            errorHandler($response["status"], $response["code"]);
        }
    }else{
        session_destroy();
        header("HTTP/1.1 406 Session not set yet");
        die("Your session has expired.");
    }
}
//Allows the user to change his follow status
function changeFollowStatus(){
    session_start();
    if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["username"])) {
        $showID = $_POST["showID"];
        $username = $_SESSION["username"];
        $response = changeFollowStatusData($showID,$username);
        if ($response["status"] == "SUCCESS") {
            echo json_encode($response["response"]);
        } else {
            errorHandler($response["status"], $response["code"]);
        }
    }else{
        session_destroy();
        header("HTTP/1.1 406 Session not set yet");
        die("Your session has expired.");
    }
}
//Loads the comments on a serie
function loadPosts(){
    session_start();
    if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["username"])) {
        $username = $_SESSION["username"];
        $showID = $_GET["showID"];
        $response = loadPostsData($showID,$username);
        if ($response["status"] == "SUCCESS") {
            echo json_encode($response);
        } else {
            errorHandler($response["status"], $response["code"]);
        }
    }else{
        session_destroy();
        header("HTTP/1.1 406 Session not set yet");
        die("Your session has expired.");
    }
}
//Allows a user to comment on a serie's comment section
function postComment(){
    session_start();
    if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["username"])) {
        $username = $_SESSION["username"];
        $showID = $_POST["showID"];
        $content = $_POST["content"];
        $response = postCommentData($showID,$username,$content);
        if ($response["status"] == "SUCCESS") {
            echo json_encode($response["response"]);
        } else {
            errorHandler($response["status"], $response["code"]);
        }
    }else{
        session_destroy();
        header("HTTP/1.1 406 Session not set yet");
        die("Your session has expired.");
    }
}
//Allows a user to erease his own comments
function deleteComment($_DELETE){
    session_start();
    if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["username"])) {
        $comment = $_DELETE["comment"];
        $date = $_DELETE["date"];
        $user = $_DELETE["user"];
        $response = deleteCommentData($comment,$date,$user);
        if ($response["status"] == "SUCCESS") {
            echo json_encode($response["status"]);
        } else {
            errorHandler($response["status"], $response["code"]);
        }
    }else{
        session_destroy();
        header("HTTP/1.1 406 Session not set yet");
        die("Your session has expired.");
    }
}

?>