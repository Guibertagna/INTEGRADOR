import '../CSS/HomePage.css'
import {Link} from 'react-router-dom';
function HomePage(){
    return( 
        <section className="background">
            <h2>A melhor solução para seus problemas financeiros</h2><br/><br/>
          <div>
            <p>No PoupAqui você consegue gerenciar melhor o seu dinheiro, tendo uma visão mais detalhada de como estão sua finanças.</p>
            <p>Uma outra exclusividade é o nosso cofrinho, onde ao selecionar uma meta, como por exemplo fazer a viagem dos sonhos, ajudamos a calcular o tempo necessario para o feito </p>
          </div>
          <div>
          <Link to="/Login"><input type="button" classeName= "bt_comecar" value="Comece agora!"/></Link>
          </div>
        </section>
    )
}

export default HomePage