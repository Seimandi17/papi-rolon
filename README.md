# PAPI FÚTBOL ROLÓN

Aplicación web responsive para gestión y visualización de un torneo de fútbol.

## 🚀 Características

- **Vista Pública**: Estadísticas, tabla de posiciones, fixture, resultados, goleadores y amonestaciones
- **Panel Admin**: Gestión completa de equipos, grupos, partidos y jugadores
- **Cálculo Automático**: Tabla de posiciones con sistema de desempate (PTS > DG > GF > menor GC)
- **Responsive**: Diseño mobile-first optimizado para todos los dispositivos
- **Persistencia Real**: Base de datos PostgreSQL en Supabase

## 📋 Requisitos Previos

- Node.js 18+ y npm/yarn
- Cuenta en [Supabase](https://supabase.com) (gratuita)

## 🛠️ Instalación Local

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

#### a) Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta (si no tienes una)
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración (puede tardar unos minutos)

#### b) Ejecutar el schema SQL

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase/schema.sql` de este proyecto
3. Copia y pega todo el contenido en el editor SQL
4. Ejecuta el script (botón "Run" o `Cmd/Ctrl + Enter`)

**⚠️ IMPORTANTE**: El schema desactiva RLS (Row Level Security) para simplificar el acceso. Esto significa que **cualquiera con las credenciales puede leer y escribir datos**. Para producción, deberías implementar autenticación y políticas de seguridad.

#### c) Obtener credenciales

1. En el dashboard de Supabase, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon/public key** (la clave pública)

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
rolon/
├── app/
│   ├── admin/          # Panel de administración
│   │   ├── groups/     # Gestión de grupos
│   │   ├── matches/    # Gestión de partidos
│   │   ├── players/    # Gestión de jugadores
│   │   └── teams/      # Gestión de equipos
│   ├── globals.css     # Estilos globales
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página pública (Home)
├── components/
│   ├── ui/             # Componentes UI reutilizables
│   ├── CardsTable.tsx  # Tabla de tarjetas
│   ├── MatchCard.tsx   # Tarjeta de partido
│   ├── ScorersTable.tsx # Tabla de goleadores
│   └── StandingsTable.tsx # Tabla de posiciones
├── lib/
│   ├── api.ts          # Funciones de API (Supabase)
│   ├── calculations.ts # Cálculo de posiciones
│   ├── supabase.ts     # Cliente de Supabase
│   └── types.ts        # Tipos TypeScript
├── public/
│   └── logo.png        # Logo del torneo
└── supabase/
    └── schema.sql      # Schema de la base de datos
```

## 🎨 Personalización

### Logo

Reemplaza el archivo `public/logo.png` con tu logo. El logo debe ser cuadrado o tener proporciones similares para verse bien.

### Colores

Los colores del brand están configurados en `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#6B1C2A',  // Maroon/Burgundy
    dark: '#4A141D',
    light: '#8B2A3A',
  },
  secondary: {
    DEFAULT: '#D4AF37',  // Gold
    dark: '#B8941F',
    light: '#E5C158',
  },
  accent: {
    DEFAULT: '#222222',  // Dark gray/Black
    light: '#444444',
  },
}
```

Puedes modificar estos valores según tu preferencia.

## 🚢 Deploy en Vercel

### 1. Preparar el proyecto

Asegúrate de que tu código esté en un repositorio Git (GitHub, GitLab, etc.).

### 2. Crear proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta o inicia sesión
2. Haz clic en "New Project"
3. Importa tu repositorio
4. Vercel detectará automáticamente que es un proyecto Next.js

### 3. Configurar variables de entorno

En la configuración del proyecto en Vercel:

1. Ve a **Settings** > **Environment Variables**
2. Agrega las siguientes variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Tu Project URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu anon key de Supabase

### 4. Deploy

Vercel desplegará automáticamente. Una vez completado, tendrás una URL pública.

## 📊 Uso de la Aplicación

### Vista Pública (`/`)

- **Posiciones**: Tabla de posiciones por grupo con cálculo automático
- **Fixture**: Partidos programados
- **Resultados**: Partidos finalizados
- **Goleadores**: Top jugadores por goles
- **Amonestaciones**: Tablas de tarjetas amarillas y rojas
- **Equipos**: Listado de equipos con estadísticas

### Panel Admin (`/admin`)

1. **Configuración**: Nombre del torneo, edición, reglas de puntos
2. **Equipos**: Crear, editar y eliminar equipos
3. **Grupos**: Crear grupos y asignar equipos
4. **Partidos**: 
   - Crear partidos (grupo, fecha, equipos)
   - Cargar resultados (goles) y marcar como finalizado
5. **Jugadores**: 
   - Crear jugadores por equipo
   - Editar estadísticas (goles, tarjetas)

## 🔒 Seguridad

**⚠️ ADVERTENCIA IMPORTANTE**: Esta aplicación **NO tiene autenticación**. Cualquiera que conozca la URL `/admin` puede modificar los datos. 

Para producción, deberías:
1. Implementar autenticación (NextAuth, Supabase Auth, etc.)
2. Habilitar RLS en Supabase con políticas apropiadas
3. Proteger las rutas `/admin` con middleware

Por ahora, el schema SQL desactiva RLS para simplificar el desarrollo.

## 🧮 Sistema de Desempate

La tabla de posiciones se ordena automáticamente según:

1. **Puntos (PTS)**: Mayor primero
2. **Diferencia de Goles (DG)**: Mayor primero
3. **Goles a Favor (GF)**: Mayor primero
4. **Goles en Contra (GC)**: Menor primero
5. **Tarjetas Amarillas (TA)**: Menor primero (opcional)

## 🐛 Solución de Problemas

### Error: "Missing Supabase environment variables"

Asegúrate de que el archivo `.env.local` existe y tiene las variables correctas. Reinicia el servidor de desarrollo después de crear/modificar el archivo.

### Error al ejecutar el schema SQL

Verifica que:
- El proyecto de Supabase esté completamente configurado
- No haya errores de sintaxis en el SQL
- Tengas permisos para crear tablas

### La tabla de posiciones no se actualiza

Asegúrate de que:
- Los partidos estén marcados como "finalizados"
- Los equipos estén asignados a grupos
- Los partidos tengan el `group_id` correcto

## 📝 Datos de Ejemplo (Seed)

Puedes crear datos de ejemplo manualmente desde el panel Admin:

1. Crear 4-8 equipos
2. Crear 1-2 grupos y asignar equipos
3. Crear algunos partidos y marcarlos como finalizados con resultados
4. Crear jugadores y asignarles estadísticas

## 🛠️ Tecnologías

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL)
- **date-fns** (manejo de fechas)

## 📄 Licencia

Este proyecto es de uso privado.

---

**Desarrollado para PAPI FÚTBOL ROLÓN** ⚽

