from flask import Flask, request, render_template
from markupsafe import Markup

app = Flask(__name__)

@app.route("/")
def home():
    if request.args.get('user'):
        return render_template('hello.html', user=request.args.get('user'))
    else:
        return "/?user=... <br>input something in ..."

if __name__ == "__main__":
    app.run()