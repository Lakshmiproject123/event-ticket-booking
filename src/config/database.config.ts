import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { config } from 'dotenv';

config(); 

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,  
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'eventdb',
  autoLoadModels: true,
  synchronize: true, 
};

