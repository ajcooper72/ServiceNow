/*
 * CleanHTML
 * Strips HTML tags from string and converts HTML special characters
 */
var CleanHTML = function (html_str) {

    function _decodeHTMLtags(str) { // decode tags
        // first, formatting tags
        str = str.replace(/<\s*br\s*\/?\s*>/g, "\r\n");		// <br/> => CR-NL
        str = str.replace(/<\s*\/\s*p\s*>/g, "\r\n");		// </p> => CR-NL
        str = str.replace(/<\s*h\d\s*>/g, "\r\n");			// <hN> => CR-NL
        str = str.replace(/<\s*\/\s*h\d\s*>/g, "\r\n\r\n");	// </hN> => CR-NL-CR-NL

        // strip the rest
        str = str.replace(/<\s*\/?([^>]*)\s*>/g, "");
        return str;
    }

    function _decodeHTMLspecial(str) { // decode special characters
        // first, numerics
        str = str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec); //Returns the special character from the decimal code representation
        });

        // second, named
        str = str.replace(/&([^;]+);/g, function (match, special) {
            var specialChars = [
                { code: "quot", value: '"' },	//quotation mark
                { code: "apos", value: "'" },	// apostrophe 
                { code: "amp", value: "&" },	// ampersand
                { code: "lt", value: "<" },	// less-than
                { code: "gt", value: ">" }	// greater-than
            ];
            for (code in specialChars) {
                if (special == specialChars[code].code) {
                    return specialChars[code].value;
                }
            }
            return "";		// Returned for &rubbish; or &unknown;
        });
        return str;
    }


    var retVal = _decodeHTMLtags(html_str);		// Remove tags
    retVal = _decodeHTMLspecial(retVal);	// Replace special characters
    return retVal;

};
