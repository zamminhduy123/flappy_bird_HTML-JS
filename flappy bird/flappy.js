const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
//get image src
var bg = new Image();
bg.src = './src/bg.png';

var pipeUp = new Image();
pipeUp.src = "./src/pipeNorth.png";

var pipeDown = new Image();
pipeDown.src = "./src/pipeSouth.png";

var fg = new Image();
fg.src = "./src/fg.png"

const pipeGap = 320;

var bird = new Image();

var bird_UpFlap = new Image();
bird_UpFlap.src = "./src/bird_UpFlap.png";
var bird_DownFlap = new Image();
bird_DownFlap.src = "./src/bird-downflap.png";
var bird_MidFlap = new Image();
bird_MidFlap.src = "./src/bird-midflap.png";

//message
const messageImage = new Image();
messageImage.src = './src/message.png';

//restart
const playButton = new Image();
playButton.src = './src/playbtn.png';


var change = 0,wing_state = 0;


var birdCor = {
    x: 50,
    y: 250,
    angle: 0
}

//first bird val
var pipe = [];
pipe[0] = {
    x: canvas.width,
    y: 0
}

// value set up
var g = 0.05, score = 0,v = 1;

//change later
const jumpVelocity = -2, birdRotationAngle = 2;

const birdJump = () => {
    v = jumpVelocity;
    birdCor.angle -= birdRotationAngle;
}

//audio 
const pointPlus = new Audio();
pointPlus.src = './src/Everything/sfx_point.wav';
const die = new Audio();
die.src = './src/Everything/sfx_hit.mp3';
const wing = new Audio();
wing.src = './src/Everything/sfx_wing.wav';

const setBirdAngle = () => {
    if (v > 0){
        if (birdCor.angle <= 70)
            birdCor.angle += birdRotationAngle;
    } else {
        if (birdCor.angle > -45)
            birdCor.angle -= birdRotationAngle;
    }
    bird.style.transform = 'rotate(' + birdCor.angle + 'deg)';
}

var isRunning = false;

canvas.addEventListener('click',() => {
    switch(gameState){
        case 1:
            gameState = 2;
            break;
        case 2:
            wing.play();
            birdJump();
            break;
        case 3:
            gameState = 1;
            gameReset();
            break;
    }
});

//score board display
const scoreBoard = new Image();
scoreBoard.src = './src/unnamed.png';
const gameOverImage = new Image();
gameOverImage.src = './src/gameover.png';

let gameState = 1;

const scoreDisplay= () => {
    ctx.drawImage(gameOverImage,50,100);
    ctx.drawImage(scoreBoard,35,170);
    ctx.drawImage(playButton,70,300,playButton.width/2,playButton.height/2);
    ctx.fillStyle = "#fff";
    ctx.font = "25px Open Sans";
    ctx.fillText(score,230,canvas.height/2-30);
}

const gameReset = () => {
    birdCor.y = 250;
    birdCor.angle = 0;
    change = 0;
    v = 1;
    pipe.splice(0,pipe.length);
    pipe[0] = {
        x: canvas.width,
        y: 0
    }
    score = 0;
}


//drawing get ready section
const readyZone = () => {
    ctx.drawImage(bg,0,0);
    ctx.drawImage(bird_MidFlap,birdCor.x,birdCor.y);
    ctx.drawImage(messageImage,50,50);
    // ground
    ctx.drawImage(fg,0,canvas.height-fg.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Open Sans";
    ctx.strokeText("Score : "+score,10,canvas.height-20);
}
readyZone();

//cast game due to state
const gameRun = () => {
    switch(gameState){
        case 1:
            readyZone();
            break;
        case 2:
            draw();
            break;
        case 3:
            scoreDisplay();
            break;
    }
    requestAnimationFrame(gameRun);
}


//drawing section
const draw = () => {
    // back ground
    ctx.drawImage(bg,0,0);
    //pipe
    for (var i = 0;i < pipe.length; i++){
        ctx.drawImage(pipeUp,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeDown,pipe[i].x,pipe[i].y+pipeGap);
        //move the pipe
        pipe[i].x--;
        if (pipe[i].x == canvas.width/2-50){
            pipe.push({
                x : canvas.width,
                y : Math.floor(Math.random()*pipeUp.height)-pipeUp.height
            }); 
        }
        //remove the pipe that get passed
        if (pipe[i].x+pipeUp.width < 0){
            pipe.slice(i,1);
        }

        //up score if  pass pipe
        if(pipe[i].x == birdCor.x){
            score++;
            pointPlus.play();
        }
    }
    //time 
    v += g;
    birdCor.y += v;
    change++;
    if (change == 7){
        switch(wing_state){
            case 0:
                bird = bird_UpFlap;
                wing_state = 1;
                break;
            case 1:
                bird = bird_MidFlap;
                wing_state = 2;
                break;
            case 2:
                bird = bird_DownFlap;
                wing_state = 0;
                break;
        }
        change=0;
    }
    
    //bird rotate
    setBirdAngle();
    var TO_RADIANS = Math.PI/180; 
    ctx.save();
    ctx.translate(birdCor.x, birdCor.y);
    ctx.rotate(birdCor.angle*TO_RADIANS);
    ctx.translate(-bird.width/2, -bird.height/2);
    ctx.drawImage(bird,0,0);
    ctx.restore();
    
    // ground
    ctx.drawImage(fg,0,canvas.height-fg.height);
    

    
    //collision
    let nextBirdPos;
    if (birdCor.y+bird.width/2 >= canvas.height - fg.height){
            gameState = 3;
            die.play();
            return;
    }
    let cornerBird = bird.height/2;
    for (let i =0; i < pipe.length;i++){
        if ((pipe[i].x >= birdCor.x-bird.width/2-4 && pipe[i].x <= birdCor.x+bird.width/2) || (pipe[i].x + pipeUp.width >= birdCor.x-bird.width/2-4 && pipe[i].x +pipeUp.width <= birdCor.x+bird.width/2)){
            nextBirdPos = birdCor.y+cornerBird;
            console.log(nextBirdPos);
            console.log(pipe[i].y+pipeGap);
            console.log('------');
            if (nextBirdPos >= pipe[i].y+pipeGap-4){
                gameState = 3;
                die.play();
                return;
            }
            nextBirdPos -= cornerBird*2;
            
            if (nextBirdPos >= 0 && nextBirdPos <=pipe[i].y+pipeUp.height){
                gameState = 3;
                die.play();
                return;
            }
            
        }
    }
    

   

    //score 
    let f = new FontFace('Open Sans', 'url(./src/04B_19__.TTF)');
    ctx.fillStyle = "#FFFFFF";
    // f.load().then(function() {
    //     ctx.font = '48px 04b_19';
    //     ctx.fillText("Score : "+score,10,canvas.height-20);
    // });
    f.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"Open Sans", Arial';
    }).catch(function(error) {
        // error occurred
       console.error(error);
    });

    ctx.font = '20px Open Sans';
    ctx.strokeText("Score : "+score,10,canvas.height-20);
        
    

}

gameRun();