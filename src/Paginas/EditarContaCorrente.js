import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

import { app } from "../Services/FirebaseConfig";
import { auth } from "../Services/FirebaseAuth";
import "../CSS/EditarCorrente.css";
import { useHistory } from 'react-router-dom';

function EditarContaCorrente() {
  const history = useHistory();
  const db = getFirestore(app);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = auth.currentUser;
  const [contaCorrente, setContaCorrente] = useState({});
  const [nomeBanco, setNomeBanco] = useState("");
  const [rendaMensal, setRendaMensal] = useState("");
  const [rendaTotal, setRendaTotal] = useState("");
  const [data, setData] = useState("");
  const [editingField, setEditingField] = useState("");

  const fetchContaCorrente = async () => {
    try {
      const qContaCorrente = query(collection(db, 'contaCorrente'), where("email", "==", user.email));
      const querySnapshotContaCorrente = await getDocs(qContaCorrente);
      const [dataContaCorrente] = querySnapshotContaCorrente.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContaCorrente(dataContaCorrente);
      setNomeBanco(dataContaCorrente.nomeBanco);
      setRendaMensal(dataContaCorrente.rendaMensal);
      setRendaTotal(dataContaCorrente.rendaTotal);
      setData(dataContaCorrente.data);
    } catch (err) {
      console.error("Erro ao buscar dados da renda", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateRendaTotal = (newRendaMensal) => {
    if(rendaMensal== NaN){
      rendaMensal=0;
    }
    const oldRendaMensal = contaCorrente.rendaMensal;
    const difference = newRendaMensal - oldRendaMensal;
    const currentRendaTotal = contaCorrente.rendaTotal;
    const newRendaTotal = currentRendaTotal + difference;
    setRendaTotal(newRendaTotal);
  };
  

  useEffect(() => {
    if (user) {
      fetchContaCorrente();
    }
  }, [user]);

  const handleFieldClick = (fieldName) => {
    setEditingField(fieldName);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Verifica se os valores de rendaMensal e rendaTotal são nulos ou vazios
    if (!rendaMensal || !rendaTotal) {
      // Define os valores como zero
      setRendaMensal(0);
      setRendaTotal(0);
    }
    
    if (isNaN(rendaMensal) || isNaN(rendaTotal)) {
      alert("Por favor, preencha os campos de renda mensal e renda total corretamente.");
      return;
    }
      
    if (window.confirm("Tem certeza de que deseja atualizar os dados da conta corrente?")) {
      try {
        const contaCorrenteRef = doc(db, "contaCorrente", contaCorrente.id);
        await updateDoc(contaCorrenteRef, {
          nomeBanco,
          rendaMensal,
          rendaTotal: parseFloat(rendaTotal),
          data
        });
        alert("Dados atualizados com sucesso!");
        history.push("/home");
      } catch (err) {
        console.error("Erro ao atualizar dados da conta corrente:", err);
        setError(err);
      }
      setEditingField("");
    }
    
  };
  
  if (error) {
    window.alert("Voce não possui conta corrente... Redirecionando");
    history.push("/contaCorrente");
  }

  return (
    <div className='fundoECC'>
      <div className="info-container">
        <form onSubmit={handleSubmit}>
          <div className="info-box">
            <h1>Editar Renda</h1>
            <div className="form-group">
              <p>
                <label htmlFor="nomeBanco">Nome do banco:</label>
                <input
                  type="text"
                  id="nomeBanco"
                  className="nomeBanco"
                  value={nomeBanco}
                  onChange={(event) => setNomeBanco(event.target.value)}
                />
              </p>
              <p>
                <label htmlFor="rendaMensal">Renda mensal:</label>
                <input
                  type="text"
                  id="rendaMensal"
                  className="rendaMensal"
                  value={rendaMensal}
                  onChange={(event) => {
                    const newRendaMensal = parseFloat(event.target.value);
                    if (!newRendaMensal || isNaN(newRendaMensal)) {
                      setRendaMensal(0);
                    } else {
                      setRendaMensal(newRendaMensal);
                      calculateRendaTotal(newRendaMensal);
                    }
                  }}
                />
              </p>
              <p>
                <label htmlFor="data">Data:</label>
                <input
                  type="date"
                  id="data"
                  className="data"
                  value={data}
                  onChange={(event) => setData(event.target.value)}
                />
              </p>
            </div>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditarContaCorrente;