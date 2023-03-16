import '../CSS/ContaCorrente.css'

function ContaCorrente(){
    return(
        <div className="fundo_CC">
            <div className="form">
            <h1>C o n t a    <br/>         C o r r e n t e</h1>
            <p><label for="iNBanco">Nome Banco</label><input className="NBanco" id="iNBanco"placeholder="Digite o nome do seu Banco"/></p>
            <p><label for="iRMensal">Renda Mensal</label><input className="NBanco" id="iRMensal" placeholder="Digite sua renda mensal fixa"/></p>
            <p><label for="iData">Data</label><input type="date" className="Data" id="iData"/></p>
            <p><input type="submit" className="btCC" value="Salvar"/></p>
            </div>
        </div>
    )   
 }
export default ContaCorrente