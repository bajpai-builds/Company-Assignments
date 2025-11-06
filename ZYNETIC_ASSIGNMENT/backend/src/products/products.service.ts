import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const product = this.productRepository.create({
      ...createProductDto,
      userId,
    });
    return await this.productRepository.save(product);
  }

  async findAll(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    search?: string;
  }) {
    const query: any = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) {
        query.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        query.price.$lte = filters.maxPrice;
      }
    }

    if (filters.minRating) {
      query.rating = { $gte: filters.minRating };
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return await this.productRepository.find({ where: query });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { _id: id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const product = await this.findOne(id);
    if (product.userId !== userId) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const product = await this.findOne(id);
    if (product.userId !== userId) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.delete(id);
    return { message: 'Product deleted successfully' };
  }
} 