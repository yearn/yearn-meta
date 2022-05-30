import	fs										from	'fs'
import	type {NextApiRequest, NextApiResponse}	from	'next'

const	dir = '../data/vaults'
function readFiles(chainID: number, address: string) {
	let		data = {}
	let		file = '';
	try {
		file = fs.readFileSync(`${dir}/${chainID}/${address}.json`, 'utf8');
	} catch(e) {
		return null;
	}
	const	jsonFileContent = JSON.parse(file)
	data = jsonFileContent;
	return data;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	const	address = req.query.address;
	const	chainID = Number(req.query.chainID || 1);
	if (!address) {
		res.status(404).json({error: 'No protocol provided'})
		return;
	}
	const	data = readFiles(chainID, address as string)
	if (!data) {
		res.status(404).json({error: 'Invalid protocol'})
		return;
	}
	res.status(200).json(data)
}
