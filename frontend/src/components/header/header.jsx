import "./header.css";
import Button from "../buttons/buttons";
export default function Header() {
    return (
        <header className={`header flex`}>
            <Button
                isLink={true}
                linkAddr={"/"}
                buttonText={"Compresso"}
                background="var(--whiteBlur)"
                color="var(--default-gradient)"
                colorHover="var(--default-gradient)"
                boxShadow="none"
                border="1px solid rgba(0,0,0,.2)"
                radius={100}
                width={200}
                padding="10px 10px"
                className="logo headerBtn entryAnimation"
                style={{ animationDelay: "0.2s" }}
            />
        </header>
    );
}
