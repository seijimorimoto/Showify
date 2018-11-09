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

    }
}

function postRequests($action)
{
    switch ($action) {
        case "RATE_SERIE":rateSeries();
            break;
        case "CHANGE_FOLLOW_STATUS": changeFollowStatus();
            break;
    }
}

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

?>