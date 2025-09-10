import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { isValidEmail, isValidInput, isValidName, isValidPw } from "../../scripts/scripts";
import "./auth.css";
import { useContext, useEffect, useRef, useState } from "react";
import bg from "../../assets/webp/loginBG.webp"
import PropTypes from "prop-types";
import { useRedirectIfAuthenticated } from "../../scripts/verifyAuth";
import Button from "../../components/buttons/buttons";
import arrow from "../../assets/svg/arrow.svg";
import AuthContext from "../../context-provider/authContextInstance";

export default function Auth({ registerMode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const resetMode = false;
    const [status, setStatus] = useState(null);
    const [timerNumber, setTimerNumber] = useState(null);

    const [usernameValue, setUserNameValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [pwValue, setPwValue] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const { setUserData, setIsLoggedIn } = useContext(AuthContext);

    const refRemember = useRef(null);
    const refForm = useRef(null);

    useRedirectIfAuthenticated();

    useEffect(() => {
        if (location.pathname === "/cadastro") {
            refForm.current.reset();
            setStatus(null);
            setUserNameValue("");
            setEmailValue("");
            setPwValue("");
            setTimerNumber(null);
        }
    }, [location])


    const submitRegister = async () => {
        if (!isValidInput(usernameValue) || !isValidEmail(emailValue) || !isValidPw(pwValue)) {
            setStatus({ success: false, message: "Preencha todos os campos corretamente." });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nome", usernameValue);
            formData.append("email", emailValue);
            formData.append("pw", pwValue);
            formData.append("remember", refRemember.current.checked);

            const response = await axios.post("/api/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data?.success) {
                setUserData(response.data.data.user);
                setIsLoggedIn(true);
                setStatus({ success: true, message: "Cadastro realizado com sucesso! Redirecionando..." });

                navigate("/", { replace: true });
            } else {
                setStatus({ success: false, message: response.data.message || "Erro ao cadastrar usuário." });
            }

        } catch (error) {
            console.error(error);
            if (error.response?.status === 500 || error.response?.status === 404) {
                setStatus({ success: false, message: "Erro no servidor. Tente novamente mais tarde." });
            } else {
                setStatus({
                    success: false,
                    message: error.response?.data?.message || "Erro ao cadastrar usuário.",
                });
            }
        }
    };


    const submitLogin = async () => {
        if (!isValidEmail(emailValue) || !isValidInput(pwValue)) {
            setStatus({ success: false, message: "Email ou senha inválidos." });
            return;
        }
        try {
            const formData = new FormData();
            formData.append("email", emailValue);
            formData.append("pw", pwValue);
            formData.append("remember", refRemember.current.checked);

            const response = await axios.post("/api/auth", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response)
            if (response.data.success) {
                setUserData(response.data.data.user);
                setIsLoggedIn(true);
                setStatus({ success: true, message: "Login realizado com sucesso! Estamos te redirecionando agora" });
                navigate("/", { replace: true });
            } else {
                setStatus({ success: false, message: response.data.message || "Erro ao logar." });
            }
        } catch (error) {
            console.log(error)
            if (error.status === 500 || error.status === 404) {
                setStatus({ success: false, message: "Erro no servidor. Tente novamente mais tarde." });
            } else setStatus({ success: false, message: error.response?.data?.message || "Erro ao logar." });
        }
    };
    const submitreset = () => {
        alert("Função em desenvolvimento, por favor aguarde.");
    }
    return (
        <div className="authContainer flexCenter" >
            <div className="formsContainer transition05 flexCenter" style={{ animationDelay: "0.6s" }}>
                <div className={`frame flex flexColumn noBlur ${registerMode ? "inRegisterPage" : ""}`}>
                    <form ref={refForm} className="loginForm flexCenter flexColumn entryAnimation" onSubmit={(e) => { e.preventDefault(); resetMode ? submitreset() : registerMode ? submitRegister() : submitLogin(); }}>
                        <Button
                            buttonAction={() => navigate(-1)}
                            needIcon={true}
                            iconHref={arrow}
                            iconClassName
                            background="rgba(255,255,255,.3)"
                            color="var(--default-gradient)"
                            backgroundHover=""
                            colorHover="var(--default-gradient)!important"
                            boxShadow={"none"}
                            border={"1px solid rgba(0,0,0,.2)"}
                            borderHover={"1px solid rgba(0,0,0,.2"}
                            radius={100}
                            padding={"10px 10px"}
                            className={`returnBtn entryAnimation ${registerMode ? "inRegisterPage" : ""}`}
                            style={{ animationDelay: "0.2s", backdropFilter: "none" }}
                            iconStyle={{ width: "70px", height: "20px" }}
                        />
                        <h1 className={`formTitle transition05 ${registerMode ? "inRegisterPage" : ""}`}>{registerMode ? "Criar" : "Entre com"} sua conta</h1>
                        <div className={`animationContainer flex flexColumn ${(registerMode && status) ? "show registerModeErro" : registerMode || status ? "show" : ""}`}>
                            {
                                status && <span className={`entryAnimation ${status?.success ? "success" : "erro"}`}>{status?.message}</span>
                            }
                            {
                                registerMode && <div className="inputContainer flexCenter entryAnimation">
                                    <input id="username" autoComplete="username" className={!isValidName(usernameValue) && usernameValue.length > 0 ? "wrong" : ""} placeholder="" type="text" onChange={(e) => setUserNameValue(e.target.value)} onKeyDown={(e) => setUserNameValue(e.target.value)} onKeyUp={(e) => setUserNameValue(e.target.value)} required />
                                    <label htmlFor="username">Usuário</label>
                                </div>
                            }
                        </div>
                        <div className="inputContainer flexCenter entryAnimation" style={{ animationDelay: `${.25 * 2}s` }}>
                            <input id="email" autoComplete="email" className={!isValidEmail(emailValue) && emailValue.length > 0 ? "wrong" : ""} placeholder="" type="email"  onChange={(e) => {
                                const formattedValue = e.target.value.replace(/\s/g, "").toLowerCase();
                                e.target.value = formattedValue
                                setEmailValue(formattedValue);
                            }} onKeyDown={(e) => setEmailValue(e.target.value)} onKeyUp={(e) => {
                                const formattedValue = e.target.value.replace(/\s/g, "").toLowerCase();
                                setEmailValue(formattedValue);
                            }} required />
                            <label htmlFor="email">Email</label>
                        </div>
                        {
                            !resetMode && <div className="inputContainer flexCenter entryAnimation" style={{ animationDelay: `${.25 * 3}s` }}>
                                <input id="password" autoComplete={registerMode ? "new-password" : "current-password"} className={(!registerMode && !isValidInput(pwValue) && pwValue.length > 0) || (registerMode && !isValidPw(pwValue) && pwValue.length > 0) ? "passwordInput wrong" : "passwordInput"} placeholder="" type={showPassword ? "text" : "password"} onChange={(e) => setPwValue(e.target.value)} onKeyDown={(e) => setPwValue(e.target.value)} onKeyUp={(e) => setPwValue(e.target.value)} required />
                                <label htmlFor="password">Senha</label>
                                <div className="showPassword flexCenter transition02" onClick={() => setShowPassword((prev) => !prev)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_2_288)">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#011729" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#011729" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path className="transition02" d={!showPassword ? "M1 1L23 23" : "M-23 -22L-1 0"} stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path className="transition02" d={!showPassword ? "M2 0L24 22" : "M-22 -23L0 -1"} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2_288">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>


                            </div>
                        }
                        {
                            !resetMode && <div className="inputContainer checkbox flexCenter entryAnimation" style={{ justifyContent: "space-between", animationDelay: `${.25 * 4}s` }}>
                                <div className="flexCenter" style={{ gap: "10px" }}>
                                    <label htmlFor="remember" className="flexCenter" style={{ cursor: "pointer" }}>
                                        <input id="remember" ref={refRemember} type="checkbox" />
                                        <div className="checkmark flexCenter">
                                            <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.54956 9.94481C5.40463 10.11 5.14748 10.1099 5.00262 9.94468L2.40945 6.98687C2.05007 6.57696 1.4124 6.57584 1.05159 6.98449C0.7505 7.3255 0.749604 7.8371 1.0495 8.17917L4.81279 12.4716C5.05818 12.7515 5.49385 12.7515 5.73925 12.4716L14.954 1.96109C15.2522 1.62105 15.2522 1.11273 14.954 0.772691C14.5951 0.363291 13.9579 0.363142 13.5988 0.772373L5.54956 9.94481Z" fill="white" />
                                            </svg>
                                        </div>
                                    </label>
                                    <span style={{ fontSize: "18px", cursor: "default" }}>Lembrar-me</span>
                                </div>
                                {/* <Link to={"/reset"} className={`forgotPassword ${!registerMode ? "entryAnimation" : "outAnimation"}`}><span style={{ wordWrap: "wrap" }}><u>Esqueçi minha senha</u></span></Link> */}
                            </div>
                        }
                        <div className="inputContainer flexCenter entryAnimation" style={{ animationDelay: `${resetMode ? (.25 * 3) : .25 * 5}s` }}>
                            <div className="submitBtn flexCenter" aria-disabled={(timerNumber || (!registerMode && (!isValidEmail(emailValue) || !isValidInput(pwValue)))) || (registerMode && (!isValidName(usernameValue) || !isValidEmail(emailValue) || !isValidPw(pwValue))) ? true : false} onClick={() => resetMode ? submitreset() : registerMode ? submitRegister() : submitLogin()}>
                                <span>{`${resetMode ? `Recuperar senha ${timerNumber ? `(${timerNumber}s)` : ""}` : registerMode ? "Cadastrar-se" : "Entrar"}`}</span>
                            </div>
                        </div>
                        <div className="entryAnimation" style={{ alignSelf: "flex-start", animationDelay: `${resetMode ? (.25 * 3) : .25 * 6}s` }}>
                            <span className={`registerLinkText transition05 ${registerMode ? "inRegisterPage" : ""}`}>Ainda não tem uma conta? <Link className="registerLink" to={"/cadastro"}>Registre-se</Link></span>
                        </div>
                        <input type="submit" value="submit" style={{ display: "none" }} />
                    </form>
                </div>
            </div>
            <div className="imageContainer transition05 flexCenter" style={{ animationDelay: "0.6s" }}>
                <img className="transition05 entryAnimation noBlur" src={bg} alt="" />
            </div>
            <span className="attribution"><Link to="https://www.freepik.com/free-photo/wet-monstera-plant-leaves-mobile-wallpaper_19101078.htm">Image by wirestock on Freepik</Link></span>
        </div>
    )
}

Auth.propTypes = {
    registerMode: PropTypes.string.isRequired,

};