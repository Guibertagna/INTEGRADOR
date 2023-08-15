import { auth } from "../Services/FirebaseAuth";
import { useHistory } from "react-router-dom";
import { Link, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSignInWithEmailAndPassword, useAuthState } from "react-firebase-hooks/auth";
import { sendPasswordResetEmail } from "firebase/auth";

function Login() {

  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
    const [email, setEmail] = useState("");


  // Usamos o hook useAuthState para monitorar o estado de autenticação do usuário
  const [userAuth] = useAuthState(auth);

  useEffect(() => {
    startSessionTimer();
  }, []);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (typeof email === "string" && email.trim() !== "") {
      sendPasswordResetEmail(email)
        .then(() => {
          setMensagem(
            "Um e-mail com as instruções para redefinir sua senha foi enviado para " +
              email
          );
        })
        .catch((error) => {
          setMensagem(
            "Ocorreu um erro ao tentar enviar o e-mail de redefinição de senha: " +
              error.message
          );
        });
    } else {
      setMensagem("Por favor, informe um endereço de e-mail válido.");
    }
    
    sendPasswordResetEmail(auth, email)
      
    .then(() => {
        setMensagem(
          "Um e-mail com as instruções para redefinir sua senha foi enviado para " +
            email
        );
      })
      .catch((error) => {
        setMensagem(
          "Ocorreu um erro ao tentar enviar o e-mail de redefinição de senha: " +
            error.message
        );
      });
  };

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
        const user = userCredential.user;
        if (user.email === "emailcorreto@example.com" && user.senha === "senhacorreta") {
          localStorage.setItem("user", JSON.stringify(user));
          history.push("/Home");
          setLoggedIn(true);
        } else {
          window.alert("Logado com sucesso!");
        }
      })
      .catch((error) => {
        window.alert("Erro ao autenticar usuário: ");
      });
  }
  

  // Se o usuário já estiver autenticado, redireciona para a página de gastos
  if (userAuth) {
    return <Redirect to="/Home" />;
  }

  if (loading) {
    return alert("Inicializando sessão!")
  }

  if (user) {
    console.log(user);
  }

  return (
    <div className="containerr">
      <div className="contente_login">
        <div className="login">
          {forgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <h2>Esqueceu sua senha?</h2>
              <p>
                <label htmlFor="email">E-mail:</label>
                <input
                  id="email"
                  name="email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </p>
              <p>
                <input type="submit" value="Enviar link para redefinição de senha" />
              </p>
              <p className="link_l">
                Lembrou da senha?{" "}
                <a href="#" onClick={() => setForgotPassword(false)}>
                  Faça login
                </a>
              </p>
            </form>
          ) : (
            <form onSubmit={(e) => handleSingIn(e)}>
              <h2>L O G I N</h2>
              <p>
                <label htmlFor="email_login">E-mail:</label>
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
                <label htmlFor="senha_login">Senha:</label>
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
                <input type="submit" value="Logar" />
              </p>
              <p className="link_l">
                Ainda não tem conta?{" "}
                <Link to="/Cadastro">
                  <span>Cadastre-se</span>
                </Link>
              </p>
              <p className="link_r">
                <a href="#" onClick={handleForgotPassword}>
                  Esqueceu sua senha?
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
  }
  export default Login;