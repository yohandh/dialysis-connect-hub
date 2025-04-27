/**
 * Utility functions to transform between camelCase and snake_case
 */

/**
 * Converts a string from camelCase to snake_case
 * @param {string} str - The camelCase string to convert
 * @returns {string} The snake_case version of the string
 */
const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Converts a string from snake_case to camelCase
 * @param {string} str - The snake_case string to convert
 * @returns {string} The camelCase version of the string
 */
const snakeToCamel = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Maps specific field names between frontend and database
 * This handles special cases where we need custom mapping beyond simple camelCase/snake_case conversion
 */
const fieldNameMap = {
  // Frontend to Database
  toDatabase: {
    'centerHours': 'center_hours',
    'contactNo': 'contact_no',
    'totalCapacity': 'total_capacity',
    'isActive': 'is_active'
  },
  // Database to Frontend
  toFrontend: {
    'center_hours': 'centerHours',
    'contact_no': 'contactNo',
    'total_capacity': 'totalCapacity',
    'is_active': 'isActive'
  }
};

/**
 * Transforms an object's keys from camelCase to snake_case
 * @param {Object} obj - The object with camelCase keys
 * @returns {Object} A new object with snake_case keys
 */
const objectToDatabaseFormat = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  
  const result = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    // Handle nested objects and arrays
    let transformedValue = value;
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        transformedValue = value.map(item => 
          typeof item === 'object' && item !== null ? objectToDatabaseFormat(item) : item
        );
      } else {
        transformedValue = objectToDatabaseFormat(value);
      }
    }
    
    // Use custom field mapping if available, otherwise convert camelCase to snake_case
    const dbFieldName = fieldNameMap.toDatabase[key] || camelToSnake(key);
    result[dbFieldName] = transformedValue;
  });
  
  return result;
};

/**
 * Transforms an object's keys from snake_case to camelCase
 * @param {Object} obj - The object with snake_case keys
 * @returns {Object} A new object with camelCase keys
 */
const objectToClientFormat = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  
  const result = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    // Special handling for JSON strings
    let transformedValue = value;
    if (typeof value === 'string' && (
      key === 'center_hours' || key === 'services' || key === 'nephrologists'
    )) {
      try {
        const parsed = JSON.parse(value);
        transformedValue = objectToClientFormat(parsed);
      } catch (e) {
        // Not valid JSON, keep as is
      }
    } 
    // Handle nested objects and arrays
    else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        transformedValue = value.map(item => 
          typeof item === 'object' && item !== null ? objectToClientFormat(item) : item
        );
      } else {
        transformedValue = objectToClientFormat(value);
      }
    }
    
    // Use custom field mapping if available, otherwise convert snake_case to camelCase
    const clientFieldName = fieldNameMap.toFrontend[key] || snakeToCamel(key);
    result[clientFieldName] = transformedValue;
  });
  
  return result;
};

/**
 * Formats center hours from database format to client format
 * @param {Array} centerHours - Array of center_hours records from database
 * @returns {Object} Formatted operating hours object for frontend
 */
const formatCenterHours = (centerHours) => {
  if (!centerHours || !Array.isArray(centerHours)) return {};
  
  const formattedHours = {};
  
  centerHours.forEach(hour => {
    formattedHours[hour.weekday] = {
      openTime: hour.open_time,
      closeTime: hour.close_time
    };
  });
  
  return formattedHours;
};

module.exports = {
  camelToSnake,
  snakeToCamel,
  objectToDatabaseFormat,
  objectToClientFormat,
  formatCenterHours
};
