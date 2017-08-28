const POINTS_REGEXP = /^(?:\((\d+)\))?[^(?:\[\d+\])]*(?:\[(\d+)\])?$/;
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

const initialPointTotalsForColumn = () => ({ estimationPoints: 0, consumptionPoints: 0 });

const updateColumnTotals = (pointTotalsByColumn, projectColumnNode) => {
  const nonIssueCardTitleNodes = Array.from(projectColumnNode.querySelectorAll('.mr-4 p'));
  const issueCardTitleNodes = Array.from(projectColumnNode.querySelectorAll('a.mr-4'))
  const cardTitleNodes = nonIssueCardTitleNodes.concat(issueCardTitleNodes);

  const id = projectColumnNode.getAttribute('data-id');
  const oldPointTotals = pointTotalsByColumn[id];
  const newPointTotals = cardTitleNodes.reduce(
    addPointsFromCardTitleNode,
    initialPointTotalsForColumn()
  );
  const estimationHasChanged = !oldPointTotals ||
    oldPointTotals.estimationPoints !== newPointTotals.estimationPoints;
  const consumptionHasChanged = !oldPointTotals ||
    oldPointTotals.consumptionPoints !== newPointTotals.consumptionPoints;

  if (estimationHasChanged) {
    const estimationPointNode = projectColumnNode.querySelector('.estimation-point');
    const newOuterHtml = `<span class="estimation-point Counter ml-1 text-red">(${ newPointTotals.estimationPoints })</span>`;
    if (estimationPointNode) {
      estimationPointNode.outerHTML = newOuterHtml;
    } else {
      projectColumnNode.querySelector('.f5').insertAdjacentHTML('beforeend', newOuterHtml);
    }
  }

  if (consumptionHasChanged) {
    const consumptionPointNode = projectColumnNode.querySelector('.consumption-point');
    const newOuterHtml = `<span class="consumption-point Counter ml-1 text-green">[${ newPointTotals.consumptionPoints }]</span>`;
    if (consumptionPointNode) {
      consumptionPointNode.outerHTML = newOuterHtml;
    } else {
      projectColumnNode.querySelector('.f5').insertAdjacentHTML('beforeend', newOuterHtml);
    }
  }

  return {
    ...pointTotalsByColumn,
    [id]: newPointTotals
  };
};

const updateAllColumnTotals = () => {
  const projectContainer = document.getElementsByClassName('project-columns')[0]
  const projectColumnNodes = Array.from(projectContainer.getElementsByClassName('project-column'));
  return projectColumnNodes.reduce(updateColumnTotals, pointTotalsByColumn);
}

const connectProjectColumnsMutationObserver = () => {
  const projectColumnsMutationObserver = new MutationObserver((mutations) => {
    mutations.some((mutation) => {
      if (mutation.target.classList.contains('js-project-column-cards')) {
        updateAllColumnTotals()
      }
    })
  });

  const config = { childList: true, subtree: true };
  const projectContainer = document.getElementsByClassName('project-columns')[0]
  updateAllColumnTotals();
  projectColumnsMutationObserver.observe(projectContainer, config);
}
