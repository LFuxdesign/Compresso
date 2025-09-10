import PropTypes from "prop-types";
import "./imageItem.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ImageItem({ imageSrc, fileName = "image", style, className }) {
    const navigate = useNavigate();
    const isBase64 = imageSrc && imageSrc.startsWith("data:");
    const [size, setSize] = useState(null); // em bytes

    useEffect(() => {
        const calculateSize = async () => {
            if (isBase64) {
                const sizeInBytes = getBase64Size(imageSrc);
                setSize(sizeInBytes);
            } else {
                try {
                    const response = await fetch(imageSrc, { method: "HEAD" });
                    const contentLength = response.headers.get("Content-Length");
                    if (contentLength) {
                        setSize(parseInt(contentLength));
                    } else {
                        // fallback: baixa o blob
                        const blobRes = await fetch(imageSrc);
                        const blob = await blobRes.blob();
                        setSize(blob.size);
                    }
                } catch (err) {
                    console.warn("Erro ao buscar imagem:", err);
                }
            }
        };

        calculateSize();
    }, [imageSrc]);

    const openImageInNewTab = () => {
        if (isBase64) {
            const byteString = atob(imageSrc.split(",")[1]);
            const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");
        } else {
            window.open(imageSrc, "_blank");
        }
    };

    const formatSize = (bytes) => {
        if (bytes === null) return "Calculando...";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    function deleteImage(filename) {
        window.api.deleteImage(filename)
            .then(response => {
                if (response.error) {
                    console.error("Erro ao deletar imagem:", response.error);
                } else {
                    console.log("Imagem deletada com sucesso:", response.message);
                    navigate("/refresh"); // se quiser manter isso
                }
            })
            .catch(error => {
                console.error("Erro ao enviar requisição de deleção:", error);
            });
    }

    return (
        <div className={`imageItemContainer ${className}`} style={{ ...style }}>
            <a
                href={imageSrc}
                download={"compresso_single_" + fileName}
                target={isBase64 ? undefined : "_blank"}
                rel={isBase64 ? undefined : "noopener noreferrer"}
            >
                <div className="downloadBtn transition flexCenter" title="Download">
                    <svg
                        width="16"
                        height="18"
                        viewBox="0 0 13 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.6758 6.14251C11.9838 5.8255 11.7592 5.29412 11.3172 5.29412H9.57143C9.29529 5.29412 9.07143 5.07026 9.07143 4.79412V0.5C9.07143 0.223858 8.84757 0 8.57143 0H4.42857C4.15243 0 3.92857 0.223858 3.92857 0.5V4.79412C3.92857 5.07026 3.70471 5.29412 3.42857 5.29412H1.68279C1.24083 5.29412 1.0162 5.8255 1.32415 6.14251L6.14136 11.1014C6.33773 11.3035 6.66227 11.3035 6.85864 11.1014L11.6758 6.14251ZM1 13.2353C0.723858 13.2353 0.5 13.4592 0.5 13.7353V14.5C0.5 14.7761 0.723858 15 1 15H12C12.2761 15 12.5 14.7761 12.5 14.5V13.7353C12.5 13.4592 12.2761 13.2353 12 13.2353H1Z"
                            fill="url(#paint0_linear_15_794)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_15_794"
                                x1="0.5"
                                y1="7.5"
                                x2="12.5"
                                y2="7.5"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#591C93" />
                                <stop offset="0.495192" stopColor="#943A78" />
                                <stop offset="1" stopColor="#E36235" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

            </a>
            <div className="downloadBtn transition flexCenter" onClick={() => deleteImage(fileName)} title="Apagar imagem" style={{ left: "10px" }}>
                <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.42599 13.9163C1.42599 14.8592 2.19742 15.6306 3.14028 15.6306H9.99742C10.9403 15.6306 11.7117 14.8592 11.7117 13.9163V3.6306H1.42599V13.9163ZM3.14028 5.34488H9.99742V13.9163H3.14028V5.34488ZM9.56885 1.05917L8.7117 0.202026H4.42599L3.56885 1.05917H0.568848V2.77345H12.5688V1.05917H9.56885Z" fill="url(#paint0_linear_205_36)" />
                    <defs>
                        <linearGradient id="paint0_linear_205_36" x1="0.568848" y1="7.91631" x2="12.5688" y2="7.91631" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#591C93" />
                            <stop offset="0.495192" stopColor="#943A78" />
                            <stop offset="1" stopColor="#E36235" />
                        </linearGradient>
                    </defs>
                </svg>

            </div>
            <img
                onClick={openImageInNewTab}
                src={imageSrc}
                alt={fileName}
                style={{ cursor: "pointer" }}
            />

            <div className="overlay">
                <span className="text">{formatSize(size)}</span>
            </div>
        </div>
    );
}

// Base64 size estimation
function getBase64Size(base64String) {
    let padding = 0;
    if (base64String.endsWith("==")) padding = 2;
    else if (base64String.endsWith("=")) padding = 1;

    const base64Length = base64String.length - (base64String.indexOf(",") + 1);
    return (base64Length * 3) / 4 - padding;
}

ImageItem.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    fileName: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
};
