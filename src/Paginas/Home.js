import '../CSS/Home.css'
import {FaPiggyBank, FaDollarSign, FaMoneyBill, FaChartBar} from 'react-icons/fa'
function Home(){
    return(
        <section id="corpo-full">
            <div id="parteSuperior">
            <ul id="paginas">
                <li id="gastos"><span><FaDollarSign/></span>
                <p>Para Gerenciar seus Gastos clique aqui!!</p>
                <input type="button" value="Editar"/> <input type="button" value="Criar"/></li>
                <li id="cofrinho"><span><FaPiggyBank/></span>
                <p>Para Gerenciar seu Cofrinho clique aqui!!</p>
                <input type="button" value="Editar"/> <input type="button" value="Criar"/></li>
                <li id="contaCorrente"><span><FaMoneyBill/></span>
                <p>Para Gerenciar sua Conta Corrente clique aqui!!</p>
                <input type="button" value="Editar"/> <input type="button" value="Criar"/></li>
                <li id="contaCorrente"><span><FaChartBar/></span>
                <p>Para ver o relatorio completo!!</p>
                <input type="button" id="btnRelatorios" value="Ver"/></li>
            </ul>
            </div>
            <div id="parteInferior">
            </div>
        </section>
    )
}
export default Home;