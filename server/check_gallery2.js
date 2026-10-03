import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://127.0.0.1:27017/maidslife';

async function checkGallery() {
  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const galleryCollection = db.collection('galleryitems');
    
    const items = await galleryCollection.find({}).toArray();
    console.log(JSON.stringify(items, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkGallery();
