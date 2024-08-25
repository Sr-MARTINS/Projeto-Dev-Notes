    // Inportando arquivos
const addNoteBtn = document.querySelector("#btnAdd");

const noteInput = document.querySelector("#addItens");

const contentNote = document.querySelector("#result");

const buscarNote = document.querySelector("#busc");

const exportNotesBtn = document.querySelector("#export");


function showNotes () {
    cleanNotes()

    getNotes().forEach((note) => {
        const noteElement = creatNote(note.id, note.content, note.fixed); 
        
        contentNote.appendChild(noteElement)
    })
}

function cleanNotes() {
    contentNote.replaceChildren([]);
}

function addNote() { 

    const notes = getNotes()

    const noteObject = {
        id: generetId(),
        content: noteInput.value,
        fixed: false,
    }

    const noteElement = creatNote(noteObject.id, noteObject.content);

    contentNote.appendChild(noteElement);

    notes.push(noteObject);
    saveNotes(notes)
    noteInput.value = ""
}

function generetId () {
    return Math.floor(Math.random() * 5000)
}

function creatNote(id, content, fixed) {
    // if(content == "") {
    //    return
    // }

    const element = document.createElement("div");
    element.classList.add("boxResult");

    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.placeholder = "Adicione algum texto...";

    element.appendChild(textarea);

    const pinIcon = document.createElement("i");
    pinIcon.classList.add("bi-pin");

    element.appendChild(pinIcon);

    const pinIconEd = document.createElement("i");
    pinIconEd.classList.add("bi-x-lg");

    element.appendChild(pinIconEd);

    const pinIconSv = document.createElement("i");
    pinIconSv.classList.add("bi-file-earmark-plus");

    element.appendChild(pinIconSv);
    if(fixed) {
        element.classList.add("fixed")
    }

    // Eventos do elemneto
    element.querySelector("textarea").addEventListener("keyup", (e) => {
        const noteContent = e.target.value;

        updaNote(id, noteContent);
    })

    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id)
    });

    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNotes(id, element)
    });

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        editNotes(id)
    })

    return element
}

    // locals
    function getNotes() {
        const notes = JSON.parse(localStorage.getItem("notes") || "[]")

            // Para ordenar o item fixado fiquem em primeiro lugar na list
        const orderedNotes = notes.sort((a , b) => a.fixed > b.fixed ? -1 : 1) 

        return orderedNotes;
    }
    function saveNotes(notes) {
        localStorage.setItem("notes",JSON.stringify(notes));
    }

    // ações de elementos
function deleteNotes(id, element) {
    const notes = getNotes().filter((note) => note.id !== id);

    saveNotes(notes);

    contentNote.removeChild(element)
}
function editNotes(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    const noteObject = {
        id: generetId,
        content: targetNote.content,
        fixed: false,
    };

    const noteElement = creatNote(
        noteObject.id,
        noteObject.content,
        noteObject.fixed,
    );

    contentNote.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes)
}

function updaNote(id, newContent) {
    const notes = getNotes();

    const targetNotes = notes.filter((note) =>  note.id === id)[0]

    targetNotes.content = newContent;

    saveNotes(notes)
}

function toggleFixNote(id) {
    
    const notes = getNotes();

    const targetNotes = notes.filter((note) => note.id === id)[0]

    targetNotes.fixed = !targetNotes.fixed;

   saveNotes(notes)
   showNotes()
}

function seachNotes(search) {
    const searchResult = getNotes().filter((note) => {
      return  note.content.includes(search);
        
    });

    if(search !== "") {

        cleanNotes();

        searchResult.forEach((note) => {
            const noteElement = creatNote(note.id, note.content, note.fixed) 
            contentNote.appendChild(noteElement);
        });

        return
    }
        cleanNotes();
        showNotes()
}


function exportData() {
    const notes = getNotes();

    const csvString = [
        ["ID", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed]),
    ]
        .map((e) => e.join(","))
        .join("\n");

    const element = document.createElement("a");
    element.href = "data:text/csv;charset=utf-8" + encodeURI(csvString);
    element.target = "_blank";
    element.download = "notes.csv";

    element.click()
}

    // Evets
addNoteBtn.addEventListener("click", () => addNote());

buscarNote.addEventListener("keyup", (e) => {
    const search = e.target.value;

    seachNotes(search)
});

noteInput.addEventListener("keyup", (e) => {
    if(e.key === "Enter") {
        addNoteBtn.click()
    }
});

exportNotesBtn.addEventListener("click", () => {
    exportData()
})

    // inicialização
showNotes()
