const Modal = {
    open () {
            // Abrir modal
            // adicionar a class active ao modal
            document
                .querySelector('.modal-overlay')
                // pesquisar pelo seletor todo
                .classList
                .add('active')

    },
    close () {
            // Fechar o modal
            // remover a class active do modal
            document
                .querySelector('.modal-overlay')
                // pesquisar pelo seletor todo
                .classList
                .remove('active')
    }
}

const Storage = {
    get() {    //get: pegar
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||   //parse: transforma str em array/objeto 
        [] //<= str vazia     
    },

    set(transactions) {    //set: guardar
        localStorage.setItem("dev.finances:transactions", JSON .stringify
        (transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload() //atualizar
    },

    remove(index) {
        Transaction.all.splice(index, 1) //splice:aplica em array; posicao do index
        
        App.reload() // reload: remover da tela
    },

    //somar as entradas
    incomes() {
        let income = 0;
        //pegar todas as transacoes
        //para cada transacao,
        Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if(transaction.amount > 0) {
                //somar a uma variavel e retornar a variavel
                income += transaction.amount;
            }
        }) 
        return income;
    },

    //somar as saídas
    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        }) 
        return expense;
    },

    // entradas - saídas
    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.idenx = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Uteis.formatCurrency(transaction.amount) 

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Uteis.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Uteis.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Uteis.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Uteis = {
    formatAmount(value) {
        value = value * 100
        
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-") //split: separar
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")  //replace: troca

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {    //locale: local
            style: "currency",
            currency: "BRL"
        }) 
            

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()

        if( description.trim() === "" || //trim: limpeza dos espaços vazios
            amount.trim() === "" ||
            date.trim() === "" )  {
                throw new Error("Por favor, preencha todos os campos!")
        }    
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Uteis.formatAmount(amount)

        date = Uteis.formatDate(date)
        
        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault() 

        try {
            Form.validateFields() //validar os campos

            const transaction = Form.formatValues() //pegar transacao formatada

            Transaction.add(transaction) //adicionar

            Form.clearFields() //limpar

            Modal.close() //fechar modal

        } catch (error) { //catch: captura o erro
            alert(error.message)
        }
    }

}

const App = {
    init() {

        Transaction.all.forEach(DOM.addTransaction) 

        DOM.updateBalance()
            
        Storage.set(Transaction.all) 
    },
    reload() { //releitura
        DOM.clearTransactions()
        App.init()
    }, 
}

App.init()
