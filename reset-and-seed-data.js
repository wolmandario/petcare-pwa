/**
 * Script para resetear y cargar datos de prueba completos
 * Ejecutar en consola del navegador
 */

(async function resetAndSeedData() {
    console.log('🔄 INICIANDO RESET Y CARGA DE DATOS...');
    
    // Datos completos de servicios con TODOS los campos necesarios
    const cleanServices = [
        {
            id: 1,
            title: 'Cuidado Personalizado Luna',
            category: 'nanny',
            icon: '🐕',
            price: 800,
            priceUnit: 'día',
            description: 'Servicio de niñera profesional para hasta 3 mascotas. Cuidado personalizado en casa del cuidador o del dueño.',
            location: 'Centro',
            address: 'Av. 18 de Julio 1234, Montevideo',
            coordinates: [-56.1645, -34.9011],
            capacity: 3,
            minCapacity: 1,
            serviceLocation: {
                caregiverHome: true,
                clientHome: true
            },
            schedule: {
                monday: { available: true, start: '08:00', end: '18:00' },
                tuesday: { available: true, start: '08:00', end: '18:00' },
                wednesday: { available: true, start: '08:00', end: '18:00' },
                thursday: { available: true, start: '08:00', end: '18:00' },
                friday: { available: true, start: '08:00', end: '18:00' },
                saturday: { available: false },
                sunday: { available: false }
            },
            acceptedPetSizes: {
                small: true,
                medium: true,
                large: false
            },
            rating: 4.8,
            reviews: 127,
            caregiver: 'María González',
            caregiverId: 1,
            features: ['Cuidado personalizado', 'Reportes diarios', 'Experiencia con cachorros'],
            active: true,
            hidden: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 2,
            title: 'Guardería Happy Pets',
            category: 'daycare',
            icon: '🎾',
            price: 400,
            priceUnit: 'día',
            description: 'Guardería diurna con actividades, socialización y cuidado profesional. Capacidad para múltiples mascotas.',
            location: 'Punta Gorda',
            address: 'Rambla República de México 5678, Montevideo',
            coordinates: [-56.1167, -34.8667],
            capacity: 10,
            minCapacity: 1,
            schedule: {
                monday: { available: true, start: '07:00', end: '19:00' },
                tuesday: { available: true, start: '07:00', end: '19:00' },
                wednesday: { available: true, start: '07:00', end: '19:00' },
                thursday: { available: true, start: '07:00', end: '19:00' },
                friday: { available: true, start: '07:00', end: '19:00' },
                saturday: { available: true, start: '08:00', end: '14:00' },
                sunday: { available: false }
            },
            acceptedPetSizes: {
                small: true,
                medium: true,
                large: true
            },
            rating: 4.6,
            reviews: 203,
            caregiver: 'Roberto Silva',
            caregiverId: 5,
            features: ['Socialización', 'Actividades', 'Monitoreo', 'Alimentación incluida'],
            active: true,
            hidden: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 3,
            title: 'Hotel Canino Pocitos',
            category: 'boarding',
            icon: '🏠',
            price: 600,
            priceUnit: 'día',
            description: 'Hospedaje para mascotas con amplios espacios verdes, cuidado personalizado las 24 horas y actividades recreativas.',
            location: 'Pocitos',
            address: 'Calle Benito Blanco 1234, Montevideo',
            coordinates: [-56.1644, -34.9089],
            capacity: 8,
            minCapacity: 1,
            accommodationType: 'mixed',
            acceptedPetSizes: {
                small: true,
                medium: true,
                large: true
            },
            rating: 4.9,
            reviews: 89,
            caregiver: 'Ana Martínez',
            caregiverId: 3,
            features: ['Espacios verdes', 'Cuidado 24h', 'Actividades', 'Cámaras de seguridad'],
            active: true,
            hidden: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    
    try {
        console.log('1️⃣ Limpiando datos antiguos...');
        
        // Limpiar localStorage
        localStorage.removeItem('services');
        console.log('   ✅ localStorage limpiado');
        
        // Limpiar Firebase
        if (typeof firebase !== 'undefined' && firebase.database) {
            await firebase.database().ref('services').remove();
            console.log('   ✅ Firebase limpiado');
        }
        
        console.log('2️⃣ Cargando datos nuevos...');
        
        // Guardar en localStorage
        localStorage.setItem('services', JSON.stringify(cleanServices));
        console.log('   ✅ Datos guardados en localStorage');
        
        // Guardar en Firebase
        if (typeof firebase !== 'undefined' && firebase.database) {
            await firebase.database().ref('services').set(cleanServices);
            console.log('   ✅ Datos guardados en Firebase');
        }
        
        console.log('3️⃣ Actualizando variable global...');
        
        // Actualizar testServices
        if (typeof testServices !== 'undefined') {
            testServices.length = 0;
            testServices.push(...cleanServices);
            console.log('   ✅ testServices actualizado:', testServices.length, 'servicios');
        }
        
        console.log('4️⃣ Recargando vistas...');
        
        // Recargar todas las vistas
        if (typeof loadFeaturedServices === 'function') {
            loadFeaturedServices();
            console.log('   ✅ Inicio recargado');
        }
        
        if (typeof loadAllServices === 'function') {
            loadAllServices();
            console.log('   ✅ Servicios recargados');
        }
        
        if (typeof initializeMap === 'function') {
            setTimeout(() => {
                initializeMap();
                if (typeof updateNearbyServices === 'function') {
                    updateNearbyServices();
                }
                console.log('   ✅ Mapa recargado');
            }, 500);
        }
        
        console.log('');
        console.log('✅ ¡RESET COMPLETADO EXITOSAMENTE!');
        console.log('');
        console.log('📊 Resumen:');
        console.log('   - Servicios cargados:', cleanServices.length);
        console.log('   - Todos tienen: active, hidden, acceptedPetSizes, capacity');
        console.log('   - Categorías: nanny, daycare, boarding');
        console.log('');
        console.log('🧪 Prueba ahora:');
        console.log('   1. Ve a "Inicio" - Deberías ver 3 servicios');
        console.log('   2. Ve a "Servicios" - Deberías ver 3 servicios');
        console.log('   3. Ve a "Mapa" - Deberías ver 3 marcadores');
        console.log('   4. Prueba los filtros - Deberían funcionar');
        console.log('');
        console.log('➕ Para crear un servicio nuevo:');
        console.log('   1. Inicia sesión como Carlos (carlos@petcare.com / 123456)');
        console.log('   2. Ve a "Mis Servicios"');
        console.log('   3. Click en "Agregar Servicio"');
        console.log('   4. El nuevo servicio tendrá todos los campos necesarios');
        
    } catch (error) {
        console.error('❌ Error durante el reset:', error);
        console.log('');
        console.log('🔧 Intenta ejecutar manualmente:');
        console.log('   localStorage.clear();');
        console.log('   location.reload();');
    }
})();
