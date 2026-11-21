(function () {
    const container = document.getElementById('dots-container');
    if (!container) return;

    const SIZE = 5;
    const MIN_DOTS = 50;      // 数量下限，太少画面太空
    const MAX_DOTS = 500;     // 数量上限，太多会卡
    const AREA_PER_DOT = 4500; // 每颗圆点负责的面积(px²)，窗口越大点越多

    // 速度：以 1440px 宽为基准，随机区间 0.3~1.5；窗口越宽整体越快，越窄越慢，
    // 让圆点穿越屏幕的视觉节奏在不同尺寸下保持一致。
    const BASE_W = 1440;
    const SPEED_MIN = 0.3;
    const SPEED_MAX = 1.5;
    const SCALE_MIN = 0.4;    // 缩放下限，避免小窗口几乎不动
    const SCALE_MAX = 2.2;    // 缩放上限，避免超大窗口飞太快

    const rand = (min, max) => Math.random() * (max - min) + min;

    const dots = [];
    let viewW = innerWidth;
    let viewH = innerHeight;

    const rangeW = () => Math.max(viewW - SIZE, 0);
    const rangeH = () => Math.max(viewH - SIZE, 0);

    // 当前窗口宽度对应的速度缩放系数
    const speedScale = (w) => Math.min(SCALE_MAX, Math.max(SCALE_MIN, w / BASE_W));

    // 在当前速度区间内随机一个速度
    function randSpeed() {
        const s = speedScale(viewW);
        return rand(SPEED_MIN * s, SPEED_MAX * s);
    }

    // 按当前窗口面积算出应有的圆点数量
    function targetCount() {
        const n = Math.round(viewW * viewH / AREA_PER_DOT);
        return Math.min(MAX_DOTS, Math.max(MIN_DOTS, n));
    }

    // 造一颗圆点（元素 + 运动状态），返回元素，由调用方决定何时插入 DOM
    function makeDot() {
        const el = document.createElement('div');
        el.className = 'bg_dot';
        const d = {
            el,
            x: rand(0, rangeW()),
            y: rand(0, rangeH()),
            vx: rand(-1, 1),
            vy: rand(-1, 1),
            speed: randSpeed()
        };
        el.style.transform = `translate3d(${d.x}px,${d.y}px,0)`;
        dots.push(d);
        return el;
    }

    // 批量把数量调整到目标值：多了删末尾的，少了用片段一次性补上
    function syncCount() {
        const target = targetCount();
        if (target > dots.length) {
            const frag = document.createDocumentFragment();
            for (let i = dots.length; i < target; i++) frag.appendChild(makeDot());
            container.appendChild(frag);
        } else if (target < dots.length) {
            for (let i = dots.length; i > target; i--) dots.pop().el.remove();
        }
    }

    syncCount();

    // 窗口变化：位置与速度按新窗口比例缩放（纯计算，不写 DOM，transform 交给
    // animate 每帧统一写，避免 resize 抢占动画帧）；数量调整加防抖，拖动停止后再批量增删。
    let syncTimer = 0;
    addEventListener('resize', () => {
        const newW = innerWidth, newH = innerHeight;
        const oldRW = rangeW(), oldRH = rangeH();
        const newRW = Math.max(newW - SIZE, 0), newRH = Math.max(newH - SIZE, 0);
        const speedK = speedScale(newW) / speedScale(viewW);

        if (oldRW > 0 && oldRH > 0) {
            for (const d of dots) {
                d.x = (d.x / oldRW) * newRW;
                d.y = (d.y / oldRH) * newRH;
                d.speed *= speedK;
            }
        }

        viewW = newW;
        viewH = newH;

        clearTimeout(syncTimer);
        syncTimer = setTimeout(syncCount, 120);
    });

    (function animate() {
        const w = rangeW(), h = rangeH();

        for (const d of dots) {
            d.x += d.vx * d.speed;
            d.y += d.vy * d.speed;

            if (d.x <= 0 || d.x >= w) {
                d.vx = -d.vx;
                d.x = Math.min(Math.max(d.x, 0), w);
            }
            if (d.y <= 0 || d.y >= h) {
                d.vy = -d.vy;
                d.y = Math.min(Math.max(d.y, 0), h);
            }

            d.el.style.transform = `translate3d(${d.x}px,${d.y}px,0)`;
        }
        requestAnimationFrame(animate);
    })();
})();
