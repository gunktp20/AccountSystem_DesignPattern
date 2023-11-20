import express from 'express'
const router = express.Router();
import { getAllUser } from '../controllers/user.controller.mjs'

router.route("/").get(getAllUser)

export default router