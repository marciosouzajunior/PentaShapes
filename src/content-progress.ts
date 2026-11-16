/** Persisted progress identity is independent of the current route and display ID. */
const foundationProgressIds:Record<string,string>={
  'first-path':'primeiro-caminho',
  'moving-the-shape':'outros-lugares',
  'phrase-and-space':'frase-e-espaco',
  'another-starting-point':'corda-la',
  'next-chord':'proximo-acorde',
  'cycle-of-fourths':'volta-pelas-quartas',
};
export function foundationProgressId(id:string):string {
  return foundationProgressIds[id]??id;
}
