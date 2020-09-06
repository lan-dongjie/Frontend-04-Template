const $ = Symbol('$');

class Trie {
  constructor() {
    this.root = Object.create(null);
  }
  insert(word) {
    let node = this.root;
    for (const k of word) {
      if (!node[k]) {
        node[k] = Object.create(null);
      }
      node = node[k];
    }
    if (!($ in node)) {
      node[$] = 0;
    }
    node[$] ++;
  }
  most() {
    let max = 0,maxWord = null;
    let visit = (node, word) => {
      if (node[$] && node[$] > max) {
        max = node[$];
        maxWord = word;
      }
      for (const p in node) {
        visit(node[p], word + p);
      }
    }
    visit(this.root, '')
    return {maxWord, max};
  }
}

