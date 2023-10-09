import { DataTypes } from 'sequelize';
import {sequelize} from '../db.js'

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_name: {
        type: DataTypes.STRING,
    },
    user_email: {
        type: DataTypes.STRING,
        unique: true,
    },
    user_password: {
        type: DataTypes.STRING,
    },
    user_image: {
        type: DataTypes.STRING,
    },
    total_orders: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    last_logged_in: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

export default User;
