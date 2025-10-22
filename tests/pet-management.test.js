/**
 * Pet Management Tests for PWA
 * Tests integrated with the PWA structure
 */

// Import the test functions from the main tests directory
if (typeof require !== 'undefined') {
  const { runPetManagementTests } = require('../../tests/pet-management-simple.test.js');
  
  // Run tests in Node.js environment
  console.log('🐾 Running PWA Pet Management Tests...\n');
  runPetManagementTests();
} else {
  // Browser environment - load tests via script tag
  console.log('PWA Pet Management Tests loaded for browser execution');
}