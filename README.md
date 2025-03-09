# TamaGame

Este proyecto es un juego que consiste en moverse, rotar y disparar a otros jugadores. La parte de cliente esta hecha en JavaScript y la parte de servidor en TypeScript.

## Descripcion del codigo

1. **Cliente**

   - **cliente/src/UIv1.js**  
     He añadido las funciones que se encargan de dibujar el tablero, los jugadores y los controles. Ademas, manda mensajes a los jugadores en funcion de su estado en la partida (si estan vivos o muertos).

   - **cliente/src/services/GameService.js**  
     Mediante #actionList define acciones que se van a hacer (pintar el tablero, los controles o los jugadores) y con el Scheduler los procesa de manera ordenada.

   - **cliente/src/GameController.js**  
     Hace de mediador entre la interfaz de usuario y ConnectionHandler. No lo he modificado con respecto al codigo inicial de clase.

   - **cliente/src/services/ConnectionHandler.js**  
     Establece y mantiene la conexion con el servidor utilizando Socket.io. Gestiona el envio y la recepciin de mensajes. No lo he modificado con respecto al codigo inicial de clase.

2. **Servidor**

   - **server/src/game/GameService.ts**  
     Contiene la logica de los movimientos, las rotaciones y el disparo de los jugadores. Diria que es el archivo que mas he modificado y donde esta la logica fundamental del juego en si.

   - **server/src/game/BoardBuilder.ts**  
     Genera y configura el tablero con la posicion predefinida de los jugadores y los arbustos. 

   - **server/src/room/RoomService.ts**  
     Es el gestor de las salas. Añade jugadores a las salas, comprueba si se ha llegado a la capacidad maxima, busca jugadores y las salas en base al ID de estos.

   - **server/src/server/ServerService.ts**  
     Maneja la comunicación entre el servidor y el cliente a traves de Socket.io. Recoge los tipos de mensajes de rotar, moverse o dispara y se encarga de enviar mensajes de actualizacion, notificaciones y gestionar eventos de conexion o desconexion.

## Objetivos

**1. Diseño del Tablero y Mecánicas de Juego (20 puntos)**
- ✔️ Implementación de un tablero de tamaño NxN correctamente generado.
- ✔️ Configuración inicial de los jugadores en las esquinas del tablero.
- ✔️ Implementación de ataques entre jugadores con reglas de distancia.
- ❌ Implementación de casillas de escondite con normas de posicionamiento adecuadas. **(cuando un jugador se esconde en un arbusto desaparece su imagen pero no he implementado la funcionalidad de que no puedan entrar mas de un jugador en un mismo arbusto ni que no puedan disparar)**

**2. Comunicación Cliente-Servidor con WebSockets (20 puntos)**
- ✔️ Configuración del servidor para manejar conexiones de clientes vía WebSockets.
- ✔️ Envío y recepción de mensajes de manera eficiente entre cliente y servidor.
- ✔️ Sincronización en tiempo real del estado del juego en todos los clientes conectados.
- ❌ Manejo de desconexiones y reconexiones de jugadores sin afectar la partida. **(si un jugador recarga la pagina es como si se saliera de la partida y estuviera buscando una nueva)**

**3. Implementación del Cliente y Eventos del Juego (20 puntos)**
- ✔️ Representación visual dinámica del tablero y los jugadores según datos del servidor.
- ✔️ Implementación de eventos de juego: desplazamiento, rotación y disparo.
- ✔️ Diseño de una interfaz intuitiva para la interacción del jugador.
- ✔️ Adaptabilidad del cliente a posibles rediseños o mejoras futuras.

**4. Gestión de Salas y Control de Juego (20 puntos)**
- ✔️ Implementación de salas para gestionar partidas independientes.
- ✔️ Control centralizado del estado del juego en el servidor.
- ✔️ Compartición eficiente de datos del mapa entre todos los clientes.
- ✔️ Manejo de finalización de partidas y asignación de ganadores. **(se les muestra un mensaje a los jugadores que han sido eliminados y al que ha ganado)**

**5. Uso de Buenas Prácticas de Programación y Patrones de Diseño (10 puntos)**
- ✔️ Uso adecuado de clases, objetos JSON y patrones de diseño.
- ✔️ Código modular y bien estructurado que facilite la escalabilidad.

**6. Nivel Avanzado: Adaptación a Angular (10 puntos)**
- ❌ Refactorización del cliente para adaptarlo a Angular.
- ❌ Implementación de servicios y componentes en Angular para la gestión del juego.
