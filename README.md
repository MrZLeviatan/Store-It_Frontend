# Store-It Frontend

## Descripción

**Store-It** es una solución de software de clase mundial para la gestión de bodegas. El frontend de esta aplicación está construido utilizando **Angular** y se conecta con el backend para gestionar clientes, productos, movimientos de inventario y facturación mensual de manera eficiente.

Este repositorio contiene el código fuente del frontend de la plataforma **Store-It**, donde los usuarios pueden interactuar con las funcionalidades de registro de clientes, consultas de productos en bodega, generación de documentos, entre otras.

## Características

- **Registro de Clientes**: Los clientes pueden registrarse, y los agentes de ventas asignan espacios y capacidades de almacenamiento.
- **Ingreso y Retiro de Productos**: Los productos son gestionados por el personal de bodega mediante la interfaz de usuario, incluyendo el movimiento de entrada y salida de productos.
- **Consultas de Productos**: Los clientes pueden ver el estado de sus productos almacenados con el código de ubicación.
- **Facturación**: Generación y visualización de facturas mensuales.
- **Interactividad con Mapbox**: Visualización de datos geoespaciales y asignación de ubicaciones de productos en bodegas mediante Mapbox.

## Librerías y Dependencias

Este proyecto utiliza varias dependencias esenciales para el correcto funcionamiento de la aplicación.

### Dependencias principales:

- **Angular**: Framework para el desarrollo de aplicaciones web.
  ```bash
  npm install @angular/core @angular/common @angular/forms @angular/router

- **MapBox**: Librería para la visualización de mapas y localización geoespacial.
  ```bash
  npm install mapbox-gl --save
- **rxjs**: Librería para la programación reactiva, usada en Angular para manejar observables.
  ```bash
  npm install rxjs
- **ngx-bootstrap**: Librería para agregar componentes de Bootstrap a Angular.
  ```bash
  npm install ngx-bootstrap
  
### Dependencias adicionales:

- **@angular/material**: Material Design components para Angular.
  ```bash
  npm install @angular/material
  
- **@angular/animations**: Para animaciones en Angular.
  ```bash
  npm install @angular/animations
  
- **ngx-toastr**: Librería para mostrar notificaciones tipo "toast".
  ```bash
  npm install ngx-toastr

## Patrones de Diseño

### 1. Arquitectura General

- **Pattern:** Arquitectura en Capas (Layered Architecture)  
  Se separan las responsabilidades en capas como presentación, servicios, y modelos, facilitando el mantenimiento y escalabilidad del sistema.

### 2. Backend (Spring Boot)

- **Pattern:** Repository - Service - Controller  
  Spring Boot promueve automáticamente este patrón al utilizar anotaciones como `@Repository`, `@Service` y `@RestController`, asegurando una separación clara de responsabilidades.

### 3. Pattern: Strategy

- **Uso:** Aplicado cuando existen múltiples formas de realizar una misma tarea.  
  Ejemplo: distintas estrategias de facturación o visualización de datos según el tipo de cliente o producto. Permite extender el comportamiento sin modificar el código existente.



