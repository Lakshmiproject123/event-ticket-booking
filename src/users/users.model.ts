import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Table
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;   

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;  

  @Column({ type: DataType.ENUM('admin', 'customer'), defaultValue: 'customer' })
  declare role: UserRole;   
}
