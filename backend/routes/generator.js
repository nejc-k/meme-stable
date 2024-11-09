var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/User")
const { spawn } = require('child_process');


router.post("/", async (req, res, next) => {
    try {
        if(!req.user || req.user === undefined) {
            res.status(403).json({error : "User is not authenticated" })
            return
        }
        const prompt = req.body.prompt;

        if(req.user.isAdmin || req.user.credits > 0){
            const pyProg = spawn('python3', ['python/generator.py', prompt]);
            let imagePath = `${process.env.API_BASE_URI}:${process.env.PORT}/`;

            pyProg.stdout.on('data', (data) => {
                imagePath += data.toString().trim();
            });

            pyProg.on('close', async (code) => {
                if (code === 0 && imagePath) {
                    let user = await User.findById({_id:req.user.id})
                    user.credits = user.credits-1;
                    user.save()
                    res.status(201).json({imgUrl: imagePath})

                } else {
                    res.status(500).json({ message: "Image generation failed" });
                }

            });

            pyProg.stderr.on('data', (data) => {
                console.error(`Error: ${data}`);
                res.status(500).json({ message: error.message });
                return
            });
        }else{
            res.status(429).json({ message: "You have run out of credits for today. Check back tommorow for more!"});
            return
        }
        
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;