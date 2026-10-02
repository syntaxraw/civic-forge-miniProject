import jwt from 'jsonwebtoken';
import { users, publicUser } from '../store.js';
const secret = () => process.env.JWT_SECRET || 'civicforge-local-development-secret';
export const signToken = (user) => jwt.sign({ id: user._id }, secret(), { expiresIn: '7d' });
export const setSession = (res, user) => res.cookie('cf_session', signToken(user), { httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', maxAge:7*24*60*60*1000, path:'/' });
export const clearSession = (res) => res.clearCookie('cf_session',{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'});
async function load(req) { try { const {id}=jwt.verify(req.cookies?.cf_session || '',secret()); return users.get(id) || null; } catch { return null; } }
export async function optionalAuth(req,_res,next) { req.user=await load(req); next(); }
export async function requireAuth(req,res,next) { req.user=await load(req); if(!req.user)return res.status(401).json({error:'Login required'}); next(); }
export const requireStaff=(req,res,next)=>['authority','ngo'].includes(req.user?.role)?next():res.status(403).json({error:'Staff only'});
