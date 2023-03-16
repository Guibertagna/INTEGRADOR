import '../CSS/Cabecalh.css'
import {Link} from 'react-router-dom';

function Cabecalho(){
    return(
      <div className="topo"> 
      <h1><Link to="/"><span>PoupAqui</span></Link></h1>
      <nav className="menu">
          <ul>
          <li><Link to="/Perfil"><span>Perfil</span></Link></li>  
          <li><Link to="/ContaCorrente"><span>Relatórios</span></Link></li>
          <li><Link to="/Cofrinho"><span>Cofrinho</span></Link></li> 
          <li><Link to="/Gastos"><span>Gastos</span></Link></li>
          <li><Link to="/"><span>Home</span></Link></li>
         </ul>
      </nav>
    </div>
    )
}

export default Cabecalho