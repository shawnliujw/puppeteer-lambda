docker build -t shawnliu/puppeteer-lambda  .

docker run --rm  -it \
-v "$PWD/src":/var/task/src \
-v "$PWD/test":/var/task/test \
shawnliu/puppeteer-lambda bash