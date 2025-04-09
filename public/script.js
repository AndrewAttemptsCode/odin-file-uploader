const toggleEdit = () => {
  const editForm = document.querySelector('.rename-folder');
  editForm.classList.toggle('active');
  
  const input = document.querySelector('input');
  if (input) {
    input.focus();
    input.select();
  }
}

const displayFile = () => {
  const fileInput = document.querySelector('#fileupload');
  const fileNameDisplay = document.querySelector('.file-name');

  if (fileInput.files[0]) {
    fileNameDisplay.textContent = fileInput.files[0].name;
  } else {
    fileNameDisplay.textContent = 'No file chosen';
  }
}
