from flask import Flask, render_template, session, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "thisisasecretkey"
debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route("/")
def homepage():
    """to show the board on the page"""

    board = boggle_game.make_board()
    session['board'] = board

    return render_template("home.html", board=board)


@app.route("/check-guess")
def check_word():
    """to check to see if the word is valid"""  

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})


@app.route("/post-score", methods=["POST"])
def post_score():
    """to post the final score"""

    score = request.json["score"]

    return jsonify(score)
