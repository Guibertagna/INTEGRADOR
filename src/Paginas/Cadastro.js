import { Link } from 'react-router-dom';
import "../CSS/Cadastro.css";
import { app } from "../Services/FirebaseConfig";
import { auth } from "../Services/FirebaseAuth";
import { collection, getFirestore, getDocs, addDoc, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Redirect } from 'react-router-dom';



// importar o módulo firebase/auth
import { createUserWithEmailAndPassword } from "firebase/auth";

export const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [users, setUsers] = useState([]);
  const [cadastradoComSucesso, setCadastradoComSucesso] = useState(false);


  const db = getFirestore(app);
  const userCollectionRef = collection(db, "users");

  async function CriarSexo(e) {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, senha);

      const userWithEmail = await getDocs(
        query(userCollectionRef, where("email", "==", email))
      );
      const userWithCPF = await getDocs(
        query(userCollectionRef, where("cpf", "==", cpf))
      );

      if (userWithEmail.docs.length > 0) {
        alert("Já existe um usuário com esse email cadastrado");
      } else if (userWithCPF.docs.length > 0) {
        alert("Já existe um usuário com esse CPF cadastrado");
      } else {
        await addDoc(userCollectionRef, {
          nome,
          email,
          cpf,
          telefone,
          senha,
        });
      
        setCadastradoComSucesso(true);

        alert('Dados gravados com sucesso!');
      }
    } catch (error) {
      alert(`Erro ao criar usuário: ${error.message}`);
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
    }
    getUsers();
  }, []);
    return(
        <div className="containerr" >
        <div className="contente_cadastro">      
          <div className="cadastro">
            <form onSubmit={(e) => CriarSexo(e)}> 
            {cadastradoComSucesso && <Redirect to="/home" />}

              <h2>C A D A S T R O</h2> 
               
              <p> 
                <label for="nome_cad">Nome: </label>
                <input id="nome" name="nome" required="required" value={nome} placeholder="Digite seu nome..." onChange={(e) =>setNome(e.target.value)}/>
              </p>
               
              <p> 
                <label for="email_cad">E-mail: </label>
                <input id="email" name="email" required="required" value={email} placeholder="Digite seu emai..." onChange={(e) =>setEmail(e.target.value)}/> 
              </p>
  
              <p>
              <label for="cpf_cad">CPF:  </label>
              <input id="cpf" name="cpf" required="required" value={cpf} placeholder="Somente numeros..." maxlength="11" minlength="11" onChange={(e) =>setCpf(e.target.value)}/> 
            </p>
  
            <p>
              <label for="cpf_cad">Telefone:  </label>
              <input id="tel" name="tel" required="required" type="tel" value={telefone} placeholder="(xx) xxxxx-xxxx"onChange={(e) =>setTelefone(e.target.value)}/> 
            </p>
               
              <p> 
                <label for="senha_cad">Senha: </label>
                <input id="senha" name="senha" required="required" type="password" value={senha} placeholder="********" onChange={(e) =>setSenha(e.target.value)}/>
              </p>
               
              <p> 
              <input type="submit" value="Cadastrar"/> 
              </p>
               
              <p className="link_c">  
                Já tem conta?
                <Link to="/Login"><span>Login</span></Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    )
}

