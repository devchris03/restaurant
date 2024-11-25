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
}

