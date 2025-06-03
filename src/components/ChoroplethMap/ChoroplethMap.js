// Importa la biblioteca D3 para manipulación de documentos basada en datos
import * as d3 from 'd3'

// Importa la función 'feature' de TopoJSON para convertir objetos TopoJSON a GeoJSON
import { feature } from 'topojson-client'

/**
 * Dibuja un mapa coroplético de los Estados Unidos mostrando el porcentaje de adultos con
 * licenciatura o grado superior por condado, utilizando D3.js y TopoJSON.
 *
 * @param {HTMLElement} container - Elemento DOM donde se insertará el SVG del mapa.
 * @param {HTMLElement} tooltipEl - Elemento DOM del tooltip que muestra información interactiva.
 * @param {Object} tooltipData - Objeto reactivo con propiedades `education` y `name` para mostrar en el tooltip.
 * @param {Object} tooltipStyle - Objeto reactivo con estilos CSS para posicionar y mostrar el tooltip.
 */
export async function drawChoroplethMap(container, tooltipEl, tooltipData, tooltipStyle) {
    // === 1. Carga de datos de educación y datos geográficos ===
    const educationData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
    const countyData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')

    // === 2. Configuración básica del SVG ===
    const width = 960
    const height = 600

    const svg = d3
        .select(container)             // Selecciona el contenedor donde se insertará el mapa
        .append('svg')                // Crea un nuevo elemento SVG
        .attr('width', width)        // Establece el ancho
        .attr('height', height)      // Establece la altura

    // === 3. Preparación de datos geográficos ===
    const path = d3.geoPath() // Generador de rutas geográficas
    const counties = feature(countyData, countyData.objects.counties).features // Convierte TopoJSON a GeoJSON

    // === 4. Escala de color para el nivel educativo ===
    const colorScale = d3
        .scaleThreshold()                 // Escala por tramos definidos
        .domain([12, 21, 30, 39])         // Umbrales de porcentaje de educación
        .range(d3.schemeBlues[5])         // Paleta de colores azulados

    // === 5. Renderizado de condados en el mapa ===
    svg
        .append('g')                      // Agrupa los elementos de condados
        .attr('class', 'counties')
        .selectAll('path')                // Selecciona todos los elementos <path>
        .data(counties)                   // Asocia los datos de condados
        .join('path')                     // Une los datos con los elementos
        .attr('class', 'county')          // Clase CSS para cada condado
        .attr('d', path)                  // Dibuja la ruta geográfica
        .attr('data-fips', d => d.id)     // Asigna el ID FIPS como atributo
        .attr('data-education', d => {
            // Busca el condado por su ID y extrae el porcentaje educativo
            const county = educationData.find(e => e.fips === d.id)
            return county ? county.bachelorsOrHigher : 0
        })
        .attr('fill', d => {
            // Define el color de relleno según la escala de color
            const county = educationData.find(e => e.fips === d.id)
            return county ? colorScale(county.bachelorsOrHigher) : '#ccc'
        })
        // === Eventos de interacción con el usuario ===
        .on('mouseover', (event, d) => {
            // Busca los datos educativos del condado actual
            const county = educationData.find(e => e.fips === d.id)
            if (!county) return

            // Actualiza contenido del tooltip (por referencias reactivas de Vue)
            tooltipData.education.value = county.bachelorsOrHigher
            tooltipData.name.value = `${county.area_name}, ${county.state}`

            // Muestra el tooltip y lo posiciona cerca del cursor
            tooltipStyle.opacity = 0.9
            tooltipStyle.left = event.pageX + 10 + 'px'
            tooltipStyle.top = event.pageY - 28 + 'px'
            tooltipEl.setAttribute('data-education', county.bachelorsOrHigher)
        })
        .on('mouseout', () => {
            // Oculta el tooltip cuando el cursor sale del condado
            tooltipStyle.opacity = 0
        })

    // === 6. Generación de la leyenda ===
    const legend = svg
        .append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${width - 400}, ${height - 50})`) // Posiciona la leyenda en la esquina inferior derecha

    // Define los rangos de porcentaje y sus colores asociados
    const thresholds = colorScale.domain()
    const ranges = colorScale.range().map((color, i) => ({
        color,
        range: [i === 0 ? 0 : thresholds[i - 1], thresholds[i] || 50], // Define los intervalos para cada color
    }))

    // Dibuja los bloques de color en la leyenda
    legend
        .selectAll('rect')
        .data(ranges)
        .join('rect')
        .attr('x', (d, i) => i * 80)   // Posiciona horizontalmente cada bloque
        .attr('y', 0)
        .attr('width', 80)
        .attr('height', 20)
        .attr('fill', d => d.color)
        .attr('stroke', 'black')

    // Añade las etiquetas de texto debajo de cada bloque
    legend
        .selectAll('text')
        .data(ranges)
        .join('text')
        .attr('x', (d, i) => i * 80 + 10)
        .attr('y', 35)
        .attr('font-size', '12px')
        .text(d => `${Math.floor(d.range[0])}% - ${Math.floor(d.range[1])}%`)
}
