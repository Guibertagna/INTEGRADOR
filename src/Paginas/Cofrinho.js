import { useState } from "react";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {app} from "../Services/FirebaseConfig";
import "../CSS/Cofrinho.css";
import { useHistory } from 'react-router-dom';


function Cofrinho() {
  const history = useHistory();
  const [nomeCofrinho, setNomeCofrinho] = useState("");
  const [descricaoCofrinho, setDescricaoCofrinho] = useState("");
  const [valorMensalCofrinho, setValorMensalCofrinho] = useState(0);
  const [metaCofrinho, setMetaCofrinho] = useState(0);
  const [valorMensalValido, setValorMensalValido] = useState(true);
  const [erro, setErro] = useState("");

  const handleChangeNomeCofrinho = (event) => {
    setNomeCofrinho(event.target.value);
  };

  const handleChangeDescricaoCofrinho = (event) => {
    setDescricaoCofrinho(event.target.value);
  };

  const handleChangeValorMensalCofrinho = (event) => {
    const valor = event.target.value;
    setValorMensalCofrinho(valor);
    setValorMensalValido(valor <= metaCofrinho);
  };

  const handleChangeMetaCofrinho = (event) => {
    const valor = event.target.value;
    setMetaCofrinho(valor);
    setValorMensalValido(valor >= valorMensalCofrinho);
  };

  const handleCriarCofrinho = async (e) => {
    e.preventDefault();
  
    const auth = getAuth(app);
    const db = getFirestore(app);
    const cofrinhoCollectionRef = collection(db, "cofrinho");
    const user = auth.currentUser;
  
    if (!user) {
      window.alert("Usuário não autenticado.");
      return;
    }
  
    // Verifique se o usuário já tem um cofrinho
    const cofrinhosDoUsuario = await getDocs(
      query(cofrinhoCollectionRef, where("userId", "==", user.uid))
    );
  
    if (cofrinhosDoUsuario.docs.length > 0) {
      // o usuário já tem um cofrinho, exiba uma mensagem de erro
      window.alert("Você já tem um cofrinho cadastrado.");
      return;
    }
  
    if (Number(valorMensalCofrinho) >= Number(metaCofrinho)) {
      window.alert("O valor depositado não pode ser maior ou igual que a meta.");
      return;
    }
  
    try {
      const docRef = await addDoc(cofrinhoCollectionRef, {
        nomeCofrinho,
        descricaoCofrinho,
        valorMensalCofrinho: Number(valorMensalCofrinho), // aqui é feita a conversão para número
        metaCofrinho: Number(metaCofrinho),
        userId: user.uid,
        userEmail: user.email,
      });
  
      console.log("Cofrinho adicionado com ID: ", docRef.id);
      setErro("");
      window.alert("Dados gravados com sucesso!"); // Adicione esta linha para exibir um alerta
      history.push("/home");
    } catch (error) {
      console.error("Erro ao adicionar cofrinho: ", error);
      setErro("Erro ao adicionar cofrinho. Tente novamente mais tarde.");
      window.alert("Erro ao gravar os dados. Tente novamente mais tarde."); // Adicione esta linha para exibir um alerta
    }
  };
  
  return (
    <div className="fundo_cofrinho">
      <div className="corpo_cofrinho">
      <form onSubmit={(e) => handleCriarCofrinho(e)}>
        <h2>C o f r i n h o</h2>
        <p>
          <label htmlFor="nomeCofrinho">Nome do Cofrinho </label>
         
          <input
      type="text"
      id="nomeCofrinho"
      value={nomeCofrinho}
      onChange={handleChangeNomeCofrinho}
      placeholder="Insira o nome do cofrinho"
      required
    />
    </p>
    <p>
      <label htmlFor="descricaoCofrinho">Descrição do Cofrinho </label>
      <input
        type="text"
        id="descricaoCofrinho"
        value={descricaoCofrinho}
        onChange={handleChangeDescricaoCofrinho}
        placeholder="Insira uma breve descrição"
        required
      />
    </p>
    <p>
  <label htmlFor="valorMensalCofrinho">Valor inicial a ser depositado: </label>
  <input
    type="number"
    id="valorMensalCofrinho"
    value={valorMensalCofrinho}
    onChange={handleChangeValorMensalCofrinho}
    placeholder="Insira o valor inicial que deseja colocar no cofrinho..."
    required
  />
  {!valorMensalValido && (
    <span className="erro">O valor depositado não pode ser maior ou igual que a meta.</span>
  )}
</p>
    <p>
      <label htmlFor="metaCofrinho">
        Meta que deseja alcançar: {" "}
      </label>
      <input
        type="number"
        id="metaCofrinho"
        value={metaCofrinho}
        onChange={handleChangeMetaCofrinho}
        placeholder="Insira o valor que deseja alcançar com a economia..."
        required
      />
    </p>
    {erro && <p className="erro">{erro}</p>}
      <input type="submit" value="Criar Cofrinho"/>
      </form>
  </div>
</div>
);
}

export default Cofrinho;