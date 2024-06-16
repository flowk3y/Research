<?php
include("db.php");

function send_mail()
{
    return 0;
}

if (isset($_POST['username']) && !empty($_POST['username'])) {
    $username = $_POST['username'];

    $sql = "SELECT * FROM users WHERE username='$username'";

    try {
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Do something with exists email...
            send_mail();
        }
        echo "Email were sent to your registered email address if its exists.";
    } catch (Exception $e) {}

}
?>
