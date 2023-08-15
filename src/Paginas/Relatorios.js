import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from "../Services/FirebaseConfig";
import { auth } from "../Services/FirebaseAuth";
import "../CSS/Relatorio.css";
import { deleteDoc, doc } from 'firebase/firestore';
import { Chart } from 'react-google-charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTrashAlt,faTimesCircle } from '@fortawesome/free-solid-svg-icons';


function ProgressBar(props) {
  return (
    <div classNameName="progress-bar-container">
      <div classNameName="progress-bar" style={{ width: `${props.progresso}%` }}>
        {props.progresso.toFixed(2)}%
      </div>
    </div>
  );
}



function PieChart({ gastos }) {
  const data = [
    ['Título', 'Gasto Médio'],
    ...gastos.map(gasto => [gasto.titulo, gasto.gasto_medio])
  ];

  const options = {
    title: 'Grafico referente a todos os gastos do usuário'
  };

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width="100%"
      height="400px"
      legendToggle
    />
  );
}

function Relatorios() {
  const [cofrinhos, setCofrinhos] = useState([]);
  const [contaCorrente, setContaCorrente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gastos, setGastos] = useState(null); 
  const [progresso, setProgresso] = useState(0);
  const [gastos_totais, setGastosTotais] = useState(0);
  const db = getFirestore(app);
  
  

  const fetchGastos = async () => {
    try {
      const user = auth.currentUser;
      const qGastos = query(collection(db, 'gastos'), where("email", "==", user.email));
  
      const querySnapshotGastos = await getDocs(qGastos);
      const dataGastos = querySnapshotGastos.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      setGastos(dataGastos);
  
      let total = 0; // 1. Inicialize a variável `total` como zero
      dataGastos.forEach(doc => {
        total += doc.gasto_medio; // 3. Some o valor de cada documento à variável `total`
      });
  
      setGastosTotais(total); // 4. Atualize o estado de `gastos_totais`
    } catch (err) {
      console.error("Erro ao buscar dados dos Gastos:", err);
      setError(err);
    }
  };
  
  function handleDeleteGasto(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este gasto?");
    if (confirmDelete) {
      const gastoRef = doc(db, "gastos", id);
      deleteDoc(gastoRef)
        .then(() => {
          alert("Documento deletado com sucesso!");
          window.location.reload(); // atualiza a página após a exclusão
        })
        .catch((error) => {
          alert("Erro ao deletar documento: ", error);
        });
    }
  }

  const fetchCofrinhos = async () => {
    try {
      const user = auth.currentUser;
      const qCofrinho = query(collection(db, 'cofrinho'), where("userEmail", "==", user.email));

      const querySnapshotCofrinho = await getDocs(qCofrinho);
      const dataCofrinho = querySnapshotCofrinho.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCofrinhos(dataCofrinho);
    } catch (err) {
      console.error("Erro ao buscar dados do cofrinho:", err);
      setError(err);
    }
  };

  const fetchContaCorrente = async () => {
    try {
      const user = auth.currentUser;
      const qContaCorrente = query(collection(db, 'contaCorrente'), where("email", "==", user.email));

      const querySnapshotContaCorrente = await getDocs(qContaCorrente);
      const dataContaCorrente = querySnapshotContaCorrente.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setContaCorrente(dataContaCorrente[0]);
    } catch (err) {
      console.error("Erro ao buscar dados da renda bruta:", err);
      setError(err);
    }
  };
  useEffect(() => {
    if (cofrinhos.length > 0) {
      const valorAcumulado = cofrinhos[0]?.valorMensalCofrinho;
      const valorTotal = cofrinhos[0]?.metaCofrinho;
      const porcentagem = (valorAcumulado / valorTotal) * 100;
      setProgresso(porcentagem);
    }
  }, [cofrinhos, contaCorrente, cofrinhos[0]?.valorMensalCofrinho]);
  useEffect(() => {
    const user = auth.currentUser;
    
    if (user) {
      Promise.all([fetchGastos(), fetchCofrinhos(), fetchContaCorrente()])
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [db, auth.currentUser]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Ocorreu um erro ao buscar os dados.</div>;
  }

 function handleDeleteCofrinho(id) {
  const cofrinhoRef = doc(db, "cofrinho", id);
  if (window.confirm("Tem certeza que deseja deletar este cofrinho?")) {
    deleteDoc(cofrinhoRef)
      .then(() => {
        alert("Cofrinho deletado com sucesso!");
        window.location.reload();
      })
      .catch((error) => {
        alert("Erro ao deletar cofrinho: ", error);
      });
  }
}

function handleDeleteContaCorrente(id) {
  const contaCorrenteRef = doc(db, "contaCorrente", id);
  if (window.confirm("Tem certeza que deseja deletar esta renda?")) {
    deleteDoc(contaCorrenteRef)
      .then(() => {
        alert("Renda bruta deletada com sucesso!");
        window.location.reload();
      })
      .catch((error) => {
        alert("Erro ao deletar conta corrente: ", error);
      });
  }
}
  
  function BarChart({ gastos_totais, rendaTotal }) {
    const data = [    ['Categoria', 'Valor', { role: 'style' }],
      ['Gastos', gastos_totais, 'red'],
      ['Renda Total', rendaTotal, 'green']
    ];
  
    const options = {
      title: 'Relação entre a Renda Total e os Gastos totais do usuário',
      legend: { position: 'none' },
      hAxis: { title: 'Categoria' },
      vAxis: { title: 'Valor' },
      colors: ['red', 'green']
    };
  
    return (
      <Chart
        chartType="BarChart"
        data={data}
        options={options}
        width="100%"
        height="400px"
        legendToggle
      />
    );
  }

  return (
    <div className='fundoRlt'>
    <div className="realtorio-container">
      <div className="cofrinho-info">
        <h2>Informações Cofrinho</h2>
        <p>Nome: {cofrinhos[0]?.nomeCofrinho}</p>
        <p>Valor Mensal: {cofrinhos[0]?.valorMensalCofrinho}</p>
        <p>Descrição: {cofrinhos[0]?.descricaoCofrinho}</p>
        <p>Meta: {cofrinhos[0]?.metaCofrinho}</p>
        <p>Progresso: {progresso.toFixed(2)}%</p>
        <div className="delete-container">
          <button onClick={() => handleDeleteCofrinho(cofrinhos[0].id)} className="delete-button" style={{ backgroundColor: 'transparent', border: 'none' }}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      <div className="conta-corrente-info">
        <h2>Informações Renda Bruta</h2>
        <p>Nome Banco: {contaCorrente && contaCorrente.nomeBanco}</p>
        <p>Renda Mensal: {contaCorrente && contaCorrente.rendaMensal}</p>
        <p>Renda Total: {contaCorrente && contaCorrente.rendaTotal}</p>
        <p>Data: {contaCorrente && contaCorrente.data}</p>
        {gastos && contaCorrente &&
          <div>
          </div>
        }
        <div className="delete-container">
          <button onClick={() => handleDeleteContaCorrente(contaCorrente.id)} className="delete-button" style={{ backgroundColor: 'transparent', border: 'none' }}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      <div className="gastos-info">
  <h2>Informações de Gastos</h2>
  {gastos && gastos.map(gasto => (
    <div className="gasto-container">
      <table className="gastos-tabela">
        <tbody>
          <tr>
            <th>Título:</th>
            <td>{gasto.titulo}</td>
          </tr>
          <tr>
            <th>Tipo de Gasto:</th>
            <td>{gasto.tipoGasto}</td>
          </tr>
          <tr>
            <th>Data a ser debitado:</th>
            <td>{gasto.data_deb}</td>
          </tr>
          <tr>
            <th>Valor médio:</th>
            <td>{gasto.gasto_medio}</td>
          </tr>
          <tr>
            <td>
              <button onClick={() => handleDeleteGasto(gasto.id)} className="delete-button" style={{ backgroundColor: 'transparent', border: 'none' }}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ))}
  <div>
    <div>
      <PieChart gastos={gastos} />
      <BarChart rendaTotal={contaCorrente && contaCorrente.rendaTotal} gastos_totais={gastos_totais}/>
    </div>
  </div>
  <div>
    <p>Gastos Totais: {gastos_totais}</p>
  </div>
</div>
</div>
</div>
);
}

export default Relatorios;