/**
 * Get validation errors from a validation object
 * @param {Object} validation - Validation object
 * @returns {string[]} Array of validation errors
 */
const getValidationErrors = validation => {
  if (!validation.success) {
    return validation.error.errors.map(
      err => `${err.path.join(".")}: ${err.message}`,
    );
  }

  return [];
};

module.exports = { getValidationErrors };
