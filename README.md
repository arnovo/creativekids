# 🎨 CreativaKids

CreativaKids es una plataforma web interactiva diseñada especialmente para niños, orientada al fomento de la creatividad a través del dibujo y el arte. La aplicación proporciona un entorno seguro y divertido donde los usuarios pueden aprender a dibujar paso a paso, colorear ilustraciones, y dejar volar su imaginación en un lienzo libre.

## 🌟 Características Principales

*   **Aprende a Dibujar (Paso a Paso):** Tutoriales interactivos que guían al usuario trazo a trazo para crear dibujos completos. Incluye un "Modo Calcar" y un sistema de herramientas inteligentes.
*   **Zona de Colorear:** Galería de ilustraciones vectoriales listas para ser pintadas usando una herramienta mágica de "Cubo de pintura" (Flood fill real sobre Canvas).
*   **Lienzo Libre:** Espacio en blanco con una paleta de colores y herramientas para dibujar sin reglas.
*   **Mis Notas:** Un bloc de notas interactivo para escribir cuentos o apuntes y añadirles trazos por encima.
*   **Guardado Inteligente:** La aplicación guarda el progreso exacto (cada trazo, color y paso) de cada dibujo o página de colorear de forma totalmente independiente en una base de datos, permitiendo retomar cualquier obra de arte en futuras sesiones.

## 🛠️ Stack Tecnológico

El proyecto está contenerizado con Docker y dividido en los siguientes servicios:
*   **Frontend:** Vue 3 + Vuetify 3 + Vite + Pinia (Gestión de estado) + Fabric.js (Motor de Canvas 2D).
*   **Backend:** Laravel 11 (PHP 8.3) operando como una API REST.
*   **Base de Datos:** PostgreSQL 16.
*   **Proxy / Web Server:** Nginx (Alpine).

---

## 🚀 Guía de Despliegue Rápido

El proyecto está diseñado para funcionar *"Out of the box"* utilizando Docker Compose. Sigue estos pasos para levantarlo en tu máquina local:

### 1. Requisitos Previos
Asegúrate de tener instalados:
*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)
*   Git

### 2. Clonar e Iniciar el Proyecto
Abre tu terminal, sitúate en la raíz del proyecto y ejecuta:

```bash
# Iniciar todos los contenedores en segundo plano
docker compose up -d
```

*Nota: La primera vez que ejecutes este comando, Docker descargará las imágenes y compilará las dependencias de Node (npm install) y Composer de forma automática. Puede tardar un par de minutos.*

### 3. Preparar la Base de Datos
Una vez que todos los contenedores estén corriendo (`creativakids-backend`, `creativakids-frontend`, `creativakids-db`, `creativakids-nginx`), es necesario inicializar las tablas de la base de datos y llenarlas con el contenido inicial (bocetos y plantillas para colorear):

```bash
# Ejecutar migraciones e inyectar el contenido semilla (Seeders)
docker compose exec backend php artisan migrate --seed
```

### 4. ¡A dibujar! 🎨
La aplicación ya está lista. Abre tu navegador web favorito y entra en:
👉 **[http://localhost:8080](http://localhost:8080)**

---

## 💻 Comandos Útiles de Mantenimiento

**Ver los logs del sistema (frontend o backend):**
```bash
docker compose logs -f frontend
docker compose logs -f backend
```

**Parar el proyecto:**
```bash
docker compose down
```

**Limpiar la base de datos y reiniciar de cero:**
```bash
docker compose exec backend php artisan migrate:fresh --seed
```

**Instalar nuevas dependencias en el backend:**
```bash
docker compose exec backend composer require nombre/paquete
```

**Instalar nuevas dependencias en el frontend:**
```bash
docker compose exec frontend npm install nombre-paquete
```
