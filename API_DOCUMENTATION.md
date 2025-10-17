# Inventory Management API Documentation

## Base URL
```
http://localhost:3000/api
```

## Health Check
```
GET /api/health
```

## Products API

### Get All Products
```
GET /api/products
Query Parameters:
- page (default: 1)
- limit (default: 10)
- search (search by name or SKU)
- sortBy (default: 'name')
- sortOrder (default: 'asc')
```

### Get Product by ID
```
GET /api/products/:id
```

### Get Product by SKU
```
GET /api/products/sku/:sku
```

### Create Product
```
POST /api/products
Content-Type: application/json

{
  "sku": "PROD001",
  "name": "Sample Product",
  "price": 29.99,
  "stock": 100
}
```

### Update Product
```
PUT /api/products/:id
Content-Type: application/json

{
  "sku": "PROD001",
  "name": "Updated Product Name",
  "price": 34.99,
  "stock": 150
}
```

### Delete Product
```
DELETE /api/products/:id
```

### Update Product Stock
```
PATCH /api/products/:id/stock
Content-Type: application/json

{
  "operation": "add", // "add", "subtract", or "set"
  "quantity": 50
}
```

## Suppliers API

### Get All Suppliers
```
GET /api/suppliers
Query Parameters:
- page (default: 1)
- limit (default: 10)
- search (search by name or email)
- sortBy (default: 'name')
- sortOrder (default: 'asc')
```

### Get Supplier by ID
```
GET /api/suppliers/:id
```

### Create Supplier
```
POST /api/suppliers
Content-Type: application/json

{
  "name": "ABC Suppliers",
  "contact": {
    "email": "contact@abcsuppliers.com",
    "phone": "+1-555-0123",
    "address": "123 Business St, City, State 12345"
  }
}
```

### Update Supplier
```
PUT /api/suppliers/:id
Content-Type: application/json

{
  "name": "Updated Supplier Name",
  "contact": {
    "email": "newemail@supplier.com",
    "phone": "+1-555-0456",
    "address": "456 New Address St, City, State 67890"
  }
}
```

### Delete Supplier
```
DELETE /api/suppliers/:id
```

## Orders API

### Get All Orders
```
GET /api/orders
Query Parameters:
- page (default: 1)
- limit (default: 10)
- status (filter by status)
- supplierId (filter by supplier)
- sortBy (default: 'orderDate')
- sortOrder (default: 'desc')
```

### Get Order by ID
```
GET /api/orders/:id
```

### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "productId": "PRODUCT_ID_HERE",
      "qty": 10,
      "price": 25.99
    },
    {
      "productId": "ANOTHER_PRODUCT_ID",
      "qty": 5,
      "price": 15.50
    }
  ],
  "supplierId": "SUPPLIER_ID_HERE"
}
```

### Update Order
```
PUT /api/orders/:id
Content-Type: application/json

{
  "items": [
    {
      "productId": "PRODUCT_ID_HERE",
      "qty": 15,
      "price": 25.99
    }
  ],
  "supplierId": "SUPPLIER_ID_HERE",
  "status": "confirmed"
}
```

### Delete Order
```
DELETE /api/orders/:id
```

### Update Order Status
```
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "shipped" // "pending", "confirmed", "shipped", "delivered", "cancelled"
}
```

### Process Order (Update Stock)
```
POST /api/orders/:id/process
Note: This endpoint updates product stock when an order is delivered 
```

## Order Status Flow
1. **pending** - Order created, awaiting confirmation
2. **confirmed** - Order confirmed by supplier
3. **shipped** - Order shipped by supplier
4. **delivered** - Order delivered (use process endpoint to update stock)
5. **cancelled** - Order cancelled

## Sample Test Data

### Create a Supplier
```bash
curl -X POST http://localhost:3000/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Supply Co",
    "contact": {
      "email": "orders@techsupply.com",
      "phone": "+1-555-0199",
      "address": "789 Tech Ave, Silicon Valley, CA 94000"
    }
  }'
```

### Create Products
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "LAPTOP001",
    "name": "Gaming Laptop",
    "price": 1299.99,
    "stock": 50
  }'

curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "MOUSE001",
    "name": "Wireless Mouse",
    "price": 29.99,
    "stock": 200
  }'
```

### Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "PRODUCT_ID_FROM_ABOVE",
        "qty": 5,
        "price": 1299.99
      },
      {
        "productId": "ANOTHER_PRODUCT_ID",
        "qty": 10,
        "price": 29.99
      }
    ],
    "supplierId": "SUPPLIER_ID_FROM_ABOVE"
  }'
```

## Error Responses
All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```
