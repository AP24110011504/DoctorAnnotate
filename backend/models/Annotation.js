const mongoose = require('mongoose');

const annotationSchema = new mongoose.Schema(
  {
    doctor: {
      type: String,
      required: [true, 'Doctor name is required'],
    },
    image_path: {
      type: String,
      required: [true, 'Image path is required'],
    },
    image_index: {
      type: Number,
      required: [true, 'Image index is required'],
    },
    disease: {
      type: String,
      required: [true, 'Disease name is required'],
    },
    case_type: {
      type: String,
      enum: ['Normal', 'Abnormal'],
      required: true,
      default: 'Normal',
    },
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe'],
      required: true,
      default: 'Mild',
    },
    description: {
      type: String,
      default: '',
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    modality: {
      type: String,
      default: 'X-ray',
    },
    body_part: {
      type: String,
      default: 'Chest',
    },
    age_group: {
      type: String,
      default: 'Adult (20-65)',
    },
    review_required: {
      type: Boolean,
      default: false,
    },
    box: {
      type: {
        x1: Number,
        y1: Number,
        x2: Number,
        y2: Number,
      },
      required: [true, 'Bounding box is required'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for finding unannotated images
annotationSchema.index({ doctor: 1, image_path: 1 });

module.exports = mongoose.model('Annotation', annotationSchema);
