const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

class CSVParser {
  constructor() {
    this.delimiter = ',';
  }

  /**
   * Parses a CSV file and returns array of objects
   * @param {string} filePath - Path to the CSV file
   * @returns {Promise<Array>} - Array of parsed objects
   */
  async parseFile(filePath) {
    try {
      // Read the file content
      const fileContent = await readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }

      // Get headers from the first line
      const headers = this.parseRow(lines[0]);
      
      // Parse each data row
      const records = [];
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseRow(lines[i]);
        if (values.length === headers.length) {
          records.push(this.createRecord(headers, values));
        } else {
          console.warn(`Skipping row ${i+1}: Column count mismatch`);
        }
      }

      return records;
    } catch (error) {
      console.error('Error parsing CSV file:', error);
      throw error;
    }
  }

  /**
   * Parse a single CSV row into an array of values
   * @param {string} row - CSV row
   * @returns {Array} - Array of values
   */
  parseRow(row) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    // Handle quoted values and commas within quotes
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"' && (i === 0 || row[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === this.delimiter && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    if (currentValue) {
      values.push(currentValue.trim());
    }
    
    return values;
  }

  /**
   * Create a record object from headers and values
   * @param {Array} headers - Array of header names
   * @param {Array} values - Array of values
   * @returns {Object} - Record object
   */
  createRecord(headers, values) {
    const record = {};
    
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i].trim();
      const value = values[i] ? values[i].trim() : '';
      
      if (header) {
        // Handle numeric values
        if (!isNaN(value) && value !== '') {
          record[header] = Number(value);
        } else {
          record[header] = value;
        }
      }
    }
    
    return record;
  }
}

module.exports = new CSVParser();