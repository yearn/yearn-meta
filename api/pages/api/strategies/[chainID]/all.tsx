import	fs										from	'fs';
import	path									from	'path';
import	type {NextApiRequest, NextApiResponse}	from	'next';

const	dir = '../data/strategies';
function readFiles(chainID: number, localization: string): unknown[] {
	const	all = [];
	const	files = fs.readdirSync(path.resolve(`${dir}/${chainID}`));
	for (const file of files) {
		if (path.extname(file) !== '.json') continue;
		const	jsonFileContent = JSON.parse(fs.readFileSync(path.resolve(`${dir}/${chainID}`, `${file}`), 'utf8'));
		if (localization === 'all') {
			all.push(jsonFileContent);
		} else {
			if (jsonFileContent.localization[localization]) {
				jsonFileContent.description = jsonFileContent.localization[localization].description;
				jsonFileContent.name = jsonFileContent.localization[localization].name;
				delete jsonFileContent.localization;
				all.push(jsonFileContent);
			}
		}
	}
	return all;
}

export default (req: NextApiRequest, res: NextApiResponse): void => {
	const	chainID = Number(req.query.chainID || 1);
	const	localization = req.query.loc || 'en';
	res.status(200).json(readFiles(chainID, localization as string));
};
