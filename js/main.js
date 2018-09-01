
//setup the canvas and get the DOM
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//define player variable
var score = 0;

//define ball
var x = canvas.width/2;
var y = canvas.height -30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

//define paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleSpd = 7;
var paddleX = (canvas.width-paddleWidth)/2;

//define bricks
var brickRowCount = 3; 
var brickColumnCount = 5; 
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10; 
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//control definition
var keyPressed = [];

//add events 
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//controls
function keyUpHandler(e){
	keyPressed[e.keyCode] = false;
}
function keyDownHandler(e){
	keyPressed[e.keyCode] = true;
}

//drawing score
function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + score, 8, 20);
}

//drawing loop
function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

//drawing paddle
function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBricks(){
	for(var c = 0; c < brickColumnCount; c++){
		for(var r = 0; r < brickRowCount; r++){
			if(bricks[c][r].status == 1){//make sure brick is not been hit
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

//collision for bricks
function collisionDetection(){
	for(var c = 0; c < brickColumnCount; c++){
		for(var r= 0; r< brickRowCount; r++){
			var b = bricks[c][r];

			//if collision then change the brick status
			if(b.status == 1 && x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
				dy = -dy;
				b.status = 0;
				score++;
				
				if(score == brickRowCount * brickColumnCount){
					alert("You Won! Congratulations!");
					document.location.reload();
				}
			}
		}
	}
}

//create drawing loop
function draw(){
	//clear canvas before each frame
	ctx.clearRect(0, 0, canvas.width, canvas.height);	
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	
	//paddle physics and movement
	if(keyPressed[39] && paddleX < canvas.width-paddleWidth){
		paddleX+=paddleSpd;
	}else if(keyPressed[37] && paddleX > 0){
		paddleX-=paddleSpd;
	}
	
	//ball physics and paddle collision
	if(x+dx > canvas.width-ballRadius || x + dx < ballRadius){
		dx = -dx;
	}
	if(y+dy<ballRadius){
		dy = -dy;
	}else if(y+dy>canvas.height-ballRadius){
		if(x > paddleX && x < paddleX + paddleWidth){
			dy = -dy;
			//dy*=1.2 //make it go faster each time the ball hits the paddle
		}else{
			alert("GAME OVER");
			document.location.reload();
		}
	}
	
	collisionDetection();
	
	x+=dx;
	y+=dy;

		requestAnimationFrame(draw);

	
}

requestAnimationFrame(draw);
//setInterval(draw, 10); //call draw every 10 milliseconds