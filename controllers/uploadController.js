const { pool } = require('../config/db');
const csvParser = require('../services/csvParser');
const jsonBuilder = require('../utils/jsonBuilder');
const ageDistribution = require('../services/ageDistribution');
require('dotenv').config();

class UploadController {
  /**
   * Process the CSV file and upload data to the database
   * @param {Object} req - HTTP request object
   * @param {Object} res - HTTP response object
   */
  async processCSV(req, res) {
    try {
      console.log('Starting CSV processing...');
      
      // Get file path from environment variable
      const filePath = process.env.CSV_FILE_PATH;
      
      // Parse the CSV file
      console.log(`Parsing CSV file: ${filePath}`);
      const records = await csvParser.parseFile(filePath);
      console.log(`Parsed ${records.length} records`);
      
      // Connect to database
      const client = await pool.connect();
      
      try {
        // Process records in batches for better performance
        const BATCH_SIZE = 1000;
        let processedCount = 0;
        
        console.log('Processing and uploading records to database...');
        
        // Begin transaction for better performance
        await client.query('BEGIN');
        
        for (let i = 0; i < records.length; i += BATCH_SIZE) {
          const batch = records.slice(i, i + BATCH_SIZE);
          
          // Process each record in the batch
          for (const record of batch) {
            // Build nested JSON structure
            const nestedRecord = jsonBuilder.buildNestedObject(record);

            //to print the json object created for a record.
            //console.log('JSON Object:', JSON.stringify(nestedRecord, null, 2));
            
            // Format for database insertion
            const dbRecord = jsonBuilder.formatForDatabase(nestedRecord);
            
            // Insert into database
            await client.query(
              `INSERT INTO users (name, age, address, additional_info) 
               VALUES ($1, $2, $3, $4)`,
              [
                dbRecord.name,
                dbRecord.age,
                dbRecord.address,
                dbRecord.additional_info
              ]
            );
            
            processedCount++;
          }
          
          // Log progress
          console.log(`Processed ${processedCount} of ${records.length} records`);
        }
        
        // Commit transaction
        await client.query('COMMIT');
        console.log('Database upload completed successfully');
        
        // Calculate and print age distribution
        const distribution = await ageDistribution.calculateDistribution();
        ageDistribution.printReport(distribution);
        
        client.release();
        
        res.status(200).json({
          success: true,
          message: 'CSV processed successfully,uploaded to DB and DB processed and age distribution calculated.',
          ageDistribution: distribution
        });
      } catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        client.release();
        throw error;
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing CSV file',
        error: error.message
      });
    }
  }
}

// Export an instance of the controller
module.exports = new UploadController();
