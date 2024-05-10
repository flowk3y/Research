# SQL Injection là gì?
SQL Injection là một lỗ hổng cho phép kẻ tấn công can thiệp vào query của đoạn mã được thực thi trên server (cụ thể là Backend) gửi đến Database server. Điều này cho phép kẻ tấn công có thể xem được những dữ liệu mà họ không được cấp phép hoặc nghiêm trọng hơn có thể dẫn đến RCE (Remote Execution Code) khi đó kẻ tấn công có thể móc nối tấn công vào các hạ tầng quan trọng khác trong hệ thống. SQL Injection còn có thể dẫn tới DOS attack
## Ví dụ
Ví dụ, trong một trang đăng nhập có dòng mã PHP như sau:
```php
$username = $_POST['username'];
$password = $_POST['password'];
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = mysqli_query($conn, $query);
```

Nếu không có biện pháp xác thực đầu vào, tin tặc có thể chèn một đoạn mã SQL độc hại vào trường username hoặc password, ví dụ: ' OR '1'='1. Khi đó, truy vấn SQL sẽ trở thành:
```sql
SELECT * FROM users WHERE username='' OR '1'='1' AND password=''
```
Truy vấn này sẽ luôn trả về tất cả các bản ghi trong bảng users vì điều kiện '1'='1' luôn đúng, cho phép tin tặc đăng nhập mà không cần tài khoản.

## Một số dạng SQL Injection


- In-band SQLi

	- Error-based SQLi:
		- Là một kỹ thuật tấn công SQL Injection dựa vào thông báo lỗi được trả về từ Database Server có chứa thông tin về cấu trúc của cơ sở dữ liệu.
		- Trong một vài trường hợp, chỉ một mình Error-based là đủ cho hacker có thể liệt kê được các thuộc tính của cơ sở dữ liệu
	
	- Union-based SQLi:
		- Là một kỹ thuật tấn công SQL Injection dựa vào sức mạnh của toán tử UNION trong ngôn ngữ SQL cho phép tổng hợp kết quả của 2 hay nhiều câu truy vấn SELECTION trong cùng 1 kết quả và được trả về như một phần của HTTP response

- Inferential SQLi (Blind SQLi): Khi không có kết quả nào được trả về từ truy vấn SQL. Kẻ tấn công phải suy luận thông tin từ phản ứng của ứng dụng, chẳng hạn như thời gian phản hồi (timeout) hoặc trạng thái (response) phản hồi.

- Blind-boolean-based SQLi

	- Time-based-blind SQLi: 
		- Là kĩ thuật tấn công SQL Injection dựa vào việc gửi các truy vấn tới cơ sở dữ liệu bắt buộc ứng dụng trả về các kết quả khác nhau phụ thuộc vào câu truy vấn là True hay False.
		- Tuỳ thuộc kết quả trả về của câu truy vấn mà HTTP reponse có thể thay đổi, hoặc giữ nguyên
		- Kiểu tấn công này thường chậm (đặc biệt với cơ sở dữ liệu có kích thước lớn) do người tấn công cần phải liệt kê từng dữ liệu, hoặc mò từng kí tự

- Out-of-band SQLi: Loại tấn công này sử dụng một kênh truyền thông khác (như file, DNS, v.v.) để truyền dữ liệu từ cơ sở dữ liệu.

## Ví dụ về một đoạn code demo SQL Injection cơ bản

```php
<?php
$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "test_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed " . $conn->connect_error);
}

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Login successfully!";
} else {
    echo "Username or password wrong!";
}

$conn->close();
?>
```

# Phòng chống SQL Injection

Để phòng chống lỗ hổng SQL Injection, các lập trình viên nên áp dụng các biện pháp sau:

1. **Xác thực đầu vào**: Luôn xác thực và làm sạch tất cả đầu vào từ người dùng trước khi sử dụng trong truy vấn SQL. Điều này có thể được thực hiện bằng cách sử dụng các hàm như `mysqli_real_escape_string()` trong PHP hoặc sử dụng các tham số hóa truy vấn (prepared statements).
2. **Luôn kiểm thử và audit code**: Kiểm thử bằng các inject những payload độc hại giúp lập trình viên có thể chủ động phát hiện được lỗ hổng từ đó dễ dàng trong việc vá code của mình. Ngoài ra, việc thường xuyên audit code hay bảo trì mã nguồn thường xuyên cũng là những cách hay để maintain code.
3. **Không hiển thị lỗi sql trực tiếp trên production**: Việc hiển thị lỗi trên production dễ dẫn tới Error-base injection, hacker có thể dễ dàng biết hệ thống đang gặp lỗ hổng từ đó khai thác