
class TextNode {

    constructor(rank, title) {

        this.rank = rank;
        this.title = title;

        this.childs = [];
    }

    findOrInsert(rank, title) {

        for(let i = 0, len = this.childs.length; i < len; i++) {
            let child = this.childs[i];
            if(child.rank == rank && child.title == title) {
                return child;
            }
        }

        let newNode = new TextNode(rank, title);
        newNode.parent = this;
        this.childs.push(newNode);

        return newNode;
    }
}

exports.TextNode = TextNode;
