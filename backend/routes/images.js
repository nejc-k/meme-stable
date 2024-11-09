var express = require('express');
var router = express.Router();
const path = require("path")


router.get('/tmp/:id', async function(req, res, next) {
  
  try {
    const imageName = req.params.id
    const imagePath = path.join(__dirname+'/../', "images/tmp", imageName);
    res.sendFile(imagePath)

    } catch (error) {
      console.error(error)
   return res.status(500).json({msg:"Internal server error"}) 
  }
  });
  

module.exports = router;
