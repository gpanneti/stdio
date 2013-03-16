/*jslint node: true, nomen: true*/
'use strict';

/**
 * Parses command line options
 * @param {function} options options specification
 */
module.exports.getopt = function (options, argv) {

	var opts = {},           // Options map
	    arg,                 // Every argument
	    spected,
	    i,
	    len,
	    opt,
	    optname,
	    name,
	    j;

	argv = argv || process.argv;

	// Arguments parsing
	argv = argv.slice(2);

	for (i = 0, len = argv.length; i < len; i = i + 1) {

		opt = null;
		optname = null;

		arg = argv[i];

		if (arg.charAt(0) === '-') {
			opt = {};
			spected = null;
			if (arg.charAt(1) === '-') {

				// It's a long option

				optname = arg.substring(2);
				spected = options[optname];
				if (!spected) {
					throw new Error('Unknown option: --' + optname);
				}

			} else {

				// It's a short option

				for (name in options) {
					if (options.hasOwnProperty(name)) {
						if (options[name].key === arg.substring(1)) {
							optname = name;
							break;
						}
					}
				}

				spected = options[optname];
				if (!spected) {
					throw new Error('Unknown option: -' + arg.substring(1));
				}
			}

			// Arguments asociated with this option
			if (spected.args === 1) {

				i = i + 1;
				opt.args = argv[i];
			} else if (spected.args) {

				opt.args = [];
				for (j = i + 1; j < i + 1 + (spected.args || 0); j = j + 1) {
					opt.args.push(argv[j]);
				}
				i += spected.args;
			} else {
				opt = true;
			}

			if (opt) {
				opts[optname] = opt;
			}
		} else {
			if (!opts.args) {
				opts.args = [];
			}
			opts.args.push(argv[i]);
		}
	}

	return opts;

};

/**
 * Reads the complete standard input
 * @param {function} callback
 */
module.exports.read = function(callback){

    if(!callback) throw new Error('no callback provided to readInput() call');

    var inputdata = '';
    
    process.stdin.resume();    
    process.stdin.on('data', function(text){
        inputdata += String(text);
    });
    process.stdin.on('end', function(){
        callback && callback(inputdata);
    });
    
};