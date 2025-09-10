import "./skeletonArea.css"
import PropTypes from "prop-types";
export default function SkeletonArea({ width, height, style, className }) {
    return (
        <div className={`skeleton ${className}`} style={{ width, height, ...style }} />
    )
}

SkeletonArea.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
}