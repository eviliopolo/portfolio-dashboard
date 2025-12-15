# Instrucciones para subir a GitHub

## Pasos para conectar y subir el código:

1. **Crea el repositorio en GitHub:**
   - Ve a https://github.com/new
   - Nombre: `portfolio-dashboard`
   - Descripción: "Dashboard gerencial de proyectos con tema blacklight/cyberpunk"
   - Elige si será público o privado
   - NO marques "Initialize with README"
   - Clic en "Create repository"

2. **Conecta tu repositorio local con GitHub:**
   
   Ejecuta estos comandos (reemplaza `TU_USUARIO` con tu usuario de GitHub):
   
   ```bash
   git remote add origin https://github.com/TU_USUARIO/portfolio-dashboard.git
   git branch -M main
   git push -u origin main
   ```

3. **Si GitHub te muestra comandos diferentes**, úsalos en lugar de los anteriores.

## Nota importante:

- El archivo Excel (`DASHBOARD_PORTAFOLIO.xlsx`) NO se subirá a GitHub (está en .gitignore)
- Cada usuario deberá colocar su propio archivo Excel en `public/data/`
- Los `node_modules` tampoco se suben (se instalan con `npm install`)

## Después de subir:

1. Actualiza el README.md con la URL de tu repositorio
2. Agrega una sección de "Instalación" si es necesario
3. Considera agregar badges de estado si usas CI/CD

