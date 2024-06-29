function loadFallbackImage() {
    const images = document.querySelectorAll('.imageElement');
    images.forEach(imageElement => {
        imageElement.onerror = null;
        if (!imageElement.src || imageElement.src === 'null') {
            imageElement.src = 'https://plus.unsplash.com/premium_photo-1710961232986-36cead00da3c?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadFallbackImage();
});
