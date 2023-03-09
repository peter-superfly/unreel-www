import { handleAuth, getSession, handleLogin, handleLogout, handleCallback } from '@auth0/nextjs-auth0';

function getUrls(req) {
	const host = req.headers['host'];
	const referer= req.headers.referer;
	const protocol = process.env.ENVIRONMENT === 'local' ? 'http' : 'https';
	const redirectUri = `${protocol}://${host}/api/auth/callback`;
	const returnToLogout = `${protocol}://${host}`;
	const returnTo = `${referer}`
	return {
		redirectUri,
		returnTo,
		returnToLogout
	};
}


function getLoginOptions(req, res) {
	const { redirectUri, returnTo } = getUrls(req);
  const authorizationParams = {
    response_type: "code",
    scope: "openid profile email",
  };

  return {
    authorizationParams: {
      ...authorizationParams,
      redirect_uri: redirectUri,
      returnTo,
    },
    returnTo,
  };
}

export default handleAuth({
	async login(req, res) {
		try {
			const hasSession = !!getSession(req, res);
			const { redirectUri } = getUrls(req);
			if (hasSession) {
				return res.redirect(redirectUri);
			}
			const { authorizationParams, returnTo } = getLoginOptions(req, res);
			console.log("authorizationParams", authorizationParams);
			console.log("login returnTo", authorizationParams);
			await handleLogin(req, res, {
				authorizationParams,
				returnTo,
			});
		} catch (error) {
			res.status(error.status || 500).end(error.message);
		}
	},

	async logout(req, res) {
		try {
			const { returnToLogout } = getUrls(req);
			console.log("Logout returnTo", returnToLogout);
			await handleLogout(req, res, { returnTo: returnToLogout });
		} catch (error) {
			res.status(error.status || 500).end(error.message);
		}
	},

	async callback(req, res) {
		try {
			const { redirectUri } = getUrls(req);
			console.log("callback redirectUri", redirectUri);
			await handleCallback(req, res, { redirectUri: redirectUri });
		} catch (error) {
			res.status(error.status || 500).end(error.message);
		}
	},
});
