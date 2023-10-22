let timer; // Timer variable
let isRunning = false; // Flag to track if the stopwatch is running
let seconds = 0, minutes = 0, hours = 0; // Time counters
let lapStartTime = 0;

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        lapStartTime = Date.now() - (hours * 3600 + minutes * 60 + seconds) * 1000;
        timer = setInterval(updateStopwatch, 1000);
    }
}

function stopTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
    }
}

function resetTimer() {
    stopTimer();
    seconds = -1;
    minutes = 0;
    hours = 0;
    updateStopwatch();
    clearLapTimes();
}

function lapTimer() {
    if (isRunning) {
        const lapTime = new Date((hours * 3600 + minutes * 60 + seconds) * 1000);
                const lapTimeString = lapTime.toISOString().substr(11, 8);
                
                const lapList = document.getElementById("lap-list");
                const lapItem = document.createElement("li");
                lapItem.className = "lap-item";
                lapItem.innerHTML = `${lapTimeString}
                <button class="share-lap">Share</button>
                <button class="delete-lap">Delete</button>`;
                lapList.appendChild(lapItem);
                const currentTime = Date.now();
                lapStartTime = currentTime;

                const lapUrl = getShareableUrl(lapTimeString);
                lapItem.className = "lap-item";
                lapItem.innerHTML = `${lapTimeString}
                <button class="share-lap">Share</button>
                <button class="delete-lap">Delete</button>`;
                lapList.appendChild(lapItem);

        // Share functionality
        const shareButton = lapItem.querySelector('.share-lap');
        shareButton.addEventListener('click', () => {
            openSharePopup(lapTimeString, lapUrl);
        });

        // Delete functionality
        const deleteButton = lapItem.querySelector('.delete-lap');
        deleteButton.addEventListener('click', () => {
            lapList.removeChild(lapItem);
        });
    }
}

function getShareableUrl(lapTimeString) {
    // Replace with your URL generation logic
    return `https://example.com/share?lap=${lapTimeString}`;
}

function openSharePopup(lapTimeString, lapUrl) {
    const popupWidth = 300;
    const popupHeight = 200;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;
    const popupWindow = window.open('', '_blank', `width=${popupWidth}, height=${popupHeight}, left=${left}, top=${top}`);

    // Content for the pop-up window
    const popupContent = `
        <h3>Lap Details</h3>
        <p>Lap Time: ${lapTimeString}</p>
        <p>Lap URL: ${lapUrl}</p>
        <button id="copy-lap-time">Copy Time</button>
    `;

    // Set the pop-up window content
    popupWindow.document.write(popupContent);

    // Copy functionality for the pop-up window
    popupWindow.document.getElementById("copy-lap-time").addEventListener('click', () => {
        copyLapTimeToClipboard(lapTimeString);
    });
}

function copyLapTimeToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Lap Time copied to clipboard: ' + text);
}

function clearLapTimes() {
    document.getElementById("lap-list").innerHTML = "";
}

function updateStopwatch() {
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
    }
    const timeString = `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
    document.querySelector(".stopwatch").textContent = timeString;
}

function padTime(time) {
    return time.toString().padStart(2, '0');
}

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("stop").addEventListener("click", stopTimer);
document.getElementById("reset").addEventListener("click", resetTimer);
document.getElementById("lap").addEventListener("click", lapTimer);
