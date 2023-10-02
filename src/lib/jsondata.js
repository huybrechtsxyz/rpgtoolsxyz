'use strict';

import jpath from 'jsonpath';

function getTokens(template) {
  var tokens = [];
  template.replace(/\+\+(.+)\+\+/ig, (_, token) => {
    tokens.push(token);
  });
  return tokens;
}

/**
 * https://github.com/dchester/jsonpath
 * https://www.npmjs.com/package/jsonpath
 * @param {JSON} targetData 
 * @param {JSON} sourceData 
 * @returns {JSON} targetData
 */
export function transform(targetData,sourceData) {
  for (let key in targetData) {
    if (targetData[key]) {
      if (typeof targetData[key] === "object") {
        transform(targetData[key],sourceData);
      } else {
        let tokens = getTokens(targetData[key].toString());
        if (!(tokens === undefined) && tokens.length > 0) {
          for(let i in tokens) {
            let sourceExpr = jpath.query(sourceData,tokens[i]); // obj needs to be an object
            let valueExpr = targetData[key].toString().replace(`++${tokens[i]}++`, sourceExpr);
            targetData[key] = valueExpr;
          }
        }
      }
    }
  }
}
