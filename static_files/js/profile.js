$(document).ready(() => {

  $('.edit-button').on('click', () => {
    openModal();
  });

  $('.submit-button').on('click', () => {
    closeModal();
  })

  $('.profile-edit-modal').on('click', () => {
    closeModal();
  })

  function openModal() {
    $('.profile-edit-modal').css('display', 'flex');
  }

  function closeModal() {
    $('.profile-edit-modal').css('display', 'none');
  }
});
