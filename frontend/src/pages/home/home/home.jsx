import ExpandedButton from "../../../components/buttons/expandedButtons/expandedButtons";
import "./home.css";
import Masonry from "react-masonry-css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageItem from "../../../components/imageItem/imageItem";
import SkeletonArea from "../../../components/skeletonArea/skeletonArea";
import { useIntersectionObserver } from "../../../scripts/scripts";
import { downloadAllImages } from "../../../scripts/downloadImages";

import donwloadIcon from "../../../assets/svg/downloadIcon.svg"

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [loadingAnimationControl, setLoadingAnimationControl] = useState(true);
  const [images, setImages] = useState([]); // ← estado para armazenar as imagens

  useIntersectionObserver();
  const breakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    400: 1,
  };

  // Redireciona ao arrastar imagem
  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      navigate("/comprimir");
    };

    window.addEventListener("dragenter", handleDragEnter);
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
    };
  }, []);


  useEffect(() => {
    const fetchImages = async () => {
      console.log("window.api", window.api);
      try {
        const response = await window.api.getImages();
        if (response?.error) {
          setLoading(false);
          setImages([]);
          return;
        }
        const imgs = response?.data?.images;


        const sortedImgs = imgs.slice().sort((a, b) => {
          const getTimestamp = (filename) => {
            const name = filename.split(".")[0];
            const parts = name.split("_");
            const timestamp = parts[parts.length - 1];
            return parseInt(timestamp);
          };

          return getTimestamp(b.filename) - getTimestamp(a.filename);
        });

        setImages(sortedImgs);
        if (loadingAnimationControl === true && loading === true || images.length === 0) {
          setLoadingAnimationControl(false);
          setTimeout(() => {
            setLoading(false);
            setTimeout(() => {
              setLoadingAnimationControl(true)
            }, 500);
          }, 500);
        } else {
          setLoading(false)
          setLoadingAnimationControl(true)
        }
      } catch (error) {
        setLoading(false)
        console.error("Erro ao buscar imagens:", error);
      }
    };

    fetchImages();
  }, [location.pathname]);


  return (
    <div className="home flex flexColumn">
      <section
        className="subheader flexCenter entryAnimation"
        style={{ animationDelay: `${0.25 * 2}s` }}
      >
        <h1 className="titlePage transition">Minhas Compressões</h1>
        <div className="flexCenter flexColumn" style={{ gap: "10px", alignItems: "flex-end" }}>
          <ExpandedButton
            linkAddr={"/comprimir"}
            text={"Comprimir imagem"}
            className="compressBtn transition headerBtn entryAnimation"
          />
          {images.length > 0 && (
            <ExpandedButton
              buttonAction={() => downloadAllImages(images)}
              svgIcon={donwloadIcon}
              text={"Baixar imagens"}
              className="downloadAllBtn transition headerBtn entryAnimation"
            />
          )}
        </div>

      </section>

      <section
        className="images entryAnimation"
        style={{ animationDelay: `${0.25 * 3}s` }}
      >
        <Masonry
          breakpointCols={breakpoints}
          className="imageGridContainer flexCenter entryAnimation"
          columnClassName="imageGridColumn entryAnimation"
        >
          {(!loading && images.length === 0) && <p>Ainda sem nada por aqui</p>}
          {(!loading && loadingAnimationControl) &&
            images.map((imgBase64, index) => (
              <ImageItem
                className={"transition1"}
                key={index}
                imageSrc={`data:image/jpeg;base64,${imgBase64.buffer}`}
                fileName={imgBase64.filename}
              />
            ))}
          {loading && Array.from({ length: 40 }, (_, index) => (
            <SkeletonArea className={"transition05 useObserver"} key={index} width="100%" height={Math.floor(Math.random() * (200 - 100 + 1)) + 100 + "px"} style={{ marginBottom: "10px", opacity: loadingAnimationControl ? 1 : 0 }} />
          ))}
        </Masonry>
      </section>
    </div>
  );
}
