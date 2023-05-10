module.exports = function envPlugin(options = {}) {

    const replaceEnv = (value) => {
        const matchList = [...value.matchAll(/\{\{(.+?)}}/g)]
        if (matchList && matchList.length > 0) {
            matchList.forEach((item) => {
                if (item) {
                    let [matchStr, name] = item;
                    name = name.replaceAll(" ", "").toUpperCase()
                    if (process.env[name]) {
                        value = value.replaceAll(matchStr, process.env[name])
                    }
                }
            })
        }
        return value
    }

    return (tree) => {
        tree.children = tree.children.map((node) => {
            if (
                node.children && node.children.length && node.children.length > 0
            ) {
                node.children = node.children.map(item => {
                    try {
                        Object.keys(item).map(key => {
                            item[key] = replaceEnv(item[key])
                        })
                    } catch (_) {
                    }
                    return item
                })
            } else if (node["type"] === 'code' && node["value"]) {
                node["value"] = replaceEnv(node["value"])
            }
            return node;
        });
    };
};