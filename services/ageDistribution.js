const { pool } = require('../config/db');

class AgeDistributionService {
  
  async calculateDistribution() {
    try {
      const client = await pool.connect();
      
      // Count total number of users
      const totalResult = await client.query('SELECT COUNT(*) FROM users');
      
      const total = parseInt(totalResult.rows[0].count);
      
      if (total === 0) {
        client.release();
        return { message: 'No users found in the database' };
      }
      
      // Calculate counts for each age group
      const lessThan20 = await this.countInRange(client, 0, 19);
      const from20To40 = await this.countInRange(client, 20, 40);
      const from40To60 = await this.countInRange(client, 40, 60);
      // Use a PostgreSQL-friendly max value (2147483647 is the max for PostgreSQL INTEGER)
      const over60 = await this.countInRange(client, 61, 2147483647);

      console.log(`${total} records in Database and processed`)
      
      client.release();
      
      
      // Calculate percentages
      const distribution = {
        '< 20': Math.round((lessThan20 / total) * 100),
        '20 to 40': Math.round((from20To40 / total) * 100),
        '40 to 60': Math.round((from40To60 / total) * 100),
        '> 60': Math.round((over60 / total) * 100)
      };
      
      return distribution;
    } catch (error) {
      console.error('Error calculating age distribution:', error);
      throw error;
    }
  }
  
 
  async countInRange(client, min, max) {
    const result = await client.query(
      'SELECT COUNT(*) FROM users WHERE age >= $1 AND age <= $2',
      [min, max]
    );
    return parseInt(result.rows[0].count);
  }
  
 
  printReport(distribution) {
 
    console.log('\n========= Age Distribution Report =========');
    console.log('Age-Group    % Distribution');
    console.log('-----------------------------');
    
    for (const [group, percentage] of Object.entries(distribution)) {
      console.log(`${group.padEnd(12)} ${percentage}`);
      
    }
    
    console.log('=========================================\n');
  }
}

module.exports = new AgeDistributionService();