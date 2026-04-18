const express = require('express');
const fs = require('fs');
const path = require('path');
const Annotation = require('../models/Annotation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Global index counter for image rotation
let currentIndex = 0;

// Helper function to get images from dataset directory
const getDatasetImages = () => {
  try {
    const datasetDir = path.join(__dirname, '../dataset');
    if (!fs.existsSync(datasetDir)) {
      return [];
    }
    const files = fs.readdirSync(datasetDir)
      .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
      .sort();
    return files;
  } catch (error) {
    console.error('Error reading dataset directory:', error);
    return [];
  }
};

// GET /api/image - Get next image in rotation
router.get('/', async (req, res) => {
  try {
    const datasetFiles = getDatasetImages();
    
    if (datasetFiles.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No dataset images found',
      });
    }

    // Reset index if it exceeds the array length
    if (currentIndex >= datasetFiles.length) {
      currentIndex = 0;
    }

    const filename = datasetFiles[currentIndex];
    const imagePath = `/dataset/${filename}`;
    const fullImageUrl = `http://localhost:5000${imagePath}`;

    const response = {
      success: true,
      image: {
        path: fullImageUrl,
        index: currentIndex,
      },
      progress: {
        total: datasetFiles.length,
        completed: currentIndex,
      },
    };

    // Increment index for next request
    currentIndex++;

    res.status(200).json(response);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      error: 'Failed to retrieve image',
      message: error.message,
    });
  }
});

// GET /api/image/dataset - Get full dataset information
router.get('/dataset', authenticateToken, async (req, res) => {
  try {
    const datasetFiles = getDatasetImages();
    res.status(200).json({
      success: true,
      dataset: {
        total: datasetFiles.length,
        images: datasetFiles.map((filename, index) => ({
          filename,
          path: `/dataset/${filename}`,
          index,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve dataset',
      message: error.message,
    });
  }
});

module.exports = router;
