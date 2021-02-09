import * as Twitter from 'twitter';
import { promises as fs } from 'fs';

export async function downloadTweets(screenName: string, count?: number): Promise<void> {
	const client = new Twitter({
		consumer_key: process.env.CONSUMER_KEY!,
		consumer_secret: process.env.CONSUMER_SECRET!,
		access_token_key: process.env.ACCESS_TOKEN_KEY!,
		access_token_secret: process.env.ACCESS_TOKEN_SECRET!,
	});

	const params = { screen_name: screenName };
	if (!count) {
		// download
		const tweets = await client.get('/statuses/user_timeline', params);
		await saveTweetsOnce(screenName, tweets);
		return;
	}
	if (count <= 200) {
		params['count'] = count;
		const tweets = await client.get('/statuses/user_timeline', params);
		await saveTweetsOnce(screenName, tweets);
		return;
	}
	// count > 200
}

async function saveTweetsOnce(screenName: string, tweets: Twitter.ResponseData): Promise<void> {
	const now: string = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
	const jsonStr = JSON.stringify(tweets, null, 2);
	await fs.writeFile(`./${screenName}-${now}.json`, jsonStr);
}

