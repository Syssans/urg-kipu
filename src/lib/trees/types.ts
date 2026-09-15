export interface TreeOption {
  label: string;
  next: string;
}

export interface TreeLink {
  label: string;
  to: string;
}

export interface TreeQuestion {
  type: "question";
  id: string;
  title: string;
  subtitle?: string;
  detail?: string;
  link?: TreeLink;
  options: TreeOption[];
}

export interface TreeLeaf {
  type: "leaf";
  id: string;
  title: string;
  items: string[];
  detail?: string;
  link?: TreeLink;
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
