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
  warning?: string;
  link?: TreeLink;
  links?: TreeLink[];
  options: TreeOption[];
}

export interface TreeLeaf {
  type: "leaf";
  id: string;
  title: string;
  items: string[];
  treatment?: string[];
  warning?: string;
  detail?: string;
  link?: TreeLink;
  links?: TreeLink[];
}

export interface TreeScoreBranch {
  label: string;
  test: (score: number) => boolean;
  next: string;
}

export interface TreeScore {
  type: "score";
  id: string;
  title: string;
  subtitle?: string;
  detail?: string;
  // id of a Calculator (score or tool) to render inline — resolved via getAny()
  calculatorId: string;
  // evaluated in order, first branch whose test(score) matches wins
  branches: TreeScoreBranch[];
}

export type TreeNode = TreeQuestion | TreeLeaf | TreeScore;

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
