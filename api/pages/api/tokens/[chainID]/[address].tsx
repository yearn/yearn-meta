import	fs										from	'fs'
import	type {NextApiRequest, NextApiResponse}	from	'next'

const	dir = '../data/tokens'
function readFiles(chainID: number, address: string, localization: string) {
	let		hasData = false;
	let		data = {}
	let		file = '';
	try {
		file = fs.readFileSync(`${dir}/${chainID}/${address}.json`, 'utf8');
	} catch(e) {
		return null;
	}
	const	jsonFileContent = JSON.parse(file)
	if (localization === 'all') {
		data = jsonFileContent;
		hasData = true
	} else {
		if (jsonFileContent.localization[localization]) {
			jsonFileContent.description = jsonFileContent.localization[localization].description;
			delete jsonFileContent.localization;
			data = jsonFileContent;
			hasData = true
		}
	}
	if (!hasData) {
		return null;
	}
	return data;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	const	address = req.query.address;
	const	chainID = Number(req.query.chainID || 1);
	const	localization = req.query.loc || 'en';
	if (!address) {
		res.status(404).json({error: 'No protocol provided'})
		return;
	}
	const	data = readFiles(chainID, address as string, localization as string)
	if (!data) {
		res.status(404).json({error: 'Invalid protocol'})
		return;
	}
	res.status(200).json(data)
}
