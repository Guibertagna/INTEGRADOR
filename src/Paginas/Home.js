import '../CSS/Home.css';
import { FaPiggyBank, FaDollarSign, FaMoneyBill } from 'react-icons/fa';
import { BiBarChartAlt } from 'react-icons/bi';
import React, { useState, useEffect } from 'react';
import { app } from '../Services/FirebaseConfig';
import {collection, getFirestore, getDocs, setDoc, query, where, updateDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import {BiX} from 'react-icons/bi'

function Home() {
  const [showAddRendaExtra, setShowAddRendaExtra] = useState(false);
  const [showAddCofrinho, setShowAddCofrinho] = useState(false);
  const [showResgateCofrinho, setShowResgateCofrinho] = useState(false);

  async function handleResgateCofrinhoSubmit(event) {
    event.preventDefault();
  
    const auth = getAuth(app);
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, 'users');
    const cofrinhoCollectionRef = collection(db, 'cofrinho');
    const user = auth.currentUser;
    const valor = parseFloat(event.target.elements.valorR.value);
  
    // Verificar se o valor é um número válido
    if (isNaN(valor)) {
      alert("Valor inválido. Por favor, insira um número.");
      return;
    }
  
    // Consultar a coleção "cofrinho" para encontrar o documento do cofrinho do usuário
    const cofrinhoQuerySnapshot = await getDocs(
      query(cofrinhoCollectionRef, where('userEmail', '==', user.email))
    );
  
    // Verificar se o documento do cofrinho foi encontrado e se o email do usuário corresponde ao campo "userEmail"
    if (cofrinhoQuerySnapshot.empty) {
      console.error("Cofrinho não encontrado ou usuário não corresponde ao email registrado");
      alert("Ocorreu um erro ao resgatar o valor.");
      return;
    }
  
    const cofrinhoDoc = cofrinhoQuerySnapshot.docs[0];
  
    if (cofrinhoDoc.data().userEmail !== user.email) {
      console.error("Cofrinho não encontrado ou usuário não corresponde ao email registrado");
      alert("Ocorreu um erro ao resgatar o valor.");
      return;
    }
  
    // Verificar se o valor a ser resgatado é maior do que o valor disponível no cofrinho
    if (valor > cofrinhoDoc.data().valorMensalCofrinho) {
      alert("O valor a ser resgatado é maior do que o valor disponível no cofrinho.");
      return;
    }
  
    // Subtrair valor do cofrinho existente
    const novoValorMensalCofrinho = cofrinhoDoc.data().valorMensalCofrinho - valor;
  
    // Atualizar o documento do cofrinho com o novo valor
    await updateDoc(cofrinhoDoc.ref, { valorMensalCofrinho: novoValorMensalCofrinho });
  
    // Fechar formulário de resgate do cofrinho
    setShowResgateCofrinho(false);
  
    // Exibir mensagem de sucesso
    alert("Valor resgatado com sucesso!");
  }
  
  
  async function handleAddCofrinhoSubmit(event) {
    event.preventDefault(event);
  
    const auth = getAuth(app);
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, 'users');
    const cofrinhoCollectionRef = collection(db, 'cofrinho');
    const user = auth.currentUser;
  
    // Obter valor inserido pelo usuário
    const valorInput = event.target.elements.valor;
    const valor = parseFloat(valorInput.value);
  
    // Verificar se o valor é um número válido
    if (isNaN(valor)) {
      // Exibir mensagem de erro
      alert("Por favor, insira apenas números no campo de valor.");
      return;
    }
  
    // Criar referência para a coleção "users" e recuperar documento do usuário atual
    const querySnapshot = await getDocs(
      query(usersCollectionRef, where('email', '==', user.email))
    );
    const doc = querySnapshot.docs[0];
  
    // Verificar se o documento foi encontrado
    if (doc) {
      // Criar referência para a coleção "cofrinho" e recuperar documento do cofrinho do usuário atual
      const cofrinhoQuerySnapshot = await getDocs(
        query(cofrinhoCollectionRef, where('userEmail', '==', user.email))
      );
      const cofrinhoDoc = cofrinhoQuerySnapshot.docs[0];
  
      // Verificar se o documento do cofrinho foi encontrado e se o email do usuário corresponde ao campo "userEmail"
      if (cofrinhoDoc && cofrinhoDoc.data().userEmail === user.email) {
        // Adicionar valor ao valorMensalCofrinho existente
        const novoValorMensalCofrinho =
          cofrinhoDoc.data().valorMensalCofrinho + valor;
  
        // Atualizar o documento com o novo valor
        await setDoc(
          cofrinhoDoc.ref,
          { valorMensalCofrinho: novoValorMensalCofrinho },
          { merge: true }
        );
  
        // Fechar formulário de adição de cofrinho
        setShowAddCofrinho(false);
  
        // Exibir mensagem de sucesso
        alert("Valor adicionado com sucesso!");
      } else {
        console.error(
          "Cofrinho não encontrado ou usuário não corresponde ao email registrado"
        );
  
        // Exibir mensagem de erro
        alert("Ocorreu um erro ao adicionar o valor.");
      }
    }
  }
  
  async function handleRendaExtraSubmit(event) {
    event.preventDefault(event);
  
    const auth = getAuth(app);
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, 'contaCorrente');
    const user = auth.currentUser;
  
    // Obter valor inserido pelo usuário e converter para Number
    const valor = Number(event.target.elements.valor.value);
  
    // Verificar se o valor é um número válido
    if (isNaN(valor)) {
      // Exibir mensagem de erro
      alert("Valor inválido. Por favor, insira um número.");
      return;
    }
  
    // Consultar contaCorrente para verificar se o usuário tem uma conta corrente
    const querySnapshot = await getDocs(
      query(usersCollectionRef, where('email', '==', user.email))
    );
  
    // Verificar se o usuário tem uma conta corrente
    if (!querySnapshot.empty) {
      // Obter o documento do usuário
      const userDoc = querySnapshot.docs[0];
  
      // Obter o valor atual de rendaMensal e rendaTotal e converter para Number
      const rendaMensal = Number(userDoc.data().rendaMensal);
      const rendaTotal = Number(userDoc.data().rendaTotal);
      // Calcular nova rendaTotal
      const novaRendaTotal = rendaTotal + valor;
  
      // Atualizar o documento do usuário com a nova rendaTotal e o valor inserido pelo usuário
      await updateDoc(userDoc.ref, { 
        rendaTotal: novaRendaTotal,
        valor: valor
      });
      
      // Exibir mensagem de sucesso
      alert(`Renda Total atualizada para R$ ${novaRendaTotal.toFixed(2)}`);
    } else {
      // Exibir mensagem de erro se o usuário não tiver uma conta corrente
      alert("Você não tem uma conta corrente. Por favor, crie uma conta corrente primeiro.");
      return;
    }
  }

  function handleAddCofrinhoClick() {
    setShowAddCofrinho(true);
  }

  function handleAddRendaExtraClick() {
    setShowAddRendaExtra(true);
  }

  async function handleResgateCofrinhoClick() {
    setShowResgateCofrinho(true);
  }
  
  return(
    <section id="corpo-full">
      <div id="corpo-sup">
        <div id="parteSuperior">
          <h1>A maneira mais fácil de gerenciar finanças pessoais</h1>
          <p>O gerenciador de gastos que você precisava a um click que distancia, adicione seu gastos, lucros e planos futuros que a gente da um jeito para você </p>
        </div>
        <ul id="paginas">
          <li id="relatorios"><span><BiBarChartAlt/></span>
            <h3>Relatórios</h3>
            <p>Para ver o relatorio completo!!</p>
            <Link to="/relatorios"><input type="button" classeName= "bt_comecar" value="ver"/></Link>
          </li>
          <li id="contaCorrente"><span className="lgCC"><FaMoneyBill/></span>
            <h3>Renda Bruta</h3>
            <p>Para Gerenciar sua Renda Bruta clique aqui!!</p>
            <Link to="/contaCorrente"><input type="button" className="bt_comecar" value="Criar"/></Link>
            <Link to="/EditarContaCorrente"><input type="button" value="Editar"/></Link>
            <input type="button" value="Extra" onClick={handleAddRendaExtraClick}/>
          </li>
          <li id="cofrinho"><span><FaPiggyBank/></span>
            <h3>Cofrinho</h3>
            <p>Para Gerenciar seu Cofrinho clique aqui!!</p>
            <Link to="/cofrinho"><input type="button" classeName= "bt_comecar" value="Criar"/></Link> 
            <input type="button" value="Adicionar" onClick={handleAddCofrinhoClick} />
            <input type="button" value="Resgatar" onClick={handleResgateCofrinhoClick} />
          </li>
          <li id="gastos"><span className="lgGastos"><FaDollarSign/></span>
            <h3>Gastos</h3>
            <p>Para Gerenciar seus Gastos clique aqui!!</p>
            <Link to="/gastos"><input type="button" classeName= "bt_comecar" value="Criar"/></Link> 
          </li>
        </ul>
        {showAddRendaExtra && (
          <div className="cofrinho-overlay">
            <div className="cofrinho-form">
              <h2>Adicionar Renda Extra</h2>
              <form onSubmit={handleRendaExtraSubmit}>
                <label htmlFor='rendaExtra'>Valor </label><input type="text" name="valor" id="rendaExtra" />  
                <button type="submit">Adicionar</button>
                <button  className='btnX' onClick={() => setShowAddRendaExtra(false)}><BiX/></button>
              </form>
            </div>
          </div>
        )}
        {showAddCofrinho && (
          <div className="cofrinho-overlay">
            <div className="cofrinho-form">
              <h2>Adicionar valor ao Cofrinho</h2>
              <form onSubmit={handleAddCofrinhoSubmit}>
                <label htmlFor='valor'>Valor </label>
                <input type="text" name="valor" id='valor' onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault();}}}/>
                <button type="submit">Adicionar</button>
                <button className='btnX' onClick={() => setShowAddCofrinho(false)}><BiX/></button>
              </form>
            </div>
          </div>
        )}
        {showResgateCofrinho && (
          <div className="cofrinho-overlay">
            <div className="cofrinho-form">
              <h2>Resgatar um valor do Cofrinho</h2>
              <form onSubmit={handleResgateCofrinhoSubmit}>
                <label htmlFor='valorR'>Valor </label>
                <input type="number" id="valorR" name="valorR" />   
                <button type="submit">Resgatar</button>
                <button className='btnX' onClick={() => setShowResgateCofrinho(false)}><BiX/></button>
              </form>
            </div>
          </div>
        )}
      </div>
      <div id="parteInferior">
        <h2>Saiba o que temos a oferecer</h2>
          <ul>
            <li className='ifoGatos'>
              <h3>Gastos</h3>
              <p>Na parte de Gastos voce pode adicionar seus gastos mensais sendo eles fixos ou variados e também a data na qual será debitado, sendo o gasto variado é feito uma media do valor e retornado sua meida</p>
            </li>
            <li className='ifoContaCorrente'>
              <h3>Renda Bruta</h3>
              <p>Em renda bruta você pode adicionar seu banco de sua escolha e preferencia assim adicionando sua renda mensal e data no qual é debitado podendo assim adicionar por padrão a data a ser debitado</p>
            </li>
            <li className='ifoCofrinho'>
              <h3>Cofrinho</h3>
              <p>O cofrinho serve para algo a qual voce deseje futuramente, no qual você decide em quantos meses deseja alcançar, e quanto será depositado mensalmente para alcança-lo</p>
            </li>
            <li className='ifoRelatorios'>
              <h3>Relatorios</h3>
              <p>Em Relatorios poderá vizualizar todo os seus gastos, cofrinho além de poder analisar o panorama geral de como foi seu mês em relação a gastos e quantidade em cofrinho e quanto falta para completa-lo </p>
            </li>
          </ul>
      </div>
    </section>
  );
}

export default Home;