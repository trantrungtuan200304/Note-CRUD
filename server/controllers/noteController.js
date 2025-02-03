import NoteModel from '../models/noteModel.js';

const getAllNotes = async (req, res) => {
    try {
        const noteData = await NoteModel.find();

        if (!noteData || noteData.length === 0) {
            return res.status(404).json({ message: 'No notes found' });
        }

        res.json(noteData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const createNote = async (req, res) => {
    const newNote = new NoteModel(req.body);
    await newNote.save();
    res.status(201).json({ message: "Ghi chú đã được lưu!", note: newNote })
}

const getNoteById = async (noteId) => {
    return await NoteModel.findById(noteId);
}

const getNote = async (req, res) => {
    const noteId = req.params.id;
    const note = await NoteModel.findById(noteId);
    res.status(200).json(note);
}

const editNote = async (req, res) => {
    const noteId = req.params.id;
    const noteFoundById = await getNoteById(noteId);

    noteFoundById.title = req.body.title || noteFoundById.title;
    noteFoundById.description = req.body.description || noteFoundById.description;
    await noteFoundById.save();

    res.status(200).json({ message: "Ghi chú đã được cập nhật!", note: noteFoundById })
}

const deleteNote = async (req, res) => {
    const noteId = req.params.id;
    const deletedNote = await NoteModel.findByIdAndDelete(noteId);

    res.status(200).json({ message: "Ghi chú đã được xóa thành công!", note: deletedNote });
}

export {
    getAllNotes,
    getNote,
    createNote,
    editNote,
    deleteNote
}