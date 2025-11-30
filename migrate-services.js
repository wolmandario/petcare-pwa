/**
 * Service Migration Script
 * 
 * This script migrates existing services by marking old categories as inactive/hidden
 * while preserving all data for historical purposes.
 * 
 * Allowed categories: nanny, daycare, boarding
 * Old categories to hide: veterinary, grooming, walking, training
 */

// Firebase configuration - Update with your Firebase URL
const FIREBASE_URL = 'https://petcare-uruguay-default-rtdb.firebaseio.com/';

// Allowed categories
const ALLOWED_CATEGORIES = ['nanny', 'daycare', 'boarding'];

// Old categories to mark as inactive
const OLD_CATEGORIES = ['veterinary', 'grooming', 'walking', 'training'];

/**
 * Load all services from Firebase
 */
async function loadAllServices() {
    try {
        console.log('📥 Loading services from Firebase...');
        const response = await fetch(`${FIREBASE_URL}services.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data) {
            console.log('⚠️ No services found in Firebase');
            return [];
        }
        
        // Convert object to array if needed
        const services = Array.isArray(data) ? data : Object.values(data);
        console.log(`✅ Loaded ${services.length} services from Firebase`);
        
        return services;
    } catch (error) {
        console.error('❌ Error loading services:', error);
        throw error;
    }
}

/**
 * Identify services with old categories
 */
function identifyOldServices(services) {
    const oldServices = services.filter(service => 
        OLD_CATEGORIES.includes(service.category)
    );
    
    console.log(`\n🔍 Analysis:`);
    console.log(`   Total services: ${services.length}`);
    console.log(`   Services with old categories: ${oldServices.length}`);
    console.log(`   Services with allowed categories: ${services.filter(s => ALLOWED_CATEGORIES.includes(s.category)).length}`);
    
    if (oldServices.length > 0) {
        console.log(`\n📋 Old services found:`);
        oldServices.forEach(service => {
            console.log(`   - ID: ${service.id}, Category: ${service.category}, Title: ${service.title}`);
        });
    }
    
    return oldServices;
}

/**
 * Mark services as inactive/hidden
 */
function markServicesAsInactive(services) {
    const migratedServices = services.map(service => {
        if (OLD_CATEGORIES.includes(service.category)) {
            return {
                ...service,
                active: false,
                hidden: true,
                migratedAt: new Date().toISOString(),
                migrationReason: 'Category no longer supported - preserved for historical data'
            };
        }
        return service;
    });
    
    return migratedServices;
}

/**
 * Save migrated services back to Firebase
 */
async function saveMigratedServices(services) {
    try {
        console.log('\n💾 Saving migrated services to Firebase...');
        
        const response = await fetch(`${FIREBASE_URL}services.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(services)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('✅ Services successfully migrated and saved to Firebase');
        return true;
    } catch (error) {
        console.error('❌ Error saving migrated services:', error);
        throw error;
    }
}

/**
 * Create backup of current services
 */
async function createBackup(services) {
    try {
        console.log('\n💾 Creating backup of current services...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `services_backup_${timestamp}`;
        
        const response = await fetch(`${FIREBASE_URL}${backupPath}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                services: services
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log(`✅ Backup created at: ${backupPath}`);
        return backupPath;
    } catch (error) {
        console.error('❌ Error creating backup:', error);
        throw error;
    }
}

/**
 * Generate migration report
 */
function generateReport(originalServices, migratedServices) {
    const oldServicesCount = originalServices.filter(s => OLD_CATEGORIES.includes(s.category)).length;
    const activeServicesCount = migratedServices.filter(s => !s.hidden).length;
    const hiddenServicesCount = migratedServices.filter(s => s.hidden).length;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION REPORT');
    console.log('='.repeat(60));
    console.log(`\n📅 Migration Date: ${new Date().toISOString()}`);
    console.log(`\n📈 Statistics:`);
    console.log(`   Total services before migration: ${originalServices.length}`);
    console.log(`   Services marked as inactive: ${oldServicesCount}`);
    console.log(`   Active services after migration: ${activeServicesCount}`);
    console.log(`   Hidden services (preserved): ${hiddenServicesCount}`);
    
    console.log(`\n✅ Allowed Categories (visible):`);
    ALLOWED_CATEGORIES.forEach(cat => {
        const count = migratedServices.filter(s => s.category === cat && !s.hidden).length;
        console.log(`   - ${cat}: ${count} services`);
    });
    
    console.log(`\n🚫 Old Categories (hidden but preserved):`);
    OLD_CATEGORIES.forEach(cat => {
        const count = migratedServices.filter(s => s.category === cat && s.hidden).length;
        console.log(`   - ${cat}: ${count} services`);
    });
    
    console.log('\n' + '='.repeat(60));
}

/**
 * Main migration function
 */
async function migrateServices(options = {}) {
    const { dryRun = false, createBackupFirst = true } = options;
    
    try {
        console.log('\n' + '='.repeat(60));
        console.log('🚀 STARTING SERVICE MIGRATION');
        console.log('='.repeat(60));
        
        if (dryRun) {
            console.log('\n⚠️ DRY RUN MODE - No changes will be saved\n');
        }
        
        // Step 1: Load all services
        const services = await loadAllServices();
        
        if (services.length === 0) {
            console.log('\n⚠️ No services to migrate');
            return;
        }
        
        // Step 2: Identify old services
        const oldServices = identifyOldServices(services);
        
        if (oldServices.length === 0) {
            console.log('\n✅ No old services found - migration not needed');
            return;
        }
        
        // Step 3: Create backup (if not dry run)
        if (!dryRun && createBackupFirst) {
            await createBackup(services);
        }
        
        // Step 4: Mark services as inactive
        const migratedServices = markServicesAsInactive(services);
        
        // Step 5: Save migrated services (if not dry run)
        if (!dryRun) {
            await saveMigratedServices(migratedServices);
        } else {
            console.log('\n⚠️ DRY RUN - Skipping save to Firebase');
        }
        
        // Step 6: Generate report
        generateReport(services, migratedServices);
        
        console.log('\n✅ Migration completed successfully!');
        
        return {
            success: true,
            originalCount: services.length,
            migratedCount: oldServices.length,
            activeCount: migratedServices.filter(s => !s.hidden).length
        };
        
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        throw error;
    }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        migrateServices,
        loadAllServices,
        identifyOldServices,
        markServicesAsInactive,
        ALLOWED_CATEGORIES,
        OLD_CATEGORIES
    };
}

// If running in browser, expose to window
if (typeof window !== 'undefined') {
    window.ServiceMigration = {
        migrateServices,
        loadAllServices,
        identifyOldServices,
        markServicesAsInactive,
        ALLOWED_CATEGORIES,
        OLD_CATEGORIES
    };
}
