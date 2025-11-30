// Script completo para arreglar filtros y migrar datos
// Este script debe ejecutarse en la consola del navegador

(function() {
    console.log('🔧 Iniciando corrección de filtros y migración de datos...');
    
    // 1. Agregar función clearServiceFilters al objeto window
    window.clearServiceFilters = function() {
        console.log('🧹 Limpiando filtros...');
        
        // Resetear filtros
        currentFilters = {
            category: '',
            petSize: '',
            minPrice: 0,
            maxPrice: 10000,
            minCapacity: 0
        };
        
        // Remover clase active de todos los botones de filtro
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('[data-pet-size]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('[data-price-range]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Resetear inputs si existen
        const minCapacityInput = document.getElementById('minCapacity');
        if (minCapacityInput) {
            minCapacityInput.value = '';
        }
        
        // Recargar todos los servicios
        if (typeof applyAllFilters === 'function') {
            applyAllFilters();
        } else if (typeof loadServices === 'function') {
            loadServices();
        }
        
        console.log('✅ Filtros limpiados');
    };
    
    // 2. Asegurar que filterByPetSize esté disponible globalmente
    window.filterByPetSize = function(size) {
        console.log('🔍 Filtrando por tamaño:', size);
        
        if (typeof currentFilters === 'undefined') {
            window.currentFilters = {
                category: '',
                petSize: '',
                minPrice: 0,
                maxPrice: 10000,
                minCapacity: 0
            };
        }
        
        currentFilters.petSize = size;
        
        // Actualizar botones activos
        document.querySelectorAll('[data-pet-size]').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-pet-size="${size}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Aplicar todos los filtros
        if (typeof applyAllFilters === 'function') {
            applyAllFilters();
        }
    };
    
    // 3. Migrar servicios existentes en Firebase
    async function migrateExistingServices() {
        console.log('📦 Migrando servicios existentes...');
        
        try {
            // Obtener todos los servicios
            const servicesRef = firebase.database().ref('services');
            const snapshot = await servicesRef.once('value');
            const services = snapshot.val();
            
            if (!services) {
                console.log('ℹ️ No hay servicios para migrar');
                return;
            }
            
            let migratedCount = 0;
            const updates = {};
            
            // Procesar cada servicio
            for (const [serviceId, service] of Object.entries(services)) {
                let needsUpdate = false;
                const updatedService = { ...service };
                
                // Agregar acceptedPetSizes si no existe
                if (!service.acceptedPetSizes) {
                    updatedService.acceptedPetSizes = {
                        small: true,
                        medium: true,
                        large: true
                    };
                    needsUpdate = true;
                    console.log(`  ✓ Agregando acceptedPetSizes a servicio ${serviceId}`);
                }
                
                // Agregar capacity si no existe
                if (!service.capacity || service.capacity === 0) {
                    // Asignar capacidad basada en categoría
                    if (service.category === 'nanny') {
                        updatedService.capacity = 2;
                    } else if (service.category === 'daycare') {
                        updatedService.capacity = 5;
                    } else if (service.category === 'boarding') {
                        updatedService.capacity = 3;
                    } else {
                        updatedService.capacity = 1;
                    }
                    needsUpdate = true;
                    console.log(`  ✓ Agregando capacity (${updatedService.capacity}) a servicio ${serviceId}`);
                }
                
                // Agregar minCapacity si no existe
                if (!service.minCapacity) {
                    updatedService.minCapacity = 1;
                    needsUpdate = true;
                    console.log(`  ✓ Agregando minCapacity a servicio ${serviceId}`);
                }
                
                // Si necesita actualización, agregarlo al batch
                if (needsUpdate) {
                    updates[`services/${serviceId}`] = updatedService;
                    migratedCount++;
                }
            }
            
            // Aplicar todas las actualizaciones
            if (migratedCount > 0) {
                await firebase.database().ref().update(updates);
                console.log(`✅ ${migratedCount} servicios migrados exitosamente`);
            } else {
                console.log('✅ Todos los servicios ya tienen los datos necesarios');
            }
            
        } catch (error) {
            console.error('❌ Error migrando servicios:', error);
        }
    }
    
    // 4. Migrar servicios en localStorage también
    function migrateLocalStorageServices() {
        console.log('💾 Migrando servicios en localStorage...');
        
        try {
            const servicesData = localStorage.getItem('services');
            if (!servicesData) {
                console.log('ℹ️ No hay servicios en localStorage');
                return;
            }
            
            const services = JSON.parse(servicesData);
            let migratedCount = 0;
            
            for (const service of services) {
                let needsUpdate = false;
                
                // Agregar acceptedPetSizes si no existe
                if (!service.acceptedPetSizes) {
                    service.acceptedPetSizes = {
                        small: true,
                        medium: true,
                        large: true
                    };
                    needsUpdate = true;
                }
                
                // Agregar capacity si no existe
                if (!service.capacity || service.capacity === 0) {
                    if (service.category === 'nanny') {
                        service.capacity = 2;
                    } else if (service.category === 'daycare') {
                        service.capacity = 5;
                    } else if (service.category === 'boarding') {
                        service.capacity = 3;
                    } else {
                        service.capacity = 1;
                    }
                    needsUpdate = true;
                }
                
                // Agregar minCapacity si no existe
                if (!service.minCapacity) {
                    service.minCapacity = 1;
                    needsUpdate = true;
                }
                
                if (needsUpdate) {
                    migratedCount++;
                }
            }
            
            if (migratedCount > 0) {
                localStorage.setItem('services', JSON.stringify(services));
                console.log(`✅ ${migratedCount} servicios en localStorage migrados`);
            } else {
                console.log('✅ Servicios en localStorage ya están actualizados');
            }
            
        } catch (error) {
            console.error('❌ Error migrando localStorage:', error);
        }
    }
    
    // 5. Ejecutar migraciones
    console.log('🚀 Ejecutando migraciones...');
    
    // Migrar localStorage inmediatamente
    migrateLocalStorageServices();
    
    // Migrar Firebase si está disponible
    if (typeof firebase !== 'undefined' && firebase.database) {
        migrateExistingServices().then(() => {
            console.log('✅ Migración completa');
            console.log('🔄 Recargando servicios...');
            
            // Recargar servicios si la función existe
            if (typeof loadServices === 'function') {
                loadServices();
            }
        });
    } else {
        console.log('⚠️ Firebase no disponible, solo se migró localStorage');
    }
    
    console.log('✅ Script de corrección cargado exitosamente');
    console.log('📝 Funciones disponibles:');
    console.log('  - clearServiceFilters() - Limpiar todos los filtros');
    console.log('  - filterByPetSize(size) - Filtrar por tamaño de mascota');
    
})();
