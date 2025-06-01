// --------------------------------------Modal logic----------------------------------------------//
var howToPlayModal = document.getElementById("how-to-play-modal");
var howToPlayButton = document.getElementById("header-how-to");
var howToPlayCloseButton = document.getElementById("close-button");
howToPlayButton.onclick = function() {
  howToPlayModal.style.display = "block";
}

howToPlayCloseButton.onclick = function() {
  howToPlayModal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == howToPlayModal) {
      howToPlayModal.style.display = "none";
    }
}

//debugger;
var navModal = document.getElementById("nav-content");
var navIcon = document.getElementById("header-menu");
var navCloseButton = document.getElementById("nav-close-button");
var helpButton = document.getElementById("help-button");

navIcon.onclick = function() {
    navModal.style.display = "block";
}

navCloseButton.onclick = function() {
    navModal.style.display = "none";
}

helpButton.onclick = function() {
    navModal.style.display = "none";
    howToPlayModal.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == navModal) {
        navModal.style.display = "none";
    }
}

// -------------------------------------------Latest Puzzle Link Logic-------------------------------------------------//
var latestPuzzleLink = document.getElementById("latest-puzzle-link");

latestPuzzleLink.onclick = function(event) {
//debugger;
window.location.href='index.htm?puzzleNumber='+(json.data.length-1);

/*    event.preventDefault();
    fetch('data')
        .then(response => response.json())
        .then(data => {
            const latestPuzzleNumber = data.totalCurrentPuzzles;
            return fetch(`/set-puzzle-number?puzzleNumber=${latestPuzzleNumber}`, {
                method: 'POST'
            });
        })
        .then(() => {
            window.location.href = '/puzzle';
        })
        .catch(error => console.error('Error setting latest puzzle number:', error));
*/
}
