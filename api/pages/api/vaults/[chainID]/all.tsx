import	fs										from	'fs'
import	path									from	'path';
import	type {NextApiRequest, NextApiResponse}	from	'next'

const	dir = '../data/vaults'
function readFiles(chainID: number) {
	const	all = []
	const	files = fs.readdirSync(`${dir}/${chainID}`)
	for (const file of files) {
		if (path.extname(file) !== '.json') continue;
		const	jsonFileContent = JSON.parse(fs.readFileSync(`${dir}/${chainID}/${file}`, 'utf8'))
		all.push(jsonFileContent);
	}
	return all;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	const	chainID = Number(req.query.chainID || 1);
	res.status(200).json(readFiles(chainID))
}
