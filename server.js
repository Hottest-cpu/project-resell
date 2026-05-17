const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Mock listings data
const mockListings = [
  {
    id: 1,
    title: 'Vintage Canon AE-1 Camera',
    price: 35,
    platform: 'Craigslist',
    location: 'San Francisco',
    url: 'https://craigslist.org/search/sss?query=vintage+camera',
    description: 'Vintage 35mm film camera in excellent working condition'
  },
  {
    id: 2,
    title: 'Apple MacBook Pro 2015',
    price: 450,
    platform: 'Facebook Marketplace',
    location: 'Oakland',
    url: 'https://facebook.com/marketplace',
    description: 'Used MacBook Pro, runs great, some scratches'
  },
  {
    id: 3,
    title: 'Vintage Leather Sofa',
    price: 150,
    platform: 'Craigslist',
    location: 'Berkeley',
    url: 'https://craigslist.org/search/sss?query=vintage+sofa',
    description: 'Classic mid-century leather sofa'
  },
  {
    id: 4,
    title: 'Nintendo Switch Console',
    price: 200,
    platform: 'Facebook Marketplace',
    location: 'San Jose',
    url: 'https://facebook.com/marketplace',
    description: 'Like new, includes 2 games'
  },
  {
    id: 5,
    title: 'Vintage Rolex Watch',
    price: 200,
    platform: 'Craigslist',
    location: 'San Francisco',
    url: 'https://craigslist.org/search/sss?query=vintage+watch',
    description: 'Vintage Rolex Submariner, keeps good time'
  },
  {
    id: 6,
    title: 'Sony WH-1000XM4 Headphones',
    price: 180,
    platform: 'Facebook Marketplace',
    location: 'San Diego',
    url: 'https://facebook.com/marketplace',
    description: 'Barely used noise canceling headphones'
  },
  {
    id: 7,
    title: 'Vintage Nikon FM2 Camera',
    price: 250,
    platform: 'Craigslist',
    location: 'Los Angeles',
    url: 'https://craigslist.org/search/sss?query=vintage+camera',
    description: 'Professional 35mm film camera, pristine condition'
  },
  {
    id: 8,
    title: 'Dyson V11 Vacuum',
    price: 350,
    platform: 'Facebook Marketplace',
    location: 'San Francisco',
    url: 'https://facebook.com/marketplace',
    description: 'Like new cordless vacuum cleaner'
  },
  {
    id: 9,
    title: 'Vintage Leica M6 Camera',
    price: 400,
    platform: 'Craigslist',
    location: 'New York',
    url: 'https://craigslist.org/search/sss?query=vintage+camera',
    description: 'Classic rangefinder camera, excellent optics'
  },
  {
    id: 10,
    title: 'iPad Pro 12.9 2022',
    price: 600,
    platform: 'Facebook Marketplace',
    location: 'Boston',
    url: 'https://facebook.com/marketplace',
    description: 'Newer model with Apple Pencil'
  }
];

// Category multipliers for profit analysis
const CATEGORY_MULTIPLIERS = {
  'camera': 3.5,
  'watch': 3.0,
  'electronics': 2.5,
  'furniture': 2.0,
  'headphones': 2.3,
  'laptop': 2.2,
  'console': 2.4,
  'vacuum': 1.8,
  'sofa': 1.6,
  'other': 1.5
};

// Detect category from title
function detectCategory(title) {
  const titleLower = title.toLowerCase();
  for (const [category, multiplier] of Object.entries(CATEGORY_MULTIPLIERS)) {
    if (titleLower.includes(category)) return category;
  }
  return 'other';
}

// Analyze profit
function analyzeProfit(item) {
  const purchasePrice = item.price;
  const category = detectCategory(item.title);
  const multiplier = CATEGORY_MULTIPLIERS[category] || 1.5;
  
  const estimatedResale = purchasePrice * multiplier;
  const platformFee = estimatedResale * 0.125; // 12.5% eBay fee
  const shippingCost = 8;
  
  const netProfit = estimatedResale - purchasePrice - platformFee - shippingCost;
  const profitMargin = (netProfit / purchasePrice) * 100;
  
  let recommendation = 'PASS';
  if (netProfit > 50 && profitMargin > 100) recommendation = 'BUY';
  else if (netProfit > 20 && profitMargin > 50) recommendation = 'MAYBE';
  
  return {
    purchasePrice,
    estimatedResale: Math.round(estimatedResale * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    shippingCost,
    netProfit: Math.round(netProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
    recommendation,
    category
  };
}

// Routes
app.get('/api/listings', (req, res) => {
  res.json(mockListings);
});

app.post('/api/analyze', (req, res) => {
  const { listing } = req.body;
  const analysis = analyzeProfit(listing);
  res.json(analysis);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Resale Scanner running on http://localhost:${PORT}`);
  console.log(`📱 Open your browser and visit http://localhost:${PORT}`);
});
