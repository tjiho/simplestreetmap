<template id="template-chip-base">
  <div class="chip_delete">
    <img src="./static/images/breeze/edit-delete-black.svg" class="icon--medium icon--white"/>
  </div>
  <div class="chip__name">
    <slot name="name">empty</slot>
  </div>
  <div class="chip__actions">
    <slot name="actions"></slot>
  </div>
  <link href='./src/css/chip.css' rel='stylesheet' />
</template>
