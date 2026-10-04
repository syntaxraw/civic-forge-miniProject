async function request(path,{method='GET',body,form}={}){const headers={};if(body)headers['Content-Type']='application/json';const res=await fetch(`/api${path}`,{method,headers,credentials:'include',body:form||(body?JSON.stringify(body):undefined)});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.error||`Request failed (${res.status})`);return data;}
export const api={get:p=>request(p),post:(p,body)=>request(p,{method:'POST',body}),patch:(p,body)=>request(p,{method:'PATCH',body}),postForm:(p,form)=>request(p,{method:'POST',form})};
export const CATEGORIES=['roads','water','electricity','waste','sanitation','safety','other'];
export const STATUS_COLOR={Raised:'#ef4444','In Progress':'#f59e0b',Completed:'#22c55e'};
export const LANGS={en:'English',hi:'हिन्दी',bn:'বাংলা',ta:'தமிழ்',te:'తెలుగు',mr:'मराठी',gu:'ગુજરાતી',ur:'اردو'};
