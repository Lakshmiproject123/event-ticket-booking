import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Event extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  declare readonly id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  location: string;

  @Column({ type: DataType.STRING }) 
  bannerUrl: string;
}

