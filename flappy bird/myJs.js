const lLeftButton = document.getElementById('rotate-left-button');
const rRightButton = document.getElementById('rotate-right-button');
const dino_border = document.getElementById('dino-image-border');
const tweetList = document.getElementById('tweet-form');
let rotation  = 0;

const rotateDino = (event) => {
    const dino = document.getElementById('dino-image');
    rotate(dino,event);
}

function rotate(element, event) {
    if (event.target.id === 'rotate-left-button') {
        rotation = rotation - 15;
    } else {
        rotation = rotation + 15;
    }
    element.style.transform = 'rotate(' + rotation + 'deg)';
} 

const setVisibility = (element) => { 
    if (element.style.visibility === 'hidden'){
        element.style.visibility = 'visible';
    } else {
        element.style.visibility = 'hidden';
    }
}

const visibilityDino = () => {
    const dinoBorder = document.getElementById('dino-image2');
    setVisibility(dinoBorder);
}

const addTweet = (event) => {
    event.preventDefault();
    const tweet = tweetList.tweet.value;
    const newTweetEnter = document.createElement('li');
    const newTweetAvatar = document.createElement('div');
    newTweetAvatar.className = 'avatar';
    const newTweetText = document.createElement('span');
    newTweetText.innerText = tweet;
    const tweets = document.getElementById('tweets').getElementsByTagName('ul')[0];
    const newTweetLi = tweets.appendChild(newTweetEnter);
    newTweetEnter.appendChild(newTweetAvatar);
    newTweetEnter.appendChild(newTweetText);
    tweetList.tweet.value = "";

}

dino_border.onmouseenter = visibilityDino;
dino_border.onmouseleave = visibilityDino;

lLeftButton.onclick = rotateDino;
rRightButton.onclick = rotateDino;


tweetList.onsubmit = addTweet;