import { useEffect, useRef, useState } from "react";
import "./preview.css";
import ImageItem from "../../imageItem/imageItem";
import PropTypes from "prop-types";

export default function Preview({ imageFiles = [], base64Images = [] }) {
  const [pause, setPause] = useState(false);
  const scrollRef = useRef(null);

  const pauseRef = useRef(false);
  const animationFrameIdRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const elapsedRef = useRef(0);

  const hasMultipleImages = imageFiles.length > 1 || base64Images.length > 1;

  const animate = (timestamp) => {
    const el = scrollRef.current;
    if (!el || pauseRef.current || !hasMultipleImages) return;

    const delta = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;
    elapsedRef.current += delta;

    const duration = (el.scrollWidth - el.clientWidth) * 10;
    const progress = (elapsedRef.current % duration) / duration;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const easeInOut = 0.5 - 0.5 * Math.cos(progress * 2 * Math.PI);

    el.scrollLeft = easeInOut * maxScroll;

    animationFrameIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Só ativa animação se houver múltiplas imagens
    if (!hasMultipleImages) return;

    lastTimestampRef.current = performance.now();
    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameIdRef.current);
  }, [hasMultipleImages]);

  useEffect(() => {
    pauseRef.current = pause;

    if (!hasMultipleImages) return;

    if (pause) {
      cancelAnimationFrame(animationFrameIdRef.current);
    } else {
      lastTimestampRef.current = performance.now();
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }
  }, [pause, hasMultipleImages]);

  return (
    <div
      className="previewContainer flexCenter"
      ref={scrollRef}
      onPointerEnter={() => setPause(true)}
      onPointerLeave={() => {
        setPause(false);
      }}
    >
      {imageFiles.length > 0 ? (
        imageFiles.map(({ file, previewUrl }, index) => (
          <div key={index} className="previewItem">
            <img src={previewUrl} alt={`Preview ${file.name || `Imagem ${index}`}`} />
          </div>
        ))
      )
        : base64Images.length > 0 ? (
          base64Images.map((img, index) => {
            const fileExtension = img.filename.split(".").pop().toLowerCase();
            const mimeType = fileExtension === "webp" ? "image/webp" : "image/jpeg";
            const src = `data:${mimeType};base64,${img.buffer}`;

            return (
              <div key={index} className="previewItem transition02 previewBase64">
                <ImageItem
                  imageSrc={src}
                  fileName={img.filename}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            );
          })
        ) : (
          <p>Nenhuma imagem selecionada</p>
        )}
    </div>
  );
}

Preview.propTypes = {
  imageFiles: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.instanceOf(File).isRequired,
      previewUrl: PropTypes.string.isRequired,
    })
  ),

  base64Images: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      buffer: PropTypes.string.isRequired,
    })
  ),
};
