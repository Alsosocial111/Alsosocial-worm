const fs = require("fs");
const p = "components/Footer.tsx";
let s = fs.readFileSync(p,"utf8");
const before=s;
s=s.replace(/Ready when[\s\S]{0,120}?you are\./i,"Let's talk!");
if(s===before){s=s.replace(/Ready when/i,"Let's talk!").replace(/you are\./i,"");}
if(s===before) throw new Error("Footer headline not found");
fs.writeFileSync(p,s);
console.log("Footer headline updated to Let's talk!");
