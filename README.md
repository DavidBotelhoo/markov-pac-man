# 🎮 Markov Pac-Man — Juego en Next.js + TypeScript + Tailwind (V4)

Este proyecto es una recreación personalizada del clásico **Pac-Man**, implementado en **Next.js**, **TypeScript** y **Tailwind CSS v4**, con una particularidad clave:

> 👉 **El movimiento de los fantasmas está modelado mediante Cadenas de Markov.**

El juego funciona tanto en navegador de escritorio como en dispositivos móviles (controles táctiles incluidos) y mantiene la estética retro tipo arcade (8-bit).

---

## 🧠 ¿Qué son las cadenas de Markov en este proyecto?

Una **Cadena de Markov** es un proceso estocástico donde la probabilidad del próximo estado depende únicamente del **estado actual**, y no del historial previo.

En este juego:

- Cada **célula del mapa** es un **estado**.
- Cada fantasma está siempre parado en un estado `(row, col)`.
- En cada “tick” del juego, el fantasma:
  1. Observa **solo sus celdas vecinas caminables** (no paredes).
  2. Forma un **vector de probabilidades** entre esos vecinos.
  3. Elige aleatoriamente su próximo estado según esa distribución.

Matemáticamente:

P(Xₙ₊₁ = s_j | Xₙ = s_i) = T[i][j]


Donde `T` es la **matriz de transición**, generada automáticamente a partir del mapa.

En este caso:
- Si una celda tiene 3 vecinos caminables, la probabilidad de ir a cada uno es `1/3`.
- No existe probabilidad de “quedarse quieto”.
- No se permite atravesar paredes, por lo que `T[i][j] = 0` si `j` es un muro.

> 📌 **Cada movimiento de cada fantasma es literalmente una transición aleatoria en una Cadena de Markov.**

---

## 🗺️ Generación de la matriz de transición

En `/lib/markov.ts` se arma la matriz de transición:

- Se convierte cada celda `(row, col)` en un ID único.
- Se listan todas las celdas alcanzables desde cada estado.
- Se asignan probabilidades iguales a cada transición válida.
- Se normaliza la matriz para asegurar que cada fila sume 1.

Esto produce una matriz enorme de tamaño:

(28 * 31) × (28 * 31) = 868 × 868


*(solo las celdas caminables tienen transiciones)*

---

## 👻 Movimiento de fantasmas

Los fantasmas:

- Se mueven cada `200 ms` aproximadamente.
- En modo **frightened** (cuando Pac-Man come un Power Pellet), se mueven más lento.
- Nunca atraviesan paredes.
- Pueden “aparecer” nuevos cuando el jugador suma puntos (hasta 10 máximos).
- Se visualizan con una animación suave (no salto brusco de celda).

Matemáticamente, cada tick es:

estado_actual = celda_del_fantasma
nueva_celda = sample(T[estado_actual])

---

## 🟡 Movimiento del Pac-Man

El movimiento del Pac-Man **no** usa Markov:  
lo controla el jugador con:

- teclado (PC)
- botones táctiles (mobile)

Cada movimiento:

- rota el sprite según dirección
- genera una animación suave `transition-transform`
- detecta colisiones con pellets, power pellets y fantasmas

---

## 🧩 Mapa Arcade Original (28×31)

El mapa utilizado es una reconstrucción del laberinto del **Pac-Man original**, con:

- paredes
- pellets
- power pellets (en esquinas)
- la “ghost house”
- teletransportes horizontales

---

## 📱 Adaptación mobile

Se agregaron:

- botones táctiles ↑ ← → ↓
- desactivación de zoom en mobile (`touch-action`, `user-scalable=no`)
- pop-up inicial “Iniciar juego”
- pop-up de “Game Over” por encima del mapa

---

## 🔥 Funcionalidades implementadas

### ✔ Movimiento del Pac-Man con rotación y animación suave  
### ✔ Movimiento de fantasmas mediante **Cadena de Markov**
### ✔ Power Pellets (modo frightened)
### ✔ Fantasmas cambian de color cuando tienen miedo
### ✔ Fantasmas extra aparecen al sumar puntos
### ✔ Game Over con pop-up
### ✔ Pantalla inicial “Iniciar”
### ✔ Modo totalmente jugable en **mobile**
### ✔ Sin zoom accidental en pantallas táctiles
### ✔ Mapa original arcade
### ✔ Código en TypeScript modular (mapa, markov, grid, página principal)

---

## 📂 Estructura del proyecto

`/`
`├── app/`
`│ ├── page.tsx # Lógica del juego y render general`
`│ ├── layout.tsx # Head + meta viewport (mobile fix)`
`│ └── globals.css # Estilos globales`
`├── components/`
`│ └── GameGrid.tsx # Renderización del mapa + sprites + animaciones`
`├── lib/`
`│ ├── map.ts # Mapa original, pellets, power pellets, spawn`
`│ └── markov.ts # Generación de la matriz de transición Markov`
`├── public/`
`└── README.md`

---

## 🧠 Motivación académica

Este proyecto es ideal para:

- demostrar una aplicación **visual e intuitiva** de Cadenas de Markov
- ilustrar modelos estocásticos con animaciones reales
- enseñar probabilidad condicional en grafos
- mostrar cómo se construye una matriz de transición en entornos reales
- usar Markov en un entorno divertido, concreto y testable

---

## 🤝 Mejoras futuras

- Implementar los 4 fantasmas clásicos (Blinky, Pinky, Inky, Clyde) con IA real
- Frenetismo cuando queda un solo pellet (como el arcade)
- Sonidos arcade originales
- Niveles con velocidad incremental
- Power-up de “super velocidad”
- Guardado del high-score en LocalStorage

---

## 📜 Licencia

Proyecto libre para uso educativo y personal.

---

## ✨ Autor

Desarrollado por **David**, como proyecto educativo y experimental para experimentar con:
- Programación web moderna (Next.js + TS)
- Diseño retro 8-bit
- Cadenas de Markov aplicadas a videojuegos
