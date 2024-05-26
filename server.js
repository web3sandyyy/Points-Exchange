const express = require('express');
const bodyParser = require('body-parser');
const { Dev, Point, Image } = require('./models');

const app = express();
app.use(bodyParser.json());

//APIS FOR DEV TABLE

//Create a dev
app.post('/devs', async (req, res) => {
  try {
    const dev = await Dev.create(req.body);
    res.status(201).json(dev);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Profile
app.put('/devs/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const dev = await Dev.findByPk(id);
    if (!dev) {
      return res.status(404).json({ error: 'Developer not found' });
    }
    await dev.update({ profile: req.body.profile });
    res.json(dev);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Phone Number
app.put('/devs/:id/phoneNumber', async (req, res) => {
  try {
    const { id } = req.params;
    const dev = await Dev.findByPk(id);
    if (!dev) {
      return res.status(404).json({ error: 'Developer not found' });
    }
    await dev.update({ phoneNumber: req.body.phoneNumber });
    res.json(dev);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Password
app.put('/devs/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const dev = await Dev.findByPk(id);
    if (!dev) {
      return res.status(404).json({ error: 'Developer not found' });
    }
    await dev.update({ password: req.body.password });
    res.json(dev);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Developers
app.get('/devs', async (req, res) => {
  try {
    const devs = await Dev.findAll();
    res.json(devs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Developer by ID
app.get('/devs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dev = await Dev.findByPk(id);
    if (!dev) {
      return res.status(404).json({ error: 'Developer not found' });
    }
    res.json(dev);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authenticate User
app.post('/auth', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const dev = await Dev.findOne({ where: { phoneNumber } });
    if (!dev) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (dev.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    res.json({ message: 'Authentication successful', dev });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//APIS FOR POINTS TABLE

// Create Point
app.post('/points', async (req, res) => {
  try {
    const { devId, reason } = req.body;
    // Find the last point of the devId
    const lastPoint = await Point.findOne({
      where: { devId },
      order: [['createdAt', 'DESC']]
    });
    let pointValue = 1; // Default point value if no previous points exist
    if (lastPoint) {
      pointValue = lastPoint.point + 1; // Increment the point value
    }
    // Create a new point
    const point = await Point.create({ devId, point: pointValue, reason });
    res.status(201).json(point);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Records by devId
app.get('/points/:devId', async (req, res) => {
  try {
    const { devId } = req.params;
    const points = await Point.findAll({ where: { devId } });
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//APIS FOR IMAGE TABLE

// Create Image Records
app.post('/images', async (req, res) => {
  try {
    const { devId, point, images } = req.body;
    const createdImages = [];
    for (const image of images) {
      const createdImage = await Image.create({ devId, point, image });
      createdImages.push(createdImage);
    }
    res.status(201).json(createdImages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Images by Point and DevId
app.get('/images/:devId/:point', async (req, res) => {
  try {
    const { devId, point } = req.params;
    const images = await Image.findAll({ where: { devId, point } });
    const imageStrings = images.map(img => img.image);
    res.json(imageStrings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//APIS FOR COMMENT TABLE

// Create Comment
app.post('/comments', async (req, res) => {
  try {
    const { point, devId, byId, comment } = req.body;
    const createdComment = await Comment.create({ point, devId, byId, comment });
    res.status(201).json(createdComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Comments by Point
app.get('/comments/:point', async (req, res) => {
  try {
    const { point } = req.params;
    const comments = await Comment.findAll({ where: { point } });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
