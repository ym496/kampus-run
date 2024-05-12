function showRaceTimer() {
    var raceType = document.getElementById('raceType').value;
    var clockContainer = document.getElementById('clockContainer');
    var raceTitle = document.getElementById('raceTitle');
    if (raceType === '5km' || raceType === '3km') {
        clockContainer.style.display = 'block';
        raceTitle.textContent = raceType + ' Race';
        startTimer(); 
        var startButton = document.getElementById('startButton');
        startButton.setAttribute('onclick', 'startRace("' + raceType + '")');
    } else {
        clockContainer.style.display = 'none'; 
    }
}

function startTimer() {
    var clock = document.getElementById('clock');

    function updateClock() {
        var currentTime = new Date();
        var hours = currentTime.getHours().toString().padStart(2, '0');
        var minutes = currentTime.getMinutes().toString().padStart(2, '0');
        var seconds = currentTime.getSeconds().toString().padStart(2, '0');
        clock.textContent = hours + ':' + minutes + ':' + seconds;
    }
    setInterval(updateClock, 1000); 
}

function startRace(raceType) {
    alert('Race started!'+ raceType);
}
