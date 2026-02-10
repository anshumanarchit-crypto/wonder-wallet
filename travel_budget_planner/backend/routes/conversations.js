import { Router } from 'express';
import ChatConversation from '../models/ChatConversation.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/conversations — list user's conversations
router.get('/', optionalAuth, async (req, res) => {
    try {
        const filter = req.userId ? { userId: req.userId } : {};
        const conversations = await ChatConversation.find(filter)
            .select('title createdAt updatedAt messages')
            .sort({ updatedAt: -1 })
            .lean();

        // Return conversations with message count instead of full messages
        const data = conversations.map((c) => ({
            id: c._id,
            title: c.title,
            messageCount: c.messages.length,
            lastMessage: c.messages.length > 0 ? c.messages[c.messages.length - 1].content.substring(0, 100) : '',
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        }));

        res.json({ status: 'success', count: data.length, data });
    } catch (error) {
        console.error('List conversations error:', error);
        res.status(500).json({ error: 'Failed to fetch conversations.' });
    }
});

// GET /api/conversations/:id — get full conversation with messages
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const conversation = await ChatConversation.findById(req.params.id).lean();

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }

        res.json({ status: 'success', data: conversation });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ error: 'Failed to fetch conversation.' });
    }
});

// POST /api/conversations — save a conversation
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { title, messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required.' });
        }

        const conversation = new ChatConversation({
            userId: req.userId || null,
            title: title || `Chat ${new Date().toLocaleDateString()}`,
            messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
                timestamp: m.timestamp || new Date(),
            })),
        });

        await conversation.save();

        res.status(201).json({
            status: 'success',
            message: 'Conversation saved',
            data: { id: conversation._id, title: conversation.title },
        });
    } catch (error) {
        console.error('Save conversation error:', error);
        res.status(500).json({ error: 'Failed to save conversation.' });
    }
});

// PUT /api/conversations/:id — update conversation (add messages)
router.put('/:id', optionalAuth, async (req, res) => {
    try {
        const { messages, title } = req.body;
        const update = {};

        if (title) update.title = title;
        if (messages && Array.isArray(messages)) {
            update.$push = { messages: { $each: messages } };
        }

        const conversation = await ChatConversation.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }

        res.json({
            status: 'success',
            message: 'Conversation updated',
            data: { id: conversation._id, messageCount: conversation.messages.length },
        });
    } catch (error) {
        console.error('Update conversation error:', error);
        res.status(500).json({ error: 'Failed to update conversation.' });
    }
});

// DELETE /api/conversations/:id
router.delete('/:id', optionalAuth, async (req, res) => {
    try {
        const conversation = await ChatConversation.findByIdAndDelete(req.params.id);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }

        res.json({ status: 'success', message: 'Conversation deleted' });
    } catch (error) {
        console.error('Delete conversation error:', error);
        res.status(500).json({ error: 'Failed to delete conversation.' });
    }
});

export default router;
