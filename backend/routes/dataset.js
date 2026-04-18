const express = require('express');
const Annotation = require('../models/Annotation');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/dataset - Get all annotations as structured dataset
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get all annotations
    const annotations = await Annotation.find().sort({ timestamp: 1 });

    // Get all users with their stats
    const users = await User.find().select('username email annotationsCount createdAt lastLogin');

    // Statistics
    const stats = {
      totalAnnotations: annotations.length,
      totalDoctors: users.length,
      totalImages: Math.max(...annotations.map(a => a.image_index + 1), 0),
      diseaseDistribution: {},
      doctorStats: {},
    };

    // Calculate statistics
    annotations.forEach(annotation => {
      // Disease distribution
      if (!stats.diseaseDistribution[annotation.disease]) {
        stats.diseaseDistribution[annotation.disease] = 0;
      }
      stats.diseaseDistribution[annotation.disease]++;

      // Doctor statistics
      if (!stats.doctorStats[annotation.doctor]) {
        stats.doctorStats[annotation.doctor] = {
          count: 0,
          diseases: [],
        };
      }
      stats.doctorStats[annotation.doctor].count++;
      if (!stats.doctorStats[annotation.doctor].diseases.includes(annotation.disease)) {
        stats.doctorStats[annotation.doctor].diseases.push(annotation.disease);
      }
    });

    res.status(200).json({
      success: true,
      dataset: {
        annotations,
        users,
        stats,
      },
    });
  } catch (error) {
    console.error('Get dataset error:', error);
    res.status(500).json({
      error: 'Failed to retrieve dataset',
      message: error.message,
    });
  }
});

// GET /api/dataset/export - Export dataset as JSON
router.get('/export/json', authenticateToken, async (req, res) => {
  try {
    const annotations = await Annotation.find().sort({ timestamp: 1 });

    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        totalAnnotations: annotations.length,
        exportedBy: req.user.username,
      },
      annotations: annotations.map(a => ({
        doctor: a.doctor,
        image_path: a.image_path,
        image_index: a.image_index,
        disease: a.disease,
        case_type: a.case_type,
        severity: a.severity,
        description: a.description,
        confidence: a.confidence,
        modality: a.modality,
        body_part: a.body_part,
        age_group: a.age_group,
        review_required: a.review_required,
        box: a.box,
        timestamp: a.timestamp,
      })),
    };

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="annotations_${Date.now()}.json"`);
    res.json(exportData);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to export dataset',
      message: error.message,
    });
  }
});

// GET /api/dataset/export/csv - Export dataset as CSV
router.get('/export/csv', authenticateToken, async (req, res) => {
  try {
    const annotations = await Annotation.find().sort({ timestamp: 1 });

    // CSV Headers
    const csvHeaders = [
      'Doctor',
      'Image Index',
      'Image Path',
      'Disease',
      'Case Type',
      'Severity',
      'Confidence',
      'Modality',
      'Body Part',
      'Age Group',
      'Box X1',
      'Box Y1',
      'Box X2',
      'Box Y2',
      'Review Required',
      'Timestamp',
    ].join(',');

    // CSV Rows
    const csvRows = annotations.map(a => [
      `"${a.doctor}"`,
      a.image_index,
      `"${a.image_path}"`,
      `"${a.disease}"`,
      a.case_type,
      a.severity,
      a.confidence,
      a.modality,
      `"${a.body_part}"`,
      `"${a.age_group}"`,
      a.box.x1,
      a.box.y1,
      a.box.x2,
      a.box.y2,
      a.review_required,
      a.timestamp,
    ].join(','));

    const csv = [csvHeaders, ...csvRows].join('\n');

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="annotations_${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to export dataset',
      message: error.message,
    });
  }
});

// GET /api/dataset/stats - Get detailed statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const annotations = await Annotation.find();

    const stats = {
      totalAnnotations: annotations.length,
      casesNormal: annotations.filter(a => a.case_type === 'Normal').length,
      casesAbnormal: annotations.filter(a => a.case_type === 'Abnormal').length,
      severityDistribution: {
        Mild: annotations.filter(a => a.severity === 'Mild').length,
        Moderate: annotations.filter(a => a.severity === 'Moderate').length,
        Severe: annotations.filter(a => a.severity === 'Severe').length,
      },
      diseaseDistribution: {},
      averageConfidence: annotations.length > 0
        ? Math.round(annotations.reduce((sum, a) => sum + a.confidence, 0) / annotations.length)
        : 0,
      reviewRequired: annotations.filter(a => a.review_required).length,
    };

    annotations.forEach(a => {
      if (!stats.diseaseDistribution[a.disease]) {
        stats.diseaseDistribution[a.disease] = 0;
      }
      stats.diseaseDistribution[a.disease]++;
    });

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve statistics',
      message: error.message,
    });
  }
});

module.exports = router;
