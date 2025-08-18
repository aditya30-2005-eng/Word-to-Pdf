const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const fileSelect = document.getElementById('fileSelect');
const convertBtn = document.getElementById('convertBtn');
const fileList = document.getElementById('file-list');
const downloadLinks = document.getElementById('download-links');

let filesToUpload = [];

fileSelect.addEventListener('click', () => fileElem.click());
fileElem.addEventListener('change', () => { filesToUpload = [...fileElem.files]; showFiles(); });

dropArea.addEventListener('dragover', e => { e.preventDefault(); dropArea.classList.add('hover'); });
dropArea.addEventListener('dragleave', e => { e.preventDefault(); dropArea.classList.remove('hover'); });
dropArea.addEventListener('drop', e => {
  e.preventDefault(); dropArea.classList.remove('hover'); filesToUpload = [...e.dataTransfer.files]; showFiles();
});

function showFiles() {
  fileList.innerHTML = '';
  if (filesToUpload.length === 0) return;
  filesToUpload.forEach(file => {
    const p = document.createElement('p'); p.textContent = file.name; fileList.appendChild(p);
  });
}

convertBtn.addEventListener('click', async () => {
  if (filesToUpload.length === 0) return alert('No files selected');
  const formData = new FormData(); filesToUpload.forEach(f => formData.append('files', f));
  downloadLinks.innerHTML = 'Converting... Please wait!';
  try {
    const res = await fetch('/convert', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Conversion failed');
    const data = await res.json();
    downloadLinks.innerHTML = '';
    data.files.forEach(file => {
      const a = document.createElement('a');
      a.href = `/converted/${file}`;
      a.target = '_blank';
      a.textContent = `Download ${file}`;
      downloadLinks.appendChild(a);
    });
  } catch (err) { console.error(err); downloadLinks.innerHTML = 'Error converting files.'; }
});
