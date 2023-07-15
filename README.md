Currently, the conventional way to assess internet connection is to analyze several metrics such as speed, latency, packet loss, and jitter.
To do so, one of many websites/tools, such as Speedtest by Ookla etc, is used. These tools would typically choose one of their servers
that's the closest to the incoming connection and then measures internet quality metrics.

Now there are two main problems with this approach. First, by choosing a server that is the closest to the incoming connection, usually, the destination server is in the same country as the incoming connection, thus facing less censorship/manipulation by that country's government.
Second, even if you manually choose servers located abroad, sometimes, these well-known internet speed tests are whitelisted by governments.
 (such as the Islamic Republic of Iran) resulting in falsely good results that are not reproducible elsewhere.

To expose and quantify such censorship measures, Netreach has been developed to measure how much of the "Internet" is available with one's Internet connection.

## Mechanism

We use a list of 1000 websites with the most traffic on the internet and then try to connect to a sample of these websites with a headless browser
to see if they are reachable in a reasonable time. (#timeout)

Then we take a linearly weighted average and report the percentage of accessible websites.

How to use

## Linux

1- Install Node v16 or later

2- Install Puppeteer dependencies

Check here. https://pptr.dev/troubleshooting#chrome-doesnt-launch-on-linux


3- Clone the project

`git clone https://github.com/NikolajHansen23/netreach.git`

4- Install dependencies

`npm install`

5- Run the test

`npm run start`



## Windows

1- Install Node v16 or later

2- Clone the project

`git clone https://github.com/NikolajHansen23/netreach.git`

3- Install dependencies

`npm install`

4- Run the test

`npm run start`

## Docker

TBA...

## How to run it the most reliably

It'd be the most accurate if you have the full bandwidth of your internet connection, meaning other devices and applications do not use it.

Also, the higher your RandomCoeff parameter, the more accurate and reliable your results will be.


## Why can't I get a perfect 100% score?

Although you might be using a VPN or an uncensored internet, you still might fail to achieve very high scores (e.g., > 95%). The reason for this is multiple:

1- Even though we don't aim to measure the speed of your internet connection, your connection speed does matter, especially if it's very low. (i.e., < 8Mb). Sometimes reaching websites requires downloading a relatively high amount of data which might take longer than the default timeout. If your connection speed is low, you can try out greater timeouts to compensate for the low speed.

2- Other applications are using your processing power (i.e., CPU). Reaching websites requires sending many requests; Doing this repeatedly, as Netreach does, needs a lot of processing power. If other applications are using your CPU while running the test, it might affect the score. Even so, a typical 1-core CPU is powerful enough for this test.

3- Regional websites: Some websites we try to reach sometimes operate with regional restrictions. This is especially true for some Chinese websites. We try to spot these websites and exclude them from our list, but they might still exist.


## How to help?

First, thank you for using this tool. The easiest and most effective way to help us is to spread the word and recommend Netreach to a friend.

Sharing your test results in the results thread is also a great way to help us better judge the state of censorship in different ISPs.

## Parameters

RandomCoeff: `RandomCoeff` controls how big our sample size can be. 1 means all websites are included, 0.5 means a random sample of 50% of websites chosen, and so on. You can control this parameter either in the .env file at the root of the project or as an argument:

`npm run start -- --RandomCoeff=0.3`

By default, RandomCoeff is 0.1.

Timeout: `Timeout` specifies how long you would wait at maximum to reach a website. By default, Timeout is 7.5s.

## Common Errors

"Error: Could not find Chromium..."

You can install Chrome manually by running `node node_modules/puppeteer/install.js`

If you run into a 403 error, then make sure you're either using a VPN/Proxy.





