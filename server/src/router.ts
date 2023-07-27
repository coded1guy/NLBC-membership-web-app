import { Router } from "express";
const router = Router();

// all member-related routes
router.get('/allMember', (req, res) => {
    res.json({ message: "welcome to all members" })
})
router.get('/member/:id', (req, res) => {})
router.put('/allMember', (req, res) => {})
router.delete('/member', (req, res) => {})
router.delete('/allMember', (req, res) => {})

// all admin-focused routes
router.get('/allAdmin', (req, res) => {})
router.get('/admin/:id', (req, res) => {})
router.put('/admin/:id', (req, res) => {})
router.delete('/admin/:id', (req, res) => {})

export default router;
