const key='pentashapes.breadcrumb-scroll.v1';

/** One-shot restoration for ordinary breadcrumb navigation in the same tab. */
export function preserveBreadcrumbScroll(nav:HTMLElement):void{
  try{
    const stored=sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    const position:unknown=JSON.parse(stored??'null');
    if(position&&typeof position==='object'){
      const saved=position as Record<string,unknown>;
      if(saved.path===location.pathname&&typeof saved.at==='number'&&Date.now()-saved.at>=0&&Date.now()-saved.at<30_000&&typeof saved.x==='number'&&Number.isFinite(saved.x)&&saved.x>=0&&typeof saved.y==='number'&&Number.isFinite(saved.y)&&saved.y>=0){
        const x=saved.x,y=saved.y;
        requestAnimationFrame(()=>window.scrollTo({left:x,top:y,behavior:'instant'}));
      }
    }
  }catch{ /* Navigation remains usable when storage is unavailable. */ }
  nav.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
    const target=new URL(link.href);
    if(target.origin!==location.origin)return;
    if(target.href===location.href){event.preventDefault();return;}
    try{sessionStorage.setItem(key,JSON.stringify({path:target.pathname,x:window.scrollX,y:window.scrollY,at:Date.now()}));}
    catch{ /* Keep the normal link behavior if the browser cannot save the position. */ }
  });
}
