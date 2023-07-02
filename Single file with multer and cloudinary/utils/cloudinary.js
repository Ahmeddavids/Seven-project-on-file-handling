const cloudinary = require('cloudinary').v2;



cloudinary.config({ 
    cloud_name: 'dasmeehsm', 
    api_key: '843285241437154', 
    api_secret: 'gqgATJKbshnN9IX_HgLIRU0PZPU' 
  });


module.exports = cloudinary; 