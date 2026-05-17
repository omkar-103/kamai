const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://omkarparelkar2006_db_user:HCJlGTs0ye5cXucO@ac-sbc9dhl-shard-00-00.tbhl9le.mongodb.net:27017,ac-sbc9dhl-shard-00-01.tbhl9le.mongodb.net:27017,ac-sbc9dhl-shard-00-02.tbhl9le.mongodb.net:27017/kamai?ssl=true&replicaSet=atlas-a3ug4a-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    console.log(`📡 Connecting to: ${MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ MongoDB Atlas connection SUCCESS!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Database: kamai`);
    console.log(`📁 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Collection names:', collections.map(c => c.name).join(', '));
    }
    
    // Test a simple write operation
    const testCollection = db.collection('connection_test');
    const result = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Connection test successful'
    });
    
    console.log('✍️ Test write operation successful!');
    console.log(`📄 Document ID: ${result.insertedId}`);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Cleaned up test document');
    
    await mongoose.disconnect();
    console.log('🎉 All tests passed! Your MongoDB connection is working perfectly.');
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Name: ${error.name}`);
    
    if (error.reason) {
      console.error(`   Reason: ${error.reason}`);
    }
    
    await mongoose.disconnect();
    process.exit(1);
  }
}

testConnection();