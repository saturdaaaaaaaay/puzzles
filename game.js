var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(400, 400, {backgroundColor: 0xe6b5eb});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

var titleScene;
var instructScene;
var gameScene;
var gameOverScene;

var menuScene;

var menuText;

var resetText;
var quitText;
var cancelText;

var titleText;
var startText;
var howToPlay;

var instructText;
var returnText;

var gameOverText;

var starText = [
    "Oh, I'm sorry - I'm too cool to hang out with you.",
    "Dude, like for real.",
  ];
var squareText = [
  "I don't hang out with people who don't have at least 4 corners.",
  "Ew, you only have 3 corners - I'm going to throw up.",
  "Ugh I can't be seen with you.",
  "Gross, I can't."
  ];
var circleText = "...";
var speech = "";

var starLimit = 2;
var squareLimit = 4;
var circleLimit = 10;

var starCount;
var squareCount;
var circleCount;

var starFriend;
var squareFriend;
var circleFriend;

var star;
var square;
var circle;
var bill;
var background

PIXI.loader
  .add("assets.json")
  .load(setup);

function setup()
{
  titleScene = new PIXI.Container();
  instructScene = new PIXI.Container();
  gameScene = new PIXI.Container();
  gameOverScene = new PIXI.Container();
  menuScene = new PIXI.Container();

  stage.addChild(titleScene);
  stage.addChild(instructScene);
  stage.addChild(gameScene);
  stage.addChild(gameOverScene);

  gameScene.visible = false;
  instructScene.visible = false;
  gameOverScene.visible = false;

  menuScene.visible = false;

  setupTitle();

  setupInstruct();

  setupGame();

  setupMenu();

  setupGameOver();
}

function animate()
{
  requestAnimationFrame(animate);

  var buffer = 50;

  if (bill.position.x >= square.position.x - buffer &&
    bill.position.x <= square.position.x + buffer &&
    bill.position.y >= square.position.y - buffer &&
    bill.position.y <= square.position.y + buffer &&
    !squareFriend)
  {
    if (circleFriend)
    {
      squareFriend = true;
      speech = "Square: Woah! You're friends with Circle? They have, like, "
        + "infinite corners.";
    }
    else if (squareCount < squareLimit)
    {
      square.position.x = Math.floor(Math.random() * 300) + 50;
      square.position.y = Math.floor(Math.random() * 300) + 50;

      speech = "Square: " + squareText[squareCount];
      squareCount += 1;
    }
    else
    {
      squareFriend = true;
      speech = "Square: Actually, 3 corners are the new fashion. Let's be friends.";
    }
  }
  else if (bill.position.x >= star.position.x - buffer &&
    bill.position.x <= star.position.x + buffer &&
    bill.position.y >= star.position.y - buffer &&
    bill.position.y <= star.position.y + buffer &&
    !starFriend)
  {
    if (circleFriend)
    {
      starFriend = true;
      speech = "Man, Circle is the coolest guy around. Maybe you are alright."
    }
    else if (starCount < starLimit)
    {
      star.position.x = Math.floor(Math.random() * 300) + 50;
      star.position.y = Math.floor(Math.random() * 300) + 50;

      speech = "Star: " + starText[starCount];
      starCount += 1;
    }
    else
    {
      starFriend = true;
      speech = "Star: Who am I kidding? I don't have any friends either.";
    }
  }
  else if (bill.position.x >= circle.position.x - buffer &&
    bill.position.x <= circle.position.x + buffer &&
    bill.position.y >= circle.position.y - buffer &&
    bill.position.y <= circle.position.y + buffer &&
    !circleFriend)
  {
    if (squareFriend && starFriend)
    {
      circleFriend = true;
      speech = "Circle: Your friends seem alright.";
    }
    else if (circleCount < circleLimit)
    {
      circle.position.x = Math.floor(Math.random() * 300) + 50;
      circle.position.y = Math.floor(Math.random() * 300) + 50;

      speech = "Circle: " + circleText;
      circleCount += 1;
    }
    else
    {
      circleFriend = true;
      speech = "Circle: Fine.";
    }
  }

  if (squareFriend)
  {
    square.position.x = bill.position.x + 30;
    square.position.y = bill.position.y - 30;
  }
  if (starFriend)
  {
    star.position.x = bill.position.x - 30;
    star.position.y = bill.position.y - 30;
  }
  if (circleFriend)
  {
    circle.position.x = bill.position.x;
    circle.position.y = bill.position.y + 50;
  }

  if (squareFriend && starFriend && circleFriend)
  {
    document.getElementById("winmessage").innerHTML =
      "Congrats! Now you have friends."
    dispGameOver();
  }

  document.getElementById("speechtext").innerHTML = speech;
  text = speech;

  renderer.render(stage);
}
animate();







function setupTitle()
{
  titleText = new PIXI.Text("Let's make friends!");
  startText = new PIXI.Text("Click here to start!");
  howToPlay = new PIXI.Text("How to play");

  titleScene.addChild(startText);
  titleScene.addChild(howToPlay);
  titleScene.addChild(titleText);

  titleText.position.x = 100;
  titleText.position.y = 50;
  startText.position.x = 100;
  startText.position.y = 200;
  howToPlay.position.x = 100;
  howToPlay.position.y = 300;

  startText.interactive = true;
  howToPlay.interactive = true;

  startText.buttonMode = true;
  howToPlay.buttonMode = true;

  startText.on('mousedown', dispGame);
  howToPlay.on('mousedown', dispInstruct);
}

function setupInstruct()
{
  instructText = new PIXI.Text("Use your arrow keys or WASD to move Bill around to meet new friends!",{fontFamily : 'Arial', fontSize: 11, fill : 0xff1010, align : 'center'});
  returnText = new PIXI.Text("Return to title screen");
  returnText.interactive = true;
  returnText.buttonMode = true;
  returnText.on('mousedown', dispTitle);
  instructScene.addChild(instructText);
  instructScene.addChild(returnText);
  instructText.position.x = 0;
  instructText.position.y = 0;
  returnText.position.x = 100;
  returnText.position.y = 100;
}

function setupGame()
{
  background = new PIXI.Sprite(PIXI.Texture.fromImage("background.png"));
  background.position.x = 0;
  background.position.y = 0;
  gameScene.addChild(background);

  star = new PIXI.Sprite(PIXI.Texture.fromFrame("star1.png")); //3
  square = new PIXI.Sprite(PIXI.Texture.fromFrame("square1.png"));  //5
  circle = new PIXI.Sprite(PIXI.Texture.fromFrame("circle1.png")); //7
  bill = new PIXI.Sprite(PIXI.Texture.fromFrame("bill1.png"));  //1

  menuText = new PIXI.Text("Menu");
  menuText.interactive = true;
  menuText.buttonMode = true;
  gameScene.addChild(menuText);
  menuText.on('mousedown', dispMenu);

  gameScene.addChild(bill);
  bill.position.x = 200;
  bill.position.y = 200;

  gameScene.addChild(star);
  star.position.x = 295;
  star.position.y = 295;

  gameScene.addChild(circle);
  circle.position.x = 45;
  circle.position.y = 270;

  gameScene.addChild(square);
  square.position.x = 180;
  square.position.y = 90;

  starFriend = false;
  squareFriend = false;
  circleFriend = false;

  starCount = 0;
  squareCount = 0;
  circleCount = 0;

  starLimit = 2;
  squareLimit = 4;
  circleLimit = 10;
}

function setupMenu()
{
  resetText = new PIXI.Text("Reset game");
  quitText = new PIXI.Text("Quit to title screen");
  cancelText = new PIXI.Text("Return to game");

  menuScene.addChild(resetText);
  menuScene.addChild(quitText);
  menuScene.addChild(cancelText);

  resetText.position.x = 100;
  resetText.position.y = 50;
  quitText.position.x = 100;
  quitText.position.y = 100;
  cancelText.position.x = 100;
  cancelText.position.y = 150;
}

function setupGameOver()
{
  gameOverText = new PIXI.Text("You win!");
  gameOverScene.addChild(gameOverText);
  gameOverText.position.x = 100;
  gameOverText.position.y = 50;

  var playAgainText = new PIXI.Text("Play again?");
  gameOverScene.addChild(playAgainText);
  playAgainText.position.x = 100;
  playAgainText.position.y = 100;
  playAgainText.interactive = true;
  playAgainText.on('mousedown', reset);
}


function dispGame(e)
{
  titleScene.visible = false;
  instructScene.visible = false;
  gameScene.visible = true;
  gameOverScene.visible = false;
}

function dispInstruct(e)
{
  instructScene.visible = true;
  titleScene.visible = false;
  gameScene.visible = false;
  menuScene.visible = false;
}

function dispTitle()
{
  titleScene.visible = true;
  instructScene.visible = false;
  gameScene.visible = false;
  menuScene.visible = false;
}

function dispMenu()
{
  titleScene.visible = false;
  instructScene.visible = false;
  gameScene.visible = false;
  menuScene.visible = true;
}

function dispGameOver()
{
  gameScene.visible = false;
  gameOverScene.visible = true;

  gameOverScene.addChild(bill);
  gameOverScene.addChild(star);
  gameOverScene.addChild(square);
  gameOverScene.addChild(circle);
}
function reset()
{
  gameScene.addChild(bill);
  bill.position.x = 200;
  bill.position.y = 200;

  gameScene.addChild(star);
  star.position.x = 295;
  star.position.y = 295;

  gameScene.addChild(circle);
  circle.position.x = 45;
  circle.position.y = 270;

  gameScene.addChild(square);
  square.position.x = 180;
  square.position.y = 90;

  starCount = 0;
  squareCount = 0;
  circleCount = 0;

  starFriend = false;
  squareFriend = false;
  circleFriend = false;

  dispGame();
}

window.addEventListener("keydown", function(e)
{
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function keydownEventHandler(e)
{
  var key = e.keyCode;
  var duration = 150;
  var boundary = 50;
  var leaveText = "You're not allowed to leave.";
  var billX;
  var billY;

  if (key == 87 || key == 38)
  { // W key
    if (bill.position.y - boundary > 0)
    {
      billY = bill.position.y - boundary;
    }
    else
    {
      speech = leaveText;
    }
  }

  if (key == 83 || key == 40)
  { // S key
    if (bill.position.y + boundary < 380)
    {
      billY = bill.position.y + boundary;
    }
    else
    {
      speech = leaveText;
    }
  }

  if (key == 65 || key == 37)
  { // A key
    if (bill.position.x - boundary > 0)
    {
      billX = bill.position.x - boundary;
    }
    else
    {
      speech = leaveText;
    }
  }

  if (key == 68 || key == 39)
   { // D key
     if (bill.position.x + boundary < 380)
     {
       billX = bill.position.x + boundary;
     }
     else
     {
       speech = leaveText;
     }
  }

  createjs.Tween.get(bill.position).to({x: billX, y: billY}, duration);
}

document.addEventListener('keydown', keydownEventHandler);
