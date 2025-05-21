import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'

export const protectCompany = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]  // ✅ Correct way

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.company = await Company.findById(decoded.id).select('-password')

      return next()

    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token failed' })
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, Login Again' })
}
