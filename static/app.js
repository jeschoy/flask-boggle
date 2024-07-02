class BoggleGame {
  // to show the board and update

  constructor(boardId, secs = 60) {
    this.secs = secs;
    this.showTimer();

    this.score = 0;
    this.words = new Set();
    this.board = $("#" + boardId);

    this.timer = setInterval(this.tick.bind(this), 1000);

    $(".add-guess", this.board).on("submit", this.handleSubmit.bind(this));
  }

  // to show a list of the guessed words

  showWord(word) {
    $(".words", this.board).append($("<li>", { text: word }));
  }

  // to show the score on the page

  showScore() {
    $(".score", this.board).text(this.score);
  }

  // to show messages on the page

  showMessage(msg, cls) {
    $(".msg", this.board).text(msg).removeClass().addClass(`msg ${cls}`);
  }

  // to handle the submission of the form to guess words

  async handleSubmit(evt) {
    evt.preventDefault();
    const $word = $(".word", this.board);

    let word = $word.val();
    if (!word) return;

    if (this.words.has(word)) {
      this.showMessage(`Already found ${word}`, "err");
      $word.val("").focus();
      return;
    }

    // to check for words that are guessed
    const res = await axios.get("/check-guess", { params: { word: word } });
    if (res.data.result === "not-word") {
      this.showMessage(`${word} is not a valid word`, "err");
      $word.val("").focus();
    } else if (res.data.result === "not-on-board") {
      this.showMessage(`${word} is not a valid guess`, "err");
      $word.val("").focus();
    } else {
      this.showWord(word);
      this.score += word.length;
      this.showScore();
      this.words.add(word);
      this.showMessage(`Added: ${word}`, "ok");
    }

    $word.val("").focus();
  }

  // to show the timer as it counts down
  showTimer() {
    $(".timer", this.board).text(this.secs);
  }

  async tick() {
    this.secs -= 1;
    this.showTimer();

    if (this.secs === 0) {
      clearInterval(this.timer);
      await this.scoreGame();
    }
  }

  // to show score at the end of the game

  async scoreGame() {
    $(".add-guess", this.board).hide();
    const resp = await axios.post("/post-score", { score: this.score });
    this.showMessage(`Final score: ${this.score}`, "ok");
  }
}
