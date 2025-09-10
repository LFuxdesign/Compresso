import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./beforeAfter.css";
import { Link } from "react-router-dom";

export default function BeforeAfterSlider({ beforeSrc, afterSrc, imagesSizesData, attributionData }) {
    const [useAnimation, setUseAnimation] = useState(true);
    const [dividerPosition, setDividerPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const containerRef = useRef(null);
    const dividerIntervalId = useRef(null);
    const initialTimeouts = useRef([]);

    // Animation on mount
    useEffect(() => {
        const animationSteps = [75, 25, 50];
        const stepInterval = 500;

        animationSteps.forEach((value, index) => {
            const id = setTimeout(() => {
                setDividerPosition(value);
            }, stepInterval * index);
            initialTimeouts.current.push(id);
        });

        // After all steps, start looping animation
        const totalDuration = stepInterval * animationSteps.length;
        const endTimeout = setTimeout(() => {
            startDividerAnimation();
        }, totalDuration);
        initialTimeouts.current.push(endTimeout);

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            initialTimeouts.current.forEach(clearTimeout);
        };
    }, []);

    function startDividerAnimation() {
        setIsAnimating(true);
        const animationSteps = [95, 5];
        let index = 0;


        dividerIntervalId.current = setInterval(() => {
            setDividerPosition(animationSteps[index]);
            index = (index + 1) % animationSteps.length;
        }, 5500);
    }

    function stopDividerAnimation() {
        setIsAnimating(false);
        if (dividerIntervalId.current) {
            clearInterval(dividerIntervalId.current);
            dividerIntervalId.current = null;
        }
    }

    const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    const updateDividerPosition = (clientX) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        let newPosition = ((clientX - rect.left) / rect.width) * 100;
        newPosition = Math.max(0, Math.min(100, newPosition));
        setDividerPosition(newPosition);
    };

    const handleStartDrag = (e) => {
        
        stopDividerAnimation();
        setUseAnimation(true);
        updateDividerPosition(getClientX(e));
        setIsDragging(true);
    };

    const handleMove = (e) => {
        if (!isDragging) return;
        setUseAnimation(false);
        updateDividerPosition(getClientX(e));
    };

    const stopDrag = () => setIsDragging(false);

    useEffect(() => {
        window.addEventListener("mouseup", stopDrag);
        window.addEventListener("touchend", stopDrag);
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchmove", handleMove);

        return () => {
            window.removeEventListener("mouseup", stopDrag);
            window.removeEventListener("touchend", stopDrag);
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchmove", handleMove);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging]);

    return (
        <div className="slider-frame">
            <div
                className="slider-container"
                ref={containerRef}
                onPointerDown={handleStartDrag}
                onTouchStart={handleStartDrag}
            >
                {attributionData && (
                    <Link className="attribution transition02" to={attributionData.link}>
                        <span>{attributionData.text}</span>
                    </Link>
                )}

                <div
                    className="image before"
                    style={{ clipPath: `inset(0 ${dividerPosition}%) 0 0` }}
                >
                    <img src={beforeSrc} alt="Before" />
                    <div className="overlay left bottom">
                        <span className="text">{imagesSizesData.beforeSize.toLocaleString('pt-BR')}mb</span>
                    </div>
                </div>

                <div
                    className={`image after ${useAnimation ? "animate" : ""} ${isAnimating ? "longerAnimate" : ""}`}
                    style={{ clipPath: `inset(0 0 0 ${dividerPosition}%)` }}
                >
                    <img src={afterSrc} alt="After" />
                    <div className="overlay right bottom">
                        <span className="text highlight">{imagesSizesData.afterSize.toLocaleString('pt-BR')}kb</span>
                    </div>
                    <div className="overlay right top">
                        <span className="text highlight">Compresso</span>
                    </div>
                </div>

                <div
                    className={`divider ${useAnimation ? "animate" : ""} ${isAnimating ? "longerAnimate" : ""}`}
                    style={{ left: `${dividerPosition}%` }}
                />
            </div>
        </div>
    );
}

BeforeAfterSlider.propTypes = {
    beforeSrc: PropTypes.string.isRequired,
    afterSrc: PropTypes.string.isRequired,
    imagesSizesData: PropTypes.shape({
        beforeSize: PropTypes.string,
        afterSize: PropTypes.string,
    }),
    attributionData: PropTypes.shape({
        text: PropTypes.string,
        link: PropTypes.string,
    }),
};
