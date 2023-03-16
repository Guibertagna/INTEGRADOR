import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {app} from "../Services/FirebaseConfig";
import "../CSS/Cofrinho.css";


function Cofrinho() {
  const [nomeCofrinho, setNomeCofrinho] = useState("");
  const [descricaoCofrinho, setDescricaoCofrinho] = useState("");
  const [valorMensalCofrinho, setValorMensalCofrinho] = useState("");
  const [tempoCofrinho, setTempoCofrinho] = useState("");
  const [jurosBancoCofrinho, setJurosBancoCofrinho] = useState("");
  const [erro, setErro] = useState("");

  const handleChangeNomeCofrinho = (event) => {
    setNomeCofrinho(event.target.value);
  };

  const handleChangeDescricaoCofrinho = (event) => {
    setDescricaoCofrinho(event.target.value);
  };

  const handleChangeValorMensalCofrinho = (event) => {
    setValorMensalCofrinho(event.target.value);
  };

  const handleChangeTempoCofrinho = (event) => {
    setTempoCofrinho(event.target.value);
  };

  const handleChangeJurosBancoCofrinho = (event) => {
    setJurosBancoCofrinho(event.target.value);
  };

  const handleCriarCofrinho = async () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const cofrinhoCollectionRef = collection(db, "cofrinho");
    const user = auth.currentUser;
  
    if (!user) {
      setErro("Usuário não autenticado.");
      return;
    }
  
    try {
      const docRef = await addDoc(cofrinhoCollectionRef, {
        nomeCofrinho,
        descricaoCofrinho,
        valorMensalCofrinho,
        tempoCofrinho,
        jurosBancoCofrinho,
        userId: user.uid,
        userEmail: user.email,
      });
  
      console.log("Cofrinho adicionado com ID: ", docRef.id);
      setErro("");
      window.alert("Dados gravados com sucesso!"); // Adicione esta linha para exibir um alerta
    } catch (error) {
      console.error("Erro ao adicionar cofrinho: ", error);
      setErro("Erro ao adicionar cofrinho. Tente novamente mais tarde.");
      window.alert("Erro ao gravar os dados. Tente novamente mais tarde."); // Adicione esta linha para exibir um alerta
    }
  };
  return (
    <div className="fundo_cofrinho">
      <div className="corpo_cofrinho">
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
      <label htmlFor="valorMensalCofrinho">Valor Mensal do Cofrinho </label>
      <input
        type="number"
        id="valorMensalCofrinho"
        value={valorMensalCofrinho}
        onChange={handleChangeValorMensalCofrinho}
        placeholder="Insira o valor mensal que deseja poupar"
        required
      />
    </p>
    <p>
      <label htmlFor="tempoCofrinho">Tempo do Cofrinho (em meses) </label>
      <input
        type="number"
        id="tempoCofrinho"
        value={tempoCofrinho}
        onChange={handleChangeTempoCofrinho}
        placeholder="Insira a quantidade de meses"
        required
      />
    </p>
    <p>
      <label htmlFor="jurosBancoCofrinho">
        Juros do Banco (em %){" "}
      </label>
      <input
        type="number"
        id="jurosBancoCofrinho"
        value={jurosBancoCofrinho}
        onChange={handleChangeJurosBancoCofrinho}
        placeholder="Insira o valor dos juros"
        required
      />
    </p>
    {erro && <p className="erro">{erro}</p>}
    <button className="botao_cofrinho" onClick={handleCriarCofrinho}>
      Criar Cofrinho
    </button>
  </div>
</div>
);
}

export default Cofrinho;