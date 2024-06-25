
const requiredDependency = () => {
    throw new Error('Missing required dependency: logger');
};

class rulesContainer {
    constructor(
        arrayOCR = [],
        ruleType = requiredDependency()) {
        this.ruleType = ruleType;
        this.arrayOCR = arrayOCR;

    }

    async validate() {
        return await this.ruleType(this.arrayOCR);
    }
}

module.exports = rulesContainer;