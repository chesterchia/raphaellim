const body = document.body,
    scrollWrap = document.getElementsByClassName("smooth-scroll-wrapper")[0], 
    height = scrollWrap.getBoundingClientRect().height - 1,
    speed = 0.05;

var offset = 0;

body.style.height = Math.floor(height) + "px";

function smoothScroll() {
    offset += (window.pageYOffset - offset) * speed;

    var scroll = "translateY(-" + offset + "px) translateZ(0)";
    scrollWrap.style.transform = scroll;

    callScroll = requestAnimationFrame(smoothScroll);
}

smoothScroll();

document.querySelectorAll(".nav-link").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        window.scrollTo(0, document.querySelector(this.getAttribute("href")).offsetTop - anchor.offsetHeight);
    })
})

const faders = document.querySelectorAll(".fade-in");
const appearOptions = {
    threshold: 0.4,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(
    function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("appear");
                appearOnScroll.unobserve(entry.target);
            }
        })
    }, 
    appearOptions
);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

const videos = [];
const tag = document.createElement("script");
const firstScriptTag = document.getElementsByTagName("script")[0];

tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// YouTube wants this function, don't rename it
function onYouTubeIframeAPIReady() {
    const slides = Array.from(document.querySelectorAll(".carousel-item"));
    slides.forEach((slide, index) => {
        // does this slide have a video?
        const video = slide.querySelector(".video-player");
        if (video && video.dataset) {
            const player = createPlayer({
                id: video.id,
                videoId: video.dataset.videoId,
            });
            videos.push({ player, index });
        }
    });
}

function createPlayer(playerInfo) {
    return new YT.Player(playerInfo.id, {
        videoId: playerInfo.videoId,
        playerVars: {
            showinfo: 0,
        },
    });
}

function theBigPause() {
    videos.map((video) => video.player.pauseVideo());
}

$(function () {
    $(".carousel").on("slide.bs.carousel", function (e) {
        theBigPause();
        const next = $(e.relatedTarget).index();
        const video = videos.filter((v) => v.index === next)[0];
        if (video) {
            video.player.playVideo();
        }
    });
});