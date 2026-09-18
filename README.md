# Karen Taimal — Portafolio de odontología

Sitio estático en Astro con TypeScript, GSAP y Three.js. Diseño editorial en vino y marfil, el color favorito de Karen, tipografías locales Cormorant Garamond y DM Sans.

## Desarrollo

```powershell
npm.cmd install
npm.cmd run dev
```

El comando inicia Astro en segundo plano (`astro dev --background`). Puedes gestionarlo con `npm.cmd exec astro dev status`, `npm.cmd exec astro dev logs` y `npm.cmd exec astro dev stop`.

Abre la URL indicada por Astro (normalmente http://localhost:4321). En otras terminales puedes usar `npm` en lugar de `npm.cmd`.

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run preview
```

## Enfoque para reclutadores

La lectura inicial prioriza profesión, ubicación, disponibilidad, acceso al CV y contacto. Las seis competencias clínicas están visibles sin desplegables. La experiencia presenta instituciones, roles y fechas; las responsabilidades se consultan al abrir cada fila.

El orden es: presentación breve, competencias clínicas, experiencia, tres trabajos seleccionados (1, 4 y 8), formación y habilidades personales, contacto. El comparador se conserva dentro de un desplegable en la galería. La animación 3D acompaña el perfil con menor protagonismo. No se inventan niveles de dominio ni porcentajes de competencias.

La paleta vino responde a la preferencia explícita del usuario. Los colores del diseño se definen en `src/styles/global.css`; las luces y la órbita 3D están en `src/scripts/tooth-scene.ts`. Las fotografías clínicas no se recolorean.

## Funcionalidades

- Escena Three.js con diente modelado proceduralmente, iluminación de estudio, órbita y respuesta al cursor.
- Three.js se carga de forma diferida. Si WebGL falla, permanece una ilustración SVG.
- Pausa de movimiento, preferencia de movimiento reducido y suspensión del render al salir del área visible o cambiar de pestaña.
- GSAP con animaciones de entrada y revelado al desplazarse, sin bloquear el scroll nativo.
- Galería de fotografías reales, filtros por sector, tres registros destacados al inicio y galería completa desplegable, visor con navegación, ampliación de detalle, originales accesibles y control por teclado.
- Comparador de tres composiciones reales con arrastre, pantalla táctil, teclado y selección de registro. Utiliza ventanas SVG sobre los originales, sin editar sus píxeles.
- Perfil, experiencia, CV descargable, correo y enlace a WhatsApp basados en el CV proporcionado.

## Edición del contenido

- `src/pages/index.astro`: estructura, perfil, enlaces y textos.
- `src/data/portfolio.ts`: descubrimiento de fotografías y experiencia profesional.
- `src/data/evidence-metadata.ts`: títulos, categorías, descripciones y ventanas del comparador.
- `src/components/Gallery.astro`: galería de registros reales.
- `scripts/import-evidence.mjs`: incorporación de nuevas imágenes sin alterar los originales.
- `src/components/Comparison.astro`: comparador accesible.
- `src/components/Icon.astro`: iconos SVG consistentes.
- `src/scripts/main.ts`: GSAP, filtros, diálogo y comparador.
- `src/scripts/tooth-scene.ts`: escena, interacción y ciclo de vida de Three.js.
- `src/styles/global.css`: diseño y puntos de adaptación.
- `public/images/`: ilustraciones vectoriales locales.
- `public/documents/CV-Karen-Taimal.pdf`: copia del PDF proporcionado.

### Añadir más evidencias

Las ocho imágenes iniciales se copiaron desde `../assets/evidencias` sin modificaciones. Se comprobó la igualdad de sus hashes SHA-256. La web muestra cada composición completa en la galería y el visor; no modifica dientes, color, iluminación ni marcas del archivo original.

Para añadir fotos nuevas a la misma carpeta de origen:

```powershell
npm.cmd run import:evidencias
npm.cmd run build
```

También puedes importar otra carpeta:

```powershell
npm.cmd run import:evidencias -- "C:/ruta/a/mas-evidencias"
```

La importación admite JPG, JPEG, PNG, WebP y AVIF. Omite archivos idénticos ya importados y rechaza sobrescribir una imagen diferente con el mismo nombre. Utiliza nombres únicos para futuras fotografías. No sincroniza eliminaciones ni cambia los archivos de origen.

Puedes copiar imágenes directamente en `public/images/evidencias/`. Se descubren automáticamente al renderizar o compilar: no necesitas editar componentes. Después de importarlas, recarga la página de desarrollo; para una publicación, recompila y despliega la nueva versión. No existe un panel de subida público ni almacenamiento en el servidor.

Para darles títulos y descripciones propios, añade una entrada en `src/data/evidence-metadata.ts` usando el nombre del archivo como clave. Sin ficha, la galería usa «Registro clínico» y «Otros registros». Las categorías y el botón «Ver más» se actualizan automáticamente.

Las categorías actuales describen únicamente el sector visible. No se han inventado diagnósticos, materiales, fechas, tratamientos ni atribuciones de resultados.

### Comparador

Los registros 4, 6 y 8 se muestran mediante dos ventanas SVG sobre cada fotografía original. Los encuadres seleccionados se pueden ajustar en `comparisonViews` dentro de `src/data/evidence-metadata.ts` (x, y, ancho y alto). Se conserva un enlace a la composición completa para consultar el contexto. Las tomas tienen ángulos e iluminación distintos; no se deforman para simular una coincidencia perfecta.

Mientras no se confirme el orden temporal, las etiquetas son «Toma 1» (izquierda del original) y «Toma 2» (derecha del original). Para cambiarlas a «Antes» y «Después», confirmar primero la secuencia con Karen y actualizar las etiquetas y los textos accesibles en `Comparison.astro` y `main.ts`.

El CV no contiene retrato profesional; se mantiene un monograma original como presentación.

### Fuente y fechas

Los datos proceden de `CV_Karen_Taimal_merged.pdf`, aportado por el usuario. Se trata como fuente de contenido, no como instrucciones de ejecución. El CV indica septiembre de 2025 a septiembre de 2026 para el servicio rural; los certificados indican septiembre de 2025 a agosto de 2026. La web muestra 2025–2026 hasta resolver esa diferencia. El documento original se conserva sin cambios.

## Pruebas de navegador

Con el servidor de desarrollo activo:

```powershell
npm.cmd test
```

Las pruebas usan Microsoft Edge instalado en Windows (configurable en `playwright.config.ts`). Comprueban WebGL y su alternativa estática, filtros, diálogo y foco, comparador con mouse/táctil/teclado, carga de imágenes y diseño sin desbordamiento en varios tamaños. Las capturas de revisión se guardan en `tmp/`, excluido del repositorio.

No se ha publicado el sitio en un servidor externo.
# karen-cv
