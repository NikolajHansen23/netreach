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


## Common Errors

"Error: Could not find Chromium..."

You can install Chrome manually by running `node node_modules/puppeteer/install.js`

If you run into a 403 error, then make sure you're either using a VPN/Proxy.





