<?php
session_start();

if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Page</title>
</head>
<body>
    <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
    <p>This is a secure admin page.</p>
    <p>FLAG: flag{Nic3_0ne_N0w_g0_t0_l3v3l_2}</p>
    <a href="logout.php">Logout</a>
</body>
</html>
