// Updated service display functions with new fields
// This file contains the updated loadFeaturedServices and loadAllServices functions

function loadFeaturedServices() {
    const container = document.getElementById('featuredServices');
    // Filter to only show allowed categories
    const allowedServices = filterAllowedCategories(testServices);
    const featured = allowedServices.slice(0, 3);
    
    container.innerHTML = featured.map(service => {
        const category = SERVICE_CATEGORIES[service.category];
        const categoryIcon = category ? category.icon : service.icon;
        const categoryName = category ? category.name : service.category;
        
        return `
        <div class="service-card">
            <div class="service-header">
                <div class="service-icon">${categoryIcon}</div>
                <div class="service-info">
                    <h3>${service.title}</h3>
                    <span style="background: #e3f2fd; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #667eea;">${categoryName}</span>
                    <div class="service-price">${service.price}/${service.priceUnit}</div>
                </div>
            </div>
            <div class="service-description">${service.description}</div>
            
            <!-- New fields display -->
            <div style="margin: 10px 0; font-size: 14px; color: #666;">
                ${service.capacity ? `<div style="margin: 5px 0;">👥 <strong>Capacidad:</strong> ${service.capacity} mascota${service.capacity > 1 ? 's' : ''}</div>` : ''}
                ${service.address ? `<div style="margin: 5px 0;">📍 <strong>Dirección:</strong> ${service.address}</div>` : 
                  service.location ? `<div style="margin: 5px 0;">📍 <strong>Ubicación:</strong> ${service.location}</div>` : ''}
                ${service.schedule ? `<div style="margin: 5px 0;">🕐 <strong>Horario:</strong> ${formatSchedule(service.schedule)}</div>` : ''}
                ${service.acceptedPetSizes ? `<div style="margin: 5px 0;">🐕 <strong>Acepta:</strong> ${formatPetSizes(service.acceptedPetSizes)}</div>` : ''}
                ${service.category === 'nanny' && service.serviceLocation ? `<div style="margin: 5px 0;">🏡 <strong>Servicio en:</strong> ${formatServiceLocation(service.serviceLocation)}</div>` : ''}
                ${service.category === 'boarding' && service.accommodationType ? `<div style="margin: 5px 0;">🛏️ <strong>Alojamiento:</strong> ${formatAccommodationType(service.accommodationType)}</div>` : ''}
            </div>
            
            <div class="service-meta">
                <div class="rating">
                    <span>${'⭐'.repeat(Math.floor(service.rating))}</span>
                    <span>${service.rating} (${service.reviews} reseñas)</span>
                </div>
            </div>
            <div class="service-actions" style="margin-top: 15px;">
                ${currentUser && currentUser.role === 'owner' ? 
                    `<button class="btn btn-primary" onclick="selectService(${service.id})">📅 Reservar</button>
                     <button class="favorite-btn" data-service-id="${service.id}" onclick="toggleFavorite(${service.id})" title="Agregar a favoritos">🤍</button>` : 
                    ''
                }
                <button class="btn btn-secondary" onclick="showReviews(${service.id})">👁️ Ver Reseñas</button>
            </div>
        </div>
    `}).join('');
    
    // Actualizar botones de favoritos después de renderizar
    setTimeout(() => updateFavoriteButtons(), 100);
}

function loadAllServices() {
    const container = document.getElementById('servicesList');
    
    // Filter to only show allowed categories
    const allowedServices = filterAllowedCategories(testServices);
    
    container.innerHTML = allowedServices.map(service => {
        const category = SERVICE_CATEGORIES[service.category];
        const categoryIcon = category ? category.icon : service.icon;
        const categoryName = category ? category.name : service.category;
        
        return `
        <div class="service-card">
            <div class="service-header">
                <div class="service-icon">${categoryIcon}</div>
                <div class="service-info">
                    <h3>${service.title}</h3>
                    <span style="background: #e3f2fd; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #667eea;">${categoryName}</span>
                    <div class="service-price">${service.price}/${service.priceUnit}</div>
                </div>
            </div>
            <div class="service-description">${service.description}</div>
            
            <!-- New fields display -->
            <div style="margin: 10px 0; font-size: 14px; color: #666;">
                ${service.capacity ? `<div style="margin: 5px 0;">👥 <strong>Capacidad:</strong> ${service.capacity} mascota${service.capacity > 1 ? 's' : ''}</div>` : ''}
                ${service.address ? `<div style="margin: 5px 0;">📍 <strong>Dirección:</strong> ${service.address}</div>` : 
                  service.location ? `<div style="margin: 5px 0;">📍 <strong>Ubicación:</strong> ${service.location}</div>` : ''}
                ${service.schedule ? `<div style="margin: 5px 0;">🕐 <strong>Horario:</strong> ${formatSchedule(service.schedule)}</div>` : ''}
                ${service.acceptedPetSizes ? `<div style="margin: 5px 0;">🐕 <strong>Acepta:</strong> ${formatPetSizes(service.acceptedPetSizes)}</div>` : ''}
                ${service.category === 'nanny' && service.serviceLocation ? `<div style="margin: 5px 0;">🏡 <strong>Servicio en:</strong> ${formatServiceLocation(service.serviceLocation)}</div>` : ''}
                ${service.category === 'boarding' && service.accommodationType ? `<div style="margin: 5px 0;">🛏️ <strong>Alojamiento:</strong> ${formatAccommodationType(service.accommodationType)}</div>` : ''}
            </div>
            
            ${service.features && service.features.length > 0 ? `
            <div style="margin: 10px 0;">
                <strong>Características:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
                    ${service.features.map(feature => `<span style="background: #e3f2fd; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${feature}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="service-meta">
                <div class="rating">
                    <span>${'⭐'.repeat(Math.floor(service.rating))}</span>
                    <span>${service.rating} (${service.reviews} reseñas)</span>
                </div>
            </div>
            <div class="service-actions" style="margin-top: 15px;">
                ${currentUser && currentUser.role === 'owner' ? 
                    `<button class="btn btn-primary" onclick="selectService(${service.id})">📅 Reservar</button>
                     <button class="favorite-btn" data-service-id="${service.id}" onclick="toggleFavorite(${service.id})" title="Agregar a favoritos">🤍</button>` : 
                    ''
                }
                <button class="btn btn-secondary" onclick="showReviews(${service.id})">👁️ Ver Reseñas</button>
            </div>
        </div>
    `}).join('');
    
    // Actualizar botones de favoritos después de renderizar
    setTimeout(() => updateFavoriteButtons(), 100);
}

function loadMyServices() {
    const container = document.getElementById('myServicesList');
    
    if (!currentUser || currentUser.role !== 'caregiver') {
        container.innerHTML = '<p>Solo los cuidadores pueden gestionar servicios.</p>';
        return;
    }
    
    // Filtrar servicios del usuario actual
    const myServices = testServices.filter(service => service.caregiverId === currentUser.id);
    
    if (myServices.length === 0) {
        container.innerHTML = '<p>No tienes servicios publicados aún. ¡Agrega tu primer servicio!</p>';
        return;
    }
    
    container.innerHTML = myServices.map(service => {
        const category = SERVICE_CATEGORIES[service.category];
        const categoryIcon = category ? category.icon : service.icon;
        const categoryName = category ? category.name : service.category;
        
        return `
        <div class="service-card">
            <div class="service-header">
                <div class="service-icon">${categoryIcon}</div>
                <div class="service-info">
                    <h3>${service.title}</h3>
                    <span style="background: #e3f2fd; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #667eea;">${categoryName}</span>
                    <div class="service-price">${service.price}/${service.priceUnit}</div>
                </div>
            </div>
            <div class="service-description">${service.description}</div>
            
            <!-- New fields display -->
            <div style="margin: 10px 0; font-size: 14px; color: #666;">
                ${service.capacity ? `<div style="margin: 5px 0;">👥 <strong>Capacidad:</strong> ${service.capacity} mascota${service.capacity > 1 ? 's' : ''}</div>` : ''}
                ${service.address ? `<div style="margin: 5px 0;">📍 <strong>Dirección:</strong> ${service.address}</div>` : 
                  service.location ? `<div style="margin: 5px 0;">📍 <strong>Ubicación:</strong> ${service.location}</div>` : ''}
                ${service.schedule ? `<div style="margin: 5px 0;">🕐 <strong>Horario:</strong> ${formatSchedule(service.schedule)}</div>` : ''}
                ${service.acceptedPetSizes ? `<div style="margin: 5px 0;">🐕 <strong>Acepta:</strong> ${formatPetSizes(service.acceptedPetSizes)}</div>` : ''}
                ${service.category === 'nanny' && service.serviceLocation ? `<div style="margin: 5px 0;">🏡 <strong>Servicio en:</strong> ${formatServiceLocation(service.serviceLocation)}</div>` : ''}
                ${service.category === 'boarding' && service.accommodationType ? `<div style="margin: 5px 0;">🛏️ <strong>Alojamiento:</strong> ${formatAccommodationType(service.accommodationType)}</div>` : ''}
            </div>
            
            <div class="service-meta">
                <div class="rating">
                    <span>${'⭐'.repeat(Math.floor(service.rating))}</span>
                    <span>${service.rating} (${service.reviews} reseñas)</span>
                </div>
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="editService(${service.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteService(${service.id})">Eliminar</button>
                <button class="btn btn-primary" onclick="openChatForService(${service.id})">💬 Chat con Clientes</button>
            </div>
        </div>
    `}).join('');
}
