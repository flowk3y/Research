<?php
include("db.php");

if (isset($_POST['username']) && !empty($_POST['username'])) {
    $username = $_POST['username'];

    $sql = "SELECT * FROM users WHERE username='$username'";

//    try {
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            echo "Email were sent to your registered email address.";
        } else {
            echo "No user were found.";
        }
//    } catch (Exception $e) {}

}
?>
