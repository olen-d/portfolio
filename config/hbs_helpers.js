module.exports = {
    formatTel: function(tel, format) {
        // Eventually offer a number of formats, but just one for now
        switch (format) {
        default:
        case "usStandard":
            let match = tel.match(/^(\d{3})(\d{3})(\d{4})$/)
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
    }
}