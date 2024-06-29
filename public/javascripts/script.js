function scrollUpperLeft() {
    const container = document.querySelector('#upperScrollDiv');
    container.scrollBy({
        left: -200,
        behavior: 'smooth'
    });
}
function scrollLowerLeft() {
    const container = document.querySelector('#lowerScrollDiv');
    container.scrollBy({
        left: -200,
        behavior: 'smooth'
    });
}

function scrollUpperRight() {
    const container = document.querySelector('#upperScrollDiv');
    container.scrollBy({
        left: 200,
        behavior: 'smooth'
    });
}
function scrollLowerRight() {
    const container = document.querySelector('#lowerScrollDiv');
    container.scrollBy({
        left: 200,
        behavior: 'smooth'
    });
}

const upperLeft = document.querySelector("#upperLeft");
upperLeft.addEventListener("click", () => {
    scrollUpperLeft();
});

const lowerLeft = document.querySelector("#lowerLeft");
lowerLeft.addEventListener("click", () => {
    scrollLowerLeft();
});

const upperRight = document.querySelector("#upperRight");
upperRight.addEventListener("click", () => {
    scrollUpperRight();
});

const lowerRight = document.querySelector("#lowerRight");
lowerRight.addEventListener("click", () => {
    scrollLowerRight();
});
