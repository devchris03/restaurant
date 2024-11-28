// --------------------------- SELECTORES ---------------------------
const saveClient = document.querySelector('#guardar-cliente');

// --------------------------- VARIABLES ---------------------------
let client = {
    table: '',
    hour: '',
    order: []
}

const categories = {
    1: 'Comida',
    2: 'Postres',
    3: 'Bebidas'
}

// --------------------------- EVENTOS ---------------------------
saveClient.addEventListener('click', validate)

// --------------------------- FUNCIONES ---------------------------

// validar datos
function validate(event) {
    event.preventDefault()

    const table = document.querySelector('#mesa').value;
    const hour = document.querySelector('#hora').value;

    if(table.trim() === '' || hour.trim() === '') {

        // verificamos si existe alerta previa
        const exist = document.querySelector('.alerta');

        if(!exist) {
            const alert = document.createElement('P');
            alert.classList.add('invalid-feedback', 'd-block', 'text-center', 'alerta');
            alert.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alert);
        
            // elimina alerta
            setTimeout(() => {
                alert.remove();
            }, 3000)
        }

        return;
    }

    client = {...client, table, hour};
    
    // ocultamos modal
    const modalForm = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
    modalBootstrap.hide();

    showSections();
    getMeal();
}


// muestra secciones ocultas
function showSections() {
    const sections = document.querySelectorAll('.d-none');
    sections.forEach(section => section.classList.remove('d-none'));
}


// consultar los platos del JSON-SERVER
function getMeal() {
    const url = "http://localhost:4000/platillos"

    fetch(url)
        .then(result => result.json())
        .then(result => showMeals(result))
}


// muestra platillos en el html
function showMeals(meals) {
    const content = document.querySelector('#platillos .contenido')
    
    meals.forEach(meal => {
        const row = document.createElement('DIV');
        row.classList.add('row');

        const name = document.createElement('P');
        name.classList.add('col-md-4');
        name.textContent = meal.nombre;

        const price = document.createElement('P');
        price.classList.add('col-md-3', 'fw-bold');
        price.textContent = `$${meal.precio}`;

        const category = document.createElement('P');
        category.classList.add('col-md-3');
        category.textContent = categories[meal.categoria];

        const input = document.createElement('INPUT');
        input.type = 'number';
        input.min = 0;
        input.value = 0;
        input.id = `producto-${meal.id}`;
        input.classList.add('form-control');

        input.onchange = () => {
            const quantity = parseInt(input.value);
            updateMeal({...meal, quantity});
        }


        const add = document.createElement('DIV');
        add.classList.add('col-md-2');
        add.appendChild(input);

        row.append(name, price, category, add);
        content.appendChild(row)
    })
}

// actualiza cantidad de platillos 
function updateMeal(product) {
    const {order} = client;

    // verificamos si la cantidad es mayor a 0
    if(product.quantity > 0) {

        // verificamos si el producto ya existe
        if(order.some(meal => meal.id === product.id)) {
            const newOrder = order.map(meal => {
                if(meal.id === product.id) {
                    meal.quantity = product.quantity;
                }

                return meal;
            })

            client.order = [...newOrder];
            
        } else {
            client.order = [...order, product];
        }
    }

    if(product.quantity === 0) {
        const remove = order.filter(meal => meal.id !== product.id);
        client.order = [...remove];
    }

    // verifica si hay platillos seleccionados
    if(client.order.length) {
        showOrder();
    } else {
        emptyOrder();
    }
}


// muestra platillos ordenados
function showOrder() {
    cleanOrder();

    const content = document.querySelector('#resumen .contenido');
    const row = document.createElement('DIV');
    row.classList.add('py-5', 'px-3', 'card', 'shadow', 'col-md-6');


    // informacion de la mesa
    const table = document.createElement('P');
    table.classList.add('fw-bold');
    table.textContent = "Mesa: ";

    const spanTable = document.createElement('SPAN');
    spanTable.classList.add('fw-normal');
    spanTable.textContent = client.table;

    table.appendChild(spanTable);
    
    
    // informacion de la hora 
    const hour = document.createElement('P');
    hour.classList.add('fw-bold');
    hour.textContent = "Mesa: ";

    const spanHour = document.createElement('SPAN');
    spanHour.classList.add('fw-normal');
    spanHour.textContent = client.hour;

    hour.appendChild(spanHour);


    // titulo
    const title = document.createElement('h3');
    title.textContent = "Platillos consumidos";
    title.classList.add('text-center', 'my-4');


    // lista 
    const list = document.createElement('UL');
    list.classList.add('list-group');

    // itera pedidos
    const {order} = client;
    order.forEach(meal => {
        const {nombre, precio, quantity, id} = meal;

        // item
        const item = document.createElement('LI');
        item.classList.add('list-group-item');

        // nombre del platillo
        const nameEl = document.createElement('H4');
        nameEl.textContent = nombre;
        nameEl.classList.add('my-4');
        
        // cantidad del platillo
        const quantityEl = document.createElement('P');
        quantityEl.textContent = 'Cantidad: ';
        quantityEl.classList.add('fw-bold');
        
        // valor de la cantidad
        const valueQuantity = document.createElement('SPAN');
        valueQuantity.classList.add('fw-normal');
        valueQuantity.textContent = quantity;
        quantityEl.appendChild(valueQuantity);
        
        // precio del platillo
        const priceEl = document.createElement('P');
        priceEl.textContent = 'Precio: ';
        priceEl.classList.add('fw-bold');
        
        // valor del precio
        const valuePrice = document.createElement('SPAN');
        valuePrice.classList.add('fw-normal');
        valuePrice.textContent = `$${precio}`;
        priceEl.appendChild(valuePrice);
        
        // subtotal del platillo
        const totalEl = document.createElement('P');
        totalEl.textContent = 'Subtotal: ';
        totalEl.classList.add('fw-bold');
        
        // valor del subtotal
        const valueTotal = document.createElement('SPAN');
        valueTotal.classList.add('fw-normal');
        valueTotal.textContent = `$${precio * quantity}`;
        totalEl.appendChild(valueTotal);

        // boton
        const btnDelete = document.createElement('BOTTON');
        btnDelete.textContent = 'Eliminar producto';
        btnDelete.classList.add('btn', 'btn-danger');
        btnDelete.onclick = () => {deleteProdcut(id)}

        // agrega informacion al item
        item.append(nameEl, quantityEl, priceEl, totalEl, btnDelete);

        // agrega item a la lista
        list.appendChild(item);
    })


    // agrega a los elementos padres
    row.append(title, table, hour, list);
    content.appendChild(row);
    
    showTip();
}


// elimina platillo ordenado
function deleteProdcut(id) {
    const {order} = client;

    const remove = order.filter(meal => meal.id !== id);
    client.order = [...remove];
    
    // verifica si hay platillos seleccionados
    if(client.order.length) {
        showOrder();
    } else {
        emptyOrder();
    }
}


// muestra formulario de propinas
function showTip() {
    const content = document.querySelector('#resumen .contenido');
    
    // contenedor
    const row = document.createElement('DIV');
    row.classList.add('col-md-6', 'formulario');

    const form = document.createElement('FORM');
    form.classList.add('card', 'py-5', 'px-3', 'shadow');

    // title
    const title = document.createElement('H3');
    title.textContent = 'Propinas';
    title.classList.add('my-4', 'text-center');

    // inputs - radio 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcMoney;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = "10%"
    radio10.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');
    radio10Div.append(radio10, radio10Label)
    
    // inputs - radio 20%
    const radio20 = document.createElement('INPUT');
    radio20.type = 'radio';
    radio20.name = 'propina';
    radio20.value = "20";
    radio20.classList.add('form-check-input');
    radio20.onclick = calcMoney;

    const radio20Label = document.createElement('LABEL');
    radio20Label.textContent = "20%"
    radio20.classList.add('form-check-label');

    const radio20Div = document.createElement('DIV');
    radio20Div.classList.add('form-check');
    radio20Div.append(radio20, radio20Label);
    
    // inputs - radio 30%
    const radio30 = document.createElement('INPUT');
    radio30.type = 'radio';
    radio30.name = 'propina';
    radio30.value = "30";
    radio30.classList.add('form-check-input');
    radio30.onclick = calcMoney;

    const radio30Label = document.createElement('LABEL');
    radio30Label.textContent = "30%"
    radio30.classList.add('form-check-label');

    const radio30Div = document.createElement('DIV');
    radio30Div.classList.add('form-check');
    radio30Div.append(radio30, radio30Label);


    // agrega a contenedores padres
    form.append(title, radio10Div, radio20Div, radio30Div);
    row.appendChild(form);
    content.appendChild(row)
}


// calcula subtotal, propina y total
function calcMoney() {
    let subtotal = 0;

    const {order} = client;

    // subtotal
    order.forEach(meal => {
        subtotal += meal.precio * meal.quantity;
    })

    // propina
    const selectedTip = document.querySelector('[name = "propina"]:checked').value;
    const propina = ((subtotal * parseInt(selectedTip)) / 100)

    // total
    const total = subtotal + propina;

    showTotal(subtotal, propina, total);
}


// muestra detalles del pago
function showTotal(subtotal, propina, total) {

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar');

    // Subtotal
    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;
    subtotalParrafo.appendChild(subtotalSpan);

    // Propina
    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fs-3', 'fw-bold');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;
    propinaParrafo.appendChild(propinaSpan);

    // Total
    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-3', 'fw-bold');
    totalParrafo.textContent = 'Total a Pagar: ';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);

    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv) {
        totalPagarDiv.remove();
    }
   


    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(divTotales);


}

// muestra mensaje si aún no hay ningú plato seleccionado
function emptyOrder() {
    cleanOrder();

    const content = document.querySelector('#resumen .contenido');

    const text = document.createElement('P');
    text.textContent = 'Añade los elementos del pedido';
    text.classList.add('text-center');
    content.appendChild(text);
}


// clean HTML
function cleanOrder() {
    const content = document.querySelector('#resumen .contenido');

    while(content.firstChild) {
        content.removeChild(content.firstChild);
    }
}