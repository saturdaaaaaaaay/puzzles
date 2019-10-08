//set up gameport, renderer, and stage
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(400, 400, {backgroundColor: 0xe6b5eb});
gameport.appendChild(renderer.view);
var stage = new PIXI.Container();

//declare variables for scene graphs
var titleScene;
var instructScene;
var gameScene;
var gameOverScene;
var menuScene;
var creditScene;

var menuText; //declare variable for menu button in game scene

//declare variables for buttons in menu
var resetText;
var quitText;
var cancelText;

//declare variables for text in title screen
var titleText;
var startText;
var howToPlay;
var credits;

//declare varaibles for instructions page
var instructText;
var returnText;

//declare varaible for game over screen
var gameOverText;

//text for character speech
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

//how many times Bill has to meet NPCs in order to make them friends
var starLimit = 2;
var squareLimit = 4;
var circleLimit = 10;

//keeps track of how many times Bill meets each NPC
var starCount;
var squareCount;
var circleCount;

//boolean - true if friends, false if not
var starFriend;
var squareFriend;
var circleFriend;

//declare variables for sprites
var star;
var square;
var circle;
var bill;
var background;

//declare variables for sound effects
var billNoise;
var starNoise;
var squareNoise;
var circleNoise;
var selectNoise;


//load spritesheet
PIXI.loader
  .add("assets.json")
  .add("bill.mp3")
  .add("circle.mp3")
  .add("square.mp3")
  .add("star.mp3")
  .add("select.mp3")
  .load(setup);

//set up game
function setup()
{
  //create scene graphs
  titleScene = new PIXI.Container();
  instructScene = new PIXI.Container();
  gameScene = new PIXI.Container();
  gameOverScene = new PIXI.Container();
  menuScene = new PIXI.Container();
  creditScene = new PIXI.Container();

  //add scene graphs to stage
  stage.addChild(titleScene);
  stage.addChild(instructScene);
  stage.addChild(gameScene);
  stage.addChild(gameOverScene);
  stage.addChild(menuScene);
  stage.addChild(creditScene);

  //make all scene graphs but title screen invisible
  gameScene.visible = false;
  instructScene.visible = false;
  gameOverScene.visible = false;
  menuScene.visible = false;
  creditScene.visible = false;

  billNoise = PIXI.audioManager.getAudio("bill.mp3");
  starNoise = PIXI.audioManager.getAudio("star.mp3");
  squareNoise = PIXI.audioManager.getAudio("square.mp3");
  circleNoise = PIXI.audioManager.getAudio("circle.mp3");
  selectNoise = PIXI.audioManager.getAudio("select.mp3");

  //set up appearance/function for each scene graph
  setupTitle();
  setupInstruct();
  setupGame();
  setupMenu();
  setupGameOver();
  setupCredits();
}

window.addEventListener("keydown", function(e)
{
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
    {
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
  billNoise.play();
}

document.addEventListener('keydown', keydownEventHandler);


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

      squareNoise.play();

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

      starNoise.play();

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

      circleNoise.play();

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
    square.setTexture(PIXI.Texture.fromFrame("square2.png"));
  }
  if (starFriend)
  {
    star.position.x = bill.position.x - 30;
    star.position.y = bill.position.y - 30;
    star.setTexture(PIXI.Texture.fromFrame("star2.png"));
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
  //create text for title and buttons
  titleText = new PIXI.Text("Let's make friends!");
  startText = new PIXI.Text("Click here to start!");
  howToPlay = new PIXI.Text("How to play");
  credits = new PIXI.Text("Credits");

  //add text to title scene graph
  titleScene.addChild(startText);
  titleScene.addChild(howToPlay);
  titleScene.addChild(titleText);
  titleScene.addChild(credits);

  //position text and buttons on screen
  titleText.position.x = 100;
  titleText.position.y = 50;
  startText.position.x = 100;
  startText.position.y = 100;
  howToPlay.position.x = 100;
  howToPlay.position.y = 150;
  credits.position.x = 100;
  credits.position.y = 200;

  //make buttons interactive
  startText.interactive = true;
  howToPlay.interactive = true;
  credits.interactive = true;
  startText.buttonMode = true;
  howToPlay.buttonMode = true;
  credits.buttonMode = true;

  //assign functions to each button
  startText.on('mousedown', dispGame);
  howToPlay.on('mousedown', dispInstruct);
  credits.on('mousedown', dispCredits);
}

function setupInstruct()
{
  instructText = new PIXI.Text("Use your arrow keys or WASD \n to move Bill around" +
    " to meet \nnew friends!",{align : 'center'});
  returnText = new PIXI.Text("Return to title screen");
  returnText.interactive = true;
  returnText.buttonMode = true;
  returnText.on('mousedown', dispTitle);
  instructScene.addChild(instructText);
  instructScene.addChild(returnText);
  instructText.position.x = 0;
  instructText.position.y = 50;
  returnText.position.x = 90;
  returnText.position.y = 200;
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

  resetText.interactive = true;
  quitText.interactive = true;
  cancelText.interactive = true;
  resetText.buttonMode = true;
  quitText.buttonMode = true;
  cancelText.buttonMode = true;

  resetText.on('mousedown', reset);
  quitText.on('mousedown', dispTitle);
  cancelText.on('mousedown', dispGame);
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
  playAgainText.buttonMode = true;
  playAgainText.on('mousedown', reset);
}

function setupCredits()
{
  var creditText = new PIXI.Text("Game by: Elie Carlos");
  var exitText = new PIXI.Text("Exit");

  creditScene.addChild(creditText);
  creditScene.addChild(exitText);

  creditText.position.x = 100;
  creditText.position.y = 100;
  exitText.position.x = 100;
  exitText.position.y = 300;

  exitText.interactive = true;
  exitText.buttonMode = true;

  exitText.on('mousedown', dispTitle);
}


function dispGame(e)
{
  selectNoise.play();
  titleScene.visible = false;
  instructScene.visible = false;
  gameScene.visible = true;
  gameOverScene.visible = false;
  menuScene.visible = false;
}

function dispInstruct(e)
{
  selectNoise.play();
  instructScene.visible = true;
  titleScene.visible = false;
  gameScene.visible = false;
  menuScene.visible = false;
}

function dispTitle()
{
  selectNoise.play();
  titleScene.visible = true;
  instructScene.visible = false;
  gameScene.visible = false;
  menuScene.visible = false;
  creditScene.visible = false;
}

function dispMenu()
{
  selectNoise.play();
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

function dispCredits()
{
  selectNoise.play();
  creditScene.visible = true;
  titleScene.visible = false;
}


function reset()
{
  selectNoise.play();
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

  square.setTexture(PIXI.Texture.fromFrame("square1.png"));
  star.setTexture(PIXI.Texture.fromFrame("star1.png"));

  document.getElementById("winmessage").innerHTML = null;

  document.getElementById("speechtext").innerHTML = null;

  speech = "";

  dispGame();
}
