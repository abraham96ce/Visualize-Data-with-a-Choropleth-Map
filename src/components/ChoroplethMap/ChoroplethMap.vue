<template>
    <div>
        <h1 id="title">United States Educational Attainment</h1>
        <p id="description">Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</p>
        <div class="map-wrapper">
            <div ref="mapContainer"></div>
            <div id="tooltip" ref="tooltip" class="tooltip" :style="tooltipStyle" :data-education="tooltipEducation">
                <p>{{ tooltipName }}</p>
                <p>{{ tooltipEducation }}% with Bachelor’s or higher</p>
            </div>
        </div>
    </div>
</template>

<script setup>
// Importa las funciones reactivas y de ciclo de vida de Vue
import { ref, reactive, onMounted } from 'vue'

// Importa la función personalizada que dibuja el mapa usando D3
import { drawChoroplethMap } from './ChoroplethMap'

// Referencia al contenedor del mapa SVG
const mapContainer = ref(null)

// Referencia al elemento tooltip en el DOM
const tooltip = ref(null)

// Valores reactivos para el contenido del tooltip
const tooltipEducation = ref(0)     // Porcentaje de educación
const tooltipName = ref('')         // Nombre del condado

// Estilos reactivos del tooltip para posicionarlo dinámicamente
const tooltipStyle = reactive({
  opacity: 0,
  left: '0px',
  top: '0px',
  position: 'absolute',
  pointerEvents: 'none',
  backgroundColor: '#fff',
  padding: '5px 10px',
  borderRadius: '5px',
  boxShadow: '0 0 5px rgba(0,0,0,0.3)',
  fontSize: '14px',
  transition: 'opacity 0.3s',
})

// Cuando el componente se monta, se llama a la función para generar el mapa
onMounted(() => {
  drawChoroplethMap(
    mapContainer.value,   // Elemento DOM donde se dibuja el mapa
    tooltip.value,        // Elemento DOM del tooltip
    {
      education: tooltipEducation, // Objeto reactivo para el porcentaje
      name: tooltipName            // Objeto reactivo para el nombre del condado
    },
    tooltipStyle         // Estilos reactivos del tooltip
  )
})
</script>