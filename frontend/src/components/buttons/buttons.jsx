/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./buttons.css";
import { isAFunction } from "../../scripts/scripts";
import { useEffect, useRef } from "react";


export default function Button({ hasGradientBorder=false, gradientBorderColor, gradientBorderWidth, isLink, linkAddr, openNewTab, buttonAction, buttonText, needIcon, iconHref, width = 0, height = 0, padding = 20, radius = 20, className = "", background = "var(--default-gradient)", color = "#fff", fontSize, fontWeight, backgroundHover, colorHover, animationDelay, border, borderHover, boxShadow, animateZoom = true, style, iconClassName = "", iconStyle }) {

    if (isLink) {
        if (!linkAddr) {
            console.error("Link address is required for a link button in Button component");
            return null;
        }
        return (
            <LinkButton
                linkAddr={linkAddr}
                openNewTab={openNewTab}
                buttonAction={buttonAction}
                buttonText={buttonText}
                needIcon={needIcon}
                iconPath={iconHref}
                width={width}
                height={height}
                padding={padding}
                radius={radius}
                className={className}
                color={color}
                background={background}
                backgroundHover={backgroundHover}
                colorHover={colorHover}
                animationDelay={animationDelay}
                border={border}
                borderHover={borderHover}
                boxShadow={boxShadow}
                fontSize={fontSize}
                animateZoom={animateZoom}
                hasGradientBorder={hasGradientBorder}
                gradientBorderColor={gradientBorderColor}
                gradientBorderWidth={gradientBorderWidth}
                fontWeight={fontWeight}
                style={style}
                iconClassName={iconClassName}
                iconStyle={iconStyle}
            />
        );
    } else {
        if (!buttonAction) {
            console.error("A function is required for a button in Button component if it is not a button with link");
            return null;
        }
        return (
            <BasicButton
                buttonAction={buttonAction}
                buttonText={buttonText}
                needIcon={needIcon}
                iconPath={iconHref}
                width={width}
                height={height}
                padding={padding}
                radius={radius}
                className={className}
                color={color}
                background={background}
                fontSize={fontSize}
                backgroundHover={backgroundHover}
                colorHover={colorHover}
                animationDelay={animationDelay}
                border={border}
                borderHover={borderHover}
                boxShadow={boxShadow}
                animateZoom={animateZoom}
                hasGradientBorder={hasGradientBorder}
                gradientBorderColor={gradientBorderColor}
                gradientBorderWidth={gradientBorderWidth}
                fontWeight={fontWeight}
                style={style}
                iconClassName={iconClassName}
                iconStyle={iconStyle}
            />
        );
    }
}

function Icon({ href, className = "", style }) {
    return (
        <img src={href} className={"iconButton " + className} style={{...style}} alt="" />
    )
}


function LinkButton({ linkAddr, openNewTab, buttonText, needIcon, iconPath, width, height, padding, radius, iconClassName = "", className = "", buttonAction, color, background, fontSize, fontWeight, backgroundHover, colorHover, animationDelay, border, borderHover, boxShadow, animateZoom, hasGradientBorder, gradientBorderColor, gradientBorderWidth, style, iconStyle }) {
    return (
        <Link to={linkAddr} target={openNewTab ? "_blank" : undefined} rel="noopener noreferrer" style={{color: "unset!important" }}>
            <BasicButton
                buttonText={buttonText}
                needIcon={needIcon}
                iconPath={iconPath}
                width={width}
                height={height}
                padding={padding}
                radius={radius}
                iconClassName={iconClassName}
                className={className}
                buttonAction={buttonAction}
                background={background}
                color={color}
                fontSize={fontSize}
                backgroundHover={backgroundHover}
                colorHover={colorHover}
                animationDelay={animationDelay}
                border={border}
                borderHover={borderHover}
                boxShadow={boxShadow}
                animateZoom={animateZoom}
                hasGradientBorder={hasGradientBorder}
                gradientBorderColor={gradientBorderColor}
                gradientBorderWidth={gradientBorderWidth}
                fontWeight={fontWeight}
                style={style}
                iconStyle={iconStyle}
            />
        </Link>
    )
}

function BasicButton({ buttonAction, buttonText, needIcon, iconPath, width, height, padding, radius, iconClassName = "", className = "", color, background, fontSize, fontWeight, backgroundHover = "#fff3", colorHover = "#fff", title, animationDelay, border, borderHover, boxShadow, animateZoom, hasGradientBorder, gradientBorderColor, gradientBorderWidth, style, iconStyle }) {
    const btnRef = useRef(null)

    useEffect(() => {
            const e = btnRef?.current;
            if (backgroundHover && typeof backgroundHover === "string" && btnRef?.current) {
                e.style.setProperty("--backgroundHover", backgroundHover);
            }
            if (colorHover && typeof colorHover === "string" && btnRef?.current) {
                e.style.setProperty("--colorHover", colorHover);
            }
            if (borderHover && typeof borderHover === "string" && btnRef?.current) {
                e.style.setProperty("--borderHover", borderHover);
            }
            if(hasGradientBorder && gradientBorderColor && gradientBorderWidth && btnRef?.current) {
                e.style.setProperty("--gradientBorderColor", gradientBorderColor);
                e.style.setProperty("--gradientBorderWidth", `${gradientBorderWidth}px`);
                e.style.setProperty("--gradientBorderOpacity", "0");
                e.style.setProperty("--radius", `${radius}px`);
            }else{
                e.style.setProperty("--gradientBorderWidth", "0px");
                e.style.setProperty("--gradientBorderColor", "transparent");
                e.style.setProperty("--gradientBorderOpacity", "0");
                e.style.setProperty("--radius", `0px`);
            }

    }, [backgroundHover, borderHover, colorHover, gradientBorderColor, gradientBorderWidth, hasGradientBorder, radius])

    function handleClick() {
        if (isAFunction(buttonAction)) {
            buttonAction();
        }
        setTimeout(() => {
            document.body.style.overflow = "";
        }, 1000);
    }
    return (
        <div
            ref={btnRef}
            title={title ? title : buttonText}
            className={"button flexCenter transition " + className}
            onClick={buttonAction && handleClick}
            style={{
                boxSizing: "border-box", // Crucial for predictable width & padding
                width: typeof width === "string" ? width : width > 0 ? `${width}px` : "auto", // Set width directly
                height: typeof height === "string" ? height : height > 0 ? `${height}px` : "auto",
                padding: typeof padding === "string" ? padding : padding > 0 ? `${padding}px` : undefined,
                borderRadius: !hasGradientBorder && typeof radius === "string" ? radius : radius > 0 ? `${radius}px` : undefined,
                background: background,
                fontSize: typeof fontSize === "string" ? fontSize : fontSize > 0 ? `${fontSize}px` : "16px",
                animationDelay: animationDelay ? typeof animationDelay === "string" ? animationDelay : `${animationDelay}s` : null,
                border: border && !hasGradientBorder ? border : undefined,
                boxShadow: boxShadow ? boxShadow : "",
                transform: !animateZoom ? "scale(1.0)" : "",
                ...style

            }}
        >
            <div className="content flexCenter transition">
                {buttonText && <span className="buttonText transition" style={{ background: color, fontWeight: fontWeight }}>{buttonText}</span>}
                {needIcon && <Icon href={iconPath} className={iconClassName} style={{...iconStyle}} />}
            </div>
        </div>
    )
}
