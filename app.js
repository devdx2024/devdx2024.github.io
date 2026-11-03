const DB_NAME = "notas-offline-db";
const DB_VERSION = 1;
const STORE = "notes";
const form = document.querySelector("#note-form");
const input = document.querySelector("#note");
const list = document.querySelector("#notes");
const empty = document.querySelector("#empty");
const count = document.querySelector("#count");
const statusEl = document.querySelector("#status");

function updateStatus() {
  statusEl.textContent = navigator.onLine
    ? "● Online — os dados continuam locais"
    : "● Offline — aplicativo funcionando";
}
addEventListener("online", updateStatus);
addEventListener("offline", updateStatus);
updateStatus();

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(mode, action) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    let request;
    try { request = action(store); }
    catch (error) { reject(error); db.close(); return; }
    tx.oncomplete = () => { resolve(request?.result); db.close(); };
    tx.onerror = () => { reject(tx.error); db.close(); };
    tx.onabort = () => { reject(tx.error || new Error("Operação cancelada")); db.close(); };
  });
}

async function renderNotes() {
  const all = await withStore("readonly", store => store.getAll());
  all.sort((a,b) => b.createdAt - a.createdAt);
  list.replaceChildren();
  empty.hidden = all.length !== 0;
  count.textContent = `${all.length} ${all.length === 1 ? "item" : "itens"}`;

  for (const note of all) {
    const li = document.createElement("li");
    li.className = "note-item";
    const date = document.createElement("div");
    date.className = "note-date";
    date.textContent = new Date(note.createdAt).toLocaleString("pt-BR");
    const body = document.createElement("div");
    body.className = "note-body";
    body.textContent = note.text;
    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete";
    del.textContent = "Excluir";
    del.addEventListener("click", async () => {
      if (!confirm("Excluir esta anotação?")) return;
      await withStore("readwrite", store => store.delete(note.id));
      await renderNotes();
    });
    li.append(date, body, del);
    list.append(li);
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  try {
    await withStore("readwrite", store =>
      store.add({ text, createdAt: Date.now() })
    );
    input.value = "";
    await renderNotes();
    input.focus();
  } catch (error) {
    alert("Não foi possível salvar localmente: " + error.message);
  }
});

renderNotes().catch(error => {
  console.error(error);
  alert("Não foi possível abrir o armazenamento local deste navegador.");
});

if ("serviceWorker" in navigator) {
  addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .catch(error => console.error("Falha ao registrar Service Worker:", error));
  });
}
