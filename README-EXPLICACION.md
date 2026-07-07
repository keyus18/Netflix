# Reseñaflix — Guía del proyecto

Plataforma de streaming (estilo Netflix) donde cada película tiene su portada,
descripción, calificación de 0 a 5 estrellas y un muro de reseñas de usuarios.

> Le puse el nombre ficticio **"Reseñaflix"** en vez de "Netflix" a propósito:
> así evitamos usar una marca registrada real en un trabajo que van a presentar.
> Toda la estética (colores, tipografía, layout) sigue siendo la de Netflix.

---

## 1. Instalación

Estos archivos están pensados para pegarse DENTRO de tu proyecto Vite que ya
tenés creado (el de la captura que mandaste). No pisan tu `package.json` ni tu
`vite.config.js` actuales, salvo que decidas reemplazarlos.

```bash
# 1) Parado en la carpeta de tu proyecto (MI-PR...), instalá las dos librerías nuevas:
npm install react-router-dom

# 2) json-server se usa como herramienta de desarrollo, no va en producción:
npm install -D json-server

# 3) Copiá/reemplazá estos archivos en tu proyecto:
#    - db.json                              -> raíz del proyecto (mismo nivel que package.json)
#    - src/main.jsx                         -> reemplaza el que ya tenés
#    - src/App.jsx                          -> reemplaza el que ya tenés
#    - src/App.css                          -> reemplaza el que ya tenés
#    - src/index.css                        -> reemplaza el que ya tenés
#    - src/pages/Home.jsx
#    - src/pages/MovieDetail.jsx
#    - src/pages/Buscar.jsx
#    - src/pages/NotFound.jsx
#    - src/components/Navbar.jsx
#    - src/components/MovieCard.jsx
#    - src/components/StarRating.jsx
#    - src/components/ReviewForm.jsx
#    - src/components/ReviewList.jsx

# 4) Agregá este script en tu package.json (dentro de "scripts"):
#    "server": "json-server --watch db.json --port 3001"
```

### Para correrlo necesitás DOS terminales abiertas a la vez:

```bash
# Terminal 1 — "la base de datos"
npm run server
# queda escuchando en http://localhost:3001

# Terminal 2 — la app de React
npm run dev
# queda escuchando en http://localhost:5173 (o el puerto que te muestre Vite)
```

Si solo corrés `npm run dev` y no `npm run server`, la página va a quedar
cargando infinito porque el `fetch` nunca recibe respuesta. **Es el error más
común, revisalo primero si algo no carga.**

---

## 2. ¿Por qué json-server y no "SQL" directamente?

Tu enunciado pide "consumo de datos de una base de datos". Noté que tu
proyecto ya tenía un archivo **`db.json`** creado de antes — esa es la marca
distintiva de la librería `json-server`, así que armé todo alrededor de eso.

`json-server` toma ese archivo y lo levanta como una **API REST real** sobre
HTTP (no es magia, es un servidor de Node corriendo en tu máquina). Eso
significa que tu componente de React hace exactamente lo mismo que haría
contra una base SQL de verdad:

```js
fetch('http://localhost:3001/movies')   // GET
fetch('http://localhost:3001/reviews', { method: 'POST', ... }) // INSERT
```

Desde el punto de vista de React **no hay diferencia** entre esto y consumir
MySQL/PostgreSQL: en ambos casos el componente solo sabe que le llega JSON
por una URL. Si tu cátedra exige específicamente un motor SQL (no JSON), lo
que cambiaría es el backend (un server Node/Express + SQLite o MySQL), pero
**ni un solo archivo de React tendría que modificarse** — los endpoints
seguirían siendo los mismos. Si llegás a necesitar eso, decímelo y armamos
ese backend también.

---

## 3. Mapeo de cada requisito del enunciado

| Requisito mínimo | Dónde está |
|---|---|
| Diseño previo de baja/media fidelidad | `wireframe-baja-fidelidad.svg` |
| 3 rutas funcionales (sin contar 404) | `App.jsx` → `/`, `/pelicula/:id`, `/buscar` |
| 2 componentes propios | `MovieCard.jsx` y `StarRating.jsx` (hay 3 más de regalo: `Navbar`, `ReviewForm`, `ReviewList`) |
| 2 useState | Hay 9 en total. Los más representativos: `movies/loading` en `Home.jsx` y `hoverRating` en `StarRating.jsx` |
| 2 useEffect | `Home.jsx` (deps `[]`, corre una vez) y `MovieDetail.jsx` (deps `[id]`, corre de nuevo si cambia la URL) |
| 2 eventos distintos | `onClick` (estrellas, links) y `onChange` (buscador, formulario). También hay `onSubmit` y `onMouseEnter`/`onMouseLeave` |
| Consumo de datos de una base de datos | `fetch` a json-server en `Home.jsx`, `MovieDetail.jsx`, `Buscar.jsx` y `ReviewForm.jsx` (GET y POST) |

---

## 4. Guía rápida para la defensa oral

**"¿Cómo viaja la información desde la base de datos hasta la pantalla?"**
1. `db.json` tiene los datos en disco.
2. `json-server` los expone como endpoints HTTP (`/movies`, `/reviews`).
3. Cada página usa `useEffect` para pedirlos con `fetch` apenas se monta.
4. La respuesta se guarda en una variable de estado con `useState`.
5. React vuelve a renderizar automáticamente apenas ese estado cambia.

**"¿Por qué useEffect y no llamar al fetch directamente en el componente?"**
Porque si el `fetch` se ejecutara durante el render, se dispararía una
petición nueva CADA VEZ que el componente se re-renderiza (loop infinito).
`useEffect` lo aísla para que corra solo cuando vos decidís (al montar, o
cuando cambia algo puntual del array de dependencias).

**"¿Qué pasa si publico una reseña, hace falta recargar la página?"**
No. `ReviewForm` hace el `POST`, y cuando json-server confirma que se guardó,
llama a `onReviewAdded` (una función que le pasamos por props desde
`MovieDetail`). Esa función mete la reseña nueva dentro del array de estado
con `setReviews([...anteriores, nueva])`, así que React la pinta al instante
sin pedirle nada de nuevo al servidor.

**"¿Cómo decide la app si una estrella se ve llena o vacía?"**
`StarRating` recibe `rating` (el valor real) y guarda en estado local
`hoverRating` (la posición del mouse). Cada estrella se pinta llena si su
número es menor o igual al mayor de los dos (`hoverRating || rating`). Eso da
el efecto de "vista previa" antes de confirmar el click.

**"¿Por qué `/pelicula/:id` y no una página por película?"**
Es una **ruta dinámica**: el `:id` es un parámetro variable. `useParams()`
lee ese valor de la URL actual, y con ÉL se le pide a json-server
"`/movies/:id`" y "`/reviews?movieId=:id`" solo los datos de esa película
puntual. Una sola página sirve para las 10 películas (o las que agregues).

---

## 5. Ideas para personalizarlo antes de entregar

- Las imágenes de portada son placeholders (`placehold.co`) para no usar
  posters reales con derechos de autor. Si querés, podés generar portadas
  propias o usar capturas de pantalla de un diseño hecho en Canva/Figma.
- Las 10 películas son ficticias por el mismo motivo. Cambialas por el tema
  que más les guste al grupo (igual sirve para defender "aplicación real").
- El nombre "Reseñaflix" lo pueden cambiar por cualquier otro en
  `Navbar.jsx` y en `index.html`.
