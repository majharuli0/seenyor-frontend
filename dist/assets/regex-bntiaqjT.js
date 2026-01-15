function c(e){return typeof e!="string"?"":e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function p(e,n="gi"){if(!e)return new RegExp("",n);const r=c(e);return new RegExp(`(${r})`,n)}export{p as c};
