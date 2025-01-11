const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// route to handle sending a message

router.post('/send-message', async (req, res) => {
    console.log("Sending message:", req.body); // Log request data
    const { text, sender } = req.body;
    try {
        const newMessage = new Message({ text, sender });
        const savedMessage = await newMessage.save();
        console.log("Saved Message:", savedMessage); // Log saved message to confirm save
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).send('Error saving message');
    }
});


// route to get messages

router.get('/get-messages', async (req, res) => {
    try {
      const messages = await Message.find();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).send('Error retrieving messages');
    }
  });

  module.exports = router;