const { App } = require('@slack/bolt');
const store = require('./store');
var Filter = require('bad-words');

const filter = new Filter();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

function badWordsRegex(list) {
  let string = ""
  for (const word of list) {
    // Escape special characters
    let escaped = word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    string = `${string}${escaped}|`
  }
  // Remove the last pipe character
  string = string.slice(0, -1)

  return new RegExp(string, "i")
}

app.message(badWordsRegex(filter.list), async ({ event, say }) => {
  store.incrementPoints(event.user)
  await say('This conversation is NSFW for this workplace');
});


app.event('app_mention', async ({ event, context, client, say }) => {
  const userSaid = event["text"].toLowerCase()
  if (userSaid.includes("points")) {
    const userPoints = await store.getUserPoints(event.user)
    await say(`Your PottyMouth Points: ${userPoints}`)
  }
});

// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

