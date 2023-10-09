import User from "../models/user.js";
import { Op } from 'sequelize'


import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// insert new user
export const insertUser = async (req, res) => {
    try {
        const { user_details } = req.body;
        // Check if a user with the same username or email already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ user_name: user_details.user_name }, { user_email: user_details.user_email }],
            },
        });

        if (existingUser) {
            return res.status(409).json('User already exists!');
        } 
        // hash the user's password before storing it in the database
        const hashedPassword = await bcrypt.hash(user_details.user_password, 10);

        // Create a new user record
        const newUser = await User.create({
            user_name: user_details.user_name,
            user_email: user_details.user_email,
            user_password: hashedPassword, 
            user_image: user_details.user_image,
            total_orders: user_details.total_orders,
        });

        // Generate a JWT token
        const token = jwt.sign({ userId: newUser.user_id }, 'jwtkey', { expiresIn: '7d' });
        
        // Set the JWT token as an HTTP-only cookie
        res.cookie('access_token', token, { httpOnly: true });

        res.status(201).json({ message: 'User created successfully' ,token});
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    } 
}

// get user details
export const getUserDetails = async (req, res) => {
    try {
        // extract the user_id from the query parameters
        const { user_id } = req.params;
        // Find the user by user_id in the database
        const user = await User.findByPk(user_id);
        
        if (!user) {
            return res.status(404).json('User not found');
        }
        const user_details = {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_image: user.user_image,
            total_orders: user.total_orders,
            created_at: user.created_at,
            last_logged_in: user.last_logged_in,
        };

        // Return the user details as an object
        res.status(200).json(user_details);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Failed to fetch user details' });
    }
};

// update user details
export const updateUserDetails = async (req, res) => {
    try {
        // extract the new user details from the request body
        const { new_details_of_user } = req.body;
        
        if (req.user.userId !== new_details_of_user.user_id) {
            return res.status(403).json('Access denied: You are not authorized to update this user.');
        }

        const userToUpdate = await User.findByPk(new_details_of_user.user_id);

        if (!userToUpdate) {
            return res.status(404).json('User not found');
        }

      // Update the user details
        userToUpdate.user_name = new_details_of_user.user_name;
        userToUpdate.user_email = new_details_of_user.user_email;
        userToUpdate.user_image = new_details_of_user.user_image;
        userToUpdate.total_orders = new_details_of_user.total_orders;

      // Save the updated user details to the database
        await userToUpdate.save();

        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ message: 'Failed to update user details' });
    }
};

// delete user 
export const deleteUser = async (req, res) => {
    try {
        // extract the user_id from the URL parameters
        const { user_id } = req.params;

        const userToDelete = await User.findByPk(user_id);

        if (!userToDelete) {
            return res.status(404).json('User not found');
        }

        // Delete the user from the database
        await userToDelete.destroy();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

// get user image
export const getUserImage = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json('User not found');
        }

      // Check if the user has an image
        if (!user.user_image) {
            return res.status(404).json('User image not found');
        }

        // Return the user's image as a response
        res.status(200).json({ user_image: user.user_image });
    } catch (error) {
        console.error('Error getting user image:', error);
        res.status(500).json({ message: 'Failed to get user image' });
    }
};
