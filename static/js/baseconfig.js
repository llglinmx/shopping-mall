var baseconfig = {};
if (process.env.NODE_ENV === 'development') {
	baseconfig = {
		server: 'https://api.it120.cc/Lilg/',
	}
} else if (process.env.NODE_ENV === 'production') {
	baseconfig = {
		server: 'https://api.it120.cc/Lilg/',
	}
}
export default baseconfig;
