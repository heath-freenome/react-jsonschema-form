"use strict";(self.webpackChunk_rjsf_docs=self.webpackChunk_rjsf_docs||[]).push([[3805],{876:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>f});var r=n(2784);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,c=function(e,t){if(null==e)return{};var n,r,c={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(c[n]=e[n]);return c}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(c[n]=e[n])}return c}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},m=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,c=e.mdxType,o=e.originalType,s=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),d=l(n),p=c,f=d["".concat(s,".").concat(p)]||d[p]||u[p]||o;return n?r.createElement(f,a(a({ref:t},m),{},{components:n})):r.createElement(f,a({ref:t},m))}));function f(e,t){var n=arguments,c=t&&t.mdxType;if("string"==typeof e||c){var o=n.length,a=new Array(o);a[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[d]="string"==typeof e?e:c,a[1]=i;for(var l=2;l<o;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},5337:(e,t,n)=>{n.d(t,{Z:()=>h});var r=n(2784),c=n(6277),o=n(4855),a=n(9817),i=n(1344),s=n(1077);const l={cardContainer:"cardContainer_Shn5",cardTitle:"cardTitle_h48N",cardDescription:"cardDescription_CytT"};function m(e){let{href:t,children:n}=e;return r.createElement(a.Z,{href:t,className:(0,c.Z)("card padding--lg",l.cardContainer)},n)}function d(e){let{href:t,icon:n,title:o,description:a}=e;return r.createElement(m,{href:t},r.createElement("h2",{className:(0,c.Z)("text--truncate",l.cardTitle),title:o},n," ",o),a&&r.createElement("p",{className:(0,c.Z)("text--truncate",l.cardDescription),title:a},a))}function u(e){let{item:t}=e;const n=(0,o.Wl)(t);return n?r.createElement(d,{href:n,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??(0,s.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function p(e){let{item:t}=e;const n=(0,i.Z)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",c=(0,o.xz)(t.docId??void 0);return r.createElement(d,{href:t.href,icon:n,title:t.label,description:t.description??c?.description})}function f(e){let{item:t}=e;switch(t.type){case"link":return r.createElement(p,{item:t});case"category":return r.createElement(u,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function y(e){let{className:t}=e;const n=(0,o.jA)();return r.createElement(h,{items:n.items,className:t})}function h(e){const{items:t,className:n}=e;if(!t)return r.createElement(y,e);const a=(0,o.MN)(t);return r.createElement("section",{className:(0,c.Z)("row",n)},a.map(((e,t)=>r.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},r.createElement(f,{item:e})))))}},9789:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>m});var r=n(7896),c=(n(2784),n(876)),o=n(5337);const a={title:"Advanced Customization",description:"Advanced customization documentation for react-jsonschema-form."},i=void 0,s={unversionedId:"advanced-customization/index",id:"advanced-customization/index",title:"Advanced Customization",description:"Advanced customization documentation for react-jsonschema-form.",source:"@site/docs/advanced-customization/index.mdx",sourceDirName:"advanced-customization",slug:"/advanced-customization/",permalink:"/react-jsonschema-form/docs/advanced-customization/",draft:!1,editUrl:"https://github.com/rjsf-team/react-jsonschema-form/tree/main/packages/docs/docs/advanced-customization/index.mdx",tags:[],version:"current",frontMatter:{title:"Advanced Customization",description:"Advanced customization documentation for react-jsonschema-form."},sidebar:"docs",previous:{title:"Quickstart",permalink:"/react-jsonschema-form/docs/quickstart"},next:{title:"Custom Templates",permalink:"/react-jsonschema-form/docs/advanced-customization/custom-templates"}},l={},m=[],d={toc:m},u="wrapper";function p(e){let{components:t,...n}=e;return(0,c.kt)(u,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("p",null,a.description),(0,c.kt)(o.Z,{mdxType:"DocCardList"}))}p.isMDXComponent=!0}}]);