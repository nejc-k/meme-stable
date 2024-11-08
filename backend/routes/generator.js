var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/User")
const { spawn } = require('child_process');


const fs = require('fs');
const path = require('path');

router.post("/", async (req, res, next) => {
    try {
        const prompt = req.body.prompt;

        const pyProg = spawn('python3', ['python/generator.py', prompt]);
        let imagePath = '';

        pyProg.stdout.on('data', (data) => {
            imagePath += data.toString().trim();
        });

        pyProg.on('close', (code) => {
            if (code === 0 && imagePath) {
                const imageBuffer = fs.readFileSync(imagePath);
                res.setHeader('Content-Type', 'image/png');
                res.send(imageBuffer);

                // fs.unlinkSync(imagePath);
            } else {
                res.status(500).json({ message: "Image generation failed" });
            }
        });

        pyProg.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;