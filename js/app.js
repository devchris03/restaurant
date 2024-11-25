// --------------------------- SELECTORES ---------------------------
const saveClient = document.querySelector('#guardar-cliente');

// --------------------------- VARIABLES ---------------------------
let client = {
    table: '',
    hour: '',
    order: []
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
}


// muestra secciones ocultas
function showSections() {
    const sections = document.querySelectorAll('.d-none');
    sections.forEach(section => section.classList.remove('d-none'));
}

