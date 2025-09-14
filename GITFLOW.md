# Git Flow

## 1. Rama main (Producción)

- Es la rama estable y lista para producción.
- No se toca directamente; todas las actualizaciones provienen de staging mediante Pull Request.

## 2. Rama staging (Pruebas)

- Se utiliza para integrar y probar las nuevas funcionalidades antes de pasar a producción.
- Los desarrolladores pueden hacer merge directo de sus feature branches en staging.

## 3. Ramas feature

- Cada desarrollador crea su rama a partir de staging (por ejemplo, `feature/nueva-funcionalidad`).
- Se desarrolla la funcionalidad en la feature branch.

## Flujo de trabajo

1. **Actualizar staging:**

   - Antes de comenzar, asegúrense de que staging esté actualizado con los últimos cambios.

2. **Crear feature branch:**

   - Desde staging, crea una nueva rama para tu funcionalidad.

3. **Desarrollar y commitear:**

   - Realiza los cambios y commitea en tu feature branch.

4. **Merge directo a staging:**

   - Una vez completada la funcionalidad, haz merge directo de tu feature branch a staging.

5. **Pruebas en staging:**

   - Todo el equipo prueba e integra las funcionalidades en staging.

6. **Pull Request a main:**
   - Cuando staging esté estable y aprobado, se crea un Pull Request desde staging a main.
   - Este Pull Request debe ser revisado y aprobado antes de integrar los cambios a producción.

## Acciones después del merge a staging

- **Verificar la integración:**

  - Realiza pruebas manuales para asegurarte de que la nueva funcionalidad se comporta correctamente y no afecta otras áreas.

- **Comunicación:**

  - Informa al equipo sobre la integración para coordinar pruebas adicionales y detectar posibles problemas.

- **Limpieza de ramas:**

  - Una vez verificada la integración, elimina la feature branch para mantener el repositorio ordenado.

- **Preparación para producción:**
  - Con la rama staging estable, procede a generar el Pull Request a main para el despliegue final.
