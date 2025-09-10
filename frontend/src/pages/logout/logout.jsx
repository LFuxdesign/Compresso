import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context-provider/authContextInstance';
import './logout.css'; // importa o CSS

function Logout() {
    const navigate = useNavigate();
    const { clearUserData } = useContext(AuthContext);
    const messageRef = useRef(null);

    useEffect(() => {
        const fazerLogout = async () => {
            clearUserData();
            try {
                await axios.post('/api/user/logout', {}, { withCredentials: true }).then(() => {
                    navigate("/", { replace: true });
                });
            } catch (error) {
                console.error('Erro ao sair:', error);
                if (error.response.status === 401) {
                    messageRef.current.textContent = 'Você não está logado.';
                    navigate("/", { replace: true });
                } else {
                    messageRef.current.textContent = 'Erro ao sair. Por favor, tente novamente mais tarde.';
                }
            }
        };

        fazerLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return (
        <div className="logout-container">
            <div className="logout-content">
                <div className="spinner"></div>
                <h1>Saindo da conta...</h1>
                <p ref={messageRef}>Você será redirecionado em instantes.</p>
            </div>
        </div>
    );
}

export default Logout;
