//设置 / 获取一些全局变量
let colors = ['blue', 'green', 'red', 'violet', 'yellow'];
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let body = document.body;
let scores = document.querySelectorAll('.score');
let num = 0;
let total = 100;
let currentBalloon = 0;
let gameOver = false;
let totalShadow = document.querySelector('.total-shadow');
let winnerWindow = document.querySelector('.win');
let loserWindow = document.querySelector('.lose');
let startBtn = document.querySelector('.start-btn');

//失败窗口按钮 Yes/No
document.querySelector('.restart').addEventListener('click', function () {
    totalShadow.style.display = 'none';
    winnerWindow.style.display = 'none';
    loserWindow.style.display = 'none';
    startGame();
})

document.querySelector('.cancel').addEventListener('click', function () {
    totalShadow.style.display = 'none';
})

//气球爆破音效
function playBallSound(){
    let audio = document.createElement('audio');
    audio.src = 'sounds/pop.mp3';
    audio.volume = 0.15;
    audio.play();
}

//创建一个气球对象
function createBalloon() {
    let div = document.createElement('div');

    let rand = Math.floor(Math.random() * colors.length);
    div.className = 'balloon balloon-' + colors[rand];

    rand = Math.floor(Math.random() * (windowWidth - 100));
    div.style.left = rand + 'px';
    //将气球的"ID" -- dataset.number 赋给该对象
    div.dataset.number = currentBalloon;
    currentBalloon++;

    body.appendChild(div);
    animateBalloon(div);
}

//删除一个气球对象
function deleteBalloon(e) {
    e.remove();
    num++;
    updateScore();
    playBallSound();
}

//更新分数
function updateScore() {
    scores.forEach(function (elem) {
        elem.textContent = num;
    })
}

//实现气球的上升
function animateBalloon(e) {
    let pos = 0;
    let randomSpeed = Math.floor(Math.random() * 6 - 3)     //气球上升速度随机微调
    let interval = setInterval(frame, 12 - Math.floor(num / 10) + randomSpeed);   //每 10 个气球加快上升速度

    function frame() {
        //检查该对象的 ID 是否还存在，如果不存在，证明已经被删除，则不作删除处理
        //若不做该判断，则气球会在被点击时删除一次，上升到顶端时再删除一次
        if (pos >= 200 + windowHeight && document.querySelector('[data-number="' + e.dataset.number + '"]')) {
            clearInterval(interval);
            gameOver = true;
            //console.log("clearInterval called...")
        }
        else {
            pos++;
            e.style.top = windowHeight - pos + 'px';
        }
    }
}

//实现点击气球消除（不能添加到 div，其在网页打开时不存在）
//该方法被称为 event delegation
document.addEventListener('click', function (event) {
    //console.log(event);
    /*
        当点击鼠标时，该事件被 event 记录
        点击事件具有属性 target，可以简单地获取被点击的对象
        用 .classList 获取对象的 class 列表
        用 .contains 方法检查其是否包含类名 balloon
    */
    if (event.target.classList.contains('balloon')) {
        console.log(event.target.classList)
        deleteBalloon(event.target);

    }
})

function startGame() {
    restartGame();
    let loop = setInterval(function () {
        if (!gameOver && num !== total) {
            createBalloon();
        } else if (num !== total) {
            clearInterval(loop);
            totalShadow.style.display = 'flex';
            loserWindow.style.display = 'block';
        }
        else {
            clearInterval(loop);
            totalShadow.style.display = 'flex';
            winnerWindow.style.display = 'block';
        }
    }, Math.floor((Math.random() * 600 +700)))  //随机生成时间 700 - 1300 ms
}

//游戏重启
function restartGame() {
    let forRemoving = document.querySelectorAll('div.balloon');
    forRemoving.forEach(function(elem){
        elem.remove();
    })
    gameOver = false;
    num = 0;
    updateScore();
}

startBtn.addEventListener('click', function(){
    startGame();
    document.querySelector('.bgm').volume = 0.2;
    document.querySelector('.bgm').play();
    document.querySelector('.start-game').style.display = 'none';
    document.querySelector('.score-block').style.display = 'flex';
})
