/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import "./expandedButtons.css"

export default function ExpandedButton({ linkAddr, text, pictureSrc, className, style, buttonAction, onMouseEnter, onMouseLeave, svgIcon }) {
    if (linkAddr) {
        return (
            <Link to={linkAddr}>
                <ButtonComponent
                    text={text}
                    pictureSrc={pictureSrc || null}
                    className={className}
                    style={style}
                    buttonAction={buttonAction}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    svgIcon={svgIcon}
                />
            </Link>
        )
    } else {
        return (
            <ButtonComponent
                text={text}
                pictureSrc={pictureSrc || null}
                className={className}
                style={style}
                buttonAction={buttonAction}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                svgIcon={svgIcon}
            />
        )
    }
}

function ButtonComponent({ text, pictureSrc, className, style, buttonAction, onMouseEnter, onMouseLeave, svgIcon }) {
    return (
        <div className={`expandedButtonLink transition ${className || ""} ${pictureSrc ? "hasPicture" : ""}`} style={{...style}} onPointerDown={buttonAction} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
            <div className="container flex">
                <div className="textContainer transition flexCenter">
                    <h1 className="text entryAnimation">{text}</h1>
                </div>
                <div className={`iconContainer transition flexCenter ${pictureSrc ? "hasPicture" : ""}`} style={{ width: pictureSrc ? "46px" : "", height: pictureSrc ? "46px" : "", padding: pictureSrc ? "0px" : "" }}>
                    {pictureSrc ?
                        <img className="img" src={pictureSrc} alt="" />
                        : svgIcon ? <img width={20} height={20} src={svgIcon} alt="" /> :<svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 15.1429C30 16.2474 29.1046 17.1429 28 17.1429H19.1429C18.0383 17.1429 17.1429 18.0383 17.1429 19.1429V28C17.1429 29.1046 16.2474 30 15.1429 30H14.8571C13.7526 30 12.8571 29.1046 12.8571 28V19.1429C12.8571 18.0383 11.9617 17.1429 10.8571 17.1429H2C0.89543 17.1429 0 16.2474 0 15.1429V14.8571C0 13.7526 0.895431 12.8571 2 12.8571H10.8571C11.9617 12.8571 12.8571 11.9617 12.8571 10.8571V2C12.8571 0.89543 13.7526 0 14.8571 0H15.1429C16.2474 0 17.1429 0.895431 17.1429 2V10.8571C17.1429 11.9617 18.0383 12.8571 19.1429 12.8571H28C29.1046 12.8571 30 13.7526 30 14.8571V15.1429Z" fill="url(#paint0_linear_24_1192)" />
                            <defs>
                                <linearGradient id="paint0_linear_24_1192" x1="0" y1="15" x2="30" y2="15" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#591C93" />
                                    <stop offset="0.495192" stopColor="#943A78" />
                                    <stop offset="1" stopColor="#E36235" />
                                </linearGradient>
                            </defs>
                        </svg>
                    }
                </div>
            </div>
        </div>
    )
}