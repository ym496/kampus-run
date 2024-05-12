function showRaceTimer() {
    var raceType = document.getElementById('raceType').value;
    var raceArg = raceType.replace(/\D/g, ''); 
    var clockContainer = document.getElementById('clockContainer');
    var raceTitle = document.getElementById('raceTitle');

    fetch('/has_started/' + raceArg, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.started) {
            clockContainer.style.display = 'block';
            raceTitle.textContent = raceType + ' Race';
            startTimer();
            var startButton = document.getElementById('startButton');
            startButton.textContent = 'Started'; 
            startButton.classList.remove('btn-primary'); 
            startButton.classList.add('btn-secondary'); 
            startButton.setAttribute('onclick', ''); 
        } else {
            clockContainer.style.display = 'block';
            raceTitle.textContent = raceType + ' Race';
            startTimer();
            var startButton = document.getElementById('startButton');
            startButton.textContent = 'Start'; 
            startButton.classList.remove('btn-secondary'); 
            startButton.classList.add('btn-primary'); 
            startButton.setAttribute('onclick', 'startRace("' + raceArg + '")');
        }
    })
    .catch(error => {
        console.error('Error checking race status:', error);
    });
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
    var currentTime = new Date(); 
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    var requestData = {
        raceType: raceType,
        startTime: {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }
    };

    fetch('/start_race', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        var startButton = document.getElementById('startButton');
        startButton.textContent = 'Started'; 
        startButton.classList.remove('btn-primary'); 
        startButton.classList.add('btn-secondary'); 
        startButton.setAttribute('onclick', ''); 
    })
    .catch(error => {
        console.error('Error starting race:', error);
    });
}
