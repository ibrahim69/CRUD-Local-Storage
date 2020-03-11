'use-strict'
tableWrapper = document.querySelector('tbody')


var lastID = 1
var tblData;
var idArr = [];

var valId;
var valNama;
var valHarga;
var valKet;

init()

// initialize tblData
function init() {
    if(!!(window.localStorage.getItem('tblData'))) {
        tblData = JSON.parse(localStorage.getItem('tblData'));
    } else {
        tblData = [];
    }
    document.getElementById('addData').addEventListener('click', simpanData);
    showList();
}

// End Init

// Crud Function

function showList() {
    if(!!tblData.length) {
        getLastTaskId()
        for (var item in tblData) {
            let table = tblData[item]
            addTasktoList(table);
        }
        syncEvents();
    }
}

function simpanData(event) {

    var newData = {
        tableId : lastID,
        tableName : $('#namaBarang').val(), 
        tableHarga : $('#hargaBarang').val(),
        tableKet : $('#ketBarang').val()
    }

    tblData.push(newData);
    syncTask()
    addTasktoList(newData)
    syncEvents()
    lastID++
}

function addTasktoList(newData) {

    // initialize for table 

    var element = document.createElement('tr')

    var tAction = document.createElement('td')

    var removeIcon = document.createElement('button')
    var updateIcon = document.createElement('button')

    var tId = document.createElement('td');
    var tName = document.createElement('td');
    var tHarga = document.createElement('td');
    var tKet = document.createElement('td');
    
    element.setAttribute('id', newData.tableId)

    removeIcon.innerHTML = 'Hapus Data'
    removeIcon.className = 'btn btn-danger btnRemove clickable'
    removeIcon.setAttribute('title', 'Remove')

    updateIcon.setAttribute('title','Update')
    updateIcon.setAttribute('data-toggle','modal')
    updateIcon.setAttribute('data-target',"#modal-update-item")
    updateIcon.style.margin = 'auto 15px'

    updateIcon.className = 'btn btn-success btnUpdate clickable'
    updateIcon.innerHTML = 'Edit Data'

    tId.innerHTML = newData.tableId 
    tName.innerHTML = newData.tableName 
    tHarga.innerHTML = newData.tableHarga 
    tKet.innerHTML = newData.tableKet 

    tAction.appendChild(updateIcon)
    tAction.appendChild(removeIcon)

    element.appendChild(tAction)
    element.appendChild(tId)
    element.appendChild(tName)
    element.appendChild(tHarga)
    element.appendChild(tKet)
    
    tableWrapper.appendChild(element)
}

function removeTask(event) {
    let tableToRemove = event.currentTarget.parentNode.parentNode;
    console.log(tableToRemove);
    let tableId = tableToRemove.id;
    tableWrapper.removeChild(tableToRemove);
    tblData.forEach((value, i) => {
        if(value.tableId == tableId) {
            tblData.splice(i, 1);
        }
    });

    syncTask()
}

// End CRUD

// Common   

function syncTask() {
  
    window.localStorage.setItem('tblData', JSON.stringify(tblData));
    tblData = JSON.parse(window.localStorage.getItem('tblData'));
}

function getLastTaskId() {
    var lastTask = tblData[tblData.length - 1];
    lastID = lastTask.tableId + 1;
  }

function syncEvents() {
    updateIcon = document.getElementsByClassName('btnUpdate')
    removeIcon = document.getElementsByClassName('btnRemove')

    if (!!removeIcon.length) {
        for (let i = 0; i < removeIcon.length; i++) {
            removeIcon[i].addEventListener('click', removeTask )
        }
    }

    if (!!updateIcon.length) {
        for (let j = 0; j < updateIcon.length; j++) {
            updateIcon[j].addEventListener('click', retrieveValue )
        }
    }
}

function findTask(id) {
    var response = {
        task : '',
        pos: 0
    }

    tblData.forEach(function (value, i) {
        if(value.tableId == id) {
            response.task = value;
            response.pos = i;
        }
    })

    return response;
}

function retrieveValue() {
    var taskTag = event.currentTarget.parentNode.parentNode;
    var tableId = taskTag.id;
    var retrieveData = findTask(tableId).task;
    var taskToUpdate = retrieveData;
    var pos = findTask(tableId).pos;

    if(!!retrieveData) {
        let id = $('.id-group').val(retrieveData.tableId);
        let nama = $('.nama-barang').val(retrieveData.tableName);
        let harga = $('.harga-barang').val(retrieveData.tableHarga);
        let keterangan = $('.keterangan-barang').val(retrieveData.tableKet);
    }

    $('#update').click(function () {
        if(!!taskToUpdate) {
            var updateData = {
                tableName : $('.nama-barang').val(),
                tableHarga : $('.harga-barang').val(),
                tableKet : $('.keterangan-barang').val()
            }

            taskToUpdate.tableName = updateData.tableName;
            taskToUpdate.tableHarga = updateData.tableHarga;
            taskToUpdate.tableKet = updateData.tableKet;

            taskTag.childNodes[2].textContent = taskToUpdate.tableName
            taskTag.childNodes[3].textContent = taskToUpdate.tableHarga
            taskTag.lastChild.textContent = taskToUpdate.tableKet

            tblData[pos] = taskToUpdate;
            syncTask();

        }   
    })
}