let addIcon = `<svg role="img" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" aria-labelledby="addIconTitle" stroke="#FFE9E9" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#FFE9E9"> <title id="addIconTitle">Add</title> <path d="M17 12L7 12M12 17L12 7"/> <circle cx="12" cy="12" r="10"/> </svg>`

let subIcon = `<svg role="img" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" aria-labelledby="removeIconTitle" stroke="#FFE9E9" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#FFE9E9"> <defs><filter id="shadow"><feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2"/></filter></defs><title id="removeIconTitle">Remove</title> <path d="M17,12 L7,12"/> <circle cx="12" cy="12" r="10"/> </svg>`

let addIcons = document.querySelectorAll('.add-icon');
addIcons.forEach(function (icon){
    icon.innerHTML = addIcon
    if (Array.from(icon.classList).indexOf('small-icon') !== -1) {
        let smallIcon = addIcon.replace('width="30px" height="30px"', 'width="20px" height="20px"')
        icon.innerHTML = smallIcon;
    }
});

let subIcons = document.querySelectorAll('.sub-icon');
subIcons.forEach(function (icon){
    icon.innerHTML = subIcon
    if (Array.from(icon.classList).indexOf('small-icon') !== -1) {
        let smallIcon = subIcon.replace('width="30px" height="30px"', 'width="20px" height="20px"')
        icon.innerHTML = smallIcon;
    }
});

let windowWidth = window.innerWidth;

let inks = document.querySelector('.inks');
let inksHeight = inks.offsetHeight;
let clockHeight = document.querySelector('.clock').offsetHeight;
let marginHeight = parseFloat(window.getComputedStyle(inks).marginTop);
let totalHeight = inksHeight + clockHeight + marginHeight;
let inksRatio = inksHeight / totalHeight;
inks.style.setProperty('height', inksHeight);

function resizeInks() {
    let clockHeight = document.querySelector('.clock').offsetHeight;
    let marginHeight = parseFloat(window.getComputedStyle(inks).marginTop);
    let totalHeight = inksHeight + clockHeight + marginHeight;
    inksHeight = inksRatio * totalHeight;
    inks.style.setProperty('height', inksHeight);
}

let subInks = document.querySelectorAll('.sub-inks');
let subInksWidth = subInks[0].offsetWidth;
let subInksRatio = subInksWidth / windowWidth;
subInks.forEach(subInk => subInk.style.setProperty('width', subInksWidth));

function resizeSubInks() {
    let windowWidth = window.innerWidth;
    subInksWidth = (subInksRatio) * windowWidth;
    subInks.forEach(subInk => subInk.style.setProperty('width', subInksWidth));
}

let container = document.querySelector('.container');
let containerWidth = container.offsetWidth;
let containerRatio = containerWidth / windowWidth;
container.style.setProperty('width', containerWidth);

function resizeContainer() {
    let windowWidth = window.innerWidth;
    containerWidth = (containerRatio) * windowWidth;
    container.style.setProperty('width', containerWidth);
}

window.addEventListener('resize', function() {
    resizeInks();
    resizeSubInks();
    resizeContainer();
});

function changeTitle() {
    let title = document.querySelector('title');
    title.textContent = document.querySelectorAll('.timer')[0].textContent;
}

function padNum(num) {
    let string = '';
    if (num.toString().length < 2) {
        string = `0${num.toString()}` 
    } else {
        string = num.toString();
    }
    return string;
}

function decrementTimer(element, timer) {
    let hours = Number(timer.slice(0, 2));
    let minutes = Number(timer.slice(3, 5));
    let seconds = Number(timer.slice(6, 8));
    let totalTime = hours * 3600 + minutes * 60 + seconds
    if (totalTime === 0) {
        return;
    }
    if (seconds === 0) {
        seconds = 60;
        --minutes;
    }
    setInterval(function () {
        if (seconds > 0) { 
            --seconds;
            let string = padNum(seconds);
            timer = padNum(hours) + ':' + padNum(minutes) + ':' + string;
            element.textContent = timer;
        }
        changeTitle();
    }, 1);
}

function incrementTimer(element, timer) {
    let hours = Number(timer.slice(0, 2));
    let minutes = Number(timer.slice(3, 5));
    let seconds = Number(timer.slice(6, 8));
    setInterval(function () {
        if (seconds < 59) { 
            ++seconds;
            let string = padNum(seconds);
            timer = padNum(hours) + ':' + padNum(minutes) + ':' + string;
            if (seconds === 59) {
                timer = padNum(hours) + ':' + padNum(++minutes) + ':' + '00';
            }
            element.textContent = timer;
        }
        changeTitle();
    }, 1);
}

let intervalID;
function stopTimer(element, timer, intervalID) {
    window.clearInterval(intervalID)
    let hours = Number(timer.slice(0, 2));
    let minutes = Number(timer.slice(3, 5));
    let seconds = Number(timer.slice(6, 8));
    timer = padNum(hours) + ':' + padNum(minutes) + ':' + padNum(seconds);
    element.textContent = timer;
}

function getActiveMode() {
    let active = document.querySelector('.active');
    let children = Array.from(active.childNodes).filter(e => e.nodeName !== '#text');
    let info = {};
    info['element'] = active;
    info['time'] = children[1].childNodes[1].textContent;
    info['mode'] = children[2].childNodes[1].textContent;
    return info;
}

function switchActiveMode() {
    let workInks = document.querySelector('.work-inks');
    let breakInks = document.querySelector('.break-inks');
    workInks.classList.toggle('active');
    breakInks.classList.toggle('active');
    let info = getActiveMode();
    let header = document.querySelector('.header');
    header.childNodes[1].textContent = info['mode'].toUpperCase();
}

function switchTimer(element) {
    switchActiveMode();
    let info = getActiveMode();
    if (info['mode'] === 'work') {
        intervalID = startTimer(element, info['time']);
    } else if (info['mode'] === 'break') {
        intervalID = startTimer(element, info['time'])
    }
}

function startTimer(element, timer) {
    let hours = Number(timer.slice(0, 2));
    let minutes = Number(timer.slice(3, 5));
    let seconds = Number(timer.slice(6, 8));
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    let intervalID = window.setInterval(function() {
        if (totalSeconds === 0) {
            stopTimer(element, timer, intervalID);
            switchTimer(element);
        } else {
            --totalSeconds;
            hours = Math.floor(totalSeconds / 3600);
            let remainder = totalSeconds % 3600;
            minutes = Math.floor(remainder / 60);
            seconds = remainder % 60;
            timer = padNum(hours) + ':' + padNum(minutes) + ':' + padNum(seconds);
            element.textContent = timer;
            changeTitle();
        }
    }, 1000);
    return intervalID;
}

function resetTimer(element) {
    let info = getActiveMode();
    let time = info['time']
    let hours = Number(time.slice(0, 2));
    let minutes = Number(time.slice(3, 5));
    let seconds = Number(time.slice(6, 8));
    let timer = padNum(hours) + ':' + padNum(minutes) + ':' + padNum(seconds);
    element.textContent = timer;
    changeTitle();
}

// click events

let timers = document.querySelectorAll('.timer');

let inksIcons = document.querySelectorAll('.inks .small-icon');
inksIcons.forEach(icon => icon.addEventListener('mousedown', function() {
    let ink = icon.parentNode.parentNode;
    if (ink.classList.contains('active')) {
        if (icon.classList.contains('add-icon')) {
        incrementTimer(timers[0], timers[0].textContent);
        }
        if (icon.classList.contains('sub-icon')) {
            decrementTimer(timers[0], timers[0].textContent);
        }
    }
}));

let decrementID;
subIcons.forEach(icon => icon.addEventListener('mousedown', function() {
    stopTimer(timers[0], timers[0].textContent, intervalID)
    let iconArray = Array.from(subIcons);
    let idx = iconArray.indexOf(icon);
    decrementID = setInterval(function() {
        decrementTimer(timers[idx], timers[idx].textContent);
        decrementTimer(timers[0], timers[0].textContent);
    }, 1)
    playBtn.textContent = 'play';
}));

subIcons.forEach(icon => icon.addEventListener('mouseup', function() {
    window.clearInterval(decrementID);
}));

subIcons.forEach(icon => icon.addEventListener('mouseleave', function() {
    window.clearInterval(decrementID);
}));

let incrementID;
addIcons.forEach(icon => icon.addEventListener('mousedown', function() {
    stopTimer(timers[0], timers[0].textContent, intervalID)
    let iconArray = Array.from(addIcons);
    let idx = iconArray.indexOf(icon);
    incrementID = setInterval(function() {
        incrementTimer(timers[idx], timers[idx].textContent);
        incrementTimer(timers[0], timers[0].textContent);
    }, 1)
    playBtn.textContent = 'play';
}));

addIcons.forEach(icon => icon.addEventListener('mouseup', function() {
    window.clearInterval(incrementID);
}));

addIcons.forEach(icon => icon.addEventListener('mouseleave', function() {
    window.clearInterval(incrementID)
}));

let clockHeader = document.querySelector('#clock-header');
clockHeader.addEventListener('click', function() {
    let playBtn = document.querySelector('#play');
    let info = getActiveMode();
    if (info['mode'] === 'work' && clockHeader.textContent.toLowerCase() === 'work') {
        stopTimer(timers[0], timers[0].textContent, intervalID);
        switchActiveMode();
        resetTimer(timers[0]);
        
    }
    if (info['mode'] === 'break' && clockHeader.textContent.toLowerCase() === 'break') {
        stopTimer(timers[0], timers[0].textContent, intervalID);
        switchActiveMode();
        resetTimer(timers[0]);
        
    }
    playBtn.textContent = 'play';
});

let playBtn = document.querySelector('#play');
playBtn.addEventListener('mousedown', function() {
    if (playBtn.textContent === 'play') {
        intervalID = startTimer(timers[0], timers[0].textContent);
        inks.style.height = '0';
        playBtn.textContent = 'pause';

    } else if (playBtn.textContent === 'pause') {
        stopTimer(timers[0], timers[0].textContent, intervalID);
        inks.style.height = inksHeight;
        playBtn.textContent = 'play';
    }
});

let restartBtn = document.querySelector('#reset');
restartBtn.addEventListener('mousedown', function() {
    stopTimer(timers[0], timers[0].textContent, intervalID)
    inks.style.height = inksHeight;
    playBtn.textContent = 'play';
    resetTimer(timers[0]);
});

let labelBtns = document.querySelectorAll('.label-btn');
labelBtns.forEach(btn => btn.addEventListener('mousedown', function() {
    let info = getActiveMode();
    if (btn.textContent === 'work') {
        while (info['mode'] !== 'work') {
            switchActiveMode();
            info = getActiveMode();
        }
        resetTimer(timers[0])
    } else if (btn.textContent === 'break') {
        while (info['mode'] !== 'break') {
            switchActiveMode();
            info = getActiveMode();
        }
        resetTimer(timers[0]);
    }
}));