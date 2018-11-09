<?php

function connect()
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "showify";

    $connection = new mysqli($servername, $username, $password, $dbname);

    if ($connection->connect_error) {
        return null;
    } else {
        return $connection;
    }
}

function loadSeriesData($showID)
{
    $conn = connect();
    if ($conn != null) {
        $sql = "SELECT showName, showDescription, showStatus, showYear, showImage, totalEpisodes, currentSeasons
				FROM Shows
                WHERE id='$showID'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $responseMainData = array("showName" => $row["showName"], "showDescription" => $row["showDescription"], "showStatus" => $row["showStatus"], "showYear" => $row["showYear"],
                    "showImage" => $row["showImage"], "totalEpisodes" => $row["totalEpisodes"], "currentSeasons" => $row["currentSeasons"]);
            }
            $sql = "SELECT Genres.genre FROM ShowsGenres JOIN Genres on ShowsGenres.genre = Genres.genre WHERE showId = '$showID'";
            $result = $conn->query($sql);
            $responseGenreData = array();
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $row_array = array("genre" => $row["genre"]);
                    array_push($responseGenreData, $row_array);
                }
                $conn->close();
                return array("status" => "SUCCESS", "responseGenre" => $responseGenreData, "responseSeriesData" => $responseMainData);
            } else {
                return array("status" => "SERIES_NOT_FOUND", "code" => 404);
            }
        } else {
            return array("status" => "SERIES_NOT_FOUND", "code" => 404);
        }
    } else {
        return array("status" => "INTERNAL_SERVER_ERROR", "code" => 500);
    }
}

function rateSeriesData($showID, $username, $rate)
{
    $conn = connect();
    if ($conn != null) {
        $sql = "SELECT * FROM Ratings WHERE showId = '$showID' AND username = '$username'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $sql = "UPDATE Ratings SET score = '$rate' WHERE showId = '$showID' AND username = '$username'";
            if (mysqli_query($conn, $sql)) {
                $conn->close();
                return array("status" => "SUCCESS");
            } else {
                return array("status" => "INTERNAL_SERVER_ERROR", "code" => 404);
            }
        } else {
            $sql = "INSERT INTO Ratings Values('$username','$showID','$rate')";
            if (mysqli_query($conn, $sql)) {
                $conn->close();
                return array("status" => "SUCCESS");
            } else {
                return array("status" => "INTERNAL_SERVER_ERROR", "code" => 404);
            }
        }
    } else {
        return array("status" => "INTERNAL_SERVER_ERROR", "code" => 500);
    }
}

function loadSerieRateData($showID)
{
    $conn = connect();
    if ($conn != null) {
        $sql = "SELECT AVG(score) as score FROM Ratings WHERE showID = '$showID'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $response = array("score" => $row["score"]);
            }
            return array("status" => "SUCCESS", "response" => $response);
        } else {
            return array("status" => "INTERNAL_SERVER_ERROR", "code" => 404);
        }
    } else {
        return array("status" => "INTERNAL_SERVER_ERROR", "code" => 500);
    }
}

function loadFollowStatusData($showID,$username){
    $conn = connect();
    if ($conn != null) {
        $sql = "SELECT * FROM FollowedShows WHERE showID = '$showID' and username = '$username'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            return array("status" => "SUCCESS", "response" => "following");
        }else{
            return array("status" => "SUCCESS", "response" => "Not Following");
        }
    }else{
        return array("status" => "INTERNAL_SERVER_ERROR", "code" => 500);
    }
}

function changeFollowStatusData($showID,$username){
    $conn = connect();
    if ($conn != null) {
        $sql = "SELECT * FROM FollowedShows WHERE showID = '$showID' and username = '$username'";
        $result = $conn->query($sql);
        if($result->num_rows > 0){
            $sql = "DELETE FROM FollowedShows WHERE showID = '$showID' and username = '$username'";
            if (mysqli_query($conn, $sql)) {
                $conn->close();
                return array("status" => "SUCCESS","response" => "NOT_FOLLOWING");
            }else{
                return array("status" => "ERROR");
            }
        }else{
            $sql = "INSERT INTO FollowedShows VALUES ('$username','$showID')";
            if (mysqli_query($conn, $sql)) {
                $conn->close();
                return array("status" => "SUCCESS","response" => "FOLLOWING");
            }else{
                return array("status" => "ERROR");
            }
        }
    }else{
        return array("status" => "INTERNAL_SERVER_ERROR", "code" => 500);
    }
}

function loadPostsData($showID,$username){
    $conn = connect();
    if ($conn != null) {
        $sql = "SELECT Comments.username as user2, Users.firstName, Users.lastName, Comments.content, Comments.commentDate FROM Comments join Users on Comments.username = Users.username WHERE showId='$showID' ORDER BY Comments.commentDate";
        $result = $conn->query($sql);
        $return_arr = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row_array = array("firstName" => $row["firstName"], "lastName" => $row["lastName"], "content" => $row["content"], "user" => $row["user2"], "commentDate" => $row["commentDate"]);
                array_push($return_arr, $row_array);
            }
            $conn->close();
            return array("status" => "SUCCESS", "response" => $return_arr, "currentUser" => $username);
        } else {
            $conn->close();
            $return_arr;
            return array("status" => "SUCCESS", "response" => $return_arr);
        }
    }else{
        return array("status" => "INTERNAL_SERVER_ERROR", "code" => 500);
    }
}

function postCommentData($showID,$username,$content){
    $conn = connect();
    if ($conn != null) {
        $sql = "INSERT INTO Comments (content,commentDate,username,showId) VALUES ('$content',NOW(),'$username','$showID')";
        if (mysqli_query($conn, $sql)) {
            $conn->close();
            $response = $username;
            return array("status" => "SUCCESS","response" => $response);
        }else{
            return array("status" => "ERROR");
        }
    }else{
        return array("status" => "INTERNAL_SERVER_ERROR", "code" => 500);
    }
}

function deleteCommentData($comment,$date,$user){
    $conn = connect();
    if ($conn != null) {
        $sql = "DELETE FROM Comments WHERE content = '$comment' and commentDate = '$date' and username = '$user'";
        if (mysqli_query($conn, $sql)) {
            $conn->close();
            return array("status" => "SUCCESS");
        }else{
            return array("status" => "ERROR");
        }
    }else{
        return array("status" => "INTERNAL_SERVER_ERROR", "code" => 500);
    }
}

?>