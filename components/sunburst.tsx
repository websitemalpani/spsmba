const rays=Array.from({length:20});
export function Sunburst({className='',style}:{className?:string,style?:React.CSSProperties}){
  return <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true">
    {rays.map((_,i)=>{const a=(i/rays.length)*Math.PI*2;const x1=100+Math.cos(a)*38,y1=100+Math.sin(a)*38,x2=100+Math.cos(a)*98,y2=100+Math.sin(a)*98;return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>})}
    <circle cx="100" cy="100" r="32" fill="currentColor"/>
  </svg>;
}
