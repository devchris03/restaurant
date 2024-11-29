# 🍽️ Proyecto Restaurante

Este proyecto es una aplicación web para la gestión de pedidos en un restaurante. Fue desarrollado utilizando **HTML**, **Bootstrap**, **JavaScript** y **json-server** para simular una base de datos.

## ✨ Características principales

### 📋 Registro de Mesa y Hora
Al iniciar la aplicación, se muestra un formulario donde se deben ingresar los siguientes datos obligatorios:
- **Número de mesa**.
- **Hora** del pedido.

Una vez validados estos campos, se habilita la funcionalidad principal de la aplicación.

### 🛍️ Listado de Platillos
- Los datos de los platillos se obtienen mediante un `fetch` desde el archivo `db.json` utilizando `json-server`.
- Cada platillo está clasificado en una de las siguientes categorías:
  - **Comida**
  - **Bebida**
  - **Postre**
- Se muestra el precio de cada platillo junto con un campo de entrada para seleccionar la cantidad deseada.

### 📑 Resumen de Pedido
A medida que el usuario selecciona cantidades de los platillos:
1. Se genera un **resumen dinámico** que incluye:
   - Nombre del platillo.
   - Cantidad seleccionada.
   - Precio unitario.
   - Subtotal por platillo.
2. Cada platillo en el resumen cuenta con un botón para eliminarlo si es necesario.

### 💸 Cálculo de Propina y Total
- Se presenta un formulario con botones para seleccionar un porcentaje de propina (10%, 20% o 30%).
- Una vez seleccionada la propina, se calculan y muestran:
  - **Subtotal**: Suma de todos los platillos seleccionados.
  - **Propina**: Monto calculado según el porcentaje seleccionado.
  - **Total**: Suma del subtotal más la propina.

## 🛠️ Tecnologías utilizadas
- **HTML**: Para la estructura de la aplicación.
- **Bootstrap**: Para el diseño y la responsividad.
- **JavaScript**: Para la lógica y las interacciones dinámicas.
- **json-server**: Para simular una API REST con el archivo `db.json`.

## 🚀 Cómo funciona
1. Ingresa el número de mesa y la hora.
2. Visualiza y selecciona los platillos deseados junto con sus cantidades.
3. Consulta el resumen del pedido y ajusta las cantidades según sea necesario.
4. Selecciona el porcentaje de propina y revisa el total final.

Disfruta de una experiencia simple y eficiente para gestionar pedidos en tu restaurante. 🍴

### :globe_with_meridians: Mis redes:
:nazar_amulet: Linkedin: [Christina Pascual](https://www.linkedin.com/in/christina-pascual/)

:nazar_amulet: Twitter: [Christina Pascual](https://x.com/devchris03)

:nazar_amulet: Tiktok: [devChris03](https://www.tiktok.com/@devchris03?_t=8p5TriBHr3G&_r=1)
