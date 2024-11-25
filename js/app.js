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

    showSections()
    getMeal()
}


// muestra secciones ocultas
function showSections() {
    const sections = document.querySelectorAll('.d-none');
    sections.forEach(section => section.classList.remove('d-none'));
}


// consultar los platos del JSON-SERVER
function getMeal() {
    const url = "http://localhost:3000/platillos"

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

        const add = document.createElement('DIV');
        add.classList.add('col-md-2');
        add.appendChild(input);

        row.append(name, price, category, add);
        content.appendChild(row)
    })
}