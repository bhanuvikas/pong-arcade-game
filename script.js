const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const PADDLE_COLOR = "white";
const BOARD_COLOR = "black";
const BALL_RADIUS = 10;
const BALL_SPEED_VARIANCE_FACTOR = 0.30;
const AI_PADDLE_SPEED = 5;
const AI_TOLERANCE = 30;
const FPS = 50;
const WINNING_SCORE = 5;

var canvas, canvasContext;
var ballX, ballY, ballSpeedX, ballSpeedY, ballColorIndex;
var paddle1Y, paddle2Y;
var player1Score, player2Score, gameOver;
var config = {};
config.colors = ["violet", "blue", "green", "yellow", "orange", "red", "cyan", "deeppink", "magenta"];

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  paddle1Y = canvas.height/2 - PADDLE_HEIGHT/2;
  paddle2Y = canvas.height/2 - PADDLE_HEIGHT/2;

  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballColorIndex = 0;
  ballSpeedX = ballSpeedY = 5;
  player1Score = player2Score = 0;
  gameOver = false;

  var framesPerSecond = FPS;
  setInterval(function () {
    if(gameOver)  return;
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener("mousedown", function (evt) {
    if(gameOver) {
      player1Score = 0;
      player2Score = 0;
      gameOver = false;
    }
  });

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
  });
}

function moveEverything() {

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Left Side Check
  if(ballX <= 0) {
    // check if paddle1 got the ball
    if(ballY+BALL_RADIUS >= paddle1Y-PADDLE_WIDTH && ballY-BALL_RADIUS <= paddle1Y+PADDLE_HEIGHT+PADDLE_WIDTH) {
      ballSpeedX = -ballSpeedX;
      var delta = ballY - (paddle1Y+PADDLE_HEIGHT/2);
      ballSpeedY = delta*BALL_SPEED_VARIANCE_FACTOR;
    } else {
      player2Score++;
      resetBall();
    }
  }

  // Right Side Check
  if(ballX > canvas.width) {
    if(ballY+BALL_RADIUS >= paddle2Y && ballY-BALL_RADIUS <= paddle2Y+PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var delta = ballY - (paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedY = delta*BALL_SPEED_VARIANCE_FACTOR;
    } else {
      player1Score++;
      resetBall();
    }
  }

  // Top Side check
  if(ballY-BALL_RADIUS <= 0) {
    ballSpeedY = -ballSpeedY;
  }

  // Bottom Side Check
  if(ballY+BALL_RADIUS > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function resetBall() {
  if(player1Score == WINNING_SCORE || player2Score == WINNING_SCORE) {
    gameOver = true;
  }
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX = -ballSpeedX;
  ballColorIndex = (ballColorIndex+1)%(config.colors.length);
}

function drawEverything() {

  if(gameOver) {
    drawGameOver();
    return;
  }

  // To draw the BOARD background
  drawRect(0, 0, canvas.width, canvas.height, BOARD_COLOR);

  // To draw the BALL
  drawCircle(ballX, ballY, BALL_RADIUS, config.colors[ballColorIndex]);

  // To draw the left player's PADDLE1
  drawRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

  // To draw the right player's PADDLE2
  drawRect(canvas.width-PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

  // To draw the score
  drawScore();

  // To draw Net
  drawNet();
}

function drawScore() {
  // Player1 score
  drawText(player1Score, canvas.width/4, canvas.height/2, 30, "white");

  // Player2 score
  drawText(player2Score, canvas.width*3/4, canvas.height/2, 30, "white");
}

function drawGameOver() {
  drawRect(0, 0, canvas.width, canvas.height, "black");
  var text = "YOU ";
  if(player1Score == WINNING_SCORE) text += "WON";
  else text += "LOSE";
  drawText(text, canvas.width/2-70, canvas.height/4, 30, "white");
  text = player1Score + " - " + player2Score;
  drawText(text, canvas.width/2-20, canvas.height/4+60, 30, "white");

  // Click To Continue Message
  text = "Click to Play Again!";
  drawText(text, canvas.width/2-70, canvas.height*3/4, 20, "white");
}

function drawNet() {
  for(var i=0;i<canvas.height;i+=30) {
    drawRect(canvas.width/2-1, i, 2, 15);
  }
}

function computerMovement() {
  if(ballY < paddle2Y+PADDLE_HEIGHT/2 - AI_TOLERANCE) {
    paddle2Y -= AI_PADDLE_SPEED;
  } else if(ballY > paddle2Y+PADDLE_HEIGHT/2 + AI_TOLERANCE) {
    paddle2Y += AI_PADDLE_SPEED;
  }
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - (rect.left + root.scrollLeft);
  var mouseY = evt.clientY - (rect.top + root.scrollTop);

  return {
    x: mouseX,
    y: mouseY
  };
}

function drawRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function drawCircle(centerX, CenterY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, CenterY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function drawText(text, leftX, leftY, fontSize = 20, drawColor = "white", fontFamily = "serif") {
  canvasContext.font = fontSize + 'px ' + fontFamily;
  canvasContext.fillStyle = drawColor;
  canvasContext.fillText(text, leftX, leftY);
}
