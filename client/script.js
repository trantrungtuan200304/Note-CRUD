/*************************************************************************
 * Create Note Popup Logic
 **************************************************************************/
const popup = () => {
  const popupContainer = document.createElement("div");

  popupContainer.innerHTML = `
  <div id="popupContainer">
      <h1>New Note</h1>
      <input placeholder="Title" id="note-title">
      <textarea id="note-text" placeholder="Enter your note..."></textarea>
      <div id="btn-container">
          <button id="submitBtn" onclick="createNote()">Create Note</button>
          <button id="closeBtn" onclick="closePopup()">Close</button>
      </div>
  </div>
  `;
  document.body.appendChild(popupContainer);
}

const closePopup = () => {
  const popupContainer = document.getElementById("popupContainer");
  if (popupContainer) {
    popupContainer.remove();
  }
}

const createNote = async () => {
  const popupContainer = document.getElementById("popupContainer");
  const noteTitle = document.getElementById("note-title").value.trim();
  const noteDescription = document.getElementById("note-text").value.trim();

  const noteData = {
    title: noteTitle,
    description: noteDescription,
  };
  try {
    const response = await fetch("http://localhost:8000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
    });
    const result = await response.json();
    if (response.ok) {
      console.log("Ghi chú đã được lưu:", result);
    } else {
      console.error("Lỗi khi lưu ghi chú:", result.message);
    }
  } catch (error) {
    console.error("Lỗi kết nối:", error);
  }

  popupContainer.remove();
  displayNotes();
};

/*************************************************************************
 * Display Notes Logic
 **************************************************************************/

const getAllNotes = async () => {
  const url = "http://localhost:8000/api/notes";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const allNotes = await response.json();
    console.log(allNotes);
    return allNotes;
  } catch (error) {
    console.error(error.message);
  }
};

const displayNotes = async () => {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";

  const notes = await getAllNotes();
  notes.forEach((note) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
          <h3>${note.title}</h3>
          <span>${note.description}</span>
          <div id="noteBtns-container">
              <button id="editBtn" onclick="editNote('${note._id}')"><i class="fa-solid fa-pen"></i></button>
              <button id="deleteBtn" onclick="deleteNote('${note._id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
          `;
    notesList.appendChild(listItem);
  });
};

/*************************************************************************
 * Edit Note Popup Logic
 **************************************************************************/

const getNoteById = async (noteId) => {
  const url = `http://localhost:8000/api/notes/${noteId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const note = await response.json();
    console.log(note);
    return note;
  } catch (error) {
    console.error(error.message);
  }
};

const editNote = async (noteId) => {
  const noteToEdit = await getNoteById(noteId);
  const noteTitle = noteToEdit ? noteToEdit.title : "";
  const noteText = noteToEdit ? noteToEdit.description : "";
  const editingPopup = document.createElement("div");

  editingPopup.innerHTML = `
  <div id="editing-container" data-note-id="${noteId}">
      <h1>Edit Note</h1>
      <input placeholder="Title" id="note-title" value=${noteTitle}>
      <textarea id="note-text">${noteText}</textarea>
      <div id="btn-container">
          <button id="submitBtn" onclick="updateNote()">Done</button>
          <button id="closeBtn" onclick="closeEditPopup()">Cancel</button>
      </div>
  </div>
  `;

  document.body.appendChild(editingPopup);
};

const closeEditPopup = () => {
  const editingPopup = document.getElementById("editing-container");

  if (editingPopup) {
    editingPopup.remove();
  }
}

const updateNote = async () => {
  const noteTitle = document.getElementById("note-title").value.trim();
  const noteText = document.getElementById("note-text").value.trim();
  const editingPopup = document.getElementById("editing-container");

  if (noteText !== "") {
    const noteId = editingPopup.getAttribute("data-note-id");
    
    const url = `http://localhost:8000/api/notes/${noteId}`
    const noteData = {
      title: noteTitle,
      description: noteText
    }
   
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData)
      })
      const result = await response.json();
      if (response.ok) {
        console.log("Ghi chú đã được sửa:", result);
      } else {
        console.error("Lỗi khi sửa ghi chú:", result.message);
      }
      closeEditPopup();
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }

    // Refresh the displayed notes
    displayNotes();
  }
}

/*************************************************************************
 * Delete Note Logic
 **************************************************************************/

const deleteNote = async (noteId) => {
  const userConfirmed = confirm("Bạn có chắc muốn xóa không?");
  if (userConfirmed) {
    const url = `http://localhost:8000/api/notes/${noteId}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        console.log('Xóa thành công');
      } else {
        console.error('Xóa thất bại', response.status, response.statusText);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
    displayNotes();
  }
}

displayNotes();