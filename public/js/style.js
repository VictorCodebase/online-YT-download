alert
const overlay = document.getElementById('overlay');
const buttons = document.querySelectorAll('.button');
const circle = document.querySelector('.circle');
const dataReceiver1 = document.getElementById("box1")
const dataReceiver2 = document.getElementById("box2")
const ytSubText = document.getElementById('YT-sub-text')
const spotifySubText = document.getElementById('spotify-sub-text')



let isHovering = false;
let isCircleVisible = true;

function updateBackgroundColor(color) {
    anime({
        targets: overlay,
        backgroundColor: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.9)'],
        duration: 300,
        easing: 'linear'
    })


    setTimeout(() => {
        if (color == '#00ff00') {

            anime({
                targets: overlay,
                backgroundColor: ['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0)'],
                duration: 300,
                easing: 'linear'
            })
            dataReceiver1.style.display = 'none'
            dataReceiver2.style.display = 'flex'
            ytSubText.style.display = 'none'
            spotifySubText.style.display = 'block'
            circle.style.backgroundImage = 'radial-gradient(circle closest-side at center,  rgba(2, 160, 2, 0.18), transparent 100%)'
            document.body.style.background = 'linear-gradient(to left, rgba(0, 0, 0, 0.9),  rgba(2, 160, 2)';
        } else {
            anime({
                targets: overlay,
                backgroundColor: ['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0)'],
                duration: 300,
                easing: 'linear'
            })
            dataReceiver1.style.display = 'flex'
            dataReceiver2.style.display = 'none'
            ytSubText.style.display = 'block'
            spotifySubText.style.display = 'none'
            document.body.style.background = 'linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(139, 0, 0, 0.9))';
            circle.style.backgroundImage = 'radial-gradient(circle closest-side at center, rgba(139, 0, 0, 0.5), transparent 100%)'
        }
    }, 700)




}

// Button click event to change the background color to deep lime
buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        if (button.classList.contains('green')) {
            updateBackgroundColor('#00ff00');

        } else {
            updateBackgroundColor('rgba(139, 0, 0, 0.9)');

        }
    });

});

window.addEventListener('mouseleave', function () {
    isCircleVisible = false;
    circle.style.display = 'none';
});

window.addEventListener('mouseenter', function () {
    isCircleVisible = true;
    circle.style.display = 'block';
});






document.addEventListener('mousemove', function (event) {
    const mouseX = event.clientX;
    const windowWidth = window.innerWidth;
    const lightness = (mouseX / windowWidth) * 100;


    if (isCircleVisible) {
        const circleX = event.clientX;
        const circleY = event.clientY;
        circle.style.top = `${circleY}px`;
        circle.style.left = `${circleX}px`;
    }
});

// Mouseleave event on window
window.addEventListener('mouseleave', function () {
    isCircleVisible = false;
    circle.style.display = 'none';
});

// Mouseenter event on window
window.addEventListener('mouseenter', function () {
    isCircleVisible = true;
    circle.style.display = 'block';
});