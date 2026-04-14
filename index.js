let score = 0;
let round = 0;
let correctName = "";
let gameOver = false;

// Load Pokémon
async function loadPokemon() {
    if (gameOver) return;

    document.getElementById("result").textContent = "";

    const randomId = Math.floor(Math.random() * 1000) + 1;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();

    correctName = data.name;

    document.getElementById("pokemonImage").src = data.sprites.front_default;

    generateOptions(correctName);
}

// Generate options
async function generateOptions(correct) {
    let options = [correct];

    while (options.length < 4) {
        const randomId = Math.floor(Math.random() * 1000) + 1;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();

        let name = data.name;

        if (!options.includes(name)) {
            options.push(name);
        }
    }

    options.sort(() => Math.random() - 0.5);

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;

        btn.onclick = () => checkAnswer(option);

        optionsDiv.appendChild(btn);
    });
}

// Check Answer
function checkAnswer(selected) {
    if (gameOver) return;

    if (selected === correctName) {
        score++;
        document.getElementById("result").textContent = "✅ Correct!";
    } else {
        document.getElementById("result").textContent = "❌ Wrong! It was " + correctName;
    }

    round++;
    document.getElementById("score").textContent = `Score: ${score} / ${round}`;

    // END GAME
    if (round === 10) {
        endGame();
    } else {
        setTimeout(loadPokemon, 800);
    }
}

// End Game Function
function endGame() {
    gameOver = true;

    let message = "";

    if (score >= 5) {
        message = "🎉 Your Pokémon knowledge is good!";
    } else {
        message = "🙂 Your knowledge is average, keep learning!";
    }

    document.getElementById("result").innerHTML = `
        <br><strong>Game Over!</strong><br>
        ${message}<br><br>
        <button onclick="restartGame()">Play Again</button>
    `;

    document.getElementById("options").innerHTML = "";
}

// Restart Game
function restartGame() {
    score = 0;
    round = 0;
    gameOver = false;

    document.getElementById("score").textContent = "Score: 0";
    document.getElementById("result").textContent = "";

    loadPokemon();
}

// Start game
loadPokemon();