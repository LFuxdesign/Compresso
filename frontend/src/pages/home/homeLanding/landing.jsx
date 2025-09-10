
import BeforeAfterSlider from "../../../components/beforeAfterSlider/beforeAfter"
import Button from "../../../components/buttons/buttons"
import "./landing.css"

import imgExample from "../../../assets/imgExample.jpg"
import imgExampleCompressed from "../../../assets/webp/exampleCompressed.webp"
export default function Landing() {
    //     function animateTextByWord(text, visibleCount) {
    //     const words = text.split(' ');
    //     return words.map((word, index) => (
    //         <span
    //             key={index}
    //             className={`word ${index < visibleCount ? 'visible' : ''}`}
    //         >
    //             {word + ' '}
    //         </span>
    //     ));
    // }
    return (<>
        <section className="landing flex transition entryAnimation" style={{ animationDelay: "0.6s" }}>
            <div className="landingContent flex flexColumn transition05">
                <h1 className="landingTitle">Compressão de imagens descomplicada e dinâmica</h1>
                <span className="landingText">Comprima suas imagens em até <div className="landingTextMark">90%</div> do tamanho original com minima perca de qualidade </span>
                <Button className="actionBtn" isLink buttonText={"Comprimir Imagem"} linkAddr={"/login"} width={240} fontSize={21} padding={"15px 0px"} />
            </div>
            <div className="landingImageContainer flex entryAnimation transition05">
                <BeforeAfterSlider
                    beforeSrc={imgExample}
                    afterSrc={imgExampleCompressed}
                    imagesSizesData={{
                        beforeSize: 5.44,
                        afterSize: 329
                    }}
                    attributionData={{
                        text: "Image by vecstock on Freepik",
                        link: "https://www.freepik.com/free-ai-image/vibrant-macaw-perched-branch-rainforest-generated-by-ai_47415729.htm#fromView=search&page=1&position=3&uuid=9df01cba-e0d8-485c-aba5-64b54a384c12&query=animals"
                    }}
                />
            </div>
        </section>
        <section className="landingAppSteps flex flexColumn transition entryAnimation" style={{ animationDelay: "0.6s" }}>
            <h1 className="landingTitle">Simples. Ponto.</h1>
            <div className="items flexCenter">
                <div className="item flexCenter">
                    <svg width="119" height="119" viewBox="0 0 119 119" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2.5" y="2.5" width="114" height="114" rx="57" fill="white" />
                        <rect x="2.5" y="2.5" width="114" height="114" rx="57" stroke="url(#paint0_linear_10_131)" strokeWidth="5" />
                        <path d="M77.0773 65.2325C75.8117 63.992 73.6773 64.8887 73.6773 66.6608V76.7C73.6773 77.8046 72.7818 78.7 71.6773 78.7H41.3972C40.2926 78.7 39.3972 77.8046 39.3972 76.7V47.1C39.3972 45.9954 40.2926 45.1 41.3972 45.1H49.8276C50.8765 45.1 51.7328 44.285 51.9403 43.2568C51.9451 43.2332 51.9499 43.2096 51.9548 43.186C52.2457 41.7805 51.2686 40.3 49.8333 40.3H39.3972C36.7037 40.3 34.5 42.46 34.5 45.1V78.7C34.5 81.34 36.7037 83.5 39.3972 83.5H73.6773C76.3707 83.5 78.5744 81.34 78.5744 78.7V67.5402C78.5744 67.0028 78.3582 66.488 77.9744 66.1119L77.0773 65.2325ZM67.5376 70.683C68.5464 71.9987 67.6084 73.9 65.9505 73.9H47.2144C45.5404 73.9 44.6071 71.9661 45.6487 70.6556L48.2874 67.3357C49.0721 66.3484 50.5637 66.325 51.379 67.2872L53.0253 69.2302C53.8413 70.1933 55.3345 70.1688 56.1186 69.1795L59.743 64.6065C60.5519 63.5859 62.105 63.5983 62.8975 64.6318L67.5376 70.683ZM78.0259 53.1747C77.3473 52.5116 77.2474 51.4705 77.6388 50.6062C78.2374 49.2844 78.5744 47.8367 78.5744 46.3C78.5744 40.324 73.6528 35.5 67.5558 35.5C61.4589 35.5 56.5372 40.324 56.5372 46.3C56.5372 52.276 61.4589 57.1 67.5313 57.1C69.1217 57.1 70.6321 56.7601 71.9935 56.1574C72.8383 55.7834 73.8483 55.8756 74.5081 56.5223L79.623 61.5358C80.4007 62.2981 81.6453 62.2981 82.423 61.5358L83.0404 60.9306C83.8414 60.1456 83.8403 58.8555 83.0381 58.0717L78.0259 53.1747ZM67.5558 52.3C64.1768 52.3 61.4344 49.612 61.4344 46.3C61.4344 42.988 64.1768 40.3 67.5558 40.3C70.9349 40.3 73.6773 42.988 73.6773 46.3C73.6773 49.612 70.9349 52.3 67.5558 52.3Z" fill="url(#paint1_linear_10_131)" />
                        <defs>
                            <linearGradient id="paint0_linear_10_131" x1="0" y1="59.5" x2="119" y2="59.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#591C93" />
                                <stop offset="0.495192" stopColor="#943A78" />
                                <stop offset="1" stopColor="#E36235" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_10_131" x1="34.5" y1="59.5" x2="84.5" y2="59.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#591C93" />
                                <stop offset="0.495192" stopColor="#943A78" />
                                <stop offset="1" stopColor="#E36235" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <h2 className="itemTitle">Selecione sua imagem</h2>
                </div>
                <div className="item flexCenter">
                    <svg width="120" height="119" viewBox="0 0 120 119" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3.34998" y="2.5" width="114" height="114" rx="57" fill="white" />
                        <rect x="3.34998" y="2.5" width="114" height="114" rx="57" stroke="url(#paint0_linear_10_135)" strokeWidth="5" />
                        <path d="M81.2966 50.8552C81.2953 50.8564 81.2942 50.8578 81.2932 50.8592L78.5355 55.0101C78.3371 55.3088 78.3156 55.69 78.4669 56.0151C79.7821 58.8414 80.4216 61.9383 80.3311 65.06C80.2405 68.1823 79.4223 71.2374 77.945 73.983C77.7755 74.298 77.4434 74.4881 77.0857 74.4881H43.5353C43.1776 74.4881 42.8454 74.2979 42.6759 73.983C40.7296 70.367 39.9379 66.2351 40.4159 62.1465C40.9164 57.8662 42.7817 53.8612 45.7355 50.7253C48.6892 47.5893 52.5741 45.4894 56.8142 44.7367C60.8637 44.0179 65.0313 44.5646 68.7527 46.2947C69.078 46.4459 69.4594 46.4242 69.758 46.2255L72.6336 44.3122C73.2343 43.9125 73.2251 43.0297 72.5953 42.6778C68.1703 40.2061 63.0877 39.1301 58.019 39.6127C52.4413 40.1438 47.2028 42.5315 43.1413 46.394C39.0798 50.2564 36.43 55.3704 35.6158 60.9179C34.8016 66.4654 35.8701 72.1259 38.6502 76.994C39.0872 77.7515 39.7147 78.3814 40.4703 78.821C41.2258 79.2606 42.0832 79.4947 42.9572 79.5H77.6387C78.5212 79.5035 79.389 79.2735 80.1541 78.8335C80.9192 78.3934 81.5546 77.7589 81.9958 76.994C84.303 72.9943 85.4609 68.4344 85.3416 63.8176C85.2226 59.2118 83.837 54.7282 81.3376 50.8595C81.3284 50.8453 81.3085 50.8432 81.2966 50.8552V50.8552ZM56.7798 67.9977C57.2449 68.4637 57.7972 68.8333 58.4052 69.0856C59.0132 69.3378 59.6649 69.4676 60.323 69.4676C60.9812 69.4676 61.6329 69.3378 62.2409 69.0856C62.8184 68.8459 63.3458 68.5003 63.7959 68.0669C63.8432 68.0213 63.8846 67.9702 63.921 67.9155L75.2673 50.8834C75.8733 49.9737 74.7894 48.8905 73.8801 49.4971L56.8619 60.8511C56.8073 60.8875 56.7561 60.929 56.7106 60.9764C56.2775 61.4268 55.9321 61.9545 55.6927 62.5325C55.4407 63.1409 55.3109 63.7931 55.3109 64.4518C55.3109 65.1104 55.4407 65.7626 55.6927 66.371C55.9447 66.9795 56.3141 67.5322 56.7798 67.9977Z" fill="url(#paint1_linear_10_135)" />
                        <defs>
                            <linearGradient id="paint0_linear_10_135" x1="0.849976" y1="59.5" x2="119.85" y2="59.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#591C93" />
                                <stop offset="0.495192" stopColor="#943A78" />
                                <stop offset="1" stopColor="#E36235" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_10_135" x1="35.35" y1="59.5" x2="85.35" y2="59.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#591C93" />
                                <stop offset="0.495192" stopColor="#943A78" />
                                <stop offset="1" stopColor="#E36235" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <h2 className="itemTitle">Selecione o nível de compressão</h2>
                </div>
                <div className="item flexCenter">
                    <svg width="120" height="119" viewBox="0 0 120 119" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2.75" y="2.5" width="114" height="114" rx="57" fill="white" />
                        <rect x="2.75" y="2.5" width="114" height="114" rx="57" stroke="url(#paint0_linear_10_139)" strokeWidth="5" />
                        <path d="M75.6523 40.1015C71.943 37.0689 67.3565 35.0639 62.3189 34.5627V39.6253C65.9781 40.0765 69.3114 41.5301 72.0934 43.6855L75.6523 40.1015ZM79.6873 56.9938H84.75C84.2487 51.9562 82.2437 47.3697 79.2112 43.6604L75.6272 47.2193C77.7826 50.0013 79.2362 53.3346 79.6873 56.9938ZM75.6272 71.7807L79.2112 75.3647C82.2437 71.6554 84.2487 67.0439 84.75 62.0314H79.6873C79.2362 65.6654 77.7826 68.9988 75.6272 71.7807ZM62.3189 79.3747V84.4374C67.3565 83.9361 71.943 81.9311 75.6523 78.8985L72.0683 75.3146C69.3114 77.4699 65.9781 78.9236 62.3189 79.3747ZM62.3189 59.5V46.9687H57.3064V59.5H47.2813L59.8127 72.0314L72.344 59.5H62.3189ZM57.3064 79.3747V84.4374C44.6497 83.1842 34.75 72.5075 34.75 59.5C34.75 46.4925 44.6497 35.8158 57.3064 34.5627V39.6253C47.4066 40.8534 39.7625 49.2745 39.7625 59.5C39.7625 69.7256 47.4066 78.1466 57.3064 79.3747Z" fill="url(#paint1_linear_10_139)" />
                        <defs>
                            <linearGradient id="paint0_linear_10_139" x1="0.25" y1="59.5" x2="119.25" y2="59.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#591C93" />
                                <stop offset="0.495192" stopColor="#943A78" />
                                <stop offset="1" stopColor="#E36235" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_10_139" x1="34.75" y1="59.5" x2="84.75" y2="59.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#591C93" />
                                <stop offset="0.495192" stopColor="#943A78" />
                                <stop offset="1" stopColor="#E36235" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <h2 className="itemTitle">Baixe sua imagem</h2>
                </div>
            </div>


        </section>
    </>)
} 