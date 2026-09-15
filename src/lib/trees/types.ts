export interface TreeOption {
  label: string;
  next: string;
}

export interface TreeQuestion {
  type: "question";
  id: string;
  title: string;
  subtitle?: string;
  options: TreeOption[];
}

export interface TreeLeaf {
  type: "leaf";
  id: string;
  title: string;
  items: string[];
  detail?: string;
}

export type TreeNode = TreeQuestion | TreeLeaf;

export interface DecisionTree {
  id: string;
  name: string;
  shortName: string;
  summary: string;
  rootId: string;
  nodes: Record<string, TreeNode>;
  source: string;
  notes?: string;
}
