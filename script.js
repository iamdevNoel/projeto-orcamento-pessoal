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

    //Registra o objeto passado por parâmetro no localStorage do navegador
    //já que ainda não aprendemos a utilizar Banco de Dados SQL
    //Na verdade, o objeto é convertido para uma string JSON antes de ser registrado
    registrarLancamento(despesa) {
        let proximoID = this.getProximoID()
        localStorage.setItem(proximoID, JSON.stringify(despesa))
        localStorage.setItem('id', proximoID)
    }

    recuperarRegistros() {
        let index = localStorage.getItem('id')
        let arrayDespesas = Array()

        for (let i = 1; i <= index; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            
            if (despesa === null) {
                continue
            }
            arrayDespesas.push(despesa)
        }
        console.log(arrayDespesas)
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

function carregarListaDespesas() {
    bd.recuperarRegistros()
}