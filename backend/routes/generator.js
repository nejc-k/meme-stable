var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/User")
const { spawn } = require('child_process');


router.post("/", async (req, res, next) => {
    try {
        const prompt = req.body.prompt;

        const pyProg = spawn('python3', ['python/generator.py', prompt]);
        let imagePath = `${process.env.API_BASE_URI}:${process.env.PORT}/`;

        pyProg.stdout.on('data', (data) => {
            imagePath += data.toString().trim();
        });

        pyProg.on('close', (code) => {
            if (code === 0 && imagePath) {
                res.send({imgUrl: imagePath})

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