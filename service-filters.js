// ========================================
// SERVICE FILTERS COMPONENT
// ========================================

// Global filter state
let currentFilters = {
    category: '',
    petSize: '',
    priceRange: '',
    capacity: '',
    location: '',
    rating: ''
};

/**
 * Filter services by category
 */
function filterByCategory(category) {
    currentFilters.category = category;
    
    // Update button states
    document.querySelectorAll('[data-category]').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    applyServiceFilters();
}

/**
 * Filter services by pet size
 */
function filterByPetSize(petSize) {
    currentFilters.petSize = petSize;
    
    // Update button states
    document.querySelectorAll('[data-petsize]').forEach(btn => {
        if (btn.dataset.petsize === petSize) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    applyServiceFilters();
}

/**
 * Apply all service filters and display results
 */
function applyServiceFilters() {
    // Get filter values
    currentFilters.priceRange = document.getElementById('filterPrice').value;
    currentFilters.capacity = document.getElementById('filterCapacity').value;
    currentFilters.location = document.getElementById('filterLocation').value;
    currentFilters.rating = document.getElementById('filterRating').value;
    
    // Load services with filters
    loadServicesWithFilters(currentFilters);
}

/**
 * Clear all filters and reset to default view
 */
function clearServiceFilters() {
    // Reset filter state
    currentFilters = {
        category: '',
        petSize: '',
        priceRange: '',
        capacity: '',
        location: '',
        rating: ''
    };
    
    // Reset UI elements
    document.querySelectorAll('[data-category]').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === '') btn.classList.add('active');
    });
    
    document.querySelectorAll('[data-petsize]').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.petsize === '') btn.classList.add('active');
    });
    
    document.getElementById('filterPrice').value = '';
    document.getElementById('filterCapacity').value = '';
    document.getElementById('filterLocation').value = '';
    document.getElementById('filterRating').value = '';
    
    // Reload all services
    loadServicesWithFilters(currentFilters);
}

/**
 * Load services from Firebase with filters applied
 */
async function loadServicesWithFilters(filters) {
    try {
        console.log('🔍 Loading services with filters:', filters);
        
        // Load services from Firebase or use testServices
        let services = [];
        
        // Try to load from Firebase first
        const firebaseServices = await loadFromDatabase('services');
        if (firebaseServices && Array.isArray(firebaseServices) && firebaseServices.length > 0) {
            services = firebaseServices;
            console.log(`✅ Loaded ${services.length} services from Firebase`);
        } else {
            // Fallback to testServices
            services = [...testServices];
            console.log(`📦 Using ${services.length} services from memory`);
        }
        
        // Filter to only show allowed categories (nanny, daycare, boarding)
        services = filterAllowedCategories(services);
        console.log(`✅ Filtered to ${services.length} allowed category services`);
        
        // Apply category filter
        if (filters.category) {
            services = services.filter(service => service.category === filters.category);
            console.log(`🔍 Category filter: ${services.length} services match`);
        }
        
        // Apply pet size filter
        if (filters.petSize) {
            services = services.filter(service => {
                return service.acceptedPetSizes && service.acceptedPetSizes[filters.petSize] === true;
            });
            console.log(`🐕 Pet size filter: ${services.length} services match`);
        }
        
        // Apply price range filter
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.includes('+') 
                ? [parseInt(filters.priceRange), Infinity] 
                : filters.priceRange.split('-').map(p => parseInt(p));
            services = services.filter(service => service.price >= min && service.price <= max);
            console.log(`💰 Price filter: ${services.length} services match`);
        }
        
        // Apply capacity filter
        if (filters.capacity) {
            const minCapacity = parseInt(filters.capacity);
            services = services.filter(service => service.capacity >= minCapacity);
            console.log(`👥 Capacity filter: ${services.length} services match`);
        }
        
        // Apply location filter
        if (filters.location) {
            services = services.filter(service => service.location === filters.location);
            console.log(`📍 Location filter: ${services.length} services match`);
        }
        
        // Apply rating filter
        if (filters.rating) {
            services = services.filter(service => service.rating >= parseFloat(filters.rating));
            console.log(`⭐ Rating filter: ${services.length} services match`);
        }
        
        // Sort results by rating (highest first)
        services.sort((a, b) => b.rating - a.rating);
        
        // Display results
        displayFilteredServices(services);
        
    } catch (error) {
        console.error('❌ Error loading services with filters:', error);
        showMessage('Error al cargar servicios', 'error');
    }
}

/**
 * Display filtered services in the UI
 */
function displayFilteredServices(services) {
    const container = document.getElementById('servicesList');
    const resultsInfo = document.getElementById('servicesResultsInfo');
    const countSpan = document.getElementById('servicesCount');
    
    // Show results count
    resultsInfo.style.display = 'block';
    countSpan.textContent = `${services.length} servicio${services.length !== 1 ? 's' : ''} encontrado${services.length !== 1 ? 's' : ''}`;
    
    if (services.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 15px;">🔍</div>
                <h3>No se encontraron servicios</h3>
                <p>Intenta ajustar los filtros para ver más resultados</p>
                <button class="btn btn-secondary" onclick="clearServiceFilters()" style="margin-top: 15px;">
                    🔄 Limpiar Filtros
                </button>
            </div>
        `;
    } else {
        container.innerHTML = services.map(service => {
            const category = SERVICE_CATEGORIES[service.category];
            const categoryName = category ? category.name : service.category;
            
            return `
                <div class="service-card" style="position: relative;">
                    ${currentUser && currentUser.role === 'owner' ? 
                        `<button class="favorite-btn ${isFavorite(service.id) ? 'favorited' : 'not-favorited'}" 
                                data-service-id="${service.id}" 
                                onclick="toggleFavorite(${service.id})" 
                                title="Agregar a favoritos">
                            ${isFavorite(service.id) ? '❤️' : '🤍'}
                        </button>` : 
                        ''
                    }
                    <div class="service-header">
                        <div class="service-icon">${service.icon}</div>
                        <div class="service-info">
                            <h3>${service.title}</h3>
                            <span class="service-category" style="background: #e3f2fd; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #1976d2;">
                                ${categoryName}
                            </span>
                            <div class="service-price" style="margin-top: 5px;">$${service.price}/${service.priceUnit}</div>
                        </div>
                    </div>
                    <div class="service-description">${service.description}</div>
                    
                    <!-- Service Details -->
                    <div style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; font-size: 14px;">
                            <span>👥 Capacidad: ${service.capacity}</span>
                            ${service.acceptedPetSizes ? 
                                `<span>🐕 ${formatPetSizes(service.acceptedPetSizes)}</span>` : 
                                ''
                            }
                            ${service.schedule ? 
                                `<span>🕐 ${formatSchedule(service.schedule)}</span>` : 
                                ''
                            }
                        </div>
                    </div>
                    
                    <div class="service-meta">
                        <div class="rating">
                            <span>${'⭐'.repeat(Math.floor(service.rating))}</span>
                            <span>${service.rating} (${service.reviews} reseñas)</span>
                        </div>
                        <span>📍 ${service.location}</span>
                    </div>
                    <div class="service-actions" style="margin-top: 15px;">
                        ${currentUser && currentUser.role === 'owner' ? 
                            `<button class="btn btn-primary" onclick="selectService(${service.id})">📅 Reservar</button>` : 
                            ''
                        }
                        <button class="btn btn-secondary" onclick="showReviews(${service.id})">👁️ Ver Reseñas</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Update favorite buttons after rendering
        setTimeout(() => updateFavoriteButtons(), 100);
    }
}

// Override the old applyFilters function for backward compatibility
if (typeof applyFilters !== 'undefined') {
    const oldApplyFilters = applyFilters;
}
function applyFilters() {
    applyServiceFilters();
}
