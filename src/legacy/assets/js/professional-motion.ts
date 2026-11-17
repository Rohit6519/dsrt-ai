// @ts-nocheck
/* DSRT AI — lightweight accessible motion */
(() => {
 const init=()=>{
  document.body.classList.add('dsrt-page-enter');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window)) return;
  const selectors=['main > section','main section','body > section','.page-section','.feature-card','.pricing-card','.solution-card','.case-study-card','.blog-card','.provider-card','.resource-card'];
  const elements=[...new Set(selectors.flatMap(s=>[...document.querySelectorAll(s)]))].filter(el=>!el.closest('nav,header,footer')&&!el.classList.contains('dsrt-no-reveal'));
  elements.forEach((el,i)=>{if(el.classList.contains('dsrt-reveal')||el.classList.contains('dsrt-reveal-left'))return;el.classList.add('dsrt-reveal');if(el.matches('.feature-card,.pricing-card,.solution-card,.provider-card,.resource-card'))el.style.setProperty('--dsrt-delay',`${(i%4)*65}ms`)});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
  elements.forEach(el=>observer.observe(el));
  elements.filter(el=>el.getBoundingClientRect().top<window.innerHeight*.82).forEach(el=>el.classList.add('is-visible'));
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

