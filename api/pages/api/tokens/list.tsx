import	fs										from	'fs';
import	path									from	'path';
import	type {NextApiRequest, NextApiResponse}	from	'next';

const	dir = '../data/tokens';
function readFiles(): unknown {
	let		data = {};
	let		file = '';
	try {
		file = fs.readFileSync(path.resolve(`${dir}`, 'tokenList.json'), 'utf8');
	} catch(e) {
		return null;
	}
	const	jsonFileContent = JSON.parse(file);
	delete jsonFileContent.$schema;
	data = jsonFileContent;
	return data;
}

export default (req: NextApiRequest, res: NextApiResponse): void => {
	const	data = readFiles();
	if (!data) {
		res.status(404).json({error: 'Invalid token address'});
		return;
	}
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	);
	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}
	res.status(200).json(data);
};
