// Superlist To-Do App JS
// Key DOM nodes
const sidebar = document.getElementById('sidebar');
const listView = document.getElementById('list-view');
const detailPane = document.getElementById('detail-pane');
const themeToggle = document.getElementById('theme-toggle');

// App State
let state = {
  lists: [],
  activeList: 0,
  tasks: [],
  activeTask: null,
  darkMode: false
};

// --- Persistence ---
function saveState() {
  localStorage.setItem('superlist-state', JSON.stringify(state));
}
function loadState() {
  const s = localStorage.getItem('superlist-state');
  if (s) state = JSON.parse(s);
  else {
    // Demo data
    state.lists = [
      { name: 'Meeting Notes', icon: '📝' },
      { name: 'Personal', icon: '🏠' },
      { name: 'Work', icon: '💼' }
    ];
    state.tasks = [
      { id: 1, list: 0, title: 'Discuss Q3 goals', completed: false, reminder: '', image: '', notes: '' },
      { id: 2, list: 0, title: 'Review design mockups', completed: true, reminder: '', image: '', notes: '' }
    ];
    state.activeList = 0;
    state.activeTask = null;
    state.darkMode = false;
    saveState();
  }
}

// --- Render Functions ---
function renderSidebar() {
  sidebar.innerHTML = '';
  state.lists.forEach((list, i) => {
    const item = document.createElement('div');
    item.className = 'sidebar-item' + (i === state.activeList ? ' active' : '');
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', list.name);
    item.innerHTML = `<span>${list.icon}</span><span>${list.name}</span>`;
    item.onclick = () => {
      state.activeList = i;
      state.activeTask = null;
      saveState();
      renderAll();
    };
    item.onkeydown = e => {
      if (e.key === 'Enter') item.click();
    };
    sidebar.appendChild(item);
  });
}
function renderListView() {
  listView.innerHTML = '';
  // Header
  const header = document.createElement('div');
  header.className = 'list-header';
  header.innerText = state.lists[state.activeList]?.name || '';
  listView.appendChild(header);
  // Subheader
  const subheader = document.createElement('div');
  subheader.className = 'list-subheader';
  subheader.innerText = 'Add tasks, set reminders, drag to reorder.';
  listView.appendChild(subheader);
  // Search
  const search = document.createElement('div');
  search.className = 'search-input';
  search.innerHTML = `<span>🔍</span><input type="text" placeholder="Search tasks..." aria-label="Search tasks">`;
  listView.appendChild(search);
  // Add Task
  const addTask = document.createElement('div');
  addTask.className = 'add-task-input';
  addTask.innerHTML = `<input type="text" placeholder="Add a task..." aria-label="Add a task"><button class="add-task-btn" aria-label="Add">＋</button>`;
  listView.appendChild(addTask);
  // Task List
  const taskList = document.createElement('div');
  taskList.className = 'task-list';
  // Filter tasks
  let filter = search.querySelector('input').value.toLowerCase();
  let tasks = state.tasks.filter(t => t.list === state.activeList && t.title.toLowerCase().includes(filter));
  tasks.forEach(task => {
    const item = document.createElement('div');
    item.className = 'task-item' + (task.completed ? ' completed' : '');
    item.draggable = true;
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', task.title);
    item.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark completed">
      <span>${task.title}</span>
      <button class="task-delete" aria-label="Delete">🗑️</button>
    `;
    // Toggle complete
    item.querySelector('.task-checkbox').onclick = e => {
      task.completed = e.target.checked;
      saveState();
      renderAll();
    };
    // Delete
    item.querySelector('.task-delete').onclick = e => {
      state.tasks = state.tasks.filter(t => t.id !== task.id);
      if (state.activeTask === task.id) state.activeTask = null;
      saveState();
      renderAll();
    };
    // Open detail
    item.onclick = e => {
      if (e.target.classList.contains('task-checkbox') || e.target.classList.contains('task-delete')) return;
      state.activeTask = task.id;
      renderAll();
      openDetailPane();
    };
    // Keyboard open
    item.onkeydown = e => {
      if (e.key === 'Enter') item.click();
    };
    // Drag & Drop
    item.ondragstart = e => {
      e.dataTransfer.setData('text/plain', task.id);
      item.classList.add('dragging');
    };
    item.ondragend = () => {
      item.classList.remove('dragging');
    };
    item.ondragover = e => {
      e.preventDefault();
      item.classList.add('drag-over');
    };
    item.ondragleave = () => {
      item.classList.remove('drag-over');
    };
    item.ondrop = e => {
      e.preventDefault();
      item.classList.remove('drag-over');
      const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
      const fromIdx = state.tasks.findIndex(t => t.id === draggedId);
      const toIdx = state.tasks.findIndex(t => t.id === task.id);
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
        const moved = state.tasks.splice(fromIdx, 1)[0];
        state.tasks.splice(toIdx, 0, moved);
        saveState();
        renderAll();
      }
    };
    taskList.appendChild(item);
  });
  listView.appendChild(taskList);
  // Add task listeners
  const addInput = addTask.querySelector('input');
  const addBtn = addTask.querySelector('button');
  function addNewTask() {
    const val = addInput.value.trim();
    if (!val) return;
    const newTask = {
      id: Date.now(),
      list: state.activeList,
      title: val,
      completed: false,
      reminder: '',
      image: '',
      notes: ''
    };
    state.tasks.push(newTask);
    addInput.value = '';
    saveState();
    renderAll();
  }
  addBtn.onclick = addNewTask;
  addInput.onkeypress = e => {
    if (e.key === 'Enter') addNewTask();
  };
  // Search listener
  search.querySelector('input').oninput = () => renderAll();
}
function renderDetailPane() {
  detailPane.innerHTML = '';
  if (!state.activeTask) {
    detailPane.style.display = 'none';
    detailPane.classList.remove('open');
    return;
  }
  detailPane.style.display = '';
  detailPane.classList.add('open');
  const task = state.tasks.find(t => t.id === state.activeTask);
  if (!task) return;
  // Title (editable)
  const title = document.createElement('h2');
  title.className = 'detail-title';
  title.contentEditable = true;
  title.innerText = task.title;
  title.tabIndex = 0;
  title.onblur = () => {
    task.title = title.innerText.trim();
    saveState();
    renderAll();
  };
  title.ondblclick = () => {
    title.focus();
  };
  detailPane.appendChild(title);
  // Reminder badge
  const reminder = document.createElement('button');
  reminder.className = 'detail-reminder';
  reminder.innerHTML = `<span>⏰</span><span>${task.reminder ? task.reminder : 'Set reminder'}</span>`;
  reminder.onclick = () => {
    const picker = document.createElement('input');
    picker.type = 'date';
    picker.value = task.reminder;
    picker.className = 'detail-reminder';
    picker.onchange = e => {
      task.reminder = e.target.value;
      saveState();
      renderAll();
      scheduleNotification(task);
    };
    detailPane.replaceChild(picker, reminder);
    picker.focus();
    picker.onblur = () => {
      renderAll();
    };
  };
  detailPane.appendChild(reminder);
  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'detail-toolbar';
  ['B','I','U','Link','Img'].forEach((icon, i) => {
    const btn = document.createElement('button');
    btn.className = 'toolbar-btn';
    btn.innerText = icon;
    btn.onclick = () => {
      // Rich text actions (demo only)
      title.focus();
      document.execCommand(icon.toLowerCase());
    };
    toolbar.appendChild(btn);
  });
  detailPane.appendChild(toolbar);
  // Image preview
  const imageArea = document.createElement('div');
  imageArea.className = 'detail-image';
  if (task.image) {
    const img = document.createElement('img');
    img.src = task.image;
    imageArea.appendChild(img);
  } else {
    const placeholder = document.createElement('span');
    placeholder.className = 'placeholder';
    placeholder.innerText = 'No image. Click to add.';
    imageArea.appendChild(placeholder);
  }
  imageArea.onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          task.image = ev.target.result;
          saveState();
          renderAll();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  detailPane.appendChild(imageArea);
  // Notes (rich text)
  const notes = document.createElement('div');
  notes.contentEditable = true;
  notes.className = 'detail-notes';
  notes.innerText = task.notes || '';
  notes.onblur = () => {
    task.notes = notes.innerText;
    saveState();
  };
  detailPane.appendChild(notes);
}
function renderAll() {
  renderSidebar();
  renderListView();
  renderDetailPane();
  updateTheme();
}
function updateTheme() {
  document.body.classList.toggle('dark', state.darkMode);
  themeToggle.innerHTML = state.darkMode ? '🌙' : '☀️';
}
function openDetailPane() {
  detailPane.classList.add('open');
  detailPane.focus();
}
function closeDetailPane() {
  detailPane.classList.remove('open');
  state.activeTask = null;
  renderAll();
}
// --- Theme Toggle ---
themeToggle.onclick = () => {
  state.darkMode = !state.darkMode;
  saveState();
  updateTheme();
};
// --- Keyboard Accessibility ---
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDetailPane();
});
// --- Notification API ---
function scheduleNotification(task) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
    return;
  }
  if (task.reminder) {
    const due = new Date(task.reminder).getTime();
    const now = Date.now();
    if (due > now) {
      setTimeout(() => {
        new Notification('Task Reminder', { body: task.title });
      }, due - now);
    }
  }
}
// --- PWA Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}
// --- Init ---
loadState();
renderAll();
