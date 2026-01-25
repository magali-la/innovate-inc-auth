const express = require("express");
const router = express.Router();
const Bookmark = require("../models/Bookmark.js");

// MIDDLEWARE
const authMiddleware = require("../utils/auth.js");
router.use(authMiddleware);

// ROUTES - induces
// Index - get all bookmarks from the user
router.get('/', async (req, res) => {
    try {
        // find by the user retrieved from the middleware's response
        const bookmarks = await Bookmark.find({ user: req.user._id });
        // respond with their bookmarks
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Index - get one by id
router.get('/:id', async (req, res) => {
    const bookmarkId = req.params.id;

    try {
        const bookmark = await Bookmark.findById(bookmarkId);

        if (!bookmark) {
            return res.status(404).json({ message: 'No bookmark found with this id' });
        }

        // Check user id
        if (bookmark.user.toString() !== req.user._id) {
            return res.status(403).json({ message: 'User is not authorized to view this bookmark' });
        }

        res.json(bookmark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete - delete bookmark
router.delete('/:id', async (req, res) => {
	const bookmarkId = req.params.id

    try {
        const bookmark = await Bookmark.findById(bookmarkId);

        if (!bookmark) {
          return res.status(404).json({ message: 'No bookmark found with this id' });
        }

		// check if the bookmark doesn't belong to the user:
		if (bookmark.user.toString() !== req.user._id) {
			return res.status(403).json({ message: 'User is not authorized to delete this bookmark' });
		}
		
		// after authorization delete it
		await bookmark.deleteOne();

        res.json({ message: 'Bookmark deleted', deletedBookmark: bookmark });
    } catch (error) {
      	res.status(500).json({ message: error.message });
    }
}); 

// Update - update a bookmark
router.put('/:id', async (req, res) => {
	const bookmarkId = req.params.id
	try {
		// find the bookmark first then run authorization
		const bookmark = await Bookmark.findById(bookmarkId);
		// error if no bookmark found
		if (!bookmark) {
			return res.status(404).json({ message: 'No bookmark found with this id'});
		}

		// check if the bookmark doesn't belong to the user:
		if (bookmark.user.toString() !== req.user._id) {
			return res.status(403).json({ message: 'User is not authorized to update this bookmark' });
		}

		// otherwise continue with the update - use object.assign to overwrite anything from the request body that has changed from the originl
		Object.assign(bookmark, req.body);
		// then save the bookmark
		await bookmark.save();

		// respond with the new bookmark
		res.json(bookmark);
	} catch (error) {
      	res.status(500).json({ message: error.message });
	}
});

// Create - post a new bookmark
router.post("/", async (req, res) => {
    try {
        // spread operator to take all the fields from the req body without writing each one, then add the user so it's attached to the bookmark, the middleware will respond with the req.user
        const bookmark = await Bookmark.create({...req.body, user: req.user._id });
        // success message with created bookmark
        res.status(201).json(bookmark);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;