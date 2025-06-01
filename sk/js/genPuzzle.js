async function fetchTotalCurrentPuzzles() {
    try {
        return json.totalCurrentPuzzles;
    } catch (error) {
        console.error("Error fetching totalCurrentPuzzles:", error);
        return 0;
    }
}

// Function to generate links to other puzzles
async function generatePuzzleLinks() {
    const totalCurrentPuzzles = await fetchTotalCurrentPuzzles();
    var navList = document.getElementById("puzzle-list");
    for (var i = 1; i <= totalCurrentPuzzles; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.classList.add("puzzle__link");
        a.href = "index.htm?puzzleNumber="+i; // Prevent default link behavior
        a.textContent = " Shabd Puzzle #" + i;
        /*
a.addEventListener('click', (function(puzzleNumber) {
            return function(event) {
                event.preventDefault();
                fetch(`/set-puzzle-number?puzzleNumber=${puzzleNumber}`, {
                    method: 'POST'
                }).then(() => {
                    window.location.href = '/puzzle';
                }).catch(error => console.error('Error setting puzzle number:', error));
            };
        })(i));
*/
        li.appendChild(a);
        navList.appendChild(li);
    }
}

// Ensure this function is called after totalCurrentPuzzles is set
document.addEventListener("DOMContentLoaded", function() {
    generatePuzzleLinks();
});