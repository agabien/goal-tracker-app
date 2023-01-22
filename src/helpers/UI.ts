export { showLayer, showElements };

const showLayer = (layerToShow, classToHide, LayersToHide) => {
  LayersToHide.forEach((layer) => layer.classList.add(classToHide));
  layerToShow.classList.remove(classToHide);
};

const showElements = (ElementsToShow, classToHide, ElementsToHide) => {
  ElementsToShow.forEach((element) => element.classList.remove(classToHide));
  ElementsToHide.forEach((element) => element.classList.add(classToHide));
};
