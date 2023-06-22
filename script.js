class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        //Verifica se o usuário deixou campos em vazio antes de registrar
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null || this[i] == ' ')
            {
                return false
            }
        }
        return true
    }
}

class BancoDeDados {
    constructor() {
        //registra uma chave id no localStorage
        let id = localStorage.getItem('id')
        //caso ainda não exista, recebe o valor 0
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    //atualiza a chave id para evitar sobrescrever ao fazer novos registros
    getProximoID() {
        let idAtual = localStorage.getItem('id')
        return parseInt(idAtual) + 1
    }

    /*Registra o objeto passado por parâmetro no localStorage do navegador
    já que ainda não aprendemos a utilizar Banco de Dados SQL
    Na verdade, o objeto é convertido para uma string JSON antes de ser registrado*/
    registrarLancamento(despesa) {
        let proximoID = this.getProximoID()
        localStorage.setItem(proximoID, JSON.stringify(despesa))
        localStorage.setItem('id', proximoID)
    }

    /*recupera o valor de idAtual e o utiliza como index no laço for
    que converterá os valores JSON do localStorage para objetos literais
    e armazenar num array*/
    recuperarRegistros() {
        let index = localStorage.getItem('id')
        let arrayDespesas = Array()

        for (let i = 1; i <= index; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //controle para não armazenar registros nulos (que foram excluídos)
            if (despesa != null) {
                despesa.id = i
                arrayDespesas.push(despesa)
            }
        }

        return arrayDespesas
    }

    pesquisar(despesaPesquisada) {
        let despesasFiltradas = this.recuperarRegistros()

        /*if (despesaPesquisada.ano != "") {
            despesasFiltradas.filter(i => i.ano == despesaPesquisada.ano)
        }
        if (despesaPesquisada.mes != "") {
            despesasFiltradas.filter(i => i.mes == despesaPesquisada.mes)
        }
        if (despesaPesquisada.dia != "") {
            despesasFiltradas.filter(i => i.dia == despesaPesquisada.dia)
        }
        if (despesaPesquisada.tipo != "") {
            despesasFiltradas.filter(i => i.tipo == despesaPesquisada.tipo)
        }
        if (despesaPesquisada.descricao != "") {
            despesasFiltradas.filter(i => i.descricao == despesaPesquisada.descricao)
        }
        if (despesaPesquisada.valor != "") {
            despesasFiltradas.filter(i => i.valor == despesaPesquisada.valor)
        }*/

        for (let i in despesaPesquisada) {
            filtrar(i)
        }

        function filtrar(atributo) {
            if (despesaPesquisada[atributo] != "") {
                despesasFiltradas = despesasFiltradas.filter(i => i[atributo] == despesaPesquisada[atributo])
            }
        }

        console.log(despesasFiltradas)
        return despesasFiltradas
    }

    removerDespesa(id) {
        localStorage.removeItem(id)
    }
}

let bd = new BancoDeDados()

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

   if(despesa.validarDados()) {
       //Repassa o objeto Despesa criado como parâmetro para a função registrarLancamento()
        bd.registrarLancamento(despesa)
        
        //dispara caixa de diálogo ao usuário, personalizado com textos positivos
        document.getElementById('modal-titulo-div').className = "modal-header text-success"
        document.getElementById('modal-titulo').innerHTML = "Registro concluído"
        document.getElementById('modal-body').innerHTML = 'Despesa foi registrada com sucesso.'
        document.getElementById('modal-button').className = "btn btn-success"
        document.getElementById('modal-button').innerHTML = "OK"

        //limpar campos após registro
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        $('#modalRegistroDespesa').modal('show')
    } else {
        //dispara caixa de diálogo ao usuário, personalizado com textos positivos
        document.getElementById('modal-titulo-div').className = "modal-header text-danger"
        document.getElementById('modal-titulo').innerHTML = "Erro ao cadastrar despesa"
        document.getElementById('modal-body').innerHTML = 'Retorne e verifique se esqueceu de preencher algum campo.'
        document.getElementById('modal-button').className = "btn btn-danger"
        document.getElementById('modal-button').innerHTML = 'Voltar'
        $('#modalRegistroDespesa').modal('show')
    }
}

function carregarListaDespesas(arrayDespesas = []) {
    //se o array recebido por parâmetro estiver vazio,
    //será exibido todos os registros, sem filtragem
    if (arrayDespesas.length == 0) {
        arrayDespesas = bd.recuperarRegistros()
    }

    let corpoTabela = document.getElementById("corpo-tabela")

    //laço para exibir cada registro por linha
    arrayDespesas.forEach(function(despesa) {
        let linha = corpoTabela.insertRow()

        linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}` 

        //converter números em texto explicativo do campo "Tipo"
        switch(despesa.tipo) {
            case '1': 
                despesa.tipo = 'Alimentação' 
                break
            case '2': 
                despesa.tipo = 'Educação' 
                break
            case '3': 
                despesa.tipo = 'Lazer'
                break
            case '4': 
                despesa.tipo = 'Saúde'
                break
            case '5': 
                despesa.tipo = 'Transporte'
                break
            }

        linha.insertCell(1).innerHTML = despesa.tipo
        linha.insertCell(2).innerHTML = despesa.descricao
        linha.insertCell(3).innerHTML = despesa.valor

        //criar elemento HTML botão para excluir lançamentos
        let botaoExcluir = document.createElement('button')
        botaoExcluir.className = "btn btn-danger"
        botaoExcluir.innerHTML = '<i class="fas fa-times"></i>'
        botaoExcluir.id = `id-despesa-${despesa.id}`
        botaoExcluir.onclick = function () {
            //para entregar ao removerDespesa() somente o número do id, sem o prefixo 'id-despesa-'
            let idCorrigida = botaoExcluir.id.replace('id-despesa-', '') 
            bd.removerDespesa(idCorrigida)
            window.location.reload()
        }
        linha.insertCell(4).append(botaoExcluir)
    })
}

function pesquisarDespesas() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    //cria um objeto-modelo com os atributos informados nos campos de filtragem
    let despesaPesquisada = new Despesa(ano, mes, dia, tipo, descricao, valor)
    
    if ( //verifica se os filtros estão vazios
        despesaPesquisada.ano == "" &&
        despesaPesquisada.mes == "" &&
        despesaPesquisada.dia == "" &&
        despesaPesquisada.tipo == "" &&
        despesaPesquisada.descricao == "" &&
        despesaPesquisada.valor == ""
    ) {
        window.alert('Preencha no mínimo um dos campos do formulário para filtrar sua pesquisa adequadamente.')
    } else {
        //o objeto-modelo despesaPesquisada é enviado por parâmetro para o método pesquisar
        //lá, ele será comparado com cada registro e, no caso de semelhança, será agrupado numa array de objetos
        //array despesasFiltradas recebe essa array de objetos semelhantes à despesaPesquisada
        despesasFiltradas = bd.pesquisar(despesaPesquisada)
        //se despesasFiltradas estiver vazio, nenhum item semelhante à pesquisa foi encontrado
        if (despesasFiltradas.length < 1) {
            document.getElementById("corpo-tabela").innerHTML = "Nenhum resultado encontrado"
        } else {
            document.getElementById("corpo-tabela").innerHTML = ""
            carregarListaDespesas(despesasFiltradas)
        }
    }
}