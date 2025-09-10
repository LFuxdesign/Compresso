import { useRef, useState, useEffect } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from "react-router-dom";
import Button from "../buttons/buttons";
import Preview from "./preview/preview";
import arrow from "../../assets/svg/arrow.svg";
import "./compressInput.css";
import { downloadAllImages } from "../../scripts/downloadImages";

export default function CompressInputUI() {
    const MAX_FILES = 20;
    const navigate = useNavigate();

    const refText = useRef(null);
    const refImageContainer = useRef(null);
    const refInput = useRef(null);
    const refPps = useRef(60);
    const timeoutTextRef = useRef(null);
    const timeoutDisclaimerRef = useRef(null);
    const refCompressionQuality = useRef(50);
    const refCompressionText = useRef(null);
    const refCompressionLabel = useRef(null);


    const defaultText = "Arraste e solte suas imagens aqui ou clique para selecionar";

    const [step, setStep] = useState(1);
    const [text, setText] = useState(defaultText);
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [compressedResult, setCompressedResult] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [outputFormat, setOutputFormat] = useState("jpg");
    const [processing, setProcessing] = useState(false);


    useEffect(() => {
        let animationFrameId;
        let lastTime = performance.now();
        let currentOffset = 0;

        const animate = (time) => {
            const deltaTime = (time - lastTime) / 1000;
            lastTime = time;
            currentOffset += refPps.current * deltaTime;

            const svg = `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23591C93' /%3E%3Cstop offset='50%25' stop-color='%23943A78' /%3E%3Cstop offset='100%25' stop-color='%23E36235' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='none' stroke='url(%23grad)' stroke-width='5' rx='20' ry='20' stroke-dasharray='${imageFiles.length === 0 ? "75 65" : "0"}' stroke-dashoffset='${imageFiles.length === 0 ? currentOffset : 0}' stroke-linecap='square'/%3E%3C/svg%3E")`;
            if (refImageContainer.current) {
                refImageContainer.current.style.backgroundImage = svg;
            }

            if (imageFiles.length === 0) {
                animationFrameId = requestAnimationFrame(animate);
                refImageContainer.current?.classList.remove("hasImages");
            } else {
                refImageContainer.current?.classList.add("hasImages");
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [imageFiles.length]);

    useEffect(() => {
        refPps.current = isDraggingFile ? 240 : 60;

    }, [isDraggingFile]);

    useEffect(() => {
        return () => {
            imageFiles.forEach(item => {
                if (item.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
            });
        };
    }, [imageFiles]);

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const allowedExtensions = [".jpg", ".jpeg", ".png"];

    function isValidImage(file) {
        const typeValid = allowedTypes.includes(file.type);
        const nameValid = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
        return typeValid && nameValid;
    }

    function processImageFiles(newFiles) {
        const validImages = newFiles.filter(isValidImage);
        
        if (validImages.length === 0) {
            animateUploadPrompt("Apenas imagens (jpg, jpeg, png) são permitidas!");
            timeoutDisclaimerRef.current = setTimeout(() => {
                animateUploadPrompt(defaultText);
            }, 5000);
            return [];
        }

        const combined = [...imageFiles, ...validImages];
        const limitedImages = combined.slice(0, MAX_FILES);

        return limitedImages.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));
    }


    function animateUploadPrompt(txt) {
        if (!refText.current) return;
        refText.current?.classList.add("hide");
        clearTimeout(timeoutTextRef.current);
        timeoutTextRef.current = setTimeout(() => {
            setText(txt);
            refText.current?.classList.remove("hide");
        }, 300);
    }

    const handleDragEnter = (e) => {
        clearTimeout(timeoutDisclaimerRef.current);
        if (step !== 1 || processing) return;
        e.preventDefault();
        if (e.dataTransfer.types.includes("Files")) {
            setIsDraggingFile(true);
            animateUploadPrompt("Solte suas imagens aqui!");
        }
    };

    const handleDragOver = (e) => {
        if (step !== 1 || processing) return;
        e.preventDefault();
    };

    const handleDragLeave = () => {
        if (step !== 1 || processing) return;
        clearTimeout(timeoutDisclaimerRef.current);
        setIsDraggingFile(false);
        navigate("/")
    };

    const handleDrop = (e) => {
        if (step !== 1 || processing) return;

        e.preventDefault();
        setIsDraggingFile(false);
        clearTimeout(timeoutDisclaimerRef.current);

        const files = Array.from(e.dataTransfer.files);
        const imageOnly = files.filter(isValidImage);

        if (imageOnly.length === 0) {
            animateUploadPrompt("Apenas imagens (jpg, jpeg, png) são permitidas!");
            timeoutDisclaimerRef.current = setTimeout(() => {
                animateUploadPrompt(defaultText);
            }, 5000);
            return;
        }

        const combined = [...imageFiles, ...imageOnly];
        const limitedImages = combined.slice(0, MAX_FILES);
        const updatedList = limitedImages.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));

        setImageFiles(updatedList);
        setShowPreview(true);
        setProcessing(true);

        // Lógica de mensagens (animadas)
        if (files.length !== limitedImages.length || imageOnly.length !== limitedImages.length) {
            animateUploadPrompt("Somente arquivos de imagem (jpg, jpeg, png) serão considerados!");
            timeoutDisclaimerRef.current = setTimeout(() => {
                animateUploadPrompt(`Serão consideradas somente ${MAX_FILES} imagens por vez!`);
                timeoutDisclaimerRef.current = setTimeout(() => {
                    animateUploadPrompt("Imagens carregadas com sucesso!");
                    timeoutDisclaimerRef.current = setTimeout(() => {
                        setStep(2);
                        setProcessing(false);
                    }, 2000);
                }, 5000);
            }, 3000);
        } else {
            animateUploadPrompt("Imagens carregadas com sucesso!");
            timeoutDisclaimerRef.current = setTimeout(() => {
                setStep(2);
                setProcessing(false);
            }, 2000);
        }
    };


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const updatedList = processImageFiles(files);
        if (updatedList.length === 0) return;

        setImageFiles(updatedList);
        setShowPreview(true);
        animateUploadPrompt("Imagens carregadas com sucesso!");

        timeoutDisclaimerRef.current = setTimeout(() => {
            setStep(2);
            setProcessing(false);
        }, 2000);
    };


    const handleClick = (e) => {
        e.preventDefault();
        if (step !== 1 || processing) return;
        refInput.current.click();
    };

    async function submitImages(files) {
        if (!files || files.length === 0) return;

        setProcessing(true);

        try {
            // Converter arquivos para base64
            const imagesBase64 = await Promise.all(
                files.map(({ file }) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            // Remove o prefixo "data:image/xxx;base64,"
                            const base64 = reader.result.split(',')[1];
                            resolve({
                                filename: file.name,
                                data: base64
                            });
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                })
            );

            // Chama o backend via IPC
            const response = await window.api.uploadImage({
                imagesBase64,
                format: outputFormat === 'jpg' ? 'jpeg' : outputFormat,
                quality: refCompressionQuality.current
            });

            if (response.error) {
                console.error('Erro na resposta:', response.error);
                setProcessing(false);
                return;
            }

            const json = response.data?.images || [];
            setCompressedResult(json);
            setStep(3);
            setProcessing(false);
        } catch (err) {
            console.error('Erro na requisição:', err);
            setProcessing(false);
        }
    }


    return (
        <>
            <Button
                buttonAction={() => navigate("/")}
                needIcon={true}
                iconHref={arrow}
                background="rgba(255,255,255,.3)"
                color="var(--default-gradient)"
                border={"1px solid rgba(0,0,0,.2)"}
                radius={100}
                padding={"10px 10px"}
                className={`compressComponent returnBtn entryAnimation`}
                style={{ animationDelay: "0.2s" }}
                iconStyle={{ width: "70px", height: "20px" }}
            />

            {step === 1 && (
                <div
                    ref={refImageContainer}
                    className={"compressContainer entryAnimation opacityAni flexCenter flexColumn"}
                    style={{
                        backgroundColor: !isDraggingFile ? "var(--whiteBlur)" : "rgb(252 255 246 / 85%)"
                    }}
                    onClick={handleClick}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <span ref={refText} className="transition02">{text}</span>
                    <DotLottieReact
                        src={isDraggingFile ? "./lottieAni/dropFile.lottie" : processing ? "./lottieAni/loadingAni.lottie" : "./lottieAni/uploadAni.lottie"}
                        autoplay
                        loop
                        style={{ width: "200px", height: "200px" }}
                    />
                </div>
            )}

            {step === 2 && (
                <div
                    className="compressContainer flexCenter flexColumn permitClick hasImages"
                    style={{ backgroundColor: "var(--whiteBlur)" }}
                >
                    <div className="scrollContainer flexCenter flexColumn">
                        <h2>Configurações de compressão:</h2>
                        {showPreview && (
                            <Preview
                                imageFiles={imageFiles}
                                isDraggingFile={isDraggingFile}
                                setIsDraggingFile={setIsDraggingFile}
                            />
                        )}
                        <div className="inputsFrame flexCenter" style={{ gap: "15px" }}>

                            <div className="outputSelector">
                                <div className="inputContainer flexCenter flexColumn" style={{ justifyContent: "space-between", gap: "10px" }}>
                                    <h3>Formato de saída</h3>
                                    <div className="flexCenter" style={{ width: "100%", justifyContent: "space-between", gap: "20px" }}>
                                        <div className="flexCenter" style={{ gap: "10px" }}>
                                            <label htmlFor="jpg" className="flexCenter" style={{ cursor: "pointer" }}>
                                                <input
                                                    id="jpg"
                                                    type="checkbox"
                                                    checked={outputFormat === "jpg"}
                                                    onChange={() => setOutputFormat("jpg")}
                                                />
                                                <div className="checkmark flexCenter">
                                                    <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.54956 9.94481C5.40463 10.11 5.14748 10.1099 5.00262 9.94468L2.40945 6.98687C2.05007 6.57696 1.4124 6.57584 1.05159 6.98449C0.7505 7.3255 0.749604 7.8371 1.0495 8.17917L4.81279 12.4716C5.05818 12.7515 5.49385 12.7515 5.73925 12.4716L14.954 1.96109C15.2522 1.62105 15.2522 1.11273 14.954 0.772691C14.5951 0.363291 13.9579 0.363142 13.5988 0.772373L5.54956 9.94481Z" fill="#dee0e2" />
                                                    </svg>
                                                </div>
                                            </label>
                                            <span style={{ fontSize: "18px", cursor: "default" }}>JPG</span>
                                        </div>
                                        <div className="divider" />
                                        <div className="flexCenter" style={{ gap: "10px" }}>
                                            <label htmlFor="webp" className="flexCenter" style={{ cursor: "pointer" }}>
                                                <input
                                                    id="webp"
                                                    type="checkbox"
                                                    checked={outputFormat === "webp"}
                                                    onChange={() => setOutputFormat("webp")}
                                                />

                                                <div className="checkmark flexCenter">
                                                    <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.54956 9.94481C5.40463 10.11 5.14748 10.1099 5.00262 9.94468L2.40945 6.98687C2.05007 6.57696 1.4124 6.57584 1.05159 6.98449C0.7505 7.3255 0.749604 7.8371 1.0495 8.17917L4.81279 12.4716C5.05818 12.7515 5.49385 12.7515 5.73925 12.4716L14.954 1.96109C15.2522 1.62105 15.2522 1.11273 14.954 0.772691C14.5951 0.363291 13.9579 0.363142 13.5988 0.772373L5.54956 9.94481Z" fill="#dee0e2" />
                                                    </svg>
                                                </div>
                                            </label>
                                            <span style={{ fontSize: "18px", cursor: "default" }}>Webp</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="outputSelector">
                                <div
                                    className="inputContainer flexCenter flexColumn"
                                    style={{ justifyContent: "space-between", gap: "10px" }}
                                >
                                    <h3>Nível de Compressão</h3>

                                    <div
                                        className="flexCenter"
                                        style={{
                                            width: "100%",
                                            justifyContent: "space-between",
                                            gap: "20px",
                                        }}
                                    >
                                        <h4
                                            ref={refCompressionLabel}
                                            style={{
                                                color:
                                                    refCompressionQuality.current >= 49
                                                        ? "#04aa12ff"
                                                        : refCompressionQuality.current > 20
                                                            ? "#FFA500"
                                                            : "#FF0000",
                                            }}
                                        >
                                            {refCompressionQuality.current >= 49
                                                ? "Alta qualidade"
                                                : refCompressionQuality.current > 20
                                                    ? "Qualidade média"
                                                    : "Qualidade baixa (+leve)"}
                                        </h4>
                                        <h4 ref={refCompressionText}>{refCompressionQuality.current}%</h4>
                                    </div>

                                    <div
                                        className="flexCenter"
                                        style={{ width: "100%", justifyContent: "space-between", gap: "20px" }}
                                    >
                                        <input
                                            type="range"
                                            className="slider"
                                            min={10}
                                            max={70}
                                            defaultValue={refCompressionQuality.current}
                                            onInput={(e) => {
                                                const value = Number(e.target.value);
                                                refCompressionQuality.current = value;

                                                if (refCompressionText.current) {
                                                    refCompressionText.current.innerText = `${value}%`;
                                                }

                                                if (refCompressionLabel.current) {
                                                    refCompressionLabel.current.innerText =
                                                        value > 50
                                                            ? "Alta qualidade"
                                                            : value > 20
                                                                ? "Qualidade média"
                                                                : "Qualidade baixa (+leve)";

                                                    refCompressionLabel.current.style.color =
                                                        value > 50
                                                            ? "rgb(52 155 80)"
                                                            : value > 20
                                                                ? "#FFA500"
                                                                : "#FF0000";
                                                }
                                            }}
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <Button
                            className={`compressBtn ${processing ? "processing" : ""}`}
                            buttonText={processing ? `Comprimendo ${imageFiles.length} ${imageFiles.length > 1 ? "imagens" : "imagem"}` : `Comprimir ${imageFiles.length} ${imageFiles.length > 1 ? "imagens" : "imagem"}`}
                            buttonAction={() => !processing ? submitImages(imageFiles) : () => { }}
                        />
                    </div>

                </div>
            )}

            {step === 3 && (
                <div
                    className="compressContainer flexCenter flexColumn permitClick hasImages"
                    style={{ backgroundColor: "#fffe" }}
                >
                    <h2>Resultado da Compressão:</h2>
                    <Preview base64Images={compressedResult || []} />
                    <div className="flexCenter" style={{ gap: "15px", flexWrap: "wrap" }}>
                        <Button
                            className={"lastBtns downloadAll"}
                            buttonAction={() => downloadAllImages(compressedResult)}
                            needIcon={false}
                            buttonText={"Baixar Imagens"}
                            background="#fff"
                            color="var(--default-gradient)"
                            colorHover="var(--default-gradient)"
                            border={"1px solid rgba(0,0,0,.2)"}
                            radius={"var(--default-radius)"}
                            padding={"10px 10px"}
                            style={{ animationDelay: "0.2s", width: "250px" }}
                        />
                        <Button
                            className={"lastBtns compressAgain"}
                            buttonAction={() => {
                                setStep(1);
                                setImageFiles([]);
                                setCompressedResult(null);
                                setShowPreview(false);
                                setText(defaultText);
                            }}
                            buttonText={"Comprimir Novamente"}
                            background="#fff"
                            color="var(--default-gradient)"
                            colorHover="var(--default-gradient)"
                            border={"1px solid rgba(0,0,0,.2)"}
                            radius={"var(--default-radius)"}
                            padding={"10px 10px"}
                            style={{ animationDelay: "0.2s", width: "350px" }}
                        />
                    </div>
                </div>
            )}

            <input
                ref={refInput}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

        </>
    );
}
