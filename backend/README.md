# Café Backend - ASP.NET Core API

API REST minimalista en ASP.NET Core para procesar datos del formulario de análisis de cafés.

## Requisitos

- **.NET SDK 8.0+** (descargar desde https://dotnet.microsoft.com/download)

## Instalación

```bash
# Restaurar dependencias
dotnet restore

# Construir proyecto
dotnet build
```

## Ejecución

```bash
# Ejecutar localmente (puerto 5000)
dotnet run
```

Deberías ver:
```
Now listening on http://localhost:5000
Now listening on https://localhost:5001
```

## Endpoints

### POST `/api/cafe/analyze`

Recibe datos del formulario, los imprime en consola y devuelve un string de confirmación.

**Request:**
```json
{
  "customer": "Ivan Ivanov",
  "cuisine": "cafeteria",
  "location": "center",
  "competitors": 3,
  "parking": "free",
  "entrance": "street",
  "avgCheck": 850,
  "anchor": "none",
  "notes": "Ubicación prometedora",
  "timestamp": "13/4/2026 6:20 PM"
}
```

**Response:** `string`
```
Análisis completado para Ivan Ivanov el 13/4/2026 6:20 PM
```

**Salida en consola:**
```
=== CAFE ANALYSIS REQUEST ===
Customer: Ivan Ivanov
Cuisine: cafeteria
Location: center
Competitors: 3
...
=============================
```

### GET `/health`

Health check simple.

**Response:** `OK`

## Configuración CORS

El backend permite requests desde:
- `http://localhost:5173` (frontend Vite desarrollo)
- `http://localhost:3000` (puerto alternativo)
- `https://joantarazona99.github.io` (GitHub Pages producción)

Para agregar más orígenes, edita `Program.cs`:

```csharp
.WithOrigins("http://new-origin.com")
```

## Variables de Entorno (Frontend)

En el frontend, configura la URL del backend con:

```javascript
// En App.tsx
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
```

**Desarrollo local:**
```bash
cd ../
REACT_APP_BACKEND_URL=http://localhost:5000 npm run dev
```

**Producción (si backend en Azure, etc.):**
```bash
REACT_APP_BACKEND_URL=https://tu-backend.azurewebsites.net npm run build
```

## Despliegue

### Azure Free Tier

```bash
# 1. Crear recurso en Azure
az webapp up -n cafe-backend -g cafe-group --sku FREE --runtime "DOTNET|8.0"

# 2. Push automático después de cambios
git push azure main
```

### Render

```bash
# 1. Conectar repositorio en render.com
# 2. Configurar Build Command: dotnet build
# 3. Configurar Start Command: dotnet run --launch-profile https
```

### Railway

```bash
# 1. Conectar repo en railway.app
# 2. Detecta .NET automáticamente
# 3. Deploy con un click
```

## Desarrollo Local

Para hacer cambios al backend:

1. Edita `Program.cs`
2. Ejecuta `dotnet run` (se recompila automáticamente)
3. El frontend en `http://localhost:5173` enviará requests a `http://localhost:5000`

## Troubleshooting

**"No .NET SDKs were found"**
→ Instala .NET SDK desde https://dotnet.microsoft.com/download

**CORS errors**
→ Verifica que la URL del frontend esté en `AllowFrontend` en `Program.cs`

**Port 5000 already in use**
→ Cambia el puerto: `dotnet run --urls "http://localhost:5001"`

---

**Creado para:** Dmitri Pavlov (mayo 2026)  
**Stack:** ASP.NET Core 8.0, Minimal APIs
