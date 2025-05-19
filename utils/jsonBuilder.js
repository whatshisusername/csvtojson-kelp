
class JSONBuilder {

  buildNestedObject(record) {
    const result = {};
    
    for (const key in record) {
      if (Object.hasOwnProperty.call(record, key)) {
        const value = record[key];
        this.setNestedProperty(result, key, value);
      }
    }
    
    return result;
  }
  
 
  setNestedProperty(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    
    // Navigate to the innermost object
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    // Set the value on the innermost property
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }
  
 
  formatForDatabase(nestedRecord) {
    // Extract mandatory fields
    const firstName = nestedRecord.name?.firstName || '';
    const lastName = nestedRecord.name?.lastName || '';
    const age = nestedRecord.age || 0;
    
    // Combine first and last name 
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Extract address fields
    const address = nestedRecord.address || null;
    
    // Create additional_info by removing mandatory fields
    const additional_info = { ...nestedRecord };
    
    // Remove mandatory fields from additional_info
    if (additional_info.name) delete additional_info.name;
    if (additional_info.age) delete additional_info.age;
    if (additional_info.address) delete additional_info.address;
    
    // Only include additional_info if it has properties
    const hasAdditionalInfo = Object.keys(additional_info).length > 0;
    
    return {
      name: fullName,
      age,
      address,
      additional_info: hasAdditionalInfo ? additional_info : null
    };
  }
}

module.exports = new JSONBuilder();