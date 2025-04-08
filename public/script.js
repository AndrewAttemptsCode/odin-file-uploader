const toggleEdit = () => {
  const editForm = document.querySelector('.rename-folder');
  editForm.classList.toggle('active');
  
  const input = document.querySelector('input');
  if (input) {
    input.focus();
    input.select();
  }
}