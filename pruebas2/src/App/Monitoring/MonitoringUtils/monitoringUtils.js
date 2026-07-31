// monitoringUtils.js
export const getVariableValue = (dataArray, variableName) => {
  const variable = dataArray.find((v) => v.nombre_variable === variableName);
  if (!variable) return "N/A";
  
  if (variable.valor_texto !== null) {
    const textVal = variable.valor_texto.toLowerCase();
    if (textVal === 'cerradas') return "Closed";
    if (textVal === 'abiertas') return "Open";
    if (textVal === 'abriendo') return "Opening...";
    if (textVal === 'cerrando') return "Closing...";
    return textVal.charAt(0).toUpperCase() + textVal.slice(1);
  }
  if (variable.valor_numerico !== null) return variable.valor_numerico;
  if (variable.valor_booleano !== null) return variable.valor_booleano === 1 ? "Active" : "Inactive";
  return "N/A";
};