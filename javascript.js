document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");
    const playBtn = document.getElementById("pause-play");
    const songList = document.getElementById("song-list");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.querySelector(".search-button");
    const progressBar = document.getElementById("progress-bar"); // Corrected variable name
    const currentTimeSpan = document.getElementById("current-time");
    const durationSpan = document.getElementById("duration");

    // Toggle Play/Pause
    playBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = "pause";
        } else {
            audio.pause();
            playBtn.textContent = "play";
        }
    });

    // Local Song Search
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        const songs = songList.getElementsByTagName("li"); 
        
        for (let i = 0; i < songs.length; i++) {
            const songName = songs[i].textContent.toLowerCase();
            songs[i].style.display = songName.includes(query) ? "list-item" : "none";
        }
    });

    // Change song on list item click
    songList.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", () => {
            const newSrc = item.getAttribute("data-src");
            audio.src = newSrc;
            audio.play();
            playBtn.textContent = "pause";
        });
    });
    
    // Update progress bar as song plays
    audio.addEventListener("timeupdate", () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress || 0;
        
        // Update time displays
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    });



    // Set duration when the audio metadata is loaded
    audio.addEventListener("loadedmetadata", () => {
        durationSpan.textContent = formatTime(audio.duration);
        progressBar.value = 0;
        audio.currentTime = 0;
    });

    // Helper function to format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
});