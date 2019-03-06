export default function buildFileSelector(){

  let fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  return fileSelector;

}
