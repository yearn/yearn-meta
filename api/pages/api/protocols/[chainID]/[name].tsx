import	fs										from	'fs';
import	path									from	'path';
import	type {NextApiRequest, NextApiResponse}	from	'next';

const	dir = '../data/protocols';
function readFiles(chainID: number, name: string, localization: string): unknown {
	let		hasData = false;
	let		data = {};
	let		file = '';
	try {
		file = fs.readFileSync(path.resolve(`${dir}/${chainID}`, `${name}.json`), 'utf8');
	} catch(e) {
		return null;
	}
	const	jsonFileContent = JSON.parse(file);
	if (localization === 'all') {
		data = jsonFileContent;
		hasData = true;
	} else {
		if (jsonFileContent.localization[localization]) {
			jsonFileContent.description = jsonFileContent.localization[localization].description;
			jsonFileContent.name = jsonFileContent.localization[localization].name;
			delete jsonFileContent.localization;
			data = jsonFileContent;
			hasData = true;
		}
	}
	if (!hasData) {
		return null;
	}
	return data;
}

export default (req: NextApiRequest, res: NextApiResponse): void => {
	const	name = req.query.name;
	const	chainID = Number(req.query.chainID || 1);
	const	localization = req.query.loc || 'en';
	if (!name) {
		res.status(404).json({error: 'No protocol provided'});
		return;
	}
	const	data = readFiles(chainID, name as string, localization as string);
	if (!data) {
		res.status(404).json({error: 'Invalid protocol'});
		return;
	}
	res.status(200).json(data);
};
