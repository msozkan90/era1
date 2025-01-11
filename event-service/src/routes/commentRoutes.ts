import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createComment,
  getEventComments,
  updateComment,
  deleteComment
} from '../controllers/commentController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Event comments management
 */

/**
 * @swagger
 * /api/events/{eventId}/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.post('/:eventId/comments', authMiddleware, createComment);

/**
 * @swagger
 * /api/events/{eventId}/comments:
 *   get:
 *     summary: Get all comments for an event
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.get('/:eventId/comments', getEventComments);

/**
 * @swagger
 * /api/events/{eventId}/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to update this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/:eventId/comments/:commentId', authMiddleware, updateComment);

/**
 * @swagger
 * /api/events/{eventId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete('/:eventId/comments/:commentId', authMiddleware, deleteComment);

export default router;