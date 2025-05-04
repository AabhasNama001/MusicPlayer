class Song {
  constructor(title, filePath) {
    this.title = title;
    this.filePath = filePath;
    this.audio = new Audio(filePath);
    this.isPaused = false;
  }

  play() {
    this.audio.play();
    this.isPaused = false;
  }

  pause() {
    if (!this.audio.paused) {
      this.audio.pause();
      this.isPaused = true;
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPaused = false;
  }

  getTitle() {
    return this.title;
  }
}

class Playlist {
  constructor(songs) {
    this.songs = songs;
    this.currentIndex = 0;
  }

  getCurrentSong() {
    return this.songs[this.currentIndex];
  }

  next() {
    this.getCurrentSong().stop();
    this.currentIndex = (this.currentIndex + 1) % this.songs.length;
  }

  prev() {
    this.getCurrentSong().stop();
    this.currentIndex =
      (this.currentIndex - 1 + this.songs.length) % this.songs.length;
  }
}

// 🎵 Initialize playlist with multiple songs
const playlist = new Playlist([
  new Song("Bulleya", "./songs/Song (1).mp3"),
  new Song("Husn", "./songs/Song (2).mp3"),
  new Song("Jo Tum Mere Ho", "./songs/Song (3).mp3"),
]);

const titleElement = document.getElementById("song-title");

function updateTitle() {
  titleElement.textContent = playlist.getCurrentSong().getTitle();
}

function changeSongImage() {
  const songImage = document.getElementById("song-image");
  const currentSong = playlist.getCurrentSong().getTitle();
  songImage.src = `./images/${currentSong}.png`;
}

// function stopAllSongs() {
//   playlist.songs.forEach((song) => song.stop());
// }

// Button Events
document.getElementById("play-btn").addEventListener("click", () => {
  playlist.getCurrentSong().play();
  handleSongChange();
});

document.getElementById("pause-btn").addEventListener("click", () => {
  playlist.getCurrentSong().pause();
});

document.getElementById("stop-btn").addEventListener("click", () => {
  playlist.getCurrentSong().stop();
});

document.getElementById("next-btn").addEventListener("click", () => {
  playlist.next();
  playlist.getCurrentSong().play();
  handleSongChange();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  playlist.prev();
  playlist.getCurrentSong().play();
  handleSongChange();
});

// Initial title
updateTitle();

const progressSlider = document.getElementById("progress-slider");

// Handle slider input (seek)
progressSlider.addEventListener("input", () => {
  const currentSong = playlist.getCurrentSong();
  currentSong.audio.currentTime = progressSlider.value;
});

// Update slider as song plays
function bindSliderToAudio(audio) {
  audio.addEventListener("timeupdate", () => {
    progressSlider.value = audio.currentTime;
  });

  audio.addEventListener("loadedmetadata", () => {
    progressSlider.max = audio.duration;
    progressSlider.value = 0;
  });

  audio.addEventListener("ended", () => {
    playlist.next();
    playlist.getCurrentSong().play();
    handleSongChange(); // sync UI & slider
  });
}

// Initial binding
bindSliderToAudio(playlist.getCurrentSong().audio);

// Call this after .play() when switching songs
function handleSongChange() {
  const currentSong = playlist.getCurrentSong();
  updateTitle();
  changeSongImage();

  bindSliderToAudio(currentSong.audio);
}
