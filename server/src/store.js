import { randomUUID } from 'crypto';

export const users = new Map();
export const issues = new Map();
export const id = () => randomUUID();
export const publicUser = (u) => u && ({ id: u._id, name: u.name, email: u.email, role: u.role, preferredLang: u.preferredLang, trustScore: u.trustScore, verifiedReports: u.verifiedReports, points: u.points, badges: [...u.badges] });
export const badgesFor = (n) => [ ...(n >= 1 ? ['First Responder'] : []), ...(n >= 5 ? ['Neighborhood Watch'] : []), ...(n >= 15 ? ['Civic Superhero'] : []) ];
export const userByEmail = (email) => [...users.values()].find((u) => u.email === String(email || '').toLowerCase());
export function seedDemoUsers(passwordHash) {
  if (users.size) return;
  const records = [
    ['Asha Verma','asha@demo.dev','citizen',80,6,140], ['Ravi Kumar','ravi@demo.dev','citizen',65,2,60],
    ['Meera Nair','meera@demo.dev','citizen',55,1,30], ['City Works Officer','authority@civicforge.dev','authority',100,0,0], ['Helping Hands NGO','ngo@civicforge.dev','ngo',100,0,0],
  ];
  const ids = records.map(([name,email,role,trustScore,verifiedReports,points]) => {
    const u = { _id:id(), name,email,role,trustScore,verifiedReports,points,badges:badgesFor(verifiedReports),preferredLang:'en',password:passwordHash,createdAt:new Date() };
    users.set(u._id,u); return u._id;
  });
  const base=[28.6139,77.209];
  const demos=[
    ['Huge pothole near school gate','Deep pothole causing accidents, children cross here daily.','roads',.004,.003,'Raised',14,0],
    ['Water pipe burst flooding street','Main pipeline leaking for 2 days, road is flooded.','water',-.006,.008,'In Progress',9,1],
    ['Garbage not collected for a week','Overflowing bins attracting stray animals.','waste',.01,-.004,'Raised',6,2],
    ['Streetlight sparking on pole 14','Live wire hanging, very dangerous at night.','electricity',-.002,-.009,'Raised',11,0],
    ['Open manhole on main road','Uncovered manhole, urgent danger for two-wheelers.','sanitation',.007,.012,'Completed',7,1],
    ['Broken footpath tiles','Footpath tiles broken near market.','roads',-.009,-.002,'Completed',4,0],
    ['Overflowing drain after rain','Drain overflow smells bad and blocks the lane.','sanitation',.002,-.011,'In Progress',3,2],
  ];
  demos.forEach(([title,description,category,dy,dx,status,count,who],i)=>{
    const reporter=users.get(ids[who]); const upvotes=Array.from({length:count},(_,k)=>({user:ids[k%3],at:new Date(Date.now()-k*5*3600e3)}));
    const severity=estimateSeverity(category,`${title} ${description}`), createdAt=new Date(Date.now()-(i+1)*864e5);
    const issue={_id:id(),title,description,category,language:'en',address:'Demo locality',photos:[],reporter:reporter._id,reporterInfo:publicUser(reporter),status,statusHistory:[{status:'Raised',by:reporter._id,byName:reporter.name,note:'Issue reported',at:createdAt}],location:{type:'Point',coordinates:[base[1]+dx,base[0]+dy]},upvotes,upvoteCount:count,reports:[],mergedCount:0,severity,priorityScore:0,spamScore:0,hidden:false,translations:{},createdAt,updatedAt:new Date()};
    if(status!=='Raised') issue.statusHistory.push({status,by:ids[3],byName:'City Works Officer',note:'Updated by city works',at:new Date()});
    issue.priorityScore=computePriority(issue,reporter.trustScore); issues.set(issue._id,issue);
  });
}
import { computePriority, estimateSeverity } from './services/priority.js';
