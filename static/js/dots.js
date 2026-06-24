(function () {
    const container = document.getElementById('dots-container');
    if (!container) return;

    const count = 300;
    const size = 10;
    const dots = [];

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('img');
        dot.src = '../static/img/bgdot.png';
        dot.className = 'bg_dot';

        const x = Math.random() * (window.innerWidth - size);
        const y = Math.random() * (window.innerHeight - size);
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        const speed = 0.3 + Math.random() * 1.2;

        dot.style.left = x + 'px';
        dot.style.top = y + 'px';

        container.appendChild(dot);
        dots.push({ el: dot, x: x, y: y, vx: vx, vy: vy, speed: speed });
    }

    function animate() {
        for (var i = 0; i < dots.length; i++) {
            var d = dots[i];
            d.x += d.vx * d.speed;
            d.y += d.vy * d.speed;

            if (d.x <= 0 || d.x >= window.innerWidth - size) {
                d.vx *= -1;
                d.x = Math.max(0, Math.min(d.x, window.innerWidth - size));
            }
            if (d.y <= 0 || d.y >= window.innerHeight - size) {
                d.vy *= -1;
                d.y = Math.max(0, Math.min(d.y, window.innerHeight - size));
            }

            d.el.style.left = d.x + 'px';
            d.el.style.top = d.y + 'px';
        }
        requestAnimationFrame(animate);
    }

    animate();
})();
