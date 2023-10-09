import { Sequelize } from "sequelize";


export const sequelize = new Sequelize('quadb', 'root', 'isy987', {
    host: 'localhost',
    dialect: 'mysql', 
    pool: {
        max: 5,
        min: 0,
    },
    logging: console.log,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database successfully.');

        await sequelize.sync();
        console.log('Models synchronized with the database');
    } catch (error) {
        console.error('Error:', error);
    }
})();