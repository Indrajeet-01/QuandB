import express from 'express'
import { deleteUser, getUserDetails, getUserImage, insertUser, updateUserDetails } from '../controllers/user.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/insert', insertUser)
router.get('/details/:user_id', getUserDetails)
router.put('/update',authMiddleware, updateUserDetails)
router.delete('/delete/:user_id', deleteUser)
router.get('/image/:user_id', getUserImage)

export default router