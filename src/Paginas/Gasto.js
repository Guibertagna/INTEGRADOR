import '../CSS/Gasto.css'
import { app } from "../Services/FirebaseConfig";
import { auth } from "../Services/FirebaseAuth";
import { collection, getFirestore, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';

function Gasto() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [tipoDeGasto, setTipoDeGasto] = useState("fixo");

  const db = getFirestore(app);
  const gastosCollectionRef = collection(db, "gastos");
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    // Observa o estado de autenticação do usuário
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // O usuário está logado, então você pode obter o ID e o email dele
        const userId = user.uid;
        const userEmail = user.email;
        
        // Armazena o ID do usuário em um estado local
        setUser({id: userId, email: userEmail});
      } else {
        // O usuário não está logado, então limpa o ID e email armazenados
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const [user, setUser] = useState(null);

  async function GravarGastos(data) {
    setSubmitting(true);
    try {
      if (user) {
        // Adiciona o ID e o email do usuário nos dados dos gastos
        data.userId = user.id;
        data.email = user.email;
  
        // Verifica o tipo de gasto selecionado
        const tipoGasto = tipoDeGasto === "fixo" ? "fixo" : "variavel";
        data.tipoGasto = tipoGasto;
  
        // Calcula o valor da variável gasto_medio com base no tipo de gasto
        const valorMax = parseFloat(data.valor_max);
        const valorMin = parseFloat(data.valor_min);
        const gastoMedio = tipoGasto === "fixo" ? valorMax : (valorMax + valorMin)/2;
        data.gasto_medio = gastoMedio;
  
        // Adiciona os dados dos gastos à coleção
        const docRef = await addDoc(gastosCollectionRef, data);
        if (docRef) {
          const gastoId = docRef.id;
          // Cria uma referência para o documento do usuário
          const userRef = doc(usersCollectionRef, user.id);
  
          // Adiciona o ID do gasto na lista de gastos do usuário
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userData.gastos.push(gastoId);
            await setDoc(userRef, userData);
          } else {
            const userData = { gastos: [gastoId] };
            await setDoc(userRef, userData);
          }
          alert("Dados gravados com sucesso!");
        } else {
          alert("Erro ao gravar os dados: documento não encontrado");
        }
      } else {
        alert("Usuário não está autenticado");
      }
    } catch (error) {
      alert("Erro ao gravar os dados: " + error.message);
    }
    setSubmitting(false);
  }
  
  function handleTipoDeGastoChange(event) {
    setTipoDeGasto(event.target.value);
  }

  return (
    <div className="fundo_gasto">
      <form onSubmit={handleSubmit(GravarGastos)}>
        <div className="formu">
          <h1>G a s t o s</h1>
          <p>
  <label htmlFor="titulo">Titulo</label>
  <input
    className="Titulo"
    id="titulo"
    placeholder="Insira titulo do Gasto"
    {...register("titulo", { required: true })}
  />
  {errors.titulo && (
    <span className="error">Este campo é obrigatório</span>
  )}
</p>
<p>
  <label htmlFor="valor_max">Valor Maximo Pago</label>
  <input
    className="VMaximo"
    id="valor_max"
    placeholder="Insira o Valor Maximo"
    {...register("valor_max", { required: true })}
  />
  {errors.valor_max && (
    <span className="error">Este campo é obrigatório</span>
  )}
</p>
<p>
  <label htmlFor="valor_min">Valor Minimo Pago</label>
  <input
    className="VMinimo"
    id="valor_min"
    placeholder="Insira o Valor Minimo"
    {...register("valor_min", { required: true })}
  />
  {errors.valor_min && (
    <span className="error">Este campo é obrigatório</span>
  )}
</p>
<p>
  <label htmlFor="data_deb">Data a ser debitado</label>
  <input
    type="date"
    className="DtDebito"
    id="data_deb"
    {...register("data_deb", { required: true })}
  />
  {errors.data_deb && (
    <span className="error">Este campo é obrigatório</span>
  )}
</p>
<fieldset className="tipoGasto">
  <label htmlFor="tipoGasto">Tipo de Gasto: </label>
<select id="tipoGasto" name="tipoGasto" onChange={handleTipoDeGastoChange}>
  <option value="fixo">Fixo</option>
  <option value="variável">Variável</option>
</select>
</fieldset>

<p>
  <input type="submit" value="Criar" />
</p>
                </div>
            </form>
        </div>
    )
}

export default Gasto