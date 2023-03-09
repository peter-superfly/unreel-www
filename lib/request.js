export const fetchData = async (req, path, id, option) => {
	try {
		if(!req || !path ) return null;
		const protocol = req.headers["x-forwarded-proto"] || "http";
		const baseUrl = req ? `${protocol}://${req.headers.host}` : "";
		if(id) path = `${path}/${id}`;
		const url = `${baseUrl}/${path}`;
		if(!option) {
			option = {
				method: 'GET'
			}
		}
		let res_ = await fetch(url, { ...option });
		return await res_.json();
	} catch (error) {
		console.error('FetchData Error', error);
		return null
	}
}

export const fetchUser = async (req, path, id, option) => {
	try {
		if(!req || !path ) return null;
		const protocol = req.headers["x-forwarded-proto"] || "http";
		const baseUrl = req ? `${protocol}://${req.headers.host}` : "";
		if(id) path = `${path}/${id}`;
		const url = `${baseUrl}/${path}`;
		if(!option) {
			option = {
				method: 'GET'
			}
		}
		console.log("xx--", url, option)

		let res_ = await fetch(url, { ...option });
		return await res_.json();
	} catch (error) {
		console.error('FetchData Error', error);
		return null
	}
}