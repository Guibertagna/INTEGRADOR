import { Link, Redirect } from "react-router-dom";
import "../CSS/Cadastro.css";
import { useState, useEffect } from "react";
import {
  useSignInWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth";
import { auth } from "../Services/FirebaseAuth";
import { useHistory } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const history = useHistory();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  // Usamos o hook useAuthState para monitorar o estado de autenticação do usuário
  const [userAuth] = useAuthState(auth);

  useEffect(() => {
    startSessionTimer();
  }, []);

  function startSessionTimer() {
    // Verifica se já existe um temporizador na sessão
    const timerId = sessionStorage.getItem("timerId");
    if (timerId) {
      clearInterval(timerId); // Limpa o temporizador anterior
    }
    const newTimerId = setInterval(() => {
      // Verifica se o usuário está autenticado antes de redirecioná-lo para a página de login
      if (auth.currentUser) {
        auth.signOut(); // Faz o logout automático
        history.push("/Login"); // Redireciona para a página de login
      }
    }, 10 * 60 * 1000); // 10 minutos em milissegundos

    // Guarda o ID do intervalo na sessão
    sessionStorage.setItem("timerId", newTimerId);
  }

  function handleSingIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        setMensagem("Usuário autenticado com sucesso!");
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify(user));
        history.push("/Gastos");
      })
      .catch((error) => {
        setMensagem("Erro ao autenticar usuário: " + error.message);
      });
  }

  // Se o usuário já estiver autenticado, redireciona para a página de gastos
  if (userAuth) {
    return <Redirect to="/Gastos" />;
  }

  if (loading) {
    return <p>carregando...</p>;
  }

  if (user) {
    console.log(user);
  }

    return (
      <div className="containerr">
        <div className="contente_login">
          <div className="login">
            <form onSubmit={(e) => handleSingIn(e)}>
              <h2>L O G I N</h2>
              {mensagem && <p>{mensagem}</p>}
              <p>
                <label htmlFor="email_login"> E-mail: </label>
                <input
                  id="email"
                  name="email"
                  required
                  value={email}
                  placeholder="Digite seu email..."
                  onChange={(e) => setEmail(e.target.value)}
                />
              </p>
              <p>
                <label htmlFor="senha_login">Senha: </label>
                <input
                  id="senha"
                  name="senha"
                  required
                  type="password"
                  value={senha}
                  placeholder="Digite sua senha..."
                  onChange={(e) => setSenha(e.target.value)}
                />
              </p>
              <p>
                <input type="checkbox" name="manterlogado" id="manterlogado" value="" />
                <label htmlFor="manterlogado">Manter-me logado</label>
              </p>
              <p>
                <input type="submit" value="Logar"/>
              </p>
              <p className="link_l">
                Ainda não tem conta?  <Link to="/Cadastro"><span>Cadastre-se</span></Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  export default Login;
