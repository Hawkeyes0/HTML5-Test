function Tester(isStrict, outputId) {
    if (isStrict) 'use strict';

    var output = document.getElementById(outputId);
    if (!output) {
        output = document.createElement("div");
        output.id = outputId;
        document.body.appendChild(output);
    }

    function replaceAll(string, oldStr, newStr) {
        while (string.indexOf(oldStr) > -1) {
            string = string.replace(oldStr, newStr);
        }
        return string;
    }

    output._write = function(html) {
        var node = document.createElement("p");
        node.innerHTML = html;
        output.appendChild(node);
    };

    output.log = function(string) {
        if (typeof string !== 'string') string = string.toString();
        var html = '[<span style="color: lightblue;">&nbsp;LOG</span>]&nbsp;' + replaceAll(string, " ", "&nbsp;");
        output._write(html);
    };

    output.warn = function(string) {
        if (typeof string !== 'string') string = string.toString();
        var html = '[<span style="color: yellow;">WARN</span>]&nbsp;' + replaceAll(string, " ", "&nbsp;");
        output._write(html);
    };

    output.error = function(string) {
        if (typeof string !== 'string') string = string.toString();
        var html = '[<span style="color: red;">&nbsp;ERR</span>]&nbsp;' + replaceAll(string, " ", "&nbsp;");
        output._write(html);
    };

    this.test = function(expression) {
        var str = "if(" + expression + ")";
        output.log(str + " ");
        var exp = isStrict ? "'use strict';" + expression : expression;
        try {
            var rs = eval(exp);
            output.log(rs);
        } catch (error) {
            output.error(error.name + ": " + error.message);
            console.error(error);
        }
    };
}

function TesterCollection(params) {
    var arr = Array.isArray(params) ? params : [];

    this.addTester = function(tester) {
        arr.push(tester);
    };

    this.test = function(expression) {
        arr.forEach(e => e.test(expression));
    };
}