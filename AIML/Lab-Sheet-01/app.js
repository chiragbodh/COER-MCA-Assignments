'use strict';
const list=document.querySelector('#courses');
list.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  const button=event.target.closest('button[data-course]');
  if(!button||!list.contains(button))return;
  document.querySelector('#selection').textContent=`Selected ${button.dataset.course}`;
});
document.querySelector('#profile-form').addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!form.reportValidity())return;
  const name=new FormData(form).get('name');
  document.querySelector('#form-result').textContent=`Profile validated for ${name}. Demo only: nothing was sent or saved.`;
});
