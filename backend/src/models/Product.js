import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  images: [String],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  
  // CORE UNIQUE FEATURE: Active Percentage System
  activePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    description: 'Concentration of active compound(s)'
  },
  
  // Tagging System with weights
  tags: [{
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    relevanceScore: {
      type: Number,
      default: 1,
      min: 0,
      max: 10,
      description: 'How strongly this tag represents the product'
    }
  }],
  
  // Product Profile (Pop-up Content)
  profile: {
    originStory: {
      type: String,
      required: true
    },
    harvestCycle: {
      type: String,
      description: 'When and how ingredients are harvested'
    },
    maker: {
      name: String,
      location: String,
      bio: String,
      foundedYear: Number
    }
  },
  
  // All Ingredients (Pop-up Content)
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    source: {
      type: String,
      enum: ['Organic', 'Wildcrafted', 'Conventional'],
      default: 'Organic'
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      description: 'Percentage of total formulation'
    },
    benefits: [String]
  }],
  
  // Shipping
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    originCountry: {
      type: String,
      required: true
    },
    globalAvailability: {
      type: Boolean,
      default: true
    },
    restrictedCountries: [String]
  },
  
  // Reviews & Ratings
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Category & Classification
  category: {
    type: String,
    enum: ['herbal', 'homeopathic', 'ayurvedic', 'tcm', 'essential-oil', 'supplement'],
    required: true
  },
  
  // SEO & Discovery
  metaTitle: String,
  metaDescription: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update timestamps
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for search optimization
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  'tags.name': 'text' 
});

// Custom method to calculate search score
productSchema.methods.calculateSearchScore = function(searchTags) {
  let tagScore = 0;
  const tagNames = this.tags.map(t => t.name);
  
  searchTags.forEach(searchTag => {
    const matchingTag = this.tags.find(t => t.name === searchTag.toLowerCase());
    if (matchingTag) {
      tagScore += matchingTag.relevanceScore || 1;
    }
  });
  
  // Combine tag score with active percentage
  return (tagScore / searchTags.length) * (this.activePercentage / 100);
};

export default mongoose.model('Product', productSchema);
