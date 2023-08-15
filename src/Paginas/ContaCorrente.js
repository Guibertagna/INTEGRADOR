import '../CSS/ContaCorrente.css';
import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, where, query, getDocs } from "firebase/firestore";
import { app } from '../Services/FirebaseConfig';
import { auth } from '../Services/FirebaseAuth';
import { useHistory } from 'react-router-dom';


function ContaCorrente() {
  const history = useHistory();
  const [contaCorrenteExistente, setContaCorrenteExistente] = useState(false);

  useEffect(() => {
    const db = getFirestore(app);
    if (!auth.currentUser) {
      return;
    }
    const contaCorrenteQuery = query(collection(db, "contaCorrente"), where("email", "==", auth.currentUser.email));
    getDocs(contaCorrenteQuery)
      .then((querySnapshot) => {
        setContaCorrenteExistente(!querySnapshot.empty);
      })
      .catch((error) => {
        console.error("Erro ao verificar existência de conta corrente:", error);
        window.alert("Erro ao verificar existência de conta corrente");
      });
  }, []);
  

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      window.alert("Faça login para salvar os dados!");
      return;
    }
  
    const db = getFirestore();
    const contaCorrenteCollectionRef = collection(db, "contaCorrente");
  
    // Verificar se já existe uma conta corrente para o usuário atual
    const contaCorrenteQuery = query(contaCorrenteCollectionRef, where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(contaCorrenteQuery);
    if (!querySnapshot.empty) {
      window.alert("Você já possui uma conta corrente cadastrada!");
      return;
    }

  const nomeBanco = document.getElementById("iNBanco").value;
  const rendaMensal = Number(document.getElementById("iRMensal").value);
  const data = document.getElementById("iData").value;

  // Adicionar alerta de confirmação aqui
  if (window.confirm("Tem certeza que deseja salvar esses dados?")) {
    try {
      await addDoc(contaCorrenteCollectionRef, {
        nomeBanco,
        rendaMensal: Number(rendaMensal),
        data,
        rendaTotal: Number(rendaMensal),
        email: auth.currentUser.email,
      });
      window.alert("Dados salvos com sucesso!");
      setContaCorrenteExistente(true);
      history.push('/home');
    } catch (error) {
      window.alert("Erro ao salvar dados:", error);
    }
  }
};

  return (
    <div className="fundo_CC">
      <div className="form">
        <h1>Renda Bruta</h1>
        <p>
          <label htmlFor="iNBanco">Nome Banco</label>
          <input className="NBanco" id="iNBanco" placeholder="Digite o nome do seu Banco" />
        </p>
        <p>
          <label htmlFor="iRMensal">Renda Mensal</label>
          <input 
         className="NBanco" 
         id="iRMensal" 
         placeholder="Digite sua renda mensal fixa" 
         type="number"
         min="0"
         step="0.01"
         required
       />
</p>
<p>
<label htmlFor="iData">Data</label>
<input type="date" className="Data" id="iData" />
</p>
<p>
<input type="submit" className="btCC" value="Salvar" onClick={handleSalvar} />
</p>
</div>
</div>
);
}

export default ContaCorrente;





