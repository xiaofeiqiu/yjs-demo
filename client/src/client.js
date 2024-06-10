import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:3000', 'my-roomname', ydoc);

const ytext = ydoc.getText('shared-text');
const editor = document.getElementById('editor');

let isLocalChange = false;

// Function to update the text area with the current content of ytext
const updateEditor = () => {
  isLocalChange = true;
  editor.value = ytext.toString();
  isLocalChange = false;
};

// Listen for changes to the Yjs document and update the text area
ytext.observe(event => {
  if (!isLocalChange) {
    updateEditor();
  }
});

// Listen for input events on the text area
editor.addEventListener('input', event => {
  if (isLocalChange) return;

  const oldText = ytext.toString();
  const newText = editor.value;

  // Find the start of the difference
  let start = 0;
  while (oldText[start] === newText[start] && start < oldText.length && start < newText.length) {
    start++;
  }

  // Find the end of the difference
  let oldEnd = oldText.length - 1;
  let newEnd = newText.length - 1;
  while (oldEnd >= start && newEnd >= start && oldText[oldEnd] === newText[newEnd]) {
    oldEnd--;
    newEnd--;
  }

  // Apply the changes to the Yjs document
  if (oldEnd >= start) {
    ytext.delete(start, oldEnd - start + 1);
  }
  if (newEnd >= start) {
    ytext.insert(start, newText.slice(start, newEnd + 1));
  }
});

// Initialize the editor with the current content of ytext
updateEditor();
