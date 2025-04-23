[🔙 Volver al README](../README.md)

# WebSocket API Documentation

## Endpoint

**URL:** `ws://localhost:8080/connect-game`

**Protocol:** STOMP

---

## Subscriptions

### 🔓 Públicas

#### `/topic/num-players`

**Descripción:**

Devuelve el número de jugadores cuyo estado sea distinto de `DISCONNECT`. Los posibles estados de un jugador son:

- `CONNECT`
- `WAITING`
- `FIGHTING`
- `DISCONNECT`
- **Formato de respuesta:**

```json
{
  "num_players": 1
}
```

---

### 🔐 Privadas

#### `/user/queue/list-players`

**Descripción:**

Devuelve el listado de todos los jugadores registrados, independientemente de su estado, excluyendo al propio usuario.

**Formato de respuesta:**

```json
[
  {
    "sessionId": "2cf41329-1d47-9661-1c02-363587207fb1",
    "name": "eva",
    "house": "casa",
    "sessionStatus": "CONNECT"
  }
]
```

---

#### `/user/queue/errors`

**Descripción:**

Canal para recibir errores personalizados relacionados con la sesión, validaciones o reglas del juego.

**Posibles errores:**

- `SESSION_ERROR`: "Session ID is null"
- `VALIDATION_ERROR`: "Name is required"
- `VALIDATION_ERROR`: "House is required"
- `PLAYER_NOT_FOUND`: "Session ID not registered"
- `PLAYER_NOT_REGISTER`: "Name or House not registered"
- `ROOM_FULL`: "The room is already full"
- `TOKEN_INVALID`: "Invalid or expired Token: <mensaje de error>"
- `SESSION_NOT_FOUND`: "The original session doesn’t exist."
- `PLAYER_IN_ROOM`: "You are already in the room"
- `PLAYER_IS_WAITING`: "You are already waiting"
- `PLAYER_IS_FIGHTING`: "You are already fighting"
- `ROOM_NOT_FOUND`: "Room not found"
- `PLAYER_NOT_FOUND`: "Player not found in this room"
- `SPELL_NOT_FOUND`: "Spell not found"
- `SPELL_ALREADY_SENT`: "You already cast a spell this round"
- **Formato de respuesta:**

```json
{
  "type": "TYPE",
  "message": "description"
}
```

---

#### `/user/queue/token-id`

⚠️ **Disclaimer:** Este endpoint está definido pero actualmente **no está en uso**

**Descripción:**

Devuelve un token de autenticación para futuras acciones.

**Formato de respuesta:**

```json
{
  "token_id": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjcxYjk4Zi1kZDZmLTc4MzgtM2Y1Ni1kZDI0OTA5Y2ExM2IiLCJpYXQiOjE3NDM2OTc2NzgsImV4cCI6MTc0MzcwMTI3OH0.kGyp0kHhC81o_QU-6rRNXoTBDyfdORO30iYZ4lErbxY"
}
```

---

#### `/user/queue/register-user`

**Descripción:**

Devuelve la confirmación de registro de usuario tras enviar los datos a `/app/register-user`.

**Formato de respuesta:**

```json
{
  "sessionId": "2cf41329-1d47-9661-1c02-363587207fb1",
  "name": "manu",
  "house": "campo",
  "sessionStatus": "CONNECT"
}
```

---

#### `/user/queue/duel`

**Descripción:**

Recibes el `room_id` más la información de tu `oponent` cuando se te asigna una sala de duelo (solicitado previamente desde `/app/duel`).

**Formato de respuesta:**

```json
{
  "room_id": "12312313-123123-123-123123",
  "oponent": {
    "sessionId": "60c44dac-4410-285e-b03b-df154007556a",
    "name": "player",
    "house": "house",
    "sessionStatus": "FIGHTING"
  }
}
```

---

#### `/user/queue/round/result`

**Descripción:**

Devuelve el resultado de la ronda actual, incluyendo el número de ronda, los jugadores involucrados, el hechizo utilizado por cada uno y la cantidad de rondas ganadas por cada jugador.  
El campo `gameOver` será `true` cuando alguno de los jugadores alcance tres victorias.

**Formato de respuesta:**

```json
{
  "round": 1,
  "gameOver": false,
  "result": {
    "winner": "55f04db1-8d82-7d98-0128-6c0f860964a7" | null,
    "status": "WINNER" | "DRAW"
  },
  "players": [
    {
      "id": "87a3bb00-cb7f-6407-5ac3-97e0ba6f70e3",
      "spellUsed": "8da58423-a8ba-4b7b-898c-d050fdc18cd1",
      "roundsWon": 0
    },
    {
      "id": "55f04db1-8d82-7d98-0128-6c0f860964a7",
      "spellUsed": "0772e01a-bdfd-4d3f-9c6d-60b9cb84be9d",
      "roundsWon": 1
    }
  ]
}
```

---

## Publish (Enviar mensajes)

### `/app/token-id`

⚠️ **Disclaimer:** Este endpoint está definido pero actualmente **no está en uso**

**Descripción:**

Solicita un token para recuperar cuenta de usuario al perder la conexion o salirte durante x tiempo.
Responde por `/user/queue/token-id`

**Body:**

```json
{}
```

**Headers:**

```json
{}
```

---

### `/app/duel`

**Descripción:**

Solicita entrar en un duelo. No requiere body ni headers actualmente.
Responde por `/user/queue/duel`

**Body:**

```json
{}
```

**Headers:**

```json
{}
```

---

### `/app/register-user`

**Descripción:**

Registra un nuevo usuario en el sistema. Responde por `/user/queue/register-user`

**Body:**

```json
{
  "name": "manu",
  "house": "campo"
}
```

**Headers:**

```json
{
  "token": "123123123-312312-123123-123123" ⚠️!important
}
```

> ⚠️ Actualmente los headers están vacíos, pero se prevé el uso de `token` más adelante.

---

### `/app/round/{roomId}`

**Descripción:**

Envía el hechizo seleccionado por el jugador en una sala de juego y solicita el resultado de la ronda una vez que ambos jugadores hayan enviado su hechizo.  
La ronda se resuelve automáticamente cuando ambos jugadores hayan enviado su hechizo.

**Parámetros de ruta:**

- `roomId` (UUID): Identificador de la sala en la que se está desarrollando la partida.

**Body:**

```json
{
  "spellId": "c55467de-5c51-4c7c-87f6-ae3d1bd3c506"
}
```

**Headers:**

```json
{}
```

---

## Notas finales

- Todas las rutas privadas comienzan por `/user/queue/`
- Las rutas públicas comienzan por `/topic/`
- Las publicaciones se hacen con prefijo `/app/`
- El `sessionStatus` de un jugador puede ser: `CONNECT`, `WAITING`, `FIGHTING`, `DISCONNECT`.

---

# 📘 API: Obtener Hechizos

**Endpoint:**

```json
GET http://domain:port/spells
```

## Descripción:

Este endpoint devuelve un listado de hechizos disponibles en el sistema, junto con su hechizo que actúa como contrahechizo (counterSpell).

**Format:**

```json
[
  {
    "id": "2d2e3423-50ae-44d3-8926-85e49be8a21a",
    "name": "Avada Kedavra",
    "counterSpell": {
      "id": "9d9869d8-45c6-4fea-88e2-3ab7d96fc4e6",
      "name": "Expelliarmus"
    }
  },
  {
    "id": "9d9869d8-45c6-4fea-88e2-3ab7d96fc4e6",
    "name": "Expelliarmus",
    "counterSpell": {
      "id": "dd3d767e-afe4-44d7-a00a-c17542f3f9f5",
      "name": "Protego"
    }
  },
  {
    "id": "dd3d767e-afe4-44d7-a00a-c17542f3f9f5",
    "name": "Protego",
    "counterSpell": {
      "id": "2d2e3423-50ae-44d3-8926-85e49be8a21a",
      "name": "Avada Kedavra"
    }
  }
]
```

© Magic Duel WebSocket API - 2025
