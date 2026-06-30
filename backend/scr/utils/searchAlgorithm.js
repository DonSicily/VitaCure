// The Secret Sauce - Active Percentage Ranking Algorithm

export const calculateProductRelevance = (product, searchTags) => {
  if (!searchTags || searchTags.length === 0) {
    return product.activePercentage / 100;
  }
  
  let totalRelevanceScore = 0;
  let matchedTags = 0;
  
  searchTags.forEach(searchTag => {
    const normalizedSearchTag = searchTag.toLowerCase().trim();
    
    // Check if product tags match
    const matchingTag = product.tags.find(t => 
      t.name.includes(normalizedSearchTag) || 
      normalizedSearchTag.includes(t.name)
    );
    
    if (matchingTag) {
      matchedTags++;
      totalRelevanceScore += matchingTag.relevanceScore || 1;
    }
  });
  
  // If no tags matched, use description search (simplified)
  if (matchedTags === 0) {
    const descriptionMatch = product.description.toLowerCase().includes(searchTags[0].toLowerCase());
    if (descriptionMatch) {
      totalRelevanceScore = 0.5; // Base score for description match
      matchedTags = 1;
    }
  }
  
  // Calculate tag relevance (0-1)
  const tagRelevance = matchedTags > 0 
    ? Math.min(totalRelevanceScore / (searchTags.length * 2), 1) 
    : 0;
  
  // Combine with active percentage (60% weight to active %, 40% to tag relevance)
  const activeScore = product.activePercentage / 100;
  const finalScore = (activeScore * 0.6) + (tagRelevance * 0.4);
  
  return finalScore;
};

export const sortProductsByRelevance = (products, searchTags) => {
  return products
    .map(product => ({
      ...product,
      relevanceScore: calculateProductRelevance(product, searchTags)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
};

// Helper: Extract tags from search query
export const extractSearchTags = (searchQuery) => {
  // Split by commas, "and", "or", or spaces
  const delimiters = /[,，\s]+(?:and|or)?\s+/i;
  const tags = searchQuery.split(delimiters).filter(tag => tag.trim().length > 0);
  
  // Remove common stop words
  const stopWords = ['for', 'with', 'the', 'to', 'help', 'relief', 'treatment'];
  return tags.map(tag => tag.toLowerCase().trim())
    .filter(tag => !stopWords.includes(tag));
};
