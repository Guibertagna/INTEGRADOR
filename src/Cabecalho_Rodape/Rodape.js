import '../CSS/Rodape.css'
import {FaFacebook, FaInstagram, FaTwitter, FaPinterest} from 'react-icons/fa'
function Rodape(){
    return(
        <footer className="main_footer container">
        <div className="content">
            <div className="colfooter">   
                <h3 className="titleFooter"> Menu</h3>
                <ul>
                  <li>Página Inícial</li>
                  <li>Sobre a Empresa</li>
                  <li>Galeria de Fotos</li>
                  <li>Fale Conosco</li>
                </ul>
            </div>      
            <div className="colfooter">
               <h3 className="titleFooter"> Contato</h3>
               <p><i className="icon icon-mail"></i> contato@seusite.com.br</p>
               <p><i className="icon icon-phone"></i> 21 90000-0000</p>
               <p><i className="icon icon-whatsapp"></i> 21 90000-0000</p>
            </div>
            <div className="colfooter">
               <h3 className="titleFooter"> Redes Sociais</h3>
               <span className='botao'> <FaFacebook/> </span>           
               <span className='botao'> <FaInstagram/> </span>            
               <span className='botao'> <FaTwitter/> </span>            
               <span className='botao'> <FaPinterest/> </span>           
            </div>
            <div className="clear"></div>
        </div>
    </footer>
    )
}

export default Rodape;