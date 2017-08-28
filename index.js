const POINTS_REGEXP = /^\(?(\d)?\)?.*\[?(\d)?\]?$/;
const POINTS_REGEXP_GROUPS = {
  'estimationPoints': 1,
  'consumptionPoints': 2
};
const pointTotalsByColumn = {};

class CardTitlePointsRegExpResult {
  constructor(cardTitle) {
    const regExpResult = POINTS_REGEXP.exec(cardTitle);
    this.cardTitle = cardTitle;
    this.estimationPoints = parseInt(regExpResult[POINTS_REGEXP_GROUPS.estimationPoints] || 0);
    this.consumptionPoints = parseInt(regExpResult[POINTS_REGEXP_GROUPS.consumptionPoints] || 0);
  }
}

const addPointsFromCardTitleNode = (pointTotal, cardTitleNode) => {
  const pointsRegExpResult = new CardTitlePointsRegExpResult(cardTitleNode.innerHTML)
  return {
    estimationPoints: pointTotal.estimationPoints + pointsRegExpResult.estimationPoints,
    consumptionPoints: pointTotal.consumptionPoints + pointsRegExpResult.consumptionPoints
  }
};

const updateColumnTotal = (pointTotalsByColumn, projectColumnNode) => {
  const nonIssueCardTitleNodes = Array.from(projectColumnNode.querySelectorAll('.mr-4 p'));
  const issueCardTitleNodes = Array.from(projectColumnNode.querySelectorAll('a.mr-4'))
  const cardTitleNodes = nonIssueCardTitleNodes.concat(issueCardTitleNodes);

  const id = projectColumnNode.getAttribute('data-id');
  const newPointTotal = cardTitleNodes.reduce(
    addPointsFromCardTitleNode,
    {
      estimationPoints: 0,
      consumptionPoints: 0
    }
  );

  return {
    ...pointTotalsByColumn,
    [id]: newPointTotal
  };
};

const updateAllColumnTotals = () => {
  const projectContainer = document.getElementsByClassName('project-columns')[0]
  const projectColumnNodes = Array.from(projectContainer.getElementsByClassName('project-column'));
  return projectColumnNodes.reduce(updateColumnTotal, pointTotalsByColumn);
}

