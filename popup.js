const noteNameInput = document.getElementById("note-title");
const noteInput = document.getElementById("note");
const addNoteButton = document.getElementById("add-note");
const searchNoteButton = document.getElementById("search-note");
const noteList = document.getElementById("note-list");

document.addEventListener("click", (event) => {
    if (!noteNameInput.contains(event.target) 
        && !noteInput.contains(event.target) 
        && !addNoteButton.contains(event.target) 
        && !searchNoteButton.contains(event.target)
        && !noteList.contains(event.target)) {
        noteNameInput.value = "";
        noteInput.value = "";
        loadNotes();
    }
});

function loadNotes(noteName = "", noteContent = "") {
    chrome.storage.local.get(["notes"], (result) => {
        const notes = result.notes || [];
        noteList.innerHTML = ""; 

        notes.forEach((note, index) => {
            const listItem = document.createElement("li");
            if(note.name.includes(noteName) && note.content.includes(noteContent)){
                const noteContent = document.createElement("span");
                noteContent.innerHTML = `<strong>${note.name}:</strong><br>${note.content}`;
                noteContent.title = note.content;
                // Nút copy
                const copyButton = document.createElement("button");
                copyButton.textContent = "📝";
                copyButton.classList.add("copy-btn");
                copyButton.title = "Click to copy";
                copyButton.addEventListener("click", () => {
                    copyNoteContent(note.content);
                    copyButton.textContent = "Copied";
                    setTimeout(() => {
                        copyButton.textContent = "📝";
                    }, 3000);
                });
                // Nút xóa
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "❌";
                deleteButton.classList.add("delete-btn");
                deleteButton.title = "Click to delete";
                deleteButton.addEventListener("click", () => deleteNote(index));

                listItem.appendChild(noteContent);
                listItem.appendChild(copyButton);
                listItem.appendChild(deleteButton);
                noteList.appendChild(listItem); 
            }
        });
    });
}

function copyNoteContent(content) {
    navigator.clipboard.writeText(content).then(() => {});
}

function addNote() {
    if (!noteNameInput.value) noteNameInput.value = "no title";
    if (!noteInput.value) noteInput.value = "no content";
    const noteName = noteNameInput.value.trim();
    const noteContent = noteInput.value.trim();

    chrome.storage.local.get(["notes"], (result) => {
        const notes = result.notes || [];
        notes.push({ name: noteName, content: noteContent });
        chrome.storage.local.set({ notes }, () => {
            noteNameInput.value = "";
            noteInput.value = "";
            loadNotes();
        });
    });
}

function searchNote() {
    const noteName = noteNameInput.value.trim();
    const noteContent = noteInput.value.trim();
    loadNotes(noteName, noteContent);
}

function deleteNote(index) {
    chrome.storage.local.get(["notes"], (result) => {
        const notes = result.notes || [];
        notes.splice(index, 1);
        chrome.storage.local.set({ notes }, () => {
            loadNotes();
        });
    });
}

addNoteButton.addEventListener("click", addNote);
searchNoteButton.addEventListener("click", searchNote);

loadNotes();