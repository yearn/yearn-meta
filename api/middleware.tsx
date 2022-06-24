import {NextResponse, NextRequest} from 'next/server'

export const config = {
	matcher: [
		'/:path/:chainID/all',
		'/:path/:chainID/:name',
	],
}

export async function middleware(req: NextRequest, res: NextResponse) {
	const	[, path, chain, element] = req.nextUrl.pathname.split('/')
	const	url = req.nextUrl.clone()
	url.pathname = url.pathname.replace(req.nextUrl.pathname, `/api/${chain}/${path}/${element}`)
	res = NextResponse.rewrite(url)
	return res
}
