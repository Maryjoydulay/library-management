# Inventory Management System

A complete CRUD API for managing inventory/store operations with Products, Suppliers, and Orders.

## Features

- **Products Management**: Create, read, update, delete products with SKU, name, price, and stock
- **Suppliers Management**: Manage supplier information with contact details
- **Orders Management**: Handle orders with multiple items, supplier relationships, and status tracking
- **Stock Management**: Automatic stock updates when orders are processed
- **Search & Pagination**: Advanced querying capabilities for all entities
- **Data Validation**: Comprehensive input validation and error handling

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```
   MONGO_URI=mongodb://localhost:27017/inventory_management
   PORT=3000
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Test the API**
   ```bash
   node test-api.js
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination, search, sorting)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/sku/:sku` - Get product by SKU
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/stock` - Update product stock

### Suppliers
- `GET /api/suppliers` - Get all suppliers (with pagination, search, sorting)
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Orders
- `GET /api/orders` - Get all orders (with pagination, filtering, sorting)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `PATCH /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/process` - Process order (update stock)

## Data Models

### Product
```javascript
{
  sku: String (required, unique),
  name: String (required),
  price: Number (required, min: 0),
  stock: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Supplier
```javascript
{
  name: String (required),
  contact: {
    email: String (required, valid email),
    phone: String (optional),
    address: String (optional)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  items: [{
    productId: ObjectId (ref: Product),
    qty: Number (required, min: 1),
    price: Number (required, min: 0)
  }],
  supplierId: ObjectId (ref: Supplier),
  status: String (enum: pending, confirmed, shipped, delivered, cancelled),
  totalAmount: Number (auto-calculated),
  orderDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Order Status Flow

1. **pending** - Order created, awaiting confirmation
2. **confirmed** - Order confirmed by supplier
3. **shipped** - Order shipped by supplier
4. **delivered** - Order delivered (use process endpoint to update stock)
5. **cancelled** - Order cancelled

## Testing

Use the provided `test-api.js` script to test all endpoints:

```bash
node test-api.js
```

Or use curl/Postman with the examples in `API_DOCUMENTATION.md`.

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP request logger
- **dotenv**: Environment variable loader
- **body-parser**: Request body parsing

## Project Structure

```
├── app.js                 # Main application file
├── config/
│   └── db.js             # Database connection
├── controllers/
│   ├── productController.js
│   ├── supplierController.js
│   ├── orderController.js
│   └── userController.js
├── models/
│   ├── productModel.js
│   ├── supplierModel.js
│   ├── orderModel.js
│   └── userModel.js
├── routes/
│   ├── productRoutes.js
│   ├── supplierRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── test-api.js           # API testing script
└── API_DOCUMENTATION.md  # Detailed API documentation
```


