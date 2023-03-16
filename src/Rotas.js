
import { Route, BrowserRouter, Switch} from "react-router-dom";
import Gasto from "./Paginas/Gasto";
import ContaCorrente from "./Paginas/ContaCorrente";
import {Cadastro} from "./Paginas/Cadastro";
import Login from "./Paginas/Login";
import Cofrinho from "./Paginas/Cofrinho";
import Cabecalho from "./Cabecalho_Rodape/Cabecalho";
import Rodape from "./Cabecalho_Rodape/Rodape";
import { getAuth } from "firebase/auth";
import { Redirect } from "react-router-dom";
import HomePage from "./Paginas/HomePage";
import { useState, useEffect } from "react";

const PrivateRoute = ({ component: Component, isLogin, ...rest }) => {
  const [authenticated, setAuthenticated] = useState("");
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user =  getAuth().currentUser;
        setAuthenticated(!!user);
      } catch (error) {
        console.log(error);
      }
    };
    checkAuth();
  }, []);
  
  if (authenticated === "") {
    return <div>Loading...</div>;
  }
  
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin || authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/Login" />
        )
      }
    />
  );
};
  
const Rotas = () => {
  return (
      <BrowserRouter>
       <div>
          <Cabecalho/>
        </div>
        <Switch>
          <Route path="/login" component={Login} />
          <Route exact path="/" component={HomePage}/>
          <Route path="/Cadastro" component={Cadastro}/>
          <PrivateRoute  path="/ContaCorrente" component={ContaCorrente} isLogin={false} />
          <PrivateRoute path="/Gastos" component={Gasto} isLogin={false} />
          <PrivateRoute path="/Cofrinho" component={Cofrinho} isLogin={false} />
        </Switch>
        <div>
          <Rodape/>
        </div>
      </BrowserRouter>
    );
  };
  
export default Rotas;