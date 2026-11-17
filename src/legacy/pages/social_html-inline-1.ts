// @ts-nocheck
const menu=document.querySelector('.mobile-menu');menu?.addEventListener('click',()=>{const h=document.querySelector('.global-header');const open=h.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});
