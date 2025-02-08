import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { User, Organization, Review } from '../models';

dotenv.config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    models: [User, Organization, Review],
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize; 