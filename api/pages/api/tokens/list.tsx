import	fs										from	'fs';
import	path									from	'path';
import	type {NextApiRequest, NextApiResponse}	from	'next';
import	allowCors								from	'lib/allowCors';

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

async function handler(_req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const	data = readFiles();
	if (!data) {
		res.status(404).json({error: 'Invalid token address'});
		return;
	}
	res.status(200).json(data);
}

export default allowCors(handler);