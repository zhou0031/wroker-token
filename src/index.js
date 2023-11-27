import {error,json,Router} from 'itty-router'
import jwt from '@tsndr/cloudflare-worker-jwt'


const router = Router()

async function auth(request,env,ctx){
	const allowed_ipv4 = await env.allowed.get("ipv4")
	const allowed_ipv6 = await env.allowed.get("ipv6")
	const trueClientIp=request.headers.get("CF-Connecting-IP")
	
	if(trueClientIp!==allowed_ipv4&&trueClientIp!==allowed_ipv6) 
		return new Response("Invalid Request",{status:403})
}

async function getToken(request,env){
	const token=await env.allowed.get("access_token")
	return token
}

router
	.all("*",auth)
	.get("/getToken",getToken)

export default {
	
	async fetch(request, env, ctx) {
		return router.handle(request,env,ctx).then(json).catch(error)
	},

	async scheduled(event, env, ctx) {
		const payload={
			web:"www.310soft.com"
		}
		const accessToken=await jwt.sign(payload,env.JWT_SECRET,{expiresIn:60*30})
		ctx.waitUntil(env.allowed.put("access_token",accessToken))
	},
};
