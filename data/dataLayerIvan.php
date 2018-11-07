<?php

function connect(){
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "proyectoFinal";

    $connection = new mysqli($servername, $username, $password, $dbname);

    if ($connection->connect_error) {
        return null;
    } else {
        return $connection;
    }
}

function loadSeriesData($showID){
    $conn = connect();
    if ($conn != null) {
        $sql = "SELECT showName, showDescription, showStatus, showYear, showImage, totalEpisodes, currentSeasons
				FROM Shows
                WHERE id='$showID'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $responseMainData = array("showName" => $row["showName"], "showDescription" => $row["showDescription"], "showStatus" => $row["showStatus"], "showYear" => $row["showYear"],
                "showImage" => $row["showImage"],"totalEpisodes" => $row["totalEpisodes"],"currentSeasons" => $row["currentSeasons"]);
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
            }else{
                return array("status" => "SERIES_NOT_FOUND", "code" => 404);
            }
        }else{
            return array("status" => "SERIES_NOT_FOUND", "code" => 404);
        }
    }else{
        return array("status" => "INTERNAL_SERVER_ERROR", "code" => 500);
    }
}

?>