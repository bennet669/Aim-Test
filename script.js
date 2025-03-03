document.addEventListener("DOMContentLoaded", function () {
    console.log("Скрипт загружен!");
    const startButton = document.getElementById("startGame");
    const gameArea = document.getElementById("gameArea");
    const resultText = document.getElementById("result");
    const circleColorInput = document.getElementById("circleColor");
    const glowColorInput = document.getElementById("glowColor");

    let startTime;
    let circle;
    let gameActive = false;
    let clickCount = 0;
    const maxClicks = 10;

    // Загружаем звук кликов
    let clickSound = new Audio("click.mp3");

    // Загружаем фоновую музыку
    let bgMusic = new Audio("music.mp3");
    bgMusic.loop = true; 
    bgMusic.volume = 0.5; // Обычная громкость (50%)

    // Включаем музыку при первом клике
    document.body.addEventListener("click", function startMusic() {
        bgMusic.play().catch(error => console.log("Ошибка запуска музыки:", error));
        document.body.removeEventListener("click", startMusic);
    });

    // Изменение цветов
    circleColorInput.addEventListener("input", () => {
        document.documentElement.style.setProperty("--circle-color", circleColorInput.value);
    });

    glowColorInput.addEventListener("input", () => {
        document.documentElement.style.setProperty("--glow-color", glowColorInput.value);
        gameArea.style.boxShadow = `0px 0px 20px ${glowColorInput.value}`;
    });

    startButton.addEventListener("click", startGame);

    function startGame() {
        console.log("Игра запущена!");
        gameArea.innerHTML = "";
        resultText.textContent = "";
        gameActive = true;
        clickCount = 0;

        // Уменьшаем громкость музыки до 5%
        bgMusic.volume = 0.05;

        spawnCircle();
    }

    function spawnCircle() {
        if (!gameActive) return;

        if (circle) circle.remove();

        circle = document.createElement("div");
        circle.classList.add("circle");

        let x = Math.random() * (gameArea.clientWidth - 60);
        let y = Math.random() * (gameArea.clientHeight - 60);

        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;

        gameArea.appendChild(circle);
        startTime = performance.now();

        circle.addEventListener("click", () => {
            let reactionTime = (performance.now() - startTime).toFixed(2);
            resultText.textContent = `Your reaction time: ${reactionTime} ms`;

            // Увеличиваем скорость звука
            let newRate = 1 + (clickCount * 0.1);
            clickSound.playbackRate = newRate;

            clickSound.currentTime = 0;
            clickSound.play();

            clickCount++;

            if (clickCount >= maxClicks) {
                clickCount = 0;
                clickSound.playbackRate = 1;
            }

            spawnCircle();
        });
    }
});
