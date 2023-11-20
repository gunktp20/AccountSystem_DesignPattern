import express from 'express'
const router = express.Router();
import { login , register , refresh } from '../controllers/auth.controller.mjs'

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/refresh").post(refresh)

export default router