class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
}



function cadastrarDespesa() {
    //Guarda informações inseridas pelo usuário em variáveis
    let dia = document.getElementById('dia')
    let mes = document.getElementById('mes')
    let ano = document.getElementById('ano')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //Utiliza essas informações para construir um objeto Despesa
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    //Repassa o objeto Despesa criado como parâmetro para a função registrarLancamento()
    registrarLancamento(despesa)
}

function registrarLancamento(despesa) {
    //Registra o objeto passado por parâmetro no localStorage do navegador
    //já que ainda não aprendemos a utilizar Banco de Dados SQL
    //Na verdade, o objeto é convertido para uma string JSON antes de ser registrado
    localStorage.setItem('despesa', JSON.stringify(despesa))
}