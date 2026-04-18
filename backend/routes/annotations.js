const express = require('express');
const Annotation = require('../models/Annotation');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/annotation - Save new annotation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { image_path, image_index, disease, case_type, severity, description, confidence, modality, body_part, age_group, review_required, box } = req.body;
    const doctor = req.user.username;

    // Validation
    if (!image_path || image_index === undefined || !disease || !box) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Missing required fields: image_path, image_index, disease, or box',
      });
    }

    // Validate bounding box
    if (!box.x1 === undefined || box.y1 === undefined || box.x2 === undefined || box.y2 === undefined) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid bounding box coordinates',
      });
    }

    // Check if annotation already exists
    const existingAnnotation = await Annotation.findOne({
      doctor,
      image_path,
    });

    if (existingAnnotation) {
      return res.status(409).json({
        error: 'Duplicate Annotation',
        message: 'This doctor has already annotated this image',
      });
    }

    // Create new annotation
    const annotation = new Annotation({
      doctor,
      image_path,
      image_index,
      disease,
      case_type: case_type || 'Normal',
      severity: severity || 'Mild',
      description: description || '',
      confidence: confidence || 50,
      modality: modality || 'X-ray',
      body_part: body_part || 'Chest',
      age_group: age_group || 'Adult (20-65)',
      review_required: review_required || false,
      box,
      timestamp: new Date(),
    });

    await annotation.save();

    // Update user annotation count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { annotationsCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Annotation saved successfully',
      annotation: {
        _id: annotation._id,
        image_path: annotation.image_path,
        disease: annotation.disease,
        timestamp: annotation.timestamp,
      },
    });
  } catch (error) {
    console.error('Save annotation error:', error);
    res.status(500).json({
      error: 'Failed to save annotation',
      message: error.message,
    });
  }
});

// GET /api/annotation - Get all annotations for the logged-in doctor
router.get('/', authenticateToken, async (req, res) => {
  try {
    const doctor = req.user.username;

    const annotations = await Annotation.find({ doctor }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: annotations.length,
      annotations,
    });
  } catch (error) {
    console.error('Get annotations error:', error);
    res.status(500).json({
      error: 'Failed to retrieve annotations',
      message: error.message,
    });
  }
});

// GET /api/annotation/:id - Get specific annotation
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id);

    if (!annotation) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Annotation not found',
      });
    }

    // Check authorization
    if (annotation.doctor !== req.user.username) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to view this annotation',
      });
    }

    res.status(200).json({
      success: true,
      annotation,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve annotation',
      message: error.message,
    });
  }
});

// PUT /api/annotation/:id - Update annotation
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id);

    if (!annotation) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Annotation not found',
      });
    }

    // Check authorization
    if (annotation.doctor !== req.user.username) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this annotation',
      });
    }

    // Update allowed fields
    const allowedFields = ['disease', 'case_type', 'severity', 'description', 'confidence', 'modality', 'body_part', 'age_group', 'review_required', 'box'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        annotation[field] = req.body[field];
      }
    });

    await annotation.save();

    res.status(200).json({
      success: true,
      message: 'Annotation updated successfully',
      annotation,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update annotation',
      message: error.message,
    });
  }
});

// DELETE /api/annotation/:id - Delete annotation
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id);

    if (!annotation) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Annotation not found',
      });
    }

    // Check authorization
    if (annotation.doctor !== req.user.username) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this annotation',
      });
    }

    await Annotation.findByIdAndDelete(req.params.id);

    // Update user annotation count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { annotationsCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Annotation deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete annotation',
      message: error.message,
    });
  }
});

module.exports = router;
