import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      shippingMethod,
      currency
    } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        activePercentage: product.activePercentage
      });
    }

    // Calculate shipping and tax (simplified)
    const shippingCost = shippingMethod === 'express' ? 25 : 
                         shippingMethod === 'priority' ? 15 : 10;
    const tax = subtotal * 0.1; // 10% tax (example)
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      user: req.userId || null,
      guestEmail: req.body.guestEmail,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      shippingMethod,
      shippingCost,
      tax,
      subtotal,
      total,
      currency: currency || 'USD',
      customsDeclaration: {
        exportCountry: 'USA',
        importCountry: shippingAddress.country,
        harmonizedCode: '3004.90.0000',
        notes: 'Natural dietary supplements'
      }
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      data: order,
      paymentUrl: `/checkout/${order._id}/pay` // Placeholder
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get Order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.user && order.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status || order.orderStatus;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};
