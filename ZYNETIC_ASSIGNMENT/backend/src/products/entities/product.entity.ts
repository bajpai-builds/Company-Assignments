import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @ObjectIdColumn()
  _id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  price: number;

  @Column()
  rating: number;

  @Column()
  userId: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
} 