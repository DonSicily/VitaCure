import Product from '../models/Product.js';
import { sortProductsByRelevance, extractSearchTags } from '../utils/searchAlgorithm.js';

// Get all products with search & filter
export const getProducts = async (req, res) => {
  try {
    const { search, sort, category, minPercentage, maxPercentage } = req.query;
    
    let query = {};
    let products = [];
    
    // Build query
    if (category) {
      query.category = category;
    }
    
    if (minPercentage || maxPercentage) {
      query.activePercentage = {};
      if (minPercentage) query.activePercentage.$gte = parseFloat(minPercentage);
      if (maxPercentage) query.activePercentage.$lte = parseFloat(maxPercentage);
    }
    
    // If search exists, use text search
    if (search && search.trim().length > 0) {
      const searchTags = extractSearchTags(search);
      
      // Find products with text search
      products = await Product.find({
        $text: { $search: searchTags.join(' ') }
      });
      
      // Sort by relevance using our algorithm
      products = sortProductsByRelevance(products, searchTags);
    } else {
      // No search, just filter
      products = await Product.find(query);
      
      // Sort by active percentage if requested
      if (sort === 'active-desc') {
        products.sort((a, b) => b.activePercentage - a.activePercentage);
      } else if (sort === 'active-asc') {
        products.sort((a, b) => a.activePercentage - b.activePercentage);
      } else if (sort === 'price-low') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        products.sort((a, b) => b.averageRating - a.averageRating);
      }
    }
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Get products by tag
export const getProductsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    
    const products = await Product.find({
      'tags.name': tag.toLowerCase()
    });
    
    // Sort by active percentage
    const sorted = products.sort((a, b) => b.activePercentage - a.activePercentage);
    
    res.status(200).json({
      success: true,
      count: sorted.length,
      data: sorted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by tag',
      error: error.message
    });
  }
};

// Create product (Admin only - add auth middleware later)
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Generate slug from name
    productData.slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Seed initial products (for testing)
export const seedProducts = async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Ashwagandha Root Extract",
        description: "Potent adaptogenic herb for stress relief and cortisol balance. Used in Ayurvedic medicine for over 3,000 years.",
        shortDescription: "Premium organic ashwagandha for stress management",
        price: 34.99,
        images: ["ashwagandha-1.jpg", "ashwagandha-2.jpg"],
        stock: 150,
        activePercentage: 85,
        tags: [
          { name: "stress relief", relevanceScore: 10 },
          { name: "anxiety", relevanceScore: 9 },
          { name: "adaptogen", relevanceScore: 8 },
          { name: "sleep", relevanceScore: 7 },
          { name: "immunity", relevanceScore: 6 }
        ],
        profile: {
          originStory: "Used for millennia in traditional Ayurvedic medicine, Ashwagandha is known as the 'strength of the stallion' for its rejuvenating properties.",
          harvestCycle: "Harvested annually in the winter months when roots are most potent, typically October through February.",
          maker: {
            name: "EarthRoot Apothecary",
            location: "Kerala, India",
            bio: "Family-owned farm practicing sustainable, biodynamic cultivation since 1982.",
            foundedYear: 1982
          }
        },
        ingredients: [
          {
            name: "Ashwagandha Root (Withania somnifera)",
            source: "Organic",
            percentage: 70,
            benefits: ["Reduces cortisol", "Supports sleep", "Enhances vitality"]
          },
          {
            name: "Black Pepper Extract",
            source: "Organic",
            percentage: 15,
            benefits: ["Enhances absorption", "Supports digestion"]
          },
          {
            name: "Organic Coconut Oil",
            source: "Organic",
            percentage: 15,
            benefits: ["Carrier oil", "Promotes absorption"]
          }
        ],
        shipping: {
          weight: 0.25,
          dimensions: { length: 10, width: 8, height: 5 },
          originCountry: "India",
          globalAvailability: true
        },
        category: "ayurvedic",
        averageRating: 4.8,
        reviewCount: 127,
        metaTitle: "Buy Organic Ashwagandha Extract | Stress Relief Supplement",
        metaDescription: "Premium Ashwagandha root extract with 85% active withanolides. Organic, sustainably sourced from India. Support stress management naturally."
      },
      {
        name: "Valerian Root Sleep Tincture",
        description: "Powerful herbal sedative for deep, restorative sleep. Non-habit forming and gentle on the system.",
        shortDescription: "Natural sleep aid with 70% active valerenic acid",
        price: 28.50,
        images: ["valerian-1.jpg", "valerian-2.jpg"],
        stock: 80,
        activePercentage: 72,
        tags: [
          { name: "sleep", relevanceScore: 10 },
          { name: "insomnia", relevanceScore: 9 },
          { name: "relaxation", relevanceScore: 8 },
          { name: "anxiety", relevanceScore: 7 },
          { name: "stress relief", relevanceScore: 6 }
        ],
        profile: {
          originStory: "Valerian root has been used since ancient Greece and Rome to promote calm and restful sleep. Hippocrates himself recommended it for insomnia.",
          harvestCycle: "Roots are harvested in the autumn of the plant's second year for maximum potency.",
          maker: {
            name: "Herbal Harmony",
            location: "Oregon, USA",
            bio: "Crafting small-batch tinctures using locally grown and wildcrafted herbs since 2005.",
            foundedYear: 2005
          }
        },
        ingredients: [
          {
            name: "Valerian Root (Valeriana officinalis)",
            source: "Wildcrafted",
            percentage: 60,
            benefits: ["Promotes sleep", "Reduces anxiety", "Muscle relaxation"]
          },
          {
            name: "Organic Grain Alcohol",
            source: "Organic",
            percentage: 30,
            benefits: ["Extraction agent", "Preservative"]
          },
          {
            name: "Distilled Water",
            source: "Conventional",
            percentage: 10,
            benefits: ["Dilution", "Carrier"]
          }
        ],
        shipping: {
          weight: 0.15,
          dimensions: { length: 8, width: 5, height: 5 },
          originCountry: "USA",
          globalAvailability: true
        },
        category: "herbal",
        averageRating: 4.6,
        reviewCount: 95,
        metaTitle: "Natural Sleep Aid | Valerian Root Tincture 72% Active",
        metaDescription: "Organic valerian root tincture for deep sleep. 72% active valerenic acid. Non-habit forming, gentle formula for restful nights."
      },
      {
        name: "Turmeric & Ginger Joint Support",
        description: "Powerful anti-inflammatory blend for joint health and mobility. Combines nature's most potent anti-inflammatory agents.",
        shortDescription: "Joint support with 90% active curcuminoids",
        price: 39.99,
        images: ["turmeric-1.jpg", "turmeric-2.jpg"],
        stock: 200,
        activePercentage: 90,
        tags: [
          { name: "joint pain", relevanceScore: 10 },
          { name: "inflammation", relevanceScore: 9 },
          { name: "arthritis", relevanceScore: 8 },
          { name: "mobility", relevanceScore: 7 },
          { name: "immunity", relevanceScore: 6 }
        ],
        profile: {
          originStory: "Turmeric has been a cornerstone of Ayurvedic medicine for 4,000 years, prized for its golden color and powerful healing properties.",
          harvestCycle: "Harvested annually in January and February when rhizomes reach full maturity.",
          maker: {
            name: "Golden Roots Co.",
            location: "Sri Lanka",
            bio: "Directly working with smallholder farmers to bring the highest quality spices to the world.",
            foundedYear: 2010
          }
        },
        ingredients: [
          {
            name: "Turmeric Rhizome (Curcuma longa)",
            source: "Organic",
            percentage: 60,
            benefits: ["Anti-inflammatory", "Antioxidant", "Joint support"]
          },
          {
            name: "Ginger Root (Zingiber officinale)",
            source: "Organic",
            percentage: 20,
            benefits: ["Anti-inflammatory", "Digestive aid", "Circulation"]
          },
          {
            name: "Black Pepper Extract",
            source: "Organic",
            percentage: 10,
            benefits: ["Enhances curcumin absorption by 2000%", "Digestive support"]
          },
          {
            name: "Organic Coconut Oil",
            source: "Organic",
            percentage: 10,
            benefits: ["Fat-soluble carrier", "Metabolism support"]
          }
        ],
        shipping: {
          weight: 0.3,
          dimensions: { length: 12, width: 8, height: 6 },
          originCountry: "Sri Lanka",
          globalAvailability: true
        },
        category: "herbal",
        averageRating: 4.9,
        reviewCount: 203,
        metaTitle: "Turmeric & Ginger Joint Support | 90% Active Curcuminoids",
        metaDescription: "Premium joint support formula with 90% active curcuminoids. Organic turmeric and ginger with black pepper for maximum absorption."
      }
    ];

    for (const productData of sampleProducts) {
      const existing = await Product.findOne({ name: productData.name });
      if (!existing) {
        const product = new Product(productData);
        await product.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Products seeded successfully',
      count: sampleProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding products',
      error: error.message
    });
  }
};
