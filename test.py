from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

class FlaskTests(TestCase):
  def setUp(self):
    """before testing"""

    self.client = app.test_client()
    app.config["TESTING"] = True

  def test_home(self):
    """to test homepage of app"""

    with self.client:
      res = self.client.get('/')
      self.assertIn('board', session)
      self.assertIn('Score', res.data)
      self.assertIn('Seconds Left', res.data)

  def test_word(self):
    """test words"""

    with self.client as client:
      with client.session_transaction() as ses:
        ses['board'] = [["B", "I", "R", "D", "S"],
                        ["B", "I", "R", "D", "S"],
                        ["B", "I", "R", "D", "S"],
                        ["B", "I", "R", "D", "S"],
                        ["B", "I", "R", "D", "S"]]
    res = self.client.get('/check-guess?word=birds')
    self.assertEqual(res.json['result'], 'ok')

  def test_not_word(self):
    """test fake words"""

    self.client.get('/')
    res = self.client.get('check-guess?word=jfiejsl')
    self.assertEqual(res.json['result'], 'not-word')
    