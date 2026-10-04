import { Router } from 'express';
import { issues, users } from '../store.js';
import { LANGS } from '../services/translate.js';
const router=Router();
router.get('/leaderboard',(req,res)=>{const period=req.query.period||'month',now=new Date(),since=period==='year'?new Date(now.getFullYear(),0,1):period==='month'?new Date(now.getFullYear(),now.getMonth(),1):new Date(0),rows=new Map();for(const i of issues.values()){if(i.hidden||i.createdAt<since||!(i.status==='Completed'||i.upvoteCount>=3))continue;const r=rows.get(i.reporter)||{verified:0,upvotes:0};r.verified++;r.upvotes+=i.upvoteCount;rows.set(i.reporter,r);}res.json([...rows].map(([id,v])=>{const u=users.get(id);return u&&{id,name:u.name,badges:u.badges,trustScore:u.trustScore,points:u.points,...v};}).filter(Boolean).sort((a,b)=>b.verified-a.verified||b.upvotes-a.upvotes).slice(0,10));});
router.get('/stats',(_req,res)=>{const byStatus={},byCategory={};for(const i of issues.values())if(!i.hidden){byStatus[i.status]=(byStatus[i.status]||0)+1;byCategory[i.category]=(byCategory[i.category]||0)+1;}res.json({byStatus,byCategory});});
router.get('/languages',(_req,res)=>res.json(LANGS));
export default router;
