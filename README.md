# 📊 Choropleth Map - Educational Attainment in U.S. Counties

Este proyecto renderiza un **mapa coroplético interactivo** utilizando [D3.js](https://d3js.org/) y [TopoJSON](https://github.com/topojson/topojson-client), que muestra el porcentaje de adultos con título universitario o superior en cada condado de los Estados Unidos.

## 🚀 Demo

> Puedes ver el mapa en acción [aquí](https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json).

## 📦 Tecnologías Utilizadas

- 📌 [D3.js v7](https://github.com/d3/d3)
- 📌 [TopoJSON Client](https://github.com/topojson/topojson-client)
- 📌 Datos públicos proporcionados por [freeCodeCamp](https://www.freecodecamp.org)

## 📁 Estructura Principal

### `drawChoroplethMap(container, tooltipEl, tooltipData, tooltipStyle)`

Función principal que dibuja el mapa:

| Parámetro        | Tipo           | Descripción |
|------------------|----------------|-------------|
| `container`      | HTMLElement    | Contenedor donde se monta el SVG |
| `tooltipEl`      | HTMLElement    | Elemento DOM que representa el tooltip |
| `tooltipData`    | Object (Vue)   | Objeto reactivo con propiedades `name` y `education` |
| `tooltipStyle`   | Object (Vue)   | Objeto reactivo para estilos CSS (posición y opacidad del tooltip) |

## 🧠 Descripción Funcional

- 🗺️ **Carga de datos:** 
  - JSON con porcentajes educativos por condado (`bachelorsOrHigher`)
  - Mapa en formato TopoJSON (`counties.json`)

- 🎨 **Escala de color:** 
  - Basada en rangos de porcentaje (e.g. 0–12%, 12–21%, ...)

- 🔎 **Interacción:**
  - Tooltip que muestra nombre del condado, estado y porcentaje educativo al pasar el mouse.

- 📚 **Leyenda:** 
  - Rango de colores con etiquetas descriptivas en porcentaje.

## 📊 Ejemplo Visual

![Choropleth Map Demo](https://user-images.githubusercontent.com/placeholder/demo.png)

> ⚠️ Reemplaza la imagen con una captura de tu propia implementación.

## 🛠️ Instalación

```bash
npm install d3 topojson-client
