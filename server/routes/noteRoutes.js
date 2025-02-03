import express from 'express';
import {getAllNotes, getNote, createNote, editNote, deleteNote} from '../controllers/noteController.js';
const router = express.Router();

router.get("/", getAllNotes)

router.get('/:id', getNote);

router.post('/', createNote)

router.patch('/:id', editNote)

router.delete('/:id', deleteNote)

export default router;