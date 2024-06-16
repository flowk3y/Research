<?php
include('db.php');

if (isset($_POST['username']) && !empty($_POST['username']) && isset($_POST['password']) && !empty($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username=? AND password=?";

    try {
        $stml = $conn->prepare($sql);
        $stml->bind_param("ss", $username, $password);
        $stml->execute();
        $result = $stml->get_result();

        if ($result->num_rows > 0) {
            echo "Login successful!";
        } else {
            echo "Invalid credentials!";
        }
    } catch (Exception $e) {
        echo "Invalid credentials!";
    }

}
?>