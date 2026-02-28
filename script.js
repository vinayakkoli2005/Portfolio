document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that should fade in
    const faders = document.querySelectorAll('.fade-in');

    // Options for the Intersection Observer
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    // Create the Intersection Observer
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Add the 'appear' class to trigger the animation
                entry.target.classList.add('appear');
                // Stop observing once the animation has been triggered
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    // Apply the observer to all fader elements
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});
