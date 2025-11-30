// Script para arreglar servicios sin categoría en Firebase
// Ejecutar desde la consola del navegador

async function fixMissingCategories() {
    console.log('🔧 Iniciando corrección de categorías faltantes...');
    
    const DATABASE_URL = 'https://petcare-pwa-default-rtdb.firebaseio.com/';
    
    try {
        // 1. Obtener todos los servicios
        const response = await fetch(`${DATABASE_URL}services.json`);
        const data = await response.json();
        
        if (!data || !data.data || !Array.isArray(data.data)) {
            console.error('❌ No se pudieron cargar los servicios');
            return;
        }
        
        const services = data.data;
        console.log(`📊 Total servicios: ${services.length}`);
        
        // 2. Identificar servicios sin categoría o con categoría inválida
        const allowedCategories = ['nanny', 'daycare', 'boarding'];
        let fixed = 0;
        
        services.forEach((service, index) => {
            if (!service) return;
            
            const hasCategory = service.category && allowedCategories.includes(service.category);
            
            if (!hasCategory) {
                console.log(`🔧 Servicio ${index} sin categoría válida:`, service.title);
                
                // Asignar categoría basada en el título o descripción
                if (service.title && service.title.toLowerCase().includes('guardería')) {
                    service.category = 'daycare';
                } else if (service.title && service.title.toLowerCase().includes('hospedaje')) {
                    service.category = 'boarding';
                } else {
                    // Por defecto, asignar 'nanny' (niñera)
                    service.category = 'nanny';
                }
                
                // Asegurar que tenga el ícono correcto
                const categoryIcons = {
                    'nanny': '👤',
                    'daycare': '🏠',
                    'boarding': '🏨'
                };
                service.icon = categoryIcons[service.category];
                
                console.log(`✅ Categoría asignada: ${service.category} ${service.icon}`);
                fixed++;
            }
        });
        
        if (fixed === 0) {
            console.log('✅ Todos los servicios ya tienen categoría válida');
            return;
        }
        
        // 3. Guardar servicios actualizados en Firebase
        console.log(`💾 Guardando ${fixed} servicios corregidos...`);
        
        const saveResponse = await fetch(`${DATABASE_URL}services.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: services })
        });
        
        if (saveResponse.ok) {
            console.log('✅ Servicios actualizados correctamente en Firebase');
            console.log(`🎉 ${fixed} servicios corregidos`);
            console.log('🔄 Recarga la página para ver los cambios');
        } else {
            console.error('❌ Error al guardar en Firebase:', saveResponse.status);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Ejecutar la corrección
fixMissingCategories();
