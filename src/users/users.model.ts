import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Table({ tableName: 'Users' })
export class User extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({
    type: DataType.ENUM('admin', 'customer'),
    defaultValue: UserRole.CUSTOMER,
  })
  declare role: UserRole;
}
