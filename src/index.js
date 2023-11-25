import jwt from '@tsndr/cloudflare-worker-jwt'

export default {

	async scheduled(event, env, ctx) {
		const payload={
			web:"www.310soft.com"
		}
		const accessToken=await jwt.sign(payload,env.JWT_SECRET,{expiresIn:60*30})
		ctx.waitUntil(env.allowed.put("access_token",accessToken))
	},
};
