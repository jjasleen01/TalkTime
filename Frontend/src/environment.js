let IS_PROD = false;
const server =  IS_PROD ?
"https://talktimebackend.onrender.com" :
"http://localhost:5000"

export default server