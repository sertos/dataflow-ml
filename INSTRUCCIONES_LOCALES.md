# DataFlow ML - Instrucciones Locales

Sigue estos pasos para correr el proyecto **DataFlow ML** de manera local en tu máquina o computadora. Si descargas este proyecto como ZIP, sigue estos pasos:

## Requisitos Previos

- Tener instalado [Node.js](https://nodejs.org/es/) (Versión 18 o superior). Esto instalará también el gestor de paquetes `npm`.
- Un editor de texto como [Visual Studio Code](https://code.visualstudio.com/).

## Pasos de Instalación y Ejecución

1.  **Descomprimir el archivo ZIP**: Extrae el contenido en una carpeta de tu preferencia.
2.  **Abrir la Terminal/Consola**: 
    Abre una terminal y colócate dentro de la carpeta del proyecto que acabas de descomprimir, donde se encuentra el archivo `package.json`.
3.  **Instalar dependencias**: 
    Ejecuta el siguiente comando para descargar todos los paquetes necesarios del proyecto.
    ```bash
    npm install
    ```
4.  **Configurar Variables de Entorno (Opcional)**:
    - Renombra el archivo `.env.example` a `.env` (si es necesario).
5.  **Iniciar el servidor de desarrollo local**:
    Una vez que termines de instalar, ejecuta el comando para lanzar el servidor.
    ```bash
    npm run dev
    ```
6.  **Probar en el Navegador**:
    Luego de 1 o 2 segundos, la terminal mostrará un mensaje indicando que el servidor está corriendo en el puerto 3000 o 5173. Generalmente puedes abrir Chrome o Edge e ingresar en la barra de direcciones:
    [http://localhost:3000](http://localhost:3000) o en su defecto `http://localhost:5173`.
    Desde allí podrás probar la aplicación funcional, tal cual interactúas con ella en esta vista previa.

## Construcción para Producción

Si deseas generar una versión empaquetada lista para subir a un hosting estático (como Vercel, Netlify, o similares), ejecuta:
```bash
npm run build
```
Esto creará una carpeta llamada `dist` con los archivos optimizados.
