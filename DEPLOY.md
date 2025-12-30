# Guía de Deploy - PAPI FÚTBOL ROLÓN

Esta guía te ayudará a subir el proyecto a GitHub y desplegarlo en Vercel.

## 📋 Prerrequisitos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Supabase](https://supabase.com) (ya deberías tenerla)
- Git instalado en tu máquina

## 🚀 Paso 1: Preparar el repositorio Git

### 1.1 Inicializar Git (si no está inicializado)

```bash
cd /Users/rodolfovalentinseimandi/Documents/Trabajo/rolon
git init
```

### 1.2 Verificar que .gitignore esté correcto

El archivo `.gitignore` ya está configurado para ignorar:
- `node_modules/`
- `.env` y `.env.local` (importante: no subir credenciales)
- `.next/`
- Archivos temporales

### 1.3 Hacer el primer commit

```bash
# Agregar todos los archivos
git add .

# Hacer el commit inicial
git commit -m "Initial commit: PAPI FÚTBOL ROLÓN"
```

## 📤 Paso 2: Subir a GitHub

### 2.1 Crear un repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** (arriba a la derecha) > **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `papi-futbol-rolon` (o el nombre que prefieras)
   - **Description**: "Aplicación web para gestión de torneo de fútbol"
   - **Visibility**: Elige **Private** (recomendado) o **Public**
   - **NO marques** "Initialize this repository with a README" (ya tenemos uno)
4. Haz clic en **"Create repository"**

### 2.2 Conectar el repositorio local con GitHub

GitHub te mostrará comandos similares a estos. Ejecútalos en tu terminal:

```bash
# Asegúrate de estar en el directorio del proyecto
cd /Users/rodolfovalentinseimandi/Documents/Trabajo/rolon

# Agregar el remote (reemplaza USERNAME con tu usuario de GitHub)
git remote add origin https://github.com/USERNAME/papi-futbol-rolon.git

# Cambiar el nombre de la rama a main (si es necesario)
git branch -M main

# Subir el código
git push -u origin main
```

**Nota**: Si GitHub te pide autenticación, puedes usar:
- **Personal Access Token** (recomendado): Ve a GitHub Settings > Developer settings > Personal access tokens > Generate new token
- O configura SSH keys

## 🌐 Paso 3: Configurar Supabase

### 3.1 Crear el proyecto en Supabase (si aún no lo hiciste)

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración

### 3.2 Ejecutar el schema SQL

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase/schema.sql` de este proyecto
3. Copia y pega todo el contenido
4. Ejecuta el script (botón "Run")

### 3.3 Obtener las credenciales

1. En Supabase, ve a **Settings** > **API**
2. Copia estos valores:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon/public key** (la clave pública, no la service_role)

## 🚢 Paso 4: Deploy en Vercel

### 4.1 Conectar con GitHub

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Si es tu primera vez, autoriza Vercel para acceder a tu cuenta de GitHub
3. Haz clic en **"Add New..."** > **"Project"**
4. Importa tu repositorio `papi-futbol-rolon`
5. Vercel detectará automáticamente que es un proyecto Next.js

### 4.2 Configurar el proyecto

En la pantalla de configuración:

1. **Framework Preset**: Debería detectar "Next.js" automáticamente
2. **Root Directory**: Deja `./` (por defecto)
3. **Build Command**: `npm run build` (por defecto)
4. **Output Directory**: `.next` (por defecto)
5. **Install Command**: `npm install` (por defecto)

### 4.3 Configurar Variables de Entorno

**IMPORTANTE**: Antes de hacer deploy, configura las variables de entorno:

1. En la sección **"Environment Variables"**, agrega:

   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_project_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

2. Reemplaza los valores con los que obtuviste de Supabase en el paso 3.3

### 4.4 Hacer el Deploy

1. Haz clic en **"Deploy"**
2. Espera a que Vercel construya y despliegue tu aplicación (2-3 minutos)
3. Una vez completado, verás una URL como: `https://papi-futbol-rolon.vercel.app`

## ✅ Paso 5: Verificar el Deploy

1. Abre la URL que te dio Vercel
2. Deberías ver la aplicación funcionando
3. Prueba acceder a `/admin` para verificar que todo funciona

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios y los subas a GitHub:

```bash
# Hacer commit de los cambios
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Vercel detectará automáticamente los cambios y hará un nuevo deploy.

## 🔒 Seguridad

**IMPORTANTE**: 
- ✅ Las variables de entorno en Vercel están seguras y no son visibles públicamente
- ✅ El archivo `.gitignore` evita que subas `.env` a GitHub
- ⚠️ Recuerda que la aplicación NO tiene autenticación, cualquiera puede acceder a `/admin` si conoce la URL

## 🐛 Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que las variables de entorno estén configuradas en Vercel
- Asegúrate de que los nombres sean exactamente: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Error al hacer build
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel para ver el error específico

### La aplicación no se conecta a Supabase
- Verifica que el schema SQL se haya ejecutado correctamente
- Confirma que las credenciales en Vercel sean correctas
- Revisa la consola del navegador para ver errores de conexión

## 📞 Soporte

Si tienes problemas, revisa:
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)

---

¡Listo! Tu aplicación debería estar funcionando en producción. 🎉

