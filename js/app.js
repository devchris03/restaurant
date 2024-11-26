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

    cleanOrder();
    showOrder();
}


// muestra platillos ordenados
function showOrder() {
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

        // agrega informacion al item
        item.append(nameEl, quantityEl, priceEl, totalEl);

        // agrega item a la lista
        list.appendChild(item);
    })


    // agrega a los elementos padres
    row.append(table, hour, title, list);
    content.appendChild(row);
    
}


// clean HTML
function cleanOrder() {
    const content = document.querySelector('#resumen .contenido');

    while(content.firstChild) {
        content.removeChild(content.firstChild);
    }
}