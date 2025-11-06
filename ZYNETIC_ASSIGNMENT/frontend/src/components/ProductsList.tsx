import React, { useState, useEffect } from 'react';
import { products } from '../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
}

const ProductsList: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    search: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        minRating: filters.minRating ? Number(filters.minRating) : undefined,
      };
      const response = await products.getAll(params);
      setProductList(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container">
      <div className="filters-section">
        <h1 className="page-title">Products</h1>
        <div className="filters-grid">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            className="form-input"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <select
            name="category"
            className="form-input"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            className="form-input"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            className="form-input"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="product-grid">
        {productList.map((product) => (
          <div key={product._id} className="product-card">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <div className="product-info">
              <span className="product-price">₹{product.price.toFixed(2)}</span>
              <span className="product-rating">★ {product.rating}</span>
            </div>
            <span className="product-category">{product.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList; 