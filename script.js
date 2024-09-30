const video = document.getElementById('video');
const playPauseButton = document.getElementById('play-pause');
const backwardButton = document.getElementById('backward');
const forwardButton = document.getElementById('forward');
const progressBar = document.querySelector('#progress-bar input');
const speedControl = document.getElementById('speed-control');
const qualityControl = document.getElementById('quality-control');
const videoItems = document.querySelectorAll('.video-item');
const canvas = document.getElementById('thumbnailCanvas');
const ctx = canvas.getContext('2d');

// Function to extract thumbnail at random moments
function createThumbnail(videoSrc) {
    const tempVideo = document.createElement('video');
    tempVideo.src = videoSrc;

    tempVideo.addEventListener('loadedmetadata', () => {
        const duration = Math.floor(tempVideo.duration); // Get total duration in seconds

        // Generate random times to capture thumbnails (every 10 seconds)
        const randomTimes = [];
        for (let i = 10; i < duration; i += 10) {
            randomTimes.push(i);
        }

        // Capture thumbnail for each random time
        randomTimes.forEach(time => {
            setTimeout(() => {
                tempVideo.currentTime = time; // Set to the random time
            }, time * 1000); // Delay based on the time in seconds
            
            // Capture the frame after the time is set
            tempVideo.addEventListener('seeked', () => {
                ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
                const thumbnailDataUrl = canvas.toDataURL();
                
                // Update the video item's thumbnail
                const videoItem = document.querySelector(`.video-item[data-video-src="${videoSrc}"]`);
                if (videoItem) {
                    videoItem.querySelector('img').src = thumbnailDataUrl; // Set the thumbnail image
                }
            }, { once: true }); // Only run once for each time
        });
    });

    tempVideo.load(); // Start loading the video to get its metadata
}

// Play/Pause functionality
playPauseButton.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        video.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Forward and Backward 10 seconds
forwardButton.addEventListener('click', () => {
    video.currentTime += 10;
});
backwardButton.addEventListener('click', () => {
    video.currentTime -= 10;
});

// Update progress bar as video plays
video.addEventListener('timeupdate', () => {
    progressBar.value = (video.currentTime / video.duration) * 100;
});

// Seek video when progress bar is changed
progressBar.addEventListener('input', () => {
    video.currentTime = (progressBar.value / 100) * video.duration;
});

// Speed control
speedControl.addEventListener('click', () => {
    const speeds = [1, 1.5, 2];
    let currentSpeedIndex = speeds.indexOf(video.playbackRate);
    currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
    video.playbackRate = speeds[currentSpeedIndex];
    speedControl.textContent = `${speeds[currentSpeedIndex]}x`;
});

// Quality control (dummy for demo purposes)
qualityControl.addEventListener('click', () => {
    const qualities = ['360p', '480p', '720p', '1080p'];
    let currentQualityIndex = qualities.indexOf(qualityControl.textContent);
    currentQualityIndex = (currentQualityIndex + 1) % qualities.length;
    qualityControl.textContent = qualities[currentQualityIndex];
    // Note: Actual quality switching would require multiple video sources.
});

// Play selected video from gallery in main player
videoItems.forEach(item => {
    item.addEventListener('click', () => {
        const newVideoSrc = item.getAttribute('data-video-src');
        const newTitle = item.getAttribute('data-title');
        
        video.src = newVideoSrc;
        video.load(); // Ensure the video is reloaded properly with the new source
        video.play(); // Auto-play the selected video
        
        document.querySelector('.movie-title').textContent = newTitle;
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    });

    // Load thumbnails for existing video items
    const videoSrc = item.getAttribute('data-video-src');
    createThumbnail(videoSrc); // Capture random thumbnails from the video
});
