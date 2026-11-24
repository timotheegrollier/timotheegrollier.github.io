import { useEffect, useRef } from 'react';

const lineCount = 26;
const colors = ['#42dcff', '#79a8ff', '#d4f5ff', '#ff805c'];

export function CodeArtwork() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d', { alpha: false });
        if (!canvas || !context) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let width = 0;
        let height = 0;
        let visible = false;
        let animationFrame = 0;
        let startedAt = 0;
        let lastDraw = 0;

        const paint = (time: number) => {
            const scale = Math.min(window.devicePixelRatio || 1, 1.5);
            context.setTransform(scale, 0, 0, scale, 0, 0);
            context.fillStyle = '#080a10';
            context.fillRect(0, 0, width, height);

            const unit = Math.min(width, height);
            const centerX = width * 0.52;
            const centerY = height * 0.5;
            const haze = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, unit * 0.72);
            haze.addColorStop(0, 'rgba(11, 67, 89, .38)');
            haze.addColorStop(0.48, 'rgba(15, 29, 48, .22)');
            haze.addColorStop(1, 'rgba(8, 10, 16, 0)');
            context.fillStyle = haze;
            context.fillRect(0, 0, width, height);

            const gridSize = Math.max(26, Math.round(unit / 15));
            context.beginPath();
            for (let x = 0; x < width; x += gridSize) {
                context.moveTo(x, 0);
                context.lineTo(x, height);
            }
            for (let y = 0; y < height; y += gridSize) {
                context.moveTo(0, y);
                context.lineTo(width, y);
            }
            context.strokeStyle = 'rgba(159, 197, 220, .055)';
            context.lineWidth = 0.7;
            context.stroke();

            const pointOnFlow = (index: number, progress: number) => {
                const seed = index * 0.33;
                const direction = index % 4 === 0 ? -1 : 1;
                const angle = seed + direction * progress * (3.3 + (index % 5) * 0.26) + time * (index % 3 === 0 ? -0.13 : 0.09);
                const radius = unit * (0.055 + progress * (0.19 + (index % 7) * 0.018));
                const ripple = Math.sin(progress * 13 + seed + time * 0.48) * unit * 0.014;
                return {
                    x: centerX + Math.cos(angle) * (radius + ripple) * (width > height ? 1.18 : 0.96),
                    y: centerY + Math.sin(angle) * (radius + ripple) * 1.1,
                };
            };

            for (let index = 0; index < lineCount; index += 1) {
                context.beginPath();
                for (let step = 0; step <= 76; step += 1) {
                    const point = pointOnFlow(index, step / 76);
                    if (step === 0) context.moveTo(point.x, point.y);
                    else context.lineTo(point.x, point.y);
                }
                const highlighted = index % 6 === 0;
                context.strokeStyle = colors[index % colors.length];
                context.globalAlpha = highlighted ? 0.55 : 0.12 + (index % 4) * 0.035;
                context.lineWidth = highlighted ? 1.15 : 0.7;
                context.shadowColor = colors[index % colors.length];
                context.shadowBlur = highlighted ? 9 : 0;
                context.stroke();
                context.shadowBlur = 0;
                context.globalAlpha = 1;

                if (index % 3 === 0) {
                    const progress = (time * (0.055 + (index % 4) * 0.009) + index * 0.173) % 1;
                    const point = pointOnFlow(index, progress);
                    context.beginPath();
                    context.arc(point.x, point.y, index % 6 === 0 ? 1.8 : 1.15, 0, Math.PI * 2);
                    context.fillStyle = colors[index % colors.length];
                    context.shadowColor = colors[index % colors.length];
                    context.shadowBlur = 9;
                    context.fill();
                    context.shadowBlur = 0;
                }
            }

            context.beginPath();
            context.arc(centerX, centerY, unit * 0.055, 0, Math.PI * 2);
            context.fillStyle = 'rgba(87, 219, 255, .08)';
            context.fill();
            context.beginPath();
            context.arc(centerX, centerY, 2, 0, Math.PI * 2);
            context.fillStyle = '#bdf5ff';
            context.shadowColor = '#42dcff';
            context.shadowBlur = 16;
            context.fill();
            context.shadowBlur = 0;

            if (visible && !document.hidden && !reduceMotion.matches) {
                animationFrame = window.requestAnimationFrame(render);
            }
        };

        const render = (timestamp: number) => {
            if (timestamp - lastDraw < 32) {
                animationFrame = window.requestAnimationFrame(render);
                return;
            }
            if (!startedAt) startedAt = timestamp;
            lastDraw = timestamp;
            paint((timestamp - startedAt) / 1000);
        };

        const resize = () => {
            const bounds = canvas.getBoundingClientRect();
            width = bounds.width;
            height = bounds.height;
            if (!width || !height) return;
            const scale = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            paint(reduceMotion.matches || !startedAt ? 0 : (performance.now() - startedAt) / 1000);
        };

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            window.cancelAnimationFrame(animationFrame);
            if (visible && !document.hidden && !reduceMotion.matches) {
                animationFrame = window.requestAnimationFrame(render);
            } else if (reduceMotion.matches) {
                paint(0);
            }
        }, { threshold: 0.05 });

        const onVisibilityChange = () => {
            window.cancelAnimationFrame(animationFrame);
            if (!document.hidden && visible && !reduceMotion.matches) {
                animationFrame = window.requestAnimationFrame(render);
            }
        };
        const onMotionChange = () => {
            window.cancelAnimationFrame(animationFrame);
            if (reduceMotion.matches) paint(0);
            else if (visible && !document.hidden) animationFrame = window.requestAnimationFrame(render);
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
        observer.observe(canvas);
        document.addEventListener('visibilitychange', onVisibilityChange);
        reduceMotion.addEventListener('change', onMotionChange);
        resize();

        return () => {
            window.cancelAnimationFrame(animationFrame);
            observer.disconnect();
            resizeObserver.disconnect();
            document.removeEventListener('visibilitychange', onVisibilityChange);
            reduceMotion.removeEventListener('change', onMotionChange);
        };
    }, []);

    return (
        <div
            className="home-page__artwork"
            role="img"
            aria-label="Œuvre numérique animée : un vortex de filaments lumineux cyan et ambre évoque des flux de code dans une grille sombre."
        >
            <canvas ref={canvasRef} className="home-page__artwork-canvas" aria-hidden="true" />
            <div className="home-page__artwork-grain" aria-hidden="true" />
            <div className="home-page__artwork-topline" aria-hidden="true">
                <span><i /> SIGNAL / 001</span>
                <span>FLUX EN COURS</span>
            </div>
            <div className="home-page__artwork-core" aria-hidden="true">
                <span>{'{ }'}</span>
                <small>NOISE → FORM</small>
            </div>
            <div className="home-page__artwork-sidecode" aria-hidden="true">01011010<br />0x7F&nbsp;·&nbsp;A3<br />λ&nbsp;/&nbsp;∞</div>
            <div className="home-page__artwork-caption" aria-hidden="true">
                <span>CREATIVE CODE // 001</span>
                <strong>Le chaos devient système.</strong>
            </div>
            <div className="home-page__artwork-coordinates" aria-hidden="true">
                <span>48°51' N</span><span>FRAME_001 · LIVE</span>
            </div>
        </div>
    );
}
