// 生成模板
const generateTemplate = (html, callback) => {
    let template = {}, templateName = '';
    // 遍历所有行
    html.split('\n').forEach(row => {
        // 是否为模板名称
        const tp = /^[^\r\t\s\n<>]/.test(row);
        if (tp) {
            // 保存上一个模板
            if (templateName) callback(templateName, template[templateName]);
            // 记录新的模板名称
            return (templateName = row.replace(/[\r\s\t\n]/g, ''))
        };
        // 解析模板的每行代码，
        const resRow = row.replace(/<(\w+-\w+)>[\r\s\t\n]*<\/\1>/g, str => {
            // 如果引用了其它模板，则填充。
            const name = (str.match(/\w+-\w+/) || [''])[0];
            return template[name] || '';
        });
        // 缓存模板
        template[templateName] = (template[templateName] || '') + resRow;
    });
    // 最后一个模板
    if (templateName) {
        callback(templateName, template[templateName]);
    }
}

const fs = require('fs');
fs.readFile('template.html', (err, data) => {
    generateTemplate(data.toString(), (templateName, templateContent) => {
        if(!/-view-/.test(templateName)) return;
        fs.writeFile(`template/${templateName}.html`, templateContent, (err) => {
            err && console.log(err)
        });
    })
})