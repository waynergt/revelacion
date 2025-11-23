# 👶 Gender Reveal Interactive App

Una aplicación web interactiva diseñada para llevar las revelaciones de
género al siguiente nivel. Olvídate de los videos simples; este proyecto
ofrece una **experiencia en tiempo real** con suspenso, efectos de
sonido y una narrativa de "Falla del Sistema" para sorprender a los
invitados.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind
CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Características Principales

-   **🎬 Narrativa Interactiva:**
    -   Pantalla de espera ("¿Están listos?").
    -   Cuenta regresiva dramática sincronizada.
-   **⚠️ Modo "Prank" (Broma):**
    -   Simulación de terminal de hacker y análisis de ADN.
    -   Efecto de "Error del Sistema" (Glitch) para generar tensión
        antes del final.
-   **🎉 Revelación Dinámica:**
    -   Explosión de confeti.
    -   Cambio de tema de colores (Rosa/Azul) automático.
    -   Mensaje personalizado.
-   **🔊 Diseño de Sonido (Audio Sync):**
    -   Redoble de tambores durante el conteo.
    -   Sonido de error/glitch en el momento de tensión.
    -   Música de celebración triunfal al revelar.
-   **📱 UX Avanzada:**
    -   Botón de **Pantalla Completa** para TVs y proyectores.
    -   Botón de **"Repetir Emoción"** para reiniciar la experiencia sin
        recargar la página.

## 🛠️ Tecnologías Utilizadas

-   **Core:** React 18 + Vite
-   **Lenguaje:** TypeScript
-   **Estilos:** Tailwind CSS v4
-   **Animaciones:** Framer Motion
-   **Efectos:** React Confetti
-   **Despliegue:** Vercel

## 🚀 Instalación y Uso Local

1.  **Clonar el repositorio:**
    `bash     git clone https://github.com/waynergt/revelacion.git     cd revelacion`

2.  **Instalar dependencias:** `bash     npm install`

3.  **Ejecutar servidor de desarrollo:** `bash     npm run dev`

4.  **Archivos de Audio:** Asegúrate de que la carpeta `/public/sounds/`
    contenga:

    -   `drumroll.mp3`
    -   `glitch.mp3`
    -   `celebration.mp3`

## ⚙️ Configuración (Niño vs Niña)

Para cambiar el resultado de la revelación, edita:

``` ts
const IS_BOY = false; // false = NIÑA 👧 | true = NIÑO 👦
```

Este valor controla: - Colores (Rosa/Azul) - Mensaje ("Princesa" vs
"Campeón") - Color del confeti - Emojis

## 📂 Estructura del Proyecto

    /public
      /sounds        # Archivos de audio (mp3)
    /src
      /components    # GenderReveal.tsx
      App.tsx
      main.tsx

## ✒️ Autor

**Wayner Lopez**\
GitHub: https://github.com/waynergt
