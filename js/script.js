// * navbar fixed
const navbar = document.querySelector('.navbar')
if (window.scrollY > 50) {
  navbar.classList.add('navbar--fixed')
} else {
  navbar.classList.remove('navbar--fixed')
}
function navbarFixed() {
  if (window.scrollY > 50) {
    navbar.classList.add('navbar--fixed')
  } else {
    navbar.classList.remove('navbar--fixed')
  }
}
window.addEventListener('scroll', navbarFixed)

// * navbar fixed to mobile
function navbarFixedMobile() {
  if (window.screen.width <= 500) {
    const navbar = document.querySelector('.navbar')
    let scroll = window.scrollY
    if (scroll > 5) {
      navbar.classList.add('navbar--fixed')
    }
  }
}
window.addEventListener('scroll', navbarFixedMobile)

// *notes app
const noteFilter = document.querySelector('.notes-filter')
const forma = document.querySelector('.notes__forma--create')
const noteInput = document.querySelector('.notes__input--create')
const noteBtnCreate = document.querySelector('.notes__button--create')
const noteList = document.querySelector('.notes__list')
let notes = []
if (localStorage.getItem('notes')) {
  notes = JSON.parse(localStorage.getItem('notes'))
  notes.forEach(note => {
    const cssClass = note.status ? 'note__text note__text--done' : 'note__text'
    const noteHTML = `<li id="${note.id}" class="notes__item note">
                  <div class="note__main">
                    <span class="${cssClass}">${note.text}</span>
                    <div class="note__btns">
                      <button type="button" data-action="edit" class="note__btn note__btn--edit">&#10000;</button>
                      <button type="button" data-action="done" class="note__btn note__btn--done">&#x2714;</button>
                      <button type="button" data-action="delete" class="note__btn note__btn--delete">&#10008;</button>
                    </div>
                  </div>
                </li>`
    noteList.insertAdjacentHTML('beforeend', noteHTML)
  })
}
forma.addEventListener('submit', e => {
  e.preventDefault()
  if (noteInput.value.trim() === '') {
    noteInput.style.borderColor = 'var(--error-color)'
    noteInput.focus()
  } else {
    addNote()
    noteInput.style.borderColor = 'var(--focus-color)'
    noteInput.focus()
    noteFilter.value = 'Все'
    const noteElements = document.querySelectorAll('.note')
    noteElements.forEach(note => {
      note.style.display = 'flex'
    })
  }
})
noteList.addEventListener('click', editNote)
noteList.addEventListener('click', statusNote)
noteList.addEventListener('click', deleteNote)
function addNote() {
  const newNote = {
    id: Date.now(),
    text: noteInput.value,
    status: false,
  }
  notes.push(newNote)
  saveToLocalStorage()
  const cssClass = newNote.status ? 'note__text note__text--done' : 'note__text'
  const noteHTML = `<li id="${newNote.id}" class="notes__item note">
                  <div class="note__main">
                    <span class="${cssClass}">${newNote.text}</span>
                    <div class="note__btns">
                      <button type="button" data-action="edit" class="note__btn note__btn--edit">&#10000;</button>
                      <button type="button" data-action="done" class="note__btn note__btn--done">&#x2714;</button>
                      <button type="button" data-action="delete" class="note__btn note__btn--delete">&#10008;</button>
                    </div>
                  </div>
                </li>`
  noteList.insertAdjacentHTML('beforeend', noteHTML)
  noteInput.value = ''
}
function editNote(e) {
  if (e.target.dataset.action === 'edit') {
    const parentTag = e.target.closest('li')
    const noteText = parentTag.querySelector('.note__text')
    if (noteText.classList.contains('note__text--done')) {
      return
    }
    const noteHTML = `<form action="#" class="notes__forma notes__forma--save">
                        <input type="text" placeholder="Введите текст" class="notes__input notes__input--save" />
                        <button class="notes__button notes__button--save" type="submit">Сохранить</button>
                      </form>`
    parentTag.insertAdjacentHTML('beforeend', noteHTML)
    const noteBtns = parentTag.querySelectorAll('.note__btn')
    if (document.querySelector('.notes__forma--save')) {
      noteBtns.forEach(btn => {
        btn.style.backgroundColor = 'var(--default-color-ui-elements)'
        btn.setAttribute('disabled', 'true')
        btn.style.cursor = 'auto'
      })
    }
    const noteEditForma = parentTag.querySelector('.notes__forma--save')
    const saveImput = noteEditForma.querySelector('.notes__input--save')
    saveImput.focus()
    saveImput.value = noteText.textContent
    const noteId = Number(parentTag.id)
    noteEditForma.addEventListener('submit', e => {
      e.preventDefault()
      if (saveImput.value.trim() === '') {
        saveImput.style.borderColor = 'var(--error-color)'
        saveImput.focus()
      } else {
        noteText.textContent = saveImput.value
        const note = notes.find(note => {
          if (note.id === noteId) {
            return true
          }
        })
        note.text = saveImput.value
        saveToLocalStorage()
        noteEditForma.remove()
        noteBtns.forEach(btn => {
          btn.removeAttribute('disabled', 'true')
          btn.style.cursor = 'pointer'
          btn.style.backgroundColor = ''
        })
      }
    })
  }
}
function statusNote(e) {
  if (e.target.dataset.action === 'done') {
    const parentTag = e.target.closest('li')
    const noteEditBtn = parentTag.querySelector('.note__btn--edit')
    const noteText = parentTag.querySelector('.note__text')
    if (!noteText.classList.contains('note__text--done')) {
      noteEditBtn.setAttribute('disabled', 'true')
      noteEditBtn.style.color = 'var(--main-color)'
      noteEditBtn.style.backgroundColor = 'var(--done-note-color)'
      noteEditBtn.style.cursor = 'auto'
    } else {
      noteEditBtn.removeAttribute('disabled', 'true')
      noteEditBtn.style.color = 'var(--accent-color)'
      noteEditBtn.style.backgroundColor = 'var(--default-color-ui-elements)'
      noteEditBtn.style.cursor = 'pointer'
    }
    const noteId = Number(parentTag.id)
    const note = notes.find(note => {
      if (note.id === noteId) {
        return true
      }
    })
    note.status = !note.status
    const currentTag = parentTag.querySelector('.note__text')
    currentTag.classList.toggle('note__text--done')
  }
  saveToLocalStorage()
}
function deleteNote(e) {
  if (e.target.dataset.action === 'delete') {
    const parentTag = e.target.closest('li')
    const noteId = Number(parentTag.id)
    notes = notes.filter(note => {
      if (note.id === noteId) {
        return false
      } else {
        return true
      }
    })
    parentTag.remove()
  }
  saveToLocalStorage()
}
function saveToLocalStorage() {
  localStorage.setItem('notes', JSON.stringify(notes))
}

const notesItem = document.querySelectorAll('.note')
notesItem.forEach(note => {
  const noteText = note.querySelector('.note__text')
  const noteEditBtn = note.querySelector('.note__btn--edit')
  if (noteText.classList.contains('note__text--done')) {
    noteEditBtn.setAttribute('disabled', 'true')
    noteEditBtn.style.color = 'var(--main-color)'
    noteEditBtn.style.backgroundColor = 'var(--done-note-color)'
    noteEditBtn.style.cursor = 'auto'
    noteEditBtn.addEventListener('mousedown', function (event) {
      event.preventDefault()
    })
    noteEditBtn.blur()
  } else {
    noteEditBtn.removeAttribute('disabled', 'true')
    noteEditBtn.style.color = 'var(--accent-color)'
    noteEditBtn.style.cursor = 'pointer'
  }
})
noteFilter.addEventListener('change', () => {
  const noteElements = document.querySelectorAll('.note')
  if (noteFilter.value === 'Все') {
    noteElements.forEach(note => {
      note.style.display = 'flex'
    })
  } else if (noteFilter.value === 'Активные') {
    noteElements.forEach(note => {
      note.style.display = 'none'
    })
    const noteActive = notes.filter(note => {
      return note.status === false
    })
    noteActive.forEach(note => {
      const htmlElement = document.getElementById(note.id)
      htmlElement.style.display = 'flex'
    })
  } else if (noteFilter.value === 'Выполнные') {
    noteElements.forEach(note => {
      note.style.display = 'none'
    })
    const noteDone = notes.filter(note => {
      return note.status === true
    })
    noteDone.forEach(note => {
      const htmlElement = document.getElementById(note.id)
      htmlElement.style.display = 'flex'
    })
  }
})
