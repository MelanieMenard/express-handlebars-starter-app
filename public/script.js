const getLocalStorage = (db_name) => JSON.parse(localStorage.getItem(db_name)) ?? []
const sendLocalStorate = (dbProcess, db_name) => localStorage.setItem(db_name, JSON.stringify(dbProcess))

const tbody = document.querySelector('tbody')
const houseSelect = document.getElementById('houses')
const newHouseName = document.getElementById('house_name')
const girlName = document.getElementById('girl_name')
const newGirlProgramValue = document.getElementById('new_program_value')
const modalGirlTitle = document.getElementById("modal_girl_update_title")
const client = document.getElementById('cliente')
const pagamento = document.getElementById('pagamento')




const resetSelectOptions = (constObj) => {
    while (constObj.hasChildNodes()) {
        constObj.removeChild(constObj.firstChild);
    }
}
const createSelectTable = (houseName, id) => {

    const selectOption = document.createElement('option')
    selectOption.innerHTML = houseName
    selectOption.id = id
    document.getElementById('houses').appendChild(selectOption)
}
const createGirlBody = () => {
    tbody.innerHTML = ``
    itens.forEach((dbitem, index) => {
        if (dbitem.house == houseSelect.value) {
            dbitem.girls.forEach((data, index) => {
                createRowTable(data, index, data.girl_colorname)



            })

        }

    })
    createResultTable()
}
const refreshPage = () => {
    window.location.href = '/'
}
const createDBIten = (item) => {
    itens.push(item)
    sendLocalStorate(itens, "db_process")

}
const createHouseName = () => {
    const house = newHouseName.value
    const newHouse = {
        house: house.toUpperCase(),
        totalClients: 0,
        totalPounds: 0,
        despesas: 0,
        girls: []
    }
    createDBIten(newHouse)

    // Inserir um Reset Filds aqui no campo da nova casa
    $('#modal_house_add').modal('hide');

    loadItens()
}
const deleteHouse = () => {
    if (window.confirm("Deseja realmente deletar a casa?")) {
        itens.splice(houseSelect.selectedIndex, 1)
        sendLocalStorate(itens, "db_process")
        loadItens()
    }
}
const createResultTable = () => {
    let totalClientes = 0
    let totalResult = 0
    let totalTransferencia = 0
    let despesas = 0
    let itensDatabase = itens[houseSelect.selectedIndex].girls
    itensDatabase.forEach((data) => {
        totalClientes += data.clients.length
        despesas += data.despesas
        data.clients.forEach((data) => {

            switch (data.pagamento) {
                case 'dinheiro':
                    totalResult += data.valor
                    break;
                case 'transferencia':
                    totalTransferencia += data.valor
                    break
                default:
                    break;
            }



        })

    })

    const resultRow = document.createElement('tr')
    resultRow.innerHTML = `
    <td id="totalClients">${totalClientes}</td>
    <td id="totalResult">$£ ${totalResult.toFixed(2)}</td>
    <td id="transferencia">£ ${totalTransferencia.toFixed(2)}</td>
    <td id="totalCasa">$£ ${totalResult.toFixed(2) / 2}</td>
    <td id="despesas">£ ${totalResult.toFixed(2) / 2}</td>
    `
    if (!document.getElementById('totalClients')) {
        document.getElementById('row_result').appendChild(resultRow)
    } else {
        document.getElementById('totalClients').innerHTML = totalClientes
        document.getElementById('totalResult').innerHTML = `£ ${totalResult.toFixed(2)}`
        document.getElementById('transferencia').innerHTML = `£ ${totalTransferencia.toFixed(2)}`
        document.getElementById('totalCasa').innerHTML = `£ ${totalResult.toFixed(2) / 2}`
    }

}
const createRowTable = (girls, index, girl_colorname) => {
    let girlsTotal = 0
    let girlsTransferencia = 0
    if (girls.clients.length == 0) {
        console.log('s')
    } else {
        girls.clients.forEach((data) => {
            switch (data.pagamento) {
                case 'dinheiro':
                    girlsTotal += data.valor
                    break;
                case 'transferencia':
                    girlsTransferencia += data.valor
                    break
                default:
                    break;
            }
        })
    }

    const newRow = document.createElement('tr')
    newRow.className = `table-${girl_colorname}`
    newRow.innerHTML = `
    <td class="text-${girl_colorname} fw-bold">${girls.nome}</td>
    <td>${girls.clients.length}</td>
    <td>£ ${girlsTotal.toFixed(2)}</td>
    <td>£ ${girlsTransferencia.toFixed(2)}</td>
    <td>£ ${girlsTotal.toFixed(2) / 2}</td>

    <td>
    <button type="button" class="btn btn-success btn-sm"   data-action="adicionar-${index}">Adicionar</button>
    <button type="button" class="btn btn-danger btn-sm" data-action="excluir-${index}">Excluir</button>
    
    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal_programas" data-action="programas-${index}">Programas</button>
    </td>
    </td>`
    document.getElementById('row_girls').appendChild(newRow)


}
const comissao = () => {
    let totalClientes = document.getElementById('totalClients')
    totalClientes = parseInt(totalClientes.innerHTML)
    let diaria = 80
    let clientes = 0
    let comissao = 0
    let validador = 0

    if (totalClientes == 15) {
        validador = totalClientes
        comissao += 10
    }
    if (totalClientes >= 15) {
        if (totalClientes == (validador + 10)) {
            validador = totalClientes
            comissao += 10
        }

    }


    
    console.log(`Diaria ${diaria} Bonus +10 : ${comissao} Comissao por clientes: ${totalClientes}`)
    console.log(`Total: ${diaria + totalClientes + comissao}`)
}
const loadItens = () => {
    
    itens = getLocalStorage("db_process")
    date = getLocalStorage("db_date")
    createDayOption()
    tbody.innerHTML = ''
    let resultTotal = 0
    let resultClients = 0
    if (date.length == 0) {
        $(".hide_element").attr("style", "display:none")
        $(".hide_date").removeAttr("style")
        alert('Adicione uma data para começar!')
    } else {
        loadDateFromLocalStorage()
        resetSelectOptions(houseSelect)
        $(".hide_date").attr("style", "display:none")
        

        itens.forEach((processo, index) => {
            console.log(processo.date)
            if (!processo.date) {
                createSelectTable(processo.house, index)
                createGirlBody()

                processo.girls.forEach((data) => {
                    resultTotal += data.total
                    resultClients += data.clients
                })
            }

        })
        createResultTable()
        comissao()
    }





}
const deleteTableDB = () => {
    if (window.confirm("Deseja realmente deletar todos os campos?")) {
        localStorage.clear()

        window.location.href = '/'
        loadItens()
    }
}
const clearTableDB = () => {
    if (window.confirm("Deseja realmente limpar todos os campos?")) {
        itens.forEach((data) => {
            data.girls.forEach((girl) => {
                girl.clients = []
            })

        })
        localStorage.removeItem("db_date")
        sendLocalStorate(itens, "db_process")
        loadItens()
    }
}
const delprocess = (index) => {
    if (window.confirm("Deseja realmente DELETAR?")) {
        itens.forEach((data) => {
            if (data.house == houseSelect.value) {
                data.girls.splice(index, 1)
            }
        })
        // data.girls.splice(index, 1)
        sendLocalStorate(itens, "db_process")
        loadItens()
    }


}
const delClient = (index) => {
    const girl_edit_id = document.getElementById('girl_edit_id').innerHTML
    let id_converted = parseInt(girl_edit_id)
    if (window.confirm("Deseja realmente DELETAR o cliente?")) {
        itens.forEach((itenIndata) => {
            if (itenIndata.house == houseSelect.value) {
                //  A casa é a mesma , saber se a garota é a mesma agora 

                itenIndata.girls.forEach((itenGirl, girlIndex) => {
                    if (id_converted == girlIndex) {
                        console.log(itenGirl);
                        itenGirl.clients.splice(index, 1)
                    }
                })
                sendLocalStorate(itens, "db_process")
                loadItens()
                createClientTable(id_converted)
            }
        })
    }
}
const createGirlName = () => {
    let houseIndex = houseSelect.selectedIndex
    let id = Object.keys(itens[houseIndex].girls).length
    let name = girlName.value

    const newGirl = {
        girl_colorname: document.getElementById('girl_colorname').value,
        id: id,
        nome: name.toUpperCase(),
        clients: 0,
        total: 0,
        casa: 0,
        transferencia: 0,
        clients: []
    }
    if (id == 0) {
        itens[houseIndex].girls.push(newGirl)
        sendLocalStorate(itens, "db_process")
        refreshPage()
    } else {

        itens[houseIndex].girls.push(newGirl)
        sendLocalStorate(itens, "db_process")
        loadItens()
    }
    girlName.value = ''
    $('#modal_girl_add').modal('hide');
}


const modalEditProgram = (indexConverted) => {
    modalGirlTitle.innerHTML = `Editar: ${itens[houseSelect.selectedIndex].girls[indexConverted].nome}`
    document.getElementById('metodo_pagamento').setAttribute('style', 'display:none')
    document.getElementById('valor').setAttribute('style', 'display:none')

    document.getElementById('addNewProgram').setAttribute('class', 'btn btn-warning')
    document.getElementById('addNewProgram').setAttribute('onclick', 'editGirlProgram()')
    document.getElementById('addNewProgram').innerHTML = 'Salvar Novos Dados'
    document.getElementById('editar_dinheiro').setAttribute('style', 'display:block')
    document.getElementById('editar_clients').setAttribute('style', 'display:block')
    document.getElementById('editar_transferencia').setAttribute('style', 'display:block')
}
const modalUpdateProgram = (indexConverted) => {
    modalGirlTitle.innerHTML = `Adicionar Programa: ${itens[houseSelect.selectedIndex].girls[indexConverted].nome}`
    client.setAttribute('style', 'display:none')
    document.getElementById('editar_dinheiro').setAttribute('style', 'display:none')
    document.getElementById('editar_clients').setAttribute('style', 'display:none')
    document.getElementById('editar_transferencia').setAttribute('style', 'display:none')
    document.getElementById('metodo_pagamento').setAttribute('style', 'display:block')
    document.getElementById('valor').setAttribute('style', 'display:block')
    document.getElementById('addNewProgram').setAttribute('class', 'btn btn-success')
    document.getElementById('addNewProgram').setAttribute('onclick', 'saveGirlProgram()')
    document.getElementById('addNewProgram').innerHTML = 'Adicionar Novo Programa'

}
const openModalGirlProgram = (index, editar) => {
    // debugger
    let indexConverted = parseInt(index)
    client.innerHTML = indexConverted
    $('#modal_girl_update').modal('show');
    if (editar) {

        modalEditProgram(indexConverted)
    } else {

        modalUpdateProgram(indexConverted)
    }

    newGirlProgramValue.value = ''
}

const saveGirlProgram = () => {
    const date = new Date().toLocaleString("en-US", { timeZone: "Europe/London" })
    let indexConverted = parseInt(client.innerHTML)

    if (newGirlProgramValue.value) {
        const newClient = {
            nome: itens[houseSelect.selectedIndex].girls[indexConverted].clients.length + 1,
            pagamento: '',
            valor: 0,
            horario: date
        }
        switch (pagamento.value) {
            case 'Dinheiro':
                newClient.pagamento = 'dinheiro'
                newClient.valor = parseInt(newGirlProgramValue.value)
                break;
            case 'Transferencia':
                newClient.pagamento = 'transferencia'
                newClient.valor = parseInt(newGirlProgramValue.value)
            default:
                break;
        }

        $('#modal_girl_update').modal('hide');
        itens[houseSelect.selectedIndex].girls[indexConverted].clients.push(newClient)
        sendLocalStorate(itens, "db_process")
        loadItens()

    } else {
        window.alert('Digite um Valor')
    }

}
const buttonEvent = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.dataset.action.split('-')

        switch (action) {

            case 'excluir':
                delprocess(index)
                loadItens()
                break;
            case 'adicionar':
                openModalGirlProgram(index, false)
                break;
            case 'editar':
                openModalGirlProgram(index, true)
                break
            case 'programas':
                document.getElementById('modalTitleId').innerHTML = `clients_${returnGirlName(index)}`
                createClientTable(index)
                break
            case 'remove':
                delClient(index)
                break
            case 'comissao':
                break
            default:
                break;
        }

    }

}
const screenShot = () => {
    const captureElement = document.querySelector('#screenshot')
    html2canvas(captureElement)
        .then(canvas => {
            canvas.style.display = 'none'
            document.body.appendChild(canvas)
            return canvas
        })
        .then(canvas => {
            const date1 = new Date()

            const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
            const a = document.createElement('a')
            const date = getLocalStorage("db_date")
            a.setAttribute('download', `${houseSelect.value}_${date[0]['date'].day}_${date[0]['date'].month}.png`)
            a.setAttribute('href', image)
            a.click()
            canvas.remove()
        })
}
const screenShotClients = () => {
    const captureElement = document.querySelector('#modal_programas')
    html2canvas(captureElement)
        .then(canvas => {
            canvas.style.display = 'none'
            document.body.appendChild(canvas)
            return canvas
        })
        .then(canvas => {


            const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
            const a = document.createElement('a')
            const date = getLocalStorage("db_date")
            a.setAttribute('download', `casa_${houseSelect.value}_${document.getElementById('modalTitleId').innerHTML}_${date[0]['date'].day}_${date[0]['date'].month}.png`)
            a.setAttribute('href', image)
            a.click()
            canvas.remove()
        })
}
const createDayOption = () => {
    const selectMonth = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const selectWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado']

    const day = document.getElementById('day')
    const month = document.getElementById('month')
    const weekday = document.getElementById('weekday')

    resetSelectOptions(weekday)
    resetSelectOptions(day)
    resetSelectOptions(month)


    for (let i = 1; i < 32; i++) {
        const option = document.createElement('option')
        option.innerHTML = i
        option.value = i
        day.appendChild(option)
    }
    selectMonth.forEach((date, index) => {
        const option = document.createElement('option')
        option.innerHTML = date
        option.value = index
        month.appendChild(option)

    })
    selectWeek.forEach((weekDay, index) => {
        const option = document.createElement('option')
        option.innerHTML = weekDay
        option.value = index
        weekday.appendChild(option)
    })
    const date = new Date()
    const changeWeekDay = document.querySelector('#weekday')
    changeWeekDay.value = date.getDay()

    const changeMonth = document.querySelector('#month')
    changeMonth.value = date.getMonth()

    const changeDay = document.querySelector('#day')
    changeDay.value = date.getDate()


}
const saveDateToLocalStorage = () => {
    if (date.length == 0) {
        const newDate = {
            date: {
                day: parseInt(document.querySelector('#day').value),
                month: parseInt(document.querySelector('#month').value),
                weekday: parseInt(document.querySelector('#weekday').value)
            }

        }
        date.push(newDate)
        sendLocalStorate(date, "db_date")
        refreshPage()
        loadItens()
    } else {
        date.forEach((data) => {
            data['date'].day = parseInt(document.querySelector('#day').value),
                data['date'].month = parseInt(document.querySelector('#month').value),
                data['date'].weekday = parseInt(document.querySelector('#weekday').value)
        })
        sendLocalStorate(itens, "db_process")
        loadItens()
        refreshPage()
    }

}
const loadDateFromLocalStorage = () => {
    date.forEach((data) => {
        const day = document.getElementById('day')
        const month = document.getElementById('month')
        const weekday = document.getElementById('weekday')
        day.value = data['date'].day
        month.value = data['date'].month
        weekday.value = data['date'].weekday

    })
}

const createClientTable = (girlsIndex) => {
    const result = document.getElementById('clients_result')
    girls = itens[houseSelect.selectedIndex].girls[girlsIndex].clients
    while (result.hasChildNodes()) {
        result.removeChild(result.firstChild);
    }
    girls.forEach((data, index) => {
        const newRow = document.createElement('tr')
        newRow.innerHTML = `
    <span id="girl_edit_id" style="display:none">${girlsIndex}</span>
    <td>${index + 1}</td>
    <td>${data.pagamento}</td>
    <td>£ ${data.valor}</td>
    <td>${data.horario}</td>
    <td><button type="button" class="btn btn-sm btn-danger" data-action="remove-${index}">Excluir</button><td>
    `
        result.appendChild(newRow)
    })


}
const returnGirlName = (girlIndex) => {
    return itens[houseSelect.selectedIndex].girls[girlIndex].nome
}
const convertHour = (num) => {
    return num.toString().padStart(2, '0');
}
document.onload = loadItens()
// document.querySelector('table > tbody').addEventListener('click', buttonEvent)
document.getElementById('screenshot').addEventListener('click', buttonEvent)
// data-bs-toggle="modal" data-bs-target="#modal_girl_update"

//test contagem de comissao

