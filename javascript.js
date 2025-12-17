document.addEventListener("DOMContentLoaded", function () {

    const audio = document.getElementById("audio");
    const playBtn = document.getElementById("pause-play");
    const songList = document.getElementById("song-list");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.querySelector(".search-button");
    const progressBar = document.getElementById("progress-bar");
    const currentTimeSpan = document.getElementById("current-time");
    const durationSpan = document.getElementById("duration");

    let currentSongIndex = -1;

    SONGS.forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = song.name;
        li.dataset.src = `songs/${song.file}`;
        li.addEventListener("click", () => {
            currentSongIndex = index;
            playSong();
        });
        songList.appendChild(li);
    });

    const songs = songList.getElementsByTagName("li");

    playBtn.addEventListener("click", () => {
        if (currentSongIndex === -1 && songs.length > 0) {
            currentSongIndex = 0;
            playSong();
            return;
        }

        if (audio.paused) {
            audio.play();
            playBtn.textContent = "pause";
        } else {
            audio.pause();
            playBtn.textContent = "play";
        }
    });

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        for (let i = 0; i < songs.length; i++) {
            const name = songs[i].textContent.toLowerCase();
            songs[i].style.display = name.includes(query) ? "list-item" : "none";
        }
    });

    audio.addEventListener("ended", () => {
        if (songs.length === 0) return;
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong();
    });

    audio.addEventListener("timeupdate", () => {
        if (!isNaN(audio.duration)) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
            currentTimeSpan.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener("loadedmetadata", () => {
        durationSpan.textContent = formatTime(audio.duration);
        progressBar.value = 0;
    });

    progressBar.addEventListener("input", () => {
        if (!isNaN(audio.duration)) {
            audio.currentTime = (progressBar.value / 100) * audio.duration;
        }
    });

    function playSong() {
        audio.src = songs[currentSongIndex].dataset.src;
        audio.play();
        playBtn.textContent = "pause";
        highlight();
    }

    function highlight() {
        for (let i = 0; i < songs.length; i++) {
            songs[i].classList.remove("active");
        }
        songs[currentSongIndex].classList.add("active");
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    }
});
