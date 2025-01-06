// filepath: /Users/nguyenhuythai/Documents/egde-note-extension/popup.js
const noteNameInput = document.getElementById("note-name");
const noteInput = document.getElementById("note");
const addNoteButton = document.getElementById("add-note");
const noteList = document.getElementById("note-list");

// Hàm tải danh sách ghi chú từ storage và hiển thị
function loadNotes() {
    chrome.storage.local.get(["notes"], (result) => {
        const notes = result.notes || [];
        noteList.innerHTML = ""; // Xóa danh sách cũ
        notes.forEach((note, index) => {
            const listItem = document.createElement("li");

            // // Nội dung ghi chú
            // const noteContent = document.createElement("span");
            // noteContent.textContent = `${note.name}: ${note.content}`;
            // noteContent.title = note.content; // Hiển thị toàn bộ nội dung khi hover
            // Nội dung ghi chú
            const noteContent = document.createElement("span");

            // Tạo nội dung với 2 dòng, dòng trên in đậm
            noteContent.innerHTML = `<strong>${note.name}</strong>:<br>${note.content}`;
            noteContent.title = note.content; // Hiển thị toàn bộ nội dung khi hover

            // Nút copy
            const copyButton = document.createElement("button");
            copyButton.textContent = "C";
            copyButton.classList.add("copy-btn");
            copyButton.addEventListener("click", () => copyNoteContent(note.content));
            
            // Nút xóa
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.classList.add("delete-btn");
            deleteButton.addEventListener("click", () => deleteNote(index));

            listItem.appendChild(noteContent);
            listItem.appendChild(copyButton);
            listItem.appendChild(deleteButton);
            noteList.appendChild(listItem);
        });
    });
}

// Hàm sao chép ghi chú vào clipboard
function copyNoteContent(content) {
    navigator.clipboard.writeText(content).then(() => {
        // alert("Note copied to clipboard!");
    }).catch((error) => {
        console.error("Failed to copy note: ", error);
    });
}

// Hàm thêm ghi chú
function addNote() {
    const noteName = noteNameInput.value.trim();
    const noteContent = noteInput.value.trim();
    if (!noteName || !noteContent) return; // Bỏ qua nếu tên hoặc nội dung ghi chú rỗng

    chrome.storage.local.get(["notes"], (result) => {
        const notes = result.notes || [];
        notes.push({ name: noteName, content: noteContent });

        chrome.storage.local.set({ notes }, () => {
            noteNameInput.value = ""; // Xóa nội dung ô nhập tên
            noteInput.value = ""; // Xóa nội dung ô nhập
            loadNotes(); // Tải lại danh sách ghi chú
        });
    });
}

// Hàm xóa ghi chú
function deleteNote(index) {
    chrome.storage.local.get(["notes"], (result) => {
        const notes = result.notes || [];
        notes.splice(index, 1); // Xóa ghi chú tại vị trí index

        chrome.storage.local.set({ notes }, () => {
            loadNotes(); // Tải lại danh sách ghi chú
        });
    });
}

// Sự kiện khi nhấn nút "Add Note"
addNoteButton.addEventListener("click", addNote);

// Tải danh sách ghi chú khi mở popup
loadNotes();